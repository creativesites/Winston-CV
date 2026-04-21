<?php
/**
 * Admin Logic + UI Class
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class PD_Admin {

	/**
	 * Instance of this class.
	 *
	 * @var PD_Admin
	 */
	private static $instance;

	/**
	 * Get instance.
	 *
	 * @return PD_Admin
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
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_filter( 'plugin_action_links', array( $this, 'add_action_link' ), 10, 2 );
	}

	/**
	 * Add menu page.
	 */
	public function add_menu() {
		add_menu_page(
			__( 'Plugin & Theme Downloader', 'plugin-downloader' ),
			__( 'Downloader', 'plugin-downloader' ),
			'activate_plugins',
			'pd-dashboard',
			array( $this, 'render_dashboard' ),
			'dashicons-download',
			80
		);
	}

	/**
	 * Enqueue admin styles.
	 */
	public function enqueue_assets( $hook ) {
		if ( 'toplevel_page_pd-dashboard' !== $hook ) {
			return;
		}

		wp_enqueue_style( 'pd-google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Outfit:wght@400;600&display=swap', array(), PD_VERSION );
		wp_enqueue_style( 'pd-admin-css', PD_URL . 'assets/css/pd-admin.css', array(), PD_VERSION );
	}

	/**
	 * Add "Download ZIP" link to standard plugin table too.
	 */
	public function add_action_link( $links, $plugin_file ) {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return $links;
		}

		$nonce = wp_create_nonce( 'pd_download_' . $plugin_file );
		$url = admin_url( 'admin-post.php?action=pd_download_item&type=plugin&id=' . urlencode( $plugin_file ) . '&_wpnonce=' . $nonce );

		$links['download'] = '<a href="' . esc_url( $url ) . '" style="color:#db9751; font-weight:bold;">' . __( 'Download ZIP', 'plugin-downloader' ) . '</a>';
		return $links;
	}

	/**
	 * Render the dashboard.
	 */
	public function render_dashboard() {
		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( $_GET['tab'] ) : 'plugins';

		// Get Data
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		$plugins = get_plugins();
		$themes  = wp_get_themes();

		?>
		<div class="pd-dashboard-wrap">
			<header class="pd-header">
				<div class="pd-header-top">
					<div class="pd-logo">
						<span class="dashicons dashicons-download"></span>
						<h1><?php echo esc_html__( 'Plugin & Theme Downloader', 'plugin-downloader' ); ?></h1>
					</div>
					<div class="pd-badge"><?php echo esc_html__( 'Free', 'plugin-downloader' ); ?></div>
				</div>
				<p class="pd-subtitle"><?php echo esc_html__( 'Easily backup or export any of your installed extensions with one click.', 'plugin-downloader' ); ?></p>
			</header>

			<nav class="pd-tabs">
				<a href="?page=pd-dashboard&tab=plugins" class="pd-tab <?php echo $tab === 'plugins' ? 'is-active' : ''; ?>">
					<?php echo esc_html__( 'Plugins', 'plugin-downloader' ); ?>
					<span class="pd-count"><?php echo count( $plugins ); ?></span>
				</a>
				<a href="?page=pd-dashboard&tab=themes" class="pd-tab <?php echo $tab === 'themes' ? 'is-active' : ''; ?>">
					<?php echo esc_html__( 'Themes', 'plugin-downloader' ); ?>
					<span class="pd-count"><?php echo count( $themes ); ?></span>
				</a>
			</nav>

			<div class="pd-content">
				<?php if ( 'plugins' === $tab ) : ?>
					<div class="pd-grid">
						<?php foreach ( $plugins as $file => $data ) : 
							$nonce = wp_create_nonce( 'pd_download_' . $file );
							$dl_url = admin_url( 'admin-post.php?action=pd_download_item&type=plugin&id=' . urlencode( $file ) . '&_wpnonce=' . $nonce );
						?>
							<article class="pd-card pd-reveal">
								<div class="pd-card-header">
									<h3 class="pd-card-title"><?php echo esc_html( $data['Name'] ); ?></h3>
									<span class="pd-version"><?php echo esc_html( $data['Version'] ); ?></span>
								</div>
								<p class="pd-card-desc"><?php echo wp_trim_words( strip_tags( $data['Description'] ), 15 ); ?></p>
								<div class="pd-card-footer">
									<span class="pd-author">by <?php echo esc_html( $data['AuthorName'] ); ?></span>
									<a href="<?php echo esc_url( $dl_url ); ?>" class="pd-button">
										<span class="dashicons dashicons-download"></span>
										<?php echo esc_html__( 'Get ZIP', 'plugin-downloader' ); ?>
									</a>
								</div>
							</article>
						<?php endforeach; ?>
					</div>
				<?php else : ?>
					<div class="pd-grid">
						<?php foreach ( $themes as $slug => $theme ) : 
							$nonce = wp_create_nonce( 'pd_download_' . $slug );
							$dl_url = admin_url( 'admin-post.php?action=pd_download_item&type=theme&slug=' . $slug . '&id=' . $slug . '&_wpnonce=' . $nonce );
						?>
							<article class="pd-card pd-reveal">
								<div class="pd-card-header">
									<h3 class="pd-card-title"><?php echo esc_html( $theme->get( 'Name' ) ); ?></h3>
									<span class="pd-version"><?php echo esc_html( $theme->get( 'Version' ) ); ?></span>
								</div>
								<div class="pd-theme-screenshot" style="background-image: url('<?php echo esc_url( $theme->get_screenshot() ); ?>');"></div>
								<div class="pd-card-footer">
									<span class="pd-author">by <?php echo esc_html( $theme->get( 'Author' ) ); ?></span>
									<a href="<?php echo esc_url( $dl_url ); ?>" class="pd-button">
										<span class="dashicons dashicons-download"></span>
										<?php echo esc_html__( 'Get ZIP', 'plugin-downloader' ); ?>
									</a>
								</div>
							</article>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
		<?php
	}
}
