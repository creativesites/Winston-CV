(function ($) {
  'use strict';

  const { ajaxUrl, nonce, cleanTypes } = WPDCConfig;
  const CIRC = 2 * Math.PI * 52;

  function post(action, data) {
    return $.post(ajaxUrl, { action: 'wpdc_' + action, nonce, ...data });
  }

  // ── Tabs ───────────────────────────────────────────────────────────────────
  $(document).on('click', '.wpdc-tab', function () {
    const tab = $(this).data('tab');
    $('.wpdc-tab').removeClass('active');
    $(this).addClass('active');
    $('.wpdc-panel').removeClass('active');
    $('[data-panel="' + tab + '"]').addClass('active');
    if (tab === 'logs') loadLogs();
  });

  // ── Load counts ────────────────────────────────────────────────────────────
  function loadCounts() {
    $('#wpdc-count-grid').html('<p class="wpdc-loading">Loading…</p>');
    post('get_counts').done(function (res) {
      if (!res.success) return;
      const { counts, health, size } = res.data;

      // Health ring
      const offset = CIRC - (health / 100) * CIRC;
      const color  = health >= 90 ? '#00a32a' : health >= 70 ? '#2271b1' : health >= 50 ? '#dba617' : '#d63638';
      $('#wpdc-ring').css({ 'stroke-dashoffset': offset, stroke: color });
      $('#wpdc-health-score').text(health + '%');
      const lbl = health >= 90 ? 'Excellent' : health >= 70 ? 'Good' : health >= 50 ? 'Fair' : health >= 30 ? 'Needs Cleaning' : 'Critical';
      $('#wpdc-health-label').text(lbl).css('color', color);
      $('#wpdc-db-size').text(size + ' MB');

      // Count grid
      let html = '';
      let totalDirty = 0;
      Object.entries(counts).forEach(function ([type, count]) {
        const label = cleanTypes[type] ? cleanTypes[type].label : type;
        const dirty = count > 0;
        totalDirty += dirty ? 1 : 0;
        html += `<div class="wpdc-ci ${dirty ? 'wpdc-ci--dirty' : 'wpdc-ci--clean'}">
          <span class="wpdc-ci-num">${Number(count).toLocaleString()}</span>
          <span class="wpdc-ci-label">${label}</span>
        </div>`;
        // Sync badges in Clean tab
        const $b = $('#wpdc-c-' + type);
        $b.text(count > 0 ? Number(count).toLocaleString() : '✓')
          .toggleClass('wpdc-badge-dirty', dirty)
          .toggleClass('wpdc-badge-clean', !dirty);
      });
      $('#wpdc-count-grid').html(html);
    });
  }

  // ── Load table stats ──────────────────────────────────────────────────────
  function loadTableStats() {
    post('get_table_stats').done(function (res) {
      if (!res.success) return;
      const { tables, reclaimable } = res.data;
      if (parseFloat(reclaimable) > 0) {
        $('#wpdc-reclaimable').text(reclaimable + ' MB reclaimable after optimize');
      }
      let html = '<div class="wpdc-table-scroll"><table class="wpdc-tbl"><thead><tr>'
        + '<th>Table</th><th>Rows</th><th>Size (MB)</th><th>Free (MB)</th>'
        + '</tr></thead><tbody>';
      tables.forEach(function (t) {
        const free  = parseFloat(t.free_mb) || 0;
        const bloat = free > 0.5 ? ' wpdc-row-bloat' : '';
        html += `<tr class="${bloat}">
          <td>${t.name}</td>
          <td>${Number(t.rows).toLocaleString()}</td>
          <td>${t.size_mb}</td>
          <td>${free > 0 ? '<strong>' + free + '</strong>' : '—'}</td>
        </tr>`;
      });
      html += '</tbody></table></div>';
      $('#wpdc-table-list').html(html);
    });
  }

  // ── Core clean runner ────────────────────────────────────────────────────
  function runClean(types, dryRun, $target) {
    if (!types.length) { alert('Select at least one item type.'); return; }

    const label = dryRun ? 'Analyzing…' : 'Cleaning…';
    $target.removeClass('hidden').html(`<p class="wpdc-loading">${label}</p>`);

    post('run_clean', {
      types,
      dry_run:          dryRun ? 1 : 0,
      keep_revisions:   $('#wpdc-keep, #wpdc-g-keep').first().val() || 5,
      unapproved_days:  $('#wpdc-days, #wpdc-g-days').first().val() || 30,
    }).done(function (res) {
      if (!res.success) {
        $target.html('<p class="wpdc-err">Error: ' + (res.data?.message || 'Request failed.') + '</p>');
        return;
      }
      const { results, dry_run } = res.data;
      let total = 0;
      let rows  = '';
      Object.entries(results).forEach(function ([type, r]) {
        const n     = parseInt(r.deleted) || 0;
        total      += n;
        const unit  = r.label || 'items';
        const label = cleanTypes[type]?.label || type;
        rows += `<tr><td>${label}</td><td><strong>${n.toLocaleString()} ${unit}</strong></td></tr>`;
        if (!dry_run) {
          $('#wpdc-c-' + type).text('✓').removeClass('wpdc-badge-dirty').addClass('wpdc-badge-clean');
          $('#wpdc-r-' + type).addClass('hidden');
        }
      });
      const prefix = dry_run
        ? '<strong>Dry Run Preview</strong> — no data was deleted'
        : '✓ <strong>Done</strong>';
      $target.html(`<div class="wpdc-result-inner">
        <p>${prefix}</p>
        <table class="wpdc-result-tbl"><tbody>${rows}</tbody>
          <tfoot><tr><td><strong>Total</strong></td><td><strong>${total.toLocaleString()} items</strong></td></tr></tfoot>
        </table>
      </div>`);
      if (!dry_run) { loadCounts(); loadTableStats(); }
    }).fail(function () {
      $target.html('<p class="wpdc-err">Request failed. Please try again.</p>');
    });
  }

  // ── Dashboard quick actions ───────────────────────────────────────────────
  $('#wpdc-btn-clean-all').on('click', function () {
    if (!confirm('This will permanently delete cleanable database items. Run a Dry Run first to preview.\n\nContinue?')) return;
    runClean(Object.keys(cleanTypes), false, $('#wpdc-dash-result'));
  });

  $('#wpdc-btn-dry-all').on('click', function () {
    const types = Object.keys(cleanTypes).filter(t => t !== 'optimize_tables');
    runClean(types, true, $('#wpdc-dash-result'));
  });

  $('#wpdc-btn-optimize').on('click', function () {
    if (!confirm('Run OPTIMIZE TABLE on all WordPress database tables?')) return;
    runClean(['optimize_tables'], false, $('#wpdc-dash-result'));
  });

  $('#wpdc-refresh').on('click', function () { loadCounts(); loadTableStats(); });

  // ── Clean tab: run selected ───────────────────────────────────────────────
  $('#wpdc-run-selected').on('click', function () {
    const dry   = $('#wpdc-dry-toggle').is(':checked');
    const types = $('.wpdc-chk:checked').map(function () { return $(this).val(); }).get();
    if (!dry && !confirm('Clean ' + types.length + ' selected item type(s)?')) return;
    runClean(types, dry, $('#wpdc-bulk-result').removeClass('hidden'));
  });

  // ── Individual row clean ─────────────────────────────────────────────────
  $(document).on('click', '.wpdc-clean-one', function () {
    const $row  = $(this).closest('.wpdc-row');
    const type  = $row.data('type');
    const dry   = $('#wpdc-dry-toggle').is(':checked');
    const $res  = $row.find('.wpdc-row-result').removeClass('hidden');
    runClean([type], dry, $res);
  });

  // ── Logs ──────────────────────────────────────────────────────────────────
  function loadLogs() {
    $('#wpdc-log-table').html('<p class="wpdc-loading">Loading…</p>');
    post('get_logs').done(function (res) {
      if (!res.success || !res.data.logs.length) {
        $('#wpdc-log-table').html('<p class="wpdc-empty">No activity logged yet.</p>');
        return;
      }
      let html = '<div class="wpdc-table-scroll"><table class="wpdc-tbl wpdc-log-tbl">'
        + '<thead><tr><th>Date / Time</th><th>Operation</th><th>Items</th><th>Mode</th><th>Trigger</th></tr></thead><tbody>';
      let prevRun = '';
      res.data.logs.forEach(function (r) {
        const cls  = r.run_id !== prevRun ? ' wpdc-run-sep' : '';
        prevRun    = r.run_id;
        const mode = r.dry_run == 1
          ? '<span class="wpdc-badge-gray">Dry Run</span>'
          : '<span class="wpdc-badge-green">Live</span>';
        html += `<tr class="${cls}">
          <td>${r.created_at}</td>
          <td>${r.label}</td>
          <td><strong>${Number(r.deleted).toLocaleString()}</strong></td>
          <td>${mode}</td>
          <td>${r.triggered}</td>
        </tr>`;
      });
      html += '</tbody></table></div>';
      $('#wpdc-log-table').html(html);
    });
  }

  $('#wpdc-clear-logs').on('click', function () {
    if (!confirm('Clear all activity logs? This cannot be undone.')) return;
    post('clear_logs').done(function (res) {
      if (res.success) loadLogs();
    });
  });

  // ── Save schedule ────────────────────────────────────────────────────────
  $('#wpdc-save-sched').on('click', function () {
    const types = $('.wpdc-s-type:checked').map(function () { return $(this).val(); }).get();
    post('save_schedule', {
      enabled:   $('#wpdc-s-enabled').is(':checked') ? 1 : 0,
      frequency: $('#wpdc-s-freq').val(),
      types,
      email:     $('#wpdc-s-email').val(),
    }).done(function (res) {
      if (res.success) flash('#wpdc-sched-saved');
    });
  });

  // ── Save settings ────────────────────────────────────────────────────────
  $('#wpdc-save-settings').on('click', function () {
    post('save_settings', {
      keep_revisions:  $('#wpdc-g-keep').val(),
      unapproved_days: $('#wpdc-g-days').val(),
      log_retention:   $('#wpdc-g-log').val(),
    }).done(function (res) {
      if (res.success) flash('#wpdc-settings-saved');
    });
  });

  function flash(selector) {
    $(selector).removeClass('hidden').delay(2500).fadeOut(400, function () {
      $(this).addClass('hidden').show();
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  $(function () {
    $('#wpdc-ring').css({ 'stroke-dasharray': CIRC, 'stroke-dashoffset': CIRC });
    loadCounts();
    loadTableStats();
  });

})(jQuery);
