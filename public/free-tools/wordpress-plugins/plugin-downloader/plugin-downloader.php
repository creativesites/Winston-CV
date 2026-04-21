<?php
/**
 * Plugin Name: Plugin & Theme Downloader
 * Plugin URI:  #
 * Description: Download any installed plugin or theme as a ZIP file directly from your WordPress dashboard.
 * Version:     1.0.0
 * Author:      Winston
 * Text Domain: plugin-downloader
 * License:     GPLv2 or later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Plugin Class
 */
final class PD_Pro {

	/**
	 * Instance of this class.
	 *
	 * @var PD_Pro
	 */
	private static $instance;

	/**
	 * Get instance.
	 *
	 * @return PD_Pro
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 */
	private function __construct() {
		$this->define_constants();
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * Define constants.
	 */
	private function define_constants() {
		define( 'PD_VERSION', '1.0.0' );
		define( 'PD_PATH', plugin_dir_path( __FILE__ ) );
		define( 'PD_URL', plugin_dir_url( __FILE__ ) );
		define( 'PD_BASENAME', plugin_basename( __FILE__ ) );
	}

	/**
	 * Include files.
	 */
	private function includes() {
		require_once PD_PATH . 'includes/class-pd-downloader.php';
		if ( is_admin() ) {
			require_once PD_PATH . 'includes/class-pd-admin.php';
		}
	}

	/**
	 * Initialize hooks.
	 */
	private function init_hooks() {
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );

		// Initialize components
		PD_Downloader::get_instance();
		if ( is_admin() ) {
			PD_Admin::get_instance();
		}
	}

	/**
	 * Load textdomain.
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'plugin-downloader', false, dirname( PD_BASENAME ) . '/languages' );
	}
}

// Kick off
PD_Pro::get_instance();
