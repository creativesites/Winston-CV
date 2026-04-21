<?php
/**
 * Plugin Name: WP Guard
 * Plugin URI:  #
 * Description: Premium security hardening tool for WordPress developers. Generate and implement security snippets with ease.
 * Version:     1.0.0
 * Author:      Winston Zulu
 * Text Domain: wp-guard
 * License:     GPLv2 or later
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Main Plugin Class
 */
final class WP_Guard {

    private static $instance;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->define_constants();
        $this->init_hooks();
    }

    private function define_constants() {
        define( 'WP_GUARD_VERSION', '1.0.0' );
        define( 'WP_GUARD_PATH', plugin_dir_path( __FILE__ ) );
        define( 'WP_GUARD_URL', plugin_dir_url( __FILE__ ) );
    }

    private function init_hooks() {
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
    }

    public function add_admin_menu() {
        add_menu_page(
            __( 'WP Guard', 'wp-guard' ),
            __( 'WP Guard', 'wp-guard' ),
            'manage_options',
            'wp-guard',
            array( $this, 'render_admin_page' ),
            'dashicons-shield-alt',
            80
        );
    }

    public function enqueue_assets( $hook ) {
        if ( 'toplevel_page_wp-guard' !== $hook ) {
            return;
        }

        wp_enqueue_style( 
            'wp-guard-google-fonts', 
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap', 
            array(), 
            null 
        );

        wp_enqueue_style( 
            'wp-guard-styles', 
            WP_GUARD_URL . 'assets/style.css', 
            array(), 
            WP_GUARD_VERSION 
        );

        wp_enqueue_script( 
            'wp-guard-scripts', 
            WP_GUARD_URL . 'assets/app.js', 
            array(), 
            WP_GUARD_VERSION, 
            true 
        );
    }

    public function render_admin_page() {
        include WP_GUARD_PATH . 'templates/admin-page.php';
    }
}

// Initialize
WP_Guard::get_instance();
