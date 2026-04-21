<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class WPDC_Cleaner {

	public static function clean( string $type, array $options = [], bool $dry_run = false ): array {
		$method = 'clean_' . $type;
		if ( ! method_exists( __CLASS__, $method ) ) {
			return [ 'deleted' => 0, 'error' => 'Unknown type.' ];
		}
		return self::$method( $options, $dry_run );
	}

	// ── Post Revisions ────────────────────────────────────────────────────────
	public static function clean_revisions( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$keep = max( 0, (int) ( $options['keep'] ?? 0 ) );

		if ( $keep > 0 ) {
			$parent_ids    = $wpdb->get_col(
				"SELECT DISTINCT post_parent FROM {$wpdb->posts} WHERE post_type = 'revision'"
			);
			$ids_to_delete = [];
			foreach ( $parent_ids as $pid ) {
				$revs = $wpdb->get_col( $wpdb->prepare(
					"SELECT ID FROM {$wpdb->posts}
					 WHERE post_type = 'revision' AND post_parent = %d
					 ORDER BY post_date DESC",
					$pid
				) );
				if ( count( $revs ) > $keep ) {
					$ids_to_delete = array_merge( $ids_to_delete, array_slice( $revs, $keep ) );
				}
			}
			$count = count( $ids_to_delete );
			if ( ! $dry_run && $count > 0 ) {
				foreach ( $ids_to_delete as $id ) {
					wp_delete_post_revision( (int) $id );
				}
			}
		} else {
			$count = (int) $wpdb->get_var(
				"SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'revision'"
			);
			if ( ! $dry_run && $count > 0 ) {
				$wpdb->query(
					"DELETE FROM {$wpdb->postmeta}
					 WHERE post_id IN ( SELECT ID FROM {$wpdb->posts} WHERE post_type = 'revision' )"
				);
				$wpdb->query( "DELETE FROM {$wpdb->posts} WHERE post_type = 'revision'" );
			}
		}
		return [ 'deleted' => $count ];
	}

	// ── Auto Drafts ───────────────────────────────────────────────────────────
	public static function clean_auto_drafts( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$count = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_status = 'auto-draft'"
		);
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query(
				"DELETE pm FROM {$wpdb->postmeta} pm
				 INNER JOIN {$wpdb->posts} p ON pm.post_id = p.ID
				 WHERE p.post_status = 'auto-draft'"
			);
			$wpdb->query( "DELETE FROM {$wpdb->posts} WHERE post_status = 'auto-draft'" );
		}
		return [ 'deleted' => $count ];
	}

	// ── Trashed Posts ─────────────────────────────────────────────────────────
	public static function clean_trashed_posts( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$ids = $wpdb->get_col(
			"SELECT ID FROM {$wpdb->posts} WHERE post_status = 'trash'"
		);
		$count = count( $ids );
		if ( ! $dry_run && $count > 0 ) {
			foreach ( $ids as $id ) {
				wp_delete_post( (int) $id, true );
			}
		}
		return [ 'deleted' => $count ];
	}

	// ── Spam Comments ─────────────────────────────────────────────────────────
	public static function clean_spam_comments( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$count = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->comments} WHERE comment_approved = 'spam'"
		);
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query(
				"DELETE cm FROM {$wpdb->commentmeta} cm
				 INNER JOIN {$wpdb->comments} c ON cm.comment_id = c.comment_ID
				 WHERE c.comment_approved = 'spam'"
			);
			$wpdb->query( "DELETE FROM {$wpdb->comments} WHERE comment_approved = 'spam'" );
		}
		return [ 'deleted' => $count ];
	}

	// ── Trashed Comments ──────────────────────────────────────────────────────
	public static function clean_trashed_comments( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$count = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->comments} WHERE comment_approved = 'trash'"
		);
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query(
				"DELETE cm FROM {$wpdb->commentmeta} cm
				 INNER JOIN {$wpdb->comments} c ON cm.comment_id = c.comment_ID
				 WHERE c.comment_approved = 'trash'"
			);
			$wpdb->query( "DELETE FROM {$wpdb->comments} WHERE comment_approved = 'trash'" );
		}
		return [ 'deleted' => $count ];
	}

	// ── Old Unapproved Comments ───────────────────────────────────────────────
	public static function clean_unapproved_comments( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$days  = max( 1, (int) ( $options['days'] ?? 30 ) );
		$count = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM {$wpdb->comments}
			 WHERE comment_approved = '0'
			   AND comment_date < DATE_SUB( NOW(), INTERVAL %d DAY )",
			$days
		) );
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query( $wpdb->prepare(
				"DELETE cm FROM {$wpdb->commentmeta} cm
				 INNER JOIN {$wpdb->comments} c ON cm.comment_id = c.comment_ID
				 WHERE c.comment_approved = '0'
				   AND c.comment_date < DATE_SUB( NOW(), INTERVAL %d DAY )",
				$days
			) );
			$wpdb->query( $wpdb->prepare(
				"DELETE FROM {$wpdb->comments}
				 WHERE comment_approved = '0'
				   AND comment_date < DATE_SUB( NOW(), INTERVAL %d DAY )",
				$days
			) );
		}
		return [ 'deleted' => $count ];
	}

	// ── Expired Transients ────────────────────────────────────────────────────
	public static function clean_expired_transients( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$now   = time();
		$names = $wpdb->get_col( $wpdb->prepare(
			"SELECT REPLACE( option_name, '_transient_timeout_', '' )
			 FROM {$wpdb->options}
			 WHERE option_name LIKE %s AND CAST( option_value AS UNSIGNED ) < %d",
			$wpdb->esc_like( '_transient_timeout_' ) . '%',
			$now
		) );
		$site_names = $wpdb->get_col( $wpdb->prepare(
			"SELECT REPLACE( option_name, '_site_transient_timeout_', '' )
			 FROM {$wpdb->options}
			 WHERE option_name LIKE %s AND CAST( option_value AS UNSIGNED ) < %d",
			$wpdb->esc_like( '_site_transient_timeout_' ) . '%',
			$now
		) );
		$count = count( $names ) + count( $site_names );
		if ( ! $dry_run && $count > 0 ) {
			foreach ( $names as $name ) {
				delete_transient( $name );
			}
			foreach ( $site_names as $name ) {
				delete_site_transient( $name );
			}
		}
		return [ 'deleted' => $count ];
	}

	// ── All Transients ────────────────────────────────────────────────────────
	public static function clean_all_transients( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$count = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM {$wpdb->options}
			 WHERE option_name LIKE %s OR option_name LIKE %s",
			$wpdb->esc_like( '_transient_' ) . '%',
			$wpdb->esc_like( '_site_transient_' ) . '%'
		) );
		$count = (int) ceil( $count / 2 );
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query( $wpdb->prepare(
				"DELETE FROM {$wpdb->options}
				 WHERE option_name LIKE %s OR option_name LIKE %s",
				$wpdb->esc_like( '_transient_' ) . '%',
				$wpdb->esc_like( '_site_transient_' ) . '%'
			) );
		}
		return [ 'deleted' => $count ];
	}

	// ── Orphaned Post Meta ────────────────────────────────────────────────────
	public static function clean_orphaned_post_meta( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$count = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->postmeta} pm
			 LEFT JOIN {$wpdb->posts} p ON pm.post_id = p.ID
			 WHERE p.ID IS NULL"
		);
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query(
				"DELETE pm FROM {$wpdb->postmeta} pm
				 LEFT JOIN {$wpdb->posts} p ON pm.post_id = p.ID
				 WHERE p.ID IS NULL"
			);
		}
		return [ 'deleted' => $count ];
	}

	// ── Orphaned Comment Meta ─────────────────────────────────────────────────
	public static function clean_orphaned_comment_meta( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$count = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->commentmeta} cm
			 LEFT JOIN {$wpdb->comments} c ON cm.comment_id = c.comment_ID
			 WHERE c.comment_ID IS NULL"
		);
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query(
				"DELETE cm FROM {$wpdb->commentmeta} cm
				 LEFT JOIN {$wpdb->comments} c ON cm.comment_id = c.comment_ID
				 WHERE c.comment_ID IS NULL"
			);
		}
		return [ 'deleted' => $count ];
	}

	// ── Orphaned User Meta ────────────────────────────────────────────────────
	public static function clean_orphaned_user_meta( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$count = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->usermeta} um
			 LEFT JOIN {$wpdb->users} u ON um.user_id = u.ID
			 WHERE u.ID IS NULL"
		);
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query(
				"DELETE um FROM {$wpdb->usermeta} um
				 LEFT JOIN {$wpdb->users} u ON um.user_id = u.ID
				 WHERE u.ID IS NULL"
			);
		}
		return [ 'deleted' => $count ];
	}

	// ── Orphaned Term Relationships ───────────────────────────────────────────
	public static function clean_orphaned_term_relationships( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$count = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->term_relationships} tr
			 LEFT JOIN {$wpdb->posts} p ON tr.object_id = p.ID
			 WHERE p.ID IS NULL"
		);
		if ( ! $dry_run && $count > 0 ) {
			$wpdb->query(
				"DELETE tr FROM {$wpdb->term_relationships} tr
				 LEFT JOIN {$wpdb->posts} p ON tr.object_id = p.ID
				 WHERE p.ID IS NULL"
			);
		}
		return [ 'deleted' => $count ];
	}

	// ── Unused Terms ──────────────────────────────────────────────────────────
	public static function clean_unused_terms( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$protected = [ 'nav_menu', 'link_category', 'post_format' ];
		$in        = implode( ',', array_fill( 0, count( $protected ), '%s' ) );
		$query     = $wpdb->prepare(
			"SELECT t.term_id, tt.taxonomy FROM {$wpdb->terms} t
			 INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id
			 WHERE tt.count = 0 AND tt.taxonomy NOT IN ( {$in} )",
			...$protected
		);
		$terms = $wpdb->get_results( $query );
		$count = count( $terms );
		if ( ! $dry_run && $count > 0 ) {
			foreach ( $terms as $term ) {
				wp_delete_term( (int) $term->term_id, $term->taxonomy );
			}
		}
		return [ 'deleted' => $count ];
	}

	// ── Duplicate Post Meta ───────────────────────────────────────────────────
	public static function clean_duplicate_post_meta( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$dupes = $wpdb->get_results(
			"SELECT post_id, meta_key, meta_value, COUNT(*) AS cnt, MIN(meta_id) AS keep_id
			 FROM {$wpdb->postmeta}
			 GROUP BY post_id, meta_key, meta_value
			 HAVING cnt > 1"
		);
		$count = 0;
		foreach ( $dupes as $d ) {
			$count += ( (int) $d->cnt ) - 1;
		}
		if ( ! $dry_run && $count > 0 ) {
			foreach ( $dupes as $d ) {
				$wpdb->query( $wpdb->prepare(
					"DELETE FROM {$wpdb->postmeta}
					 WHERE post_id = %d AND meta_key = %s AND meta_value = %s AND meta_id != %d",
					$d->post_id, $d->meta_key, $d->meta_value, $d->keep_id
				) );
			}
		}
		return [ 'deleted' => $count ];
	}

	// ── Optimize Tables ───────────────────────────────────────────────────────
	public static function clean_optimize_tables( array $options = [], bool $dry_run = false ): array {
		global $wpdb;
		$tables = $wpdb->get_col( 'SHOW TABLES' );
		$wp_tables = array_filter( $tables, fn ( $t ) => str_starts_with( $t, $wpdb->prefix ) );
		if ( ! $dry_run ) {
			foreach ( $wp_tables as $table ) {
				$wpdb->query( "OPTIMIZE TABLE `{$table}`" ); // phpcs:ignore WordPress.DB.PreparedSQL
			}
		}
		return [ 'deleted' => count( $wp_tables ), 'label' => 'tables optimized' ];
	}

	// ── Counts for Dashboard ──────────────────────────────────────────────────
	public static function get_counts(): array {
		global $wpdb;
		$now = time();
		return [
			'revisions'                   => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'revision'" ),
			'auto_drafts'                 => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_status = 'auto-draft'" ),
			'trashed_posts'               => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_status = 'trash'" ),
			'spam_comments'               => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->comments} WHERE comment_approved = 'spam'" ),
			'trashed_comments'            => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->comments} WHERE comment_approved = 'trash'" ),
			'unapproved_comments'         => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->comments} WHERE comment_approved = '0'" ),
			'expired_transients'          => (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->options} WHERE option_name LIKE %s AND CAST(option_value AS UNSIGNED) < %d",
				$wpdb->esc_like( '_transient_timeout_' ) . '%', $now
			) ),
			'orphaned_post_meta'          => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->postmeta} pm LEFT JOIN {$wpdb->posts} p ON pm.post_id = p.ID WHERE p.ID IS NULL" ),
			'orphaned_comment_meta'       => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->commentmeta} cm LEFT JOIN {$wpdb->comments} c ON cm.comment_id = c.comment_ID WHERE c.comment_ID IS NULL" ),
			'orphaned_user_meta'          => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->usermeta} um LEFT JOIN {$wpdb->users} u ON um.user_id = u.ID WHERE u.ID IS NULL" ),
			'orphaned_term_relationships' => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->term_relationships} tr LEFT JOIN {$wpdb->posts} p ON tr.object_id = p.ID WHERE p.ID IS NULL" ),
			'unused_terms'                => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->terms} t INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id WHERE tt.count = 0 AND tt.taxonomy NOT IN ('nav_menu','link_category','post_format')" ),
			'duplicate_post_meta'         => (int) $wpdb->get_var( "SELECT SUM(cnt - 1) FROM ( SELECT COUNT(*) AS cnt FROM {$wpdb->postmeta} GROUP BY post_id, meta_key, meta_value HAVING cnt > 1 ) AS dupes" ),
		];
	}
}
