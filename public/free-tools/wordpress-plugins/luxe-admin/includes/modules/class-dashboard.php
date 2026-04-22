<?php
namespace Luxe_Admin\Modules;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles Dashboard cleanup and custom widgets.
 */
class Dashboard {
	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'wp_dashboard_setup', [ $this, 'clean_dashboard' ], 999 );
		add_action( 'wp_dashboard_setup', [ $this, 'add_luxe_welcome_widget' ] );
	}

	public function clean_dashboard() {
		$settings = get_option( 'luxe_admin_settings', [] );
		if ( empty( $settings['dashboard']['hide_default'] ) ) {
			return;
		}

		remove_meta_box( 'dashboard_primary', 'dashboard', 'side' );
		remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
		remove_meta_box( 'dashboard_right_now', 'dashboard', 'normal' );
		remove_meta_box( 'dashboard_activity', 'dashboard', 'normal' );
		remove_meta_box( 'dashboard_site_health', 'dashboard', 'normal' );
	}

	public function add_luxe_welcome_widget() {
		$settings = get_option( 'luxe_admin_settings', [] );
		$msg = ! empty( $settings['dashboard']['welcome_msg'] ) ? $settings['dashboard']['welcome_msg'] : 'Welcome to your professional dashboard.';

		wp_add_dashboard_widget(
			'luxe_welcome_widget',
			__( 'Luxe Welcome', 'luxe-admin' ),
			function() use ( $msg ) {
				echo '<div class="luxe-welcome-wrap">';
				echo '<h2 style="font-weight: 300; font-size: 24px; margin-bottom: 10px;">Hello!</h2>';
				echo '<p style="font-size: 16px; color: #666; line-height: 1.6;">' . esc_html( $msg ) . '</p>';
				echo '<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">';
				echo '<p><a href="' . admin_url( 'post-new.php' ) . '" class="button button-primary">Start Writing</a></p>';
				echo '</div>';
			}
		);
	}
}
