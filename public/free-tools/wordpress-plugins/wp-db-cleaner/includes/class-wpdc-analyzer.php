<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class WPDC_Analyzer {

	public static function get_table_stats(): array {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			"SELECT
				table_name      AS name,
				table_rows      AS `rows`,
				ROUND( ( data_length + index_length ) / 1024 / 1024, 2 ) AS size_mb,
				ROUND( data_free / 1024 / 1024, 2 )                       AS free_mb
			FROM information_schema.tables
			WHERE table_schema = %s
			  AND table_name LIKE %s
			ORDER BY ( data_length + index_length ) DESC",
			DB_NAME,
			$wpdb->esc_like( $wpdb->prefix ) . '%'
		) ) ?: [];
	}

	public static function get_database_size(): float {
		global $wpdb;
		$mb = $wpdb->get_var( $wpdb->prepare(
			"SELECT ROUND( SUM( data_length + index_length ) / 1024 / 1024, 2 )
			 FROM information_schema.tables
			 WHERE table_schema = %s
			   AND table_name LIKE %s",
			DB_NAME,
			$wpdb->esc_like( $wpdb->prefix ) . '%'
		) );
		return (float) $mb;
	}

	public static function get_reclaimable_size(): float {
		global $wpdb;
		$mb = $wpdb->get_var( $wpdb->prepare(
			"SELECT ROUND( SUM( data_free ) / 1024 / 1024, 2 )
			 FROM information_schema.tables
			 WHERE table_schema = %s
			   AND table_name LIKE %s",
			DB_NAME,
			$wpdb->esc_like( $wpdb->prefix ) . '%'
		) );
		return (float) $mb;
	}

	public static function get_health_score( array $counts ): int {
		$total = array_sum( $counts );
		if ( $total === 0  ) return 100;
		if ( $total < 25   ) return 92;
		if ( $total < 100  ) return 80;
		if ( $total < 300  ) return 65;
		if ( $total < 1000 ) return 45;
		if ( $total < 5000 ) return 28;
		return 15;
	}
}
