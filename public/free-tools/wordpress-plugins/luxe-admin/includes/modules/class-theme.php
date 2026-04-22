<?php
namespace Luxe_Admin\Modules;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles the "Skins" for the WordPress Admin.
 */
class Theme {
	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'admin_head', [ $this, 'inject_skin_variables' ], 1 );
	}

	public function inject_skin_variables() {
		$settings = get_option( 'luxe_admin_settings', [] );
		$theme = ! empty( $settings['theme'] ) ? $settings['theme'] : 'default';

		if ( 'default' === $theme ) return;

		?>
		<style type="text/css" id="luxe-admin-skin">
			:root {
				<?php if ( 'midnight' === $theme ) : ?>
					--luxe-bg: #0f172a;
					--luxe-sidebar: #1e293b;
					--luxe-accent: #38bdf8;
					--luxe-text: #f1f5f9;
					--luxe-border: #334155;
				<?php elseif ( 'glass' === $theme ) : ?>
					--luxe-bg: #f8fafc;
					--luxe-sidebar: rgba(255, 255, 255, 0.7);
					--luxe-accent: #6366f1;
					--luxe-text: #1e293b;
					--luxe-border: rgba(226, 232, 240, 0.5);
				<?php endif; ?>
			}
			
			/* Applying variables - Basic overrides */
			#adminmenuback, #adminmenu, #adminmenu .wp-submenu, #wpadminbar { background: var(--luxe-sidebar) !important; }
			#wpcontent { background: var(--luxe-bg) !important; }
			#adminmenu a, #wpadminbar .ab-item, #wpadminbar a.ab-item { color: var(--luxe-text) !important; }
			#adminmenu li.current a.menu-top, #adminmenu li.wp-has-current-submenu a.wp-has-current-submenu { background: var(--luxe-accent) !important; color: #fff !important; }
			
			<?php if ( 'glass' === $theme ) : ?>
				#adminmenu { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
			<?php endif; ?>
		</style>
		<?php
	}
}
