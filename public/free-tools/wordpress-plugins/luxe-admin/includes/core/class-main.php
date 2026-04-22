<?php
namespace Luxe_Admin\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Luxe_Admin Controller
 */
class Main {
	private static $instance = null;
	private $settings;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		$this->settings = get_option( 'luxe_admin_settings', [] );
		$this->init_modules();
		$this->init_hooks();
	}

	private function init_modules() {
		// Initialize modules
		\Luxe_Admin\Modules\Login::get_instance();
		\Luxe_Admin\Modules\Theme::get_instance();
		\Luxe_Admin\Modules\Menu::get_instance();
		\Luxe_Admin\Modules\Dashboard::get_instance();
	}

	private function init_hooks() {
		add_action( 'admin_menu', [ $this, 'add_settings_page' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
		add_action( 'wp_ajax_luxe_save_settings', [ $this, 'handle_save_settings' ] );
	}

	public function handle_save_settings() {
		check_ajax_referer( 'luxe_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( 'Unauthorized' );
		}

		$settings = json_decode( stripslashes( $_POST['settings'] ), true );
		
		if ( update_option( 'luxe_admin_settings', $settings ) ) {
			wp_send_json_success( 'Settings saved' );
		} else {
			// If nothing changed, update_option returns false, but we should still send success
			wp_send_json_success( 'Settings unchanged' );
		}
	}

	public function add_settings_page() {
		add_menu_page(
			__( 'Luxe Admin', 'luxe-admin' ),
			__( 'Luxe Admin', 'luxe-admin' ),
			'manage_options',
			'luxe-admin',
			[ $this, 'render_settings_page' ],
			'dashicons-layout',
			60
		);
	}

	public function render_settings_page() {
		include LUXE_ADMIN_PATH . 'includes/views/settings-page.php';
	}

	public function enqueue_admin_assets( $hook ) {
		// Only load our dashboard CSS everywhere, but specific settings JS only on our page
		wp_enqueue_style( 'luxe-admin-core', LUXE_ADMIN_URL . 'assets/css/luxe-admin-ui.css', [], LUXE_ADMIN_VERSION );
		
		if ( 'toplevel_page_luxe-admin' === $hook ) {
			wp_enqueue_style( 'luxe-admin-settings', LUXE_ADMIN_URL . 'assets/css/luxe-settings.css', [], LUXE_ADMIN_VERSION );
			wp_enqueue_script( 'luxe-admin-settings', LUXE_ADMIN_URL . 'assets/js/luxe-settings.js', [ 'jquery' ], LUXE_ADMIN_VERSION, true );
			
			wp_localize_script( 'luxe-admin-settings', 'luxeAdmin', [
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'luxe_admin_nonce' ),
				'settings' => $this->settings
			] );
		}
	}
}
