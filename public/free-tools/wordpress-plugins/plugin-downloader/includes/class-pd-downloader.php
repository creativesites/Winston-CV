<?php
/**
 * Downloader Engine Class
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class PD_Downloader {

	/**
	 * Instance of this class.
	 *
	 * @var PD_Downloader
	 */
	private static $instance;

	/**
	 * Get instance.
	 *
	 * @return PD_Downloader
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
		add_action( 'admin_post_pd_download_item', array( $this, 'handle_download' ) );
	}

	/**
	 * Handle the download request.
	 */
	public function handle_download() {
		if ( ! current_user_can( 'activate_plugins' ) && ! current_user_can( 'edit_theme_options' ) ) {
			wp_die( esc_html__( 'Insufficient permissions.', 'plugin-downloader' ) );
		}

		$type = isset( $_GET['type'] ) ? sanitize_text_field( wp_unslash( $_GET['type'] ) ) : '';
		$slug = isset( $_GET['slug'] ) ? sanitize_text_field( wp_unslash( $_GET['slug'] ) ) : '';
		$item_id = isset( $_GET['id'] ) ? sanitize_text_field( wp_unslash( $_GET['id'] ) ) : '';

		// Verify nonce
		if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( $_GET['_wpnonce'], 'pd_download_' . $item_id ) ) {
			wp_die( esc_html__( 'Security check failed.', 'plugin-downloader' ) );
		}

		if ( 'plugin' === $type ) {
			$this->download_plugin( $item_id );
		} elseif ( 'theme' === $type ) {
			$this->download_theme( $slug );
		} else {
			wp_die( esc_html__( 'Invalid download type.', 'plugin-downloader' ) );
		}
	}

	/**
	 * Download a plugin.
	 *
	 * @param string $plugin_file The plugin basename (e.g., folder/file.php).
	 */
	private function download_plugin( $plugin_file ) {
		$plugin_path = WP_PLUGIN_DIR . '/' . $plugin_file;

		if ( ! file_exists( $plugin_path ) ) {
			wp_die( esc_html__( 'Plugin not found.', 'plugin-downloader' ) );
		}

		$plugin_slug = dirname( $plugin_file );
		$is_directory = ( '.' !== $plugin_slug );
		$source_path = $is_directory ? WP_PLUGIN_DIR . '/' . $plugin_slug : $plugin_path;
		$zip_name = $is_directory ? $plugin_slug : basename( $plugin_file, '.php' );

		$this->zip_and_stream( $source_path, $zip_name, $is_directory );
	}

	/**
	 * Download a theme.
	 *
	 * @param string $theme_slug The theme folder name.
	 */
	private function download_theme( $theme_slug ) {
		$theme_path = get_theme_root() . '/' . $theme_slug;

		if ( ! file_exists( $theme_path ) ) {
			wp_die( esc_html__( 'Theme not found.', 'plugin-downloader' ) );
		}

		$this->zip_and_stream( $theme_path, $theme_slug, true );
	}

	/**
	 * ZIP the source and stream to browser.
	 */
	private function zip_and_stream( $source_path, $zip_name, $is_directory ) {
		if ( ! class_exists( 'ZipArchive' ) ) {
			wp_die( esc_html__( 'ZipArchive class not found.', 'plugin-downloader' ) );
		}

		$temp_zip = wp_upload_dir()['basedir'] . '/' . $zip_name . '-' . time() . '.zip';
		$zip = new ZipArchive();

		if ( true !== $zip->open( $temp_zip, ZipArchive::CREATE | ZipArchive::OVERWRITE ) ) {
			wp_die( esc_html__( 'Failed to create ZIP.', 'plugin-downloader' ) );
		}

		if ( $is_directory ) {
			$files = new RecursiveIteratorIterator(
				new RecursiveDirectoryIterator( $source_path, RecursiveDirectoryIterator::SKIP_DOTS ),
				RecursiveIteratorIterator::LEAVES_ONLY
			);

			foreach ( $files as $file ) {
				if ( ! $file->isDir() ) {
					$file_path = $file->getRealPath();
					$relative_path = $zip_name . '/' . substr( $file_path, strlen( realpath( $source_path ) ) + 1 );
					$zip->addFile( $file_path, $relative_path );
				}
			}
		} else {
			$zip->addFile( $source_path, basename( $source_path ) );
		}

		$zip->close();

		if ( ! file_exists( $temp_zip ) ) {
			wp_die( esc_html__( 'ZIP generation failed.', 'plugin-downloader' ) );
		}

		// Stream
		header( 'Content-Type: application/zip' );
		header( 'Content-Disposition: attachment; filename="' . esc_attr( $zip_name ) . '.zip"' );
		header( 'Content-Length: ' . filesize( $temp_zip ) );
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );

		readfile( $temp_zip );
		unlink( $temp_zip );
		exit;
	}
}
