<?php
namespace Luxe_Admin\Modules;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Login {
	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'login_enqueue_scripts', [ $this, 'customize_login_page' ] );
	}

	public function customize_login_page() {
		$settings = get_option( 'luxe_admin_settings', [] );
		if ( empty( $settings['login']['enabled'] ) ) {
			return;
		}

		?>
		<style type="text/css">
			body.login { background: #fdfdfd; display: flex; align-items: center; justify-content: center; }
			#login { padding: 40px; background: #fff; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
			.login h1 a { background-size: contain; width: 100%; }
			#loginform { border: none; box-shadow: none; padding: 0; }
			.wp-core-ui .button-primary { background: #111 !important; border: none !important; border-radius: 6px !important; transition: all 0.3s ease; }
			.wp-core-ui .button-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
		</style>
		<?php
	}
}
