<?php
namespace Luxe_Admin\Modules;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles granular control over Admin Menus and the Toolbar.
 */
class Menu {
	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'admin_menu', [ $this, 'modify_admin_menu' ], 999 );
		add_action( 'admin_bar_menu', [ $this, 'modify_toolbar' ], 999 );
	}

	public function modify_admin_menu() {
		global $menu, $submenu;
		$settings = get_option( 'luxe_admin_settings', [] );
		$hidden_items = isset( $settings['menu']['hidden'] ) ? $settings['menu']['hidden'] : [];

		if ( empty( $hidden_items ) ) return;

		// We assume $hidden_items is an array of menu slugs to hide for specific roles
		// For simplicity in this initial version, we hide them for anyone not a Super Admin
		if ( ! is_super_admin() ) {
			foreach ( $menu as $key => $item ) {
				if ( in_array( $item[2], $hidden_items ) ) {
					unset( $menu[$key] );
				}
			}
		}
	}

	public function modify_toolbar( $wp_admin_bar ) {
		$settings = get_option( 'luxe_admin_settings', [] );
		if ( ! empty( $settings['menu']['hide_wp_logo'] ) ) {
			$wp_admin_bar->remove_node( 'wp-logo' );
		}
	}
}
