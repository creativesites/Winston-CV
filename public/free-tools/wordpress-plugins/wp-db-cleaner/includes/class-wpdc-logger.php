<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class WPDC_Logger {

	private static function table(): string {
		global $wpdb;
		return $wpdb->prefix . 'wpdc_log';
	}

	public static function create_table(): void {
		global $wpdb;
		$charset = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS " . self::table() . " (
			id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			run_id      VARCHAR(32)  NOT NULL,
			type        VARCHAR(60)  NOT NULL,
			label       VARCHAR(120) NOT NULL,
			deleted     INT UNSIGNED NOT NULL DEFAULT 0,
			dry_run     TINYINT(1)   NOT NULL DEFAULT 0,
			triggered   VARCHAR(20)  NOT NULL DEFAULT 'manual',
			created_at  DATETIME     NOT NULL,
			PRIMARY KEY (id),
			KEY run_id     (run_id),
			KEY created_at (created_at)
		) $charset;";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	public static function log(
		string $run_id,
		string $type,
		string $label,
		int    $deleted,
		bool   $dry_run   = false,
		string $triggered = 'manual'
	): void {
		global $wpdb;
		$wpdb->insert( self::table(), [
			'run_id'     => $run_id,
			'type'       => $type,
			'label'      => $label,
			'deleted'    => $deleted,
			'dry_run'    => $dry_run ? 1 : 0,
			'triggered'  => $triggered,
			'created_at' => current_time( 'mysql' ),
		] );
	}

	public static function get_recent( int $limit = 200 ): array {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM " . self::table() . " ORDER BY created_at DESC, id DESC LIMIT %d",
			$limit
		) ) ?: [];
	}

	public static function get_run_summary( string $run_id ): array {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM " . self::table() . " WHERE run_id = %s ORDER BY id ASC",
			$run_id
		) ) ?: [];
	}

	public static function clear( int $days = 0 ): int {
		global $wpdb;
		if ( $days > 0 ) {
			return (int) $wpdb->query( $wpdb->prepare(
				"DELETE FROM " . self::table() . " WHERE created_at < DATE_SUB(NOW(), INTERVAL %d DAY)",
				$days
			) );
		}
		return (int) $wpdb->query( "TRUNCATE TABLE " . self::table() );
	}

	public static function get_total_deleted(): int {
		global $wpdb;
		return (int) $wpdb->get_var(
			"SELECT SUM(deleted) FROM " . self::table() . " WHERE dry_run = 0"
		);
	}

	public static function prune( int $days ): void {
		if ( $days > 0 ) {
			self::clear( $days );
		}
	}
}
