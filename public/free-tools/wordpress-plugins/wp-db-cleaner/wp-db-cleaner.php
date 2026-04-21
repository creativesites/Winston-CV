<?php
/**
 * Plugin Name:  WP Database Cleaner
 * Plugin URI:   https://winston.work/tools
 * Description:  Enterprise-grade WordPress database optimization. Clean revisions, transients, orphaned metadata, and optimize tables — with scheduling, dry-run mode, and a full activity log.
 * Version:      1.0.0
 * Author:       Winston Chikazhe
 * Author URI:   https://winston.work
 * License:      GPL v2 or later
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  wp-db-cleaner
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WPDC_VERSION',     '1.0.0' );
define( 'WPDC_PLUGIN_DIR',  plugin_dir_path( __FILE__ ) );
define( 'WPDC_PLUGIN_URL',  plugin_dir_url( __FILE__ ) );
define( 'WPDC_PLUGIN_FILE', __FILE__ );

foreach ( [ 'class-wpdc-logger', 'class-wpdc-analyzer', 'class-wpdc-cleaner', 'class-wpdc-scheduler', 'class-wpdc-admin' ] as $file ) {
	require_once WPDC_PLUGIN_DIR . 'includes/' . $file . '.php';
}

register_activation_hook( __FILE__, function () {
	WPDC_Logger::create_table();
	WPDC_Scheduler::register_schedules();
} );

register_deactivation_hook( __FILE__, [ 'WPDC_Scheduler', 'clear_scheduled_events' ] );

add_action( 'plugins_loaded', function () {
	new WPDC_Admin();
	new WPDC_Scheduler();
} );
