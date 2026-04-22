jQuery(document).ready(function($) {
    // Tab Switching
    $('.luxe-tabs a').on('click', function(e) {
        e.preventDefault();
        const target = $(this).data('tab');
        
        $('.luxe-tabs a').removeClass('active');
        $(this).addClass('active');
        
        $('.tab-content').removeClass('active');
        $('#tab-' + target).addClass('active');
        
        window.location.hash = target;
    });

    // Handle Hash on Load
    if (window.location.hash) {
        $(`.luxe-tabs a[data-tab="${window.location.hash.substring(1)}"]`).trigger('click');
    }

    // Radio Option Selection Visuals
    $('.luxe-skin-selector input').on('change', function() {
        $('.skin-option').removeClass('selected');
        $(this).closest('.skin-option').addClass('selected');
    });

    // Save Settings
    $('#luxe-save-settings').on('click', function(e) {
        e.preventDefault();
        const $btn = $(this);
        const originalText = $btn.text();
        
        $btn.text('Saving...').prop('disabled', true);

        // Gather all inputs
        const settings = {
            theme: $('input[name="theme"]:checked').val(),
            login: {
                enabled: $('input[name="login_enabled"]').is(':checked') ? 1 : 0,
                msg: $('input[name="login_msg"]').val()
            },
            menu: {
                hide_wp_logo: $('input[name="hide_wp_logo"]').is(':checked') ? 1 : 0,
                hidden: $('input[name="hide_menu[]"]:checked').map(function() { return $(this).val(); }).get()
            },
            dashboard: {
                hide_default: $('input[name="hide_default_widgets"]').is(':checked') ? 1 : 0,
                welcome_msg: $('textarea[name="welcome_msg"]').val()
            }
        };

        $.ajax({
            url: luxeAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'luxe_save_settings',
                nonce: luxeAdmin.nonce,
                settings: JSON.stringify(settings)
            },
            success: function(response) {
                if (response.success) {
                    $btn.text('Saved!').css('background', '#10b981');
                    setTimeout(() => {
                        $btn.text(originalText).prop('disabled', false).css('background', '');
                    }, 2000);
                } else {
                    alert('Error saving settings: ' + response.data);
                    $btn.text(originalText).prop('disabled', false);
                }
            },
            error: function() {
                alert('Connection error.');
                $btn.text(originalText).prop('disabled', false);
            }
        });
    });
});
