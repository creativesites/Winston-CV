<?php
/**
 * Plugin Name: Luxe Admin - Premium White-Label Dashboard
 * Plugin URI: https://winstonzulu.com/luxe-admin
 * Description: A high-end, editorial-style WordPress admin customization tool for agencies.
 * Version: 1.0.0
 * Author: Winston Zulu
 * Author URI: https://winstonzulu.com
 * License: GPL2
 * Text Domain: luxe-admin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define Constants
define( 'LUXE_ADMIN_VERSION', '1.0.0' );
define( 'LUXE_ADMIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'LUXE_ADMIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Autoloader for Luxe Admin classes.
 */
spl_autoload_register( function ( $class ) {
	$prefix = 'Luxe_Admin\\';
	$base_dir = LUXE_ADMIN_PATH . 'includes/';

	$len = strlen( $prefix );
	if ( strncmp( $prefix, $class, $len ) !== 0 ) {
		return;
	}

	$relative_class = substr( $class, $len );
	
	// Convert namespace to file path
	// Luxe_Admin\Modules\Login -> modules/class-login.php
	$parts = explode( '\\', $relative_class );
	$file = 'class-' . strtolower( end( $parts ) ) . '.php';
	
	array_pop( $parts );
	$sub_path = ! empty( $parts ) ? strtolower( implode( '/', $parts ) ) . '/' : '';
	
	$path = $base_dir . $sub_path . $file;

	if ( file_exists( $path ) ) {
		require $path;
	}
} );

/**
 * Initialize the Plugin
 */
function luxe_admin_init() {
	if ( is_admin() || strpos( $_SERVER['REQUEST_URI'], 'wp-login.php' ) !== false ) {
		\Luxe_Admin\Core\Main::get_instance();
	}
}
add_action( 'plugins_loaded', 'luxe_admin_init' );

/**
 * Activation Hook
 */
register_activation_hook( __FILE__, function() {
	// Initialize default options
	if ( ! get_option( 'luxe_admin_settings' ) ) {
		update_option( 'luxe_admin_settings', [
			'theme' => 'default',
			'login' => [
				'enabled' => false,
				'logo'    => '',
			],
			'menu' => [],
			'dashboard' => [
				'hide_default' => true,
				'welcome_msg'  => 'Welcome to your professional dashboard.',
			]
		] );
	}
} );
