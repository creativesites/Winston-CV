<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class WPDC_Scheduler {

	const HOOK = 'wpdc_scheduled_clean';

	public function __construct() {
		add_action( self::HOOK, [ $this, 'run' ] );
		add_filter( 'cron_schedules', [ $this, 'add_schedules' ] );
	}

	public function add_schedules( array $schedules ): array {
		if ( ! isset( $schedules['weekly'] ) ) {
			$schedules['weekly'] = [
				'interval' => WEEK_IN_SECONDS,
				'display'  => __( 'Once Weekly', 'wp-db-cleaner' ),
			];
		}
		if ( ! isset( $schedules['monthly'] ) ) {
			$schedules['monthly'] = [
				'interval' => 30 * DAY_IN_SECONDS,
				'display'  => __( 'Once Monthly', 'wp-db-cleaner' ),
			];
		}
		return $schedules;
	}

	public static function register_schedules(): void {
		$s = get_option( 'wpdc_schedule', [] );
		if ( ! empty( $s['enabled'] ) ) {
			self::activate( $s['frequency'] ?? 'weekly' );
		}
	}

	public static function activate( string $frequency ): void {
		if ( ! wp_next_scheduled( self::HOOK ) ) {
			wp_schedule_event( time(), $frequency, self::HOOK );
		}
	}

	public static function reschedule( string $frequency ): void {
		self::clear_scheduled_events();
		self::activate( $frequency );
	}

	public static function clear_scheduled_events(): void {
		$ts = wp_next_scheduled( self::HOOK );
		if ( $ts ) {
			wp_unschedule_event( $ts, self::HOOK );
		}
	}

	public function run(): void {
		$schedule = get_option( 'wpdc_schedule', [] );
		$settings = get_option( 'wpdc_settings', [] );
		$types    = $schedule['types'] ?? array_keys( WPDC_Admin::CLEAN_TYPES );
		$run_id   = uniqid( 'sched_', true );
		$options  = [
			'keep' => (int) ( $settings['keep_revisions'] ?? 5 ),
			'days' => (int) ( $settings['unapproved_days'] ?? 30 ),
		];

		foreach ( $types as $type ) {
			$result = WPDC_Cleaner::clean( $type, $options, false );
			$label  = WPDC_Admin::CLEAN_TYPES[ $type ]['label'] ?? $type;
			WPDC_Logger::log( $run_id, $type, $label, $result['deleted'] ?? 0, false, 'scheduled' );
		}

		// Prune old logs
		$retention = (int) ( $settings['log_retention'] ?? 90 );
		WPDC_Logger::prune( $retention );

		update_option( 'wpdc_last_scheduled_run', current_time( 'mysql' ) );

		if ( ! empty( $schedule['email'] ) && is_email( $schedule['email'] ) ) {
			self::send_email_report( $schedule['email'], $run_id );
		}
	}

	private static function send_email_report( string $email, string $run_id ): void {
		$rows    = WPDC_Logger::get_run_summary( $run_id );
		$total   = array_sum( array_column( $rows, 'deleted' ) );
		$site    = get_bloginfo( 'name' );
		$subject = sprintf( '[%s] WP Database Cleaner — Scheduled Run Complete', $site );
		$lines   = array_map(
			fn ( $r ) => sprintf( '  %-40s %d items removed', $r->label . ':', $r->deleted ),
			$rows
		);
		$body    = sprintf( "Scheduled database cleaning for %s completed.\n\n", $site )
		         . implode( "\n", $lines )
		         . sprintf( "\n\nTotal items removed: %d\nRun completed: %s\n", $total, current_time( 'mysql' ) );
		wp_mail( $email, $subject, $body );
	}
}
