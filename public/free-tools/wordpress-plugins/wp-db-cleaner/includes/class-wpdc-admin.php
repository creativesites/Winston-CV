<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class WPDC_Admin {

	const CLEAN_TYPES = [
		'revisions'                   => [ 'label' => 'Post Revisions',                'group' => 'posts'    ],
		'auto_drafts'                 => [ 'label' => 'Auto Drafts',                   'group' => 'posts'    ],
		'trashed_posts'               => [ 'label' => 'Trashed Posts & Pages',         'group' => 'posts'    ],
		'spam_comments'               => [ 'label' => 'Spam Comments',                 'group' => 'comments' ],
		'trashed_comments'            => [ 'label' => 'Trashed Comments',              'group' => 'comments' ],
		'unapproved_comments'         => [ 'label' => 'Old Unapproved Comments',       'group' => 'comments' ],
		'expired_transients'          => [ 'label' => 'Expired Transients',            'group' => 'options'  ],
		'all_transients'              => [ 'label' => 'All Transients',                'group' => 'options'  ],
		'orphaned_post_meta'          => [ 'label' => 'Orphaned Post Meta',            'group' => 'meta'     ],
		'orphaned_comment_meta'       => [ 'label' => 'Orphaned Comment Meta',         'group' => 'meta'     ],
		'orphaned_user_meta'          => [ 'label' => 'Orphaned User Meta',            'group' => 'meta'     ],
		'orphaned_term_relationships' => [ 'label' => 'Orphaned Term Relationships',   'group' => 'meta'     ],
		'unused_terms'                => [ 'label' => 'Unused Tags & Categories',      'group' => 'taxonomy' ],
		'duplicate_post_meta'         => [ 'label' => 'Duplicate Post Meta',           'group' => 'meta'     ],
		'optimize_tables'             => [ 'label' => 'Optimize Database Tables',      'group' => 'database' ],
	];

	const GROUPS = [
		'posts'    => 'Posts & Pages',
		'comments' => 'Comments',
		'options'  => 'Options & Transients',
		'meta'     => 'Orphaned & Duplicate Meta',
		'taxonomy' => 'Taxonomy',
		'database' => 'Database Maintenance',
	];

	public function __construct() {
		add_action( 'admin_menu', [ $this, 'register_menu' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		foreach ( [ 'get_counts', 'run_clean', 'get_table_stats', 'get_logs', 'clear_logs', 'save_settings', 'save_schedule' ] as $a ) {
			add_action( 'wp_ajax_wpdc_' . $a, [ $this, 'ajax_' . $a ] );
		}
	}

	public function register_menu(): void {
		add_management_page(
			__( 'WP Database Cleaner', 'wp-db-cleaner' ),
			__( 'DB Cleaner', 'wp-db-cleaner' ),
			'manage_options',
			'wp-db-cleaner',
			[ $this, 'render_page' ]
		);
	}

	public function enqueue_assets( string $hook ): void {
		if ( 'tools_page_wp-db-cleaner' !== $hook ) return;
		wp_enqueue_style(  'wpdc-admin', WPDC_PLUGIN_URL . 'assets/wpdc-admin.css', [], WPDC_VERSION );
		wp_enqueue_script( 'wpdc-admin', WPDC_PLUGIN_URL . 'assets/wpdc-admin.js', [ 'jquery' ], WPDC_VERSION, true );
		wp_localize_script( 'wpdc-admin', 'WPDCConfig', [
			'ajaxUrl'    => admin_url( 'admin-ajax.php' ),
			'nonce'      => wp_create_nonce( 'wpdc_nonce' ),
			'cleanTypes' => self::CLEAN_TYPES,
		] );
	}

	// ── Page ─────────────────────────────────────────────────────────────────
	public function render_page(): void {
		$settings = get_option( 'wpdc_settings', [] );
		$schedule = get_option( 'wpdc_schedule', [] );
		$last_run = get_option( 'wpdc_last_scheduled_run', 'Never' );
		$total    = number_format( WPDC_Logger::get_total_deleted() );
		?>
		<div class="wpdc-wrap">

			<div class="wpdc-header">
				<div>
					<h1 class="wpdc-title">WP Database Cleaner</h1>
					<span class="wpdc-ver">v<?php echo esc_html( WPDC_VERSION ); ?></span>
				</div>
				<div class="wpdc-header-meta">
					<span class="wpdc-chip" id="wpdc-db-size">— MB</span>
					<span class="wpdc-chip"><?php echo esc_html( $total ); ?> items cleaned all-time</span>
				</div>
			</div>

			<div class="wpdc-nav">
				<button class="wpdc-tab active" data-tab="dashboard">Dashboard</button>
				<button class="wpdc-tab" data-tab="clean">Clean</button>
				<button class="wpdc-tab" data-tab="schedule">Schedule</button>
				<button class="wpdc-tab" data-tab="logs">Activity Log</button>
			</div>

			<!-- ── Dashboard ─────────────────────────────────────────────── -->
			<div class="wpdc-panel active" data-panel="dashboard">
				<div class="wpdc-dash-grid">

					<div class="wpdc-card wpdc-card-health">
						<h3>Database Health</h3>
						<div class="wpdc-ring-wrap">
							<svg viewBox="0 0 120 120" class="wpdc-ring-svg">
								<circle class="wpdc-ring-track" cx="60" cy="60" r="52"/>
								<circle class="wpdc-ring-fill" id="wpdc-ring" cx="60" cy="60" r="52"/>
							</svg>
							<div class="wpdc-ring-score" id="wpdc-health-score">—</div>
						</div>
						<p class="wpdc-health-label" id="wpdc-health-label">Analyzing…</p>
					</div>

					<div class="wpdc-card wpdc-card-counts">
						<div class="wpdc-card-head">
							<h3>Cleanable Items</h3>
							<button class="button" id="wpdc-refresh">↻ Refresh</button>
						</div>
						<div id="wpdc-count-grid"><p class="wpdc-loading">Loading…</p></div>
					</div>

					<div class="wpdc-card wpdc-card-actions">
						<h3>Quick Actions</h3>
						<div class="wpdc-action-stack">
							<button class="button button-primary wpdc-w100" id="wpdc-btn-clean-all">
								⚡ Clean Everything
							</button>
							<button class="button wpdc-w100" id="wpdc-btn-dry-all">
								🔍 Dry Run — Preview Only
							</button>
							<button class="button wpdc-w100" id="wpdc-btn-optimize">
								🗜 Optimize Tables
							</button>
						</div>
						<div id="wpdc-dash-result" class="wpdc-result hidden"></div>
					</div>

					<div class="wpdc-card wpdc-card-tables">
						<div class="wpdc-card-head">
							<h3>Table Sizes</h3>
							<span class="wpdc-badge-green" id="wpdc-reclaimable"></span>
						</div>
						<div id="wpdc-table-list"><p class="wpdc-loading">Loading…</p></div>
					</div>

				</div>
			</div>

			<!-- ── Clean ─────────────────────────────────────────────────── -->
			<div class="wpdc-panel" data-panel="clean">
				<div class="wpdc-clean-bar">
					<label class="wpdc-toggle">
						<input type="checkbox" id="wpdc-dry-toggle">
						<span class="wpdc-toggle-track"></span>
						<span>Dry Run — preview without deleting</span>
					</label>
					<button class="button button-primary" id="wpdc-run-selected">Run Selected</button>
				</div>
				<div id="wpdc-bulk-result"></div>

				<?php foreach ( self::GROUPS as $group_key => $group_label ) :
					$group_types = array_filter( self::CLEAN_TYPES, fn ( $t ) => $t['group'] === $group_key );
					if ( empty( $group_types ) ) continue;
				?>
				<div class="wpdc-group">
					<div class="wpdc-group-title"><?php echo esc_html( $group_label ); ?></div>
					<?php foreach ( $group_types as $type => $meta ) : ?>
					<div class="wpdc-row" data-type="<?php echo esc_attr( $type ); ?>">
						<label class="wpdc-row-label">
							<input type="checkbox" class="wpdc-chk" value="<?php echo esc_attr( $type ); ?>" checked>
							<?php echo esc_html( $meta['label'] ); ?>
						</label>
						<span class="wpdc-count-badge" id="wpdc-c-<?php echo esc_attr( $type ); ?>">—</span>
						<?php if ( $type === 'revisions' ) : ?>
						<span class="wpdc-row-opt">
							Keep last <input type="number" id="wpdc-keep" min="0" max="100" value="<?php echo esc_attr( $settings['keep_revisions'] ?? 5 ); ?>" class="wpdc-num"> per post (0 = remove all)
						</span>
						<?php elseif ( $type === 'unapproved_comments' ) : ?>
						<span class="wpdc-row-opt">
							Older than <input type="number" id="wpdc-days" min="1" max="365" value="<?php echo esc_attr( $settings['unapproved_days'] ?? 30 ); ?>" class="wpdc-num"> days
						</span>
						<?php elseif ( $type === 'all_transients' ) : ?>
						<span class="wpdc-row-opt wpdc-danger-note">⚠ Removes all transients — cached data will rebuild on next page load</span>
						<?php endif; ?>
						<div class="wpdc-row-result hidden" id="wpdc-r-<?php echo esc_attr( $type ); ?>"></div>
						<button class="button wpdc-clean-one" data-type="<?php echo esc_attr( $type ); ?>">Clean</button>
					</div>
					<?php endforeach; ?>
				</div>
				<?php endforeach; ?>
			</div>

			<!-- ── Schedule ──────────────────────────────────────────────── -->
			<div class="wpdc-panel" data-panel="schedule">
				<div class="wpdc-card">
					<h3>Automatic Cleaning Schedule</h3>
					<?php if ( $last_run !== 'Never' ) : ?>
					<p class="description">Last scheduled run: <strong><?php echo esc_html( $last_run ); ?></strong></p>
					<?php endif; ?>
					<?php
					$next = wp_next_scheduled( WPDC_Scheduler::HOOK );
					if ( $next ) {
						echo '<p class="description">Next run: <strong>' . esc_html( get_date_from_gmt( date( 'Y-m-d H:i:s', $next ) ) ) . '</strong></p>';
					}
					?>
					<table class="form-table">
						<tr>
							<th>Enable Scheduling</th>
							<td><label>
								<input type="checkbox" id="wpdc-s-enabled" <?php checked( ! empty( $schedule['enabled'] ) ); ?>>
								Run automatic database cleaning
							</label></td>
						</tr>
						<tr>
							<th>Frequency</th>
							<td><select id="wpdc-s-freq">
								<option value="daily"   <?php selected( ( $schedule['frequency'] ?? 'weekly' ), 'daily'   ); ?>>Daily</option>
								<option value="weekly"  <?php selected( ( $schedule['frequency'] ?? 'weekly' ), 'weekly'  ); ?>>Weekly</option>
								<option value="monthly" <?php selected( ( $schedule['frequency'] ?? 'weekly' ), 'monthly' ); ?>>Monthly</option>
							</select></td>
						</tr>
						<tr>
							<th>What to Clean</th>
							<td class="wpdc-sched-types">
								<?php foreach ( self::CLEAN_TYPES as $type => $meta ) :
									$checked = in_array( $type, $schedule['types'] ?? array_keys( self::CLEAN_TYPES ), true );
								?>
								<label class="wpdc-sched-label">
									<input type="checkbox" class="wpdc-s-type" value="<?php echo esc_attr( $type ); ?>" <?php checked( $checked ); ?>>
									<?php echo esc_html( $meta['label'] ); ?>
								</label>
								<?php endforeach; ?>
							</td>
						</tr>
						<tr>
							<th>Email Report</th>
							<td>
								<input type="email" id="wpdc-s-email" class="regular-text"
									value="<?php echo esc_attr( $schedule['email'] ?? get_option( 'admin_email' ) ); ?>"
									placeholder="Leave blank to skip email reports">
							</td>
						</tr>
					</table>
					<p>
						<button class="button button-primary" id="wpdc-save-sched">Save Schedule</button>
						<span class="wpdc-saved hidden" id="wpdc-sched-saved">✓ Saved</span>
					</p>
				</div>

				<div class="wpdc-card">
					<h3>Global Settings</h3>
					<table class="form-table">
						<tr>
							<th>Revisions to Keep</th>
							<td>
								<input type="number" id="wpdc-g-keep" min="0" max="100" value="<?php echo esc_attr( $settings['keep_revisions'] ?? 5 ); ?>">
								<p class="description">Per post. Set to 0 to remove all revisions.</p>
							</td>
						</tr>
						<tr>
							<th>Unapproved Comment Age</th>
							<td>
								<input type="number" id="wpdc-g-days" min="1" max="365" value="<?php echo esc_attr( $settings['unapproved_days'] ?? 30 ); ?>">
								<p class="description">Remove unapproved comments older than this many days.</p>
							</td>
						</tr>
						<tr>
							<th>Log Retention</th>
							<td><select id="wpdc-g-log">
								<option value="30"  <?php selected( ( $settings['log_retention'] ?? 90 ), 30  ); ?>>30 days</option>
								<option value="90"  <?php selected( ( $settings['log_retention'] ?? 90 ), 90  ); ?>>90 days</option>
								<option value="180" <?php selected( ( $settings['log_retention'] ?? 90 ), 180 ); ?>>180 days</option>
								<option value="365" <?php selected( ( $settings['log_retention'] ?? 90 ), 365 ); ?>>1 year</option>
								<option value="0"   <?php selected( ( $settings['log_retention'] ?? 90 ), 0   ); ?>>Keep forever</option>
							</select></td>
						</tr>
					</table>
					<p>
						<button class="button button-primary" id="wpdc-save-settings">Save Settings</button>
						<span class="wpdc-saved hidden" id="wpdc-settings-saved">✓ Saved</span>
					</p>
				</div>
			</div>

			<!-- ── Logs ──────────────────────────────────────────────────── -->
			<div class="wpdc-panel" data-panel="logs">
				<div class="wpdc-logs-bar">
					<h3>Activity Log</h3>
					<button class="button wpdc-btn-danger" id="wpdc-clear-logs">Clear All Logs</button>
				</div>
				<div id="wpdc-log-table"><p class="wpdc-loading">Loading…</p></div>
			</div>

		</div>
		<?php
	}

	// ── AJAX ─────────────────────────────────────────────────────────────────
	private function verify(): void {
		if ( ! current_user_can( 'manage_options' )
		  || ! check_ajax_referer( 'wpdc_nonce', 'nonce', false ) ) {
			wp_send_json_error( [ 'message' => 'Unauthorized.' ], 403 );
		}
	}

	public function ajax_get_counts(): void {
		$this->verify();
		$counts = WPDC_Cleaner::get_counts();
		$health = WPDC_Analyzer::get_health_score( $counts );
		$size   = WPDC_Analyzer::get_database_size();
		wp_send_json_success( compact( 'counts', 'health', 'size' ) );
	}

	public function ajax_run_clean(): void {
		$this->verify();
		$types   = array_filter( array_map( 'sanitize_key', (array) ( $_POST['types'] ?? [] ) ), fn ( $t ) => isset( self::CLEAN_TYPES[ $t ] ) );
		$dry_run = ! empty( $_POST['dry_run'] );
		$options = [
			'keep' => max( 0, (int) ( $_POST['keep_revisions'] ?? get_option( 'wpdc_settings', [] )['keep_revisions'] ?? 5 ) ),
			'days' => max( 1, (int) ( $_POST['unapproved_days'] ?? get_option( 'wpdc_settings', [] )['unapproved_days'] ?? 30 ) ),
		];
		$run_id  = uniqid( 'manual_', true );
		$results = [];
		foreach ( $types as $type ) {
			$result         = WPDC_Cleaner::clean( $type, $options, $dry_run );
			$results[$type] = $result;
			if ( ! $dry_run ) {
				WPDC_Logger::log( $run_id, $type, self::CLEAN_TYPES[$type]['label'], $result['deleted'] ?? 0, false, 'manual' );
			}
		}
		wp_send_json_success( compact( 'results', 'dry_run', 'run_id' ) );
	}

	public function ajax_get_table_stats(): void {
		$this->verify();
		$tables      = WPDC_Analyzer::get_table_stats();
		$reclaimable = WPDC_Analyzer::get_reclaimable_size();
		wp_send_json_success( compact( 'tables', 'reclaimable' ) );
	}

	public function ajax_get_logs(): void {
		$this->verify();
		wp_send_json_success( [ 'logs' => WPDC_Logger::get_recent( 300 ) ] );
	}

	public function ajax_clear_logs(): void {
		$this->verify();
		WPDC_Logger::clear();
		wp_send_json_success();
	}

	public function ajax_save_settings(): void {
		$this->verify();
		$s = [
			'keep_revisions'  => max( 0, (int) ( $_POST['keep_revisions']  ?? 5  ) ),
			'unapproved_days' => max( 1, (int) ( $_POST['unapproved_days'] ?? 30 ) ),
			'log_retention'   => (int) ( $_POST['log_retention'] ?? 90 ),
		];
		update_option( 'wpdc_settings', $s );
		wp_send_json_success( [ 'settings' => $s ] );
	}

	public function ajax_save_schedule(): void {
		$this->verify();
		$enabled   = ! empty( $_POST['enabled'] );
		$frequency = in_array( $_POST['frequency'] ?? '', [ 'daily', 'weekly', 'monthly' ], true ) ? $_POST['frequency'] : 'weekly';
		$types     = array_filter( array_map( 'sanitize_key', (array) ( $_POST['types'] ?? [] ) ), fn ( $t ) => isset( self::CLEAN_TYPES[$t] ) );
		$email     = sanitize_email( $_POST['email'] ?? '' );

		update_option( 'wpdc_schedule', compact( 'enabled', 'frequency', 'types', 'email' ) );

		if ( $enabled ) {
			WPDC_Scheduler::reschedule( $frequency );
		} else {
			WPDC_Scheduler::clear_scheduled_events();
		}

		$next = wp_next_scheduled( WPDC_Scheduler::HOOK );
		wp_send_json_success( [ 'next_run' => $next ? date( 'Y-m-d H:i:s', $next ) : null ] );
	}
}
