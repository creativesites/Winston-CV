<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$settings = get_option( 'luxe_admin_settings', [] );
?>

<div class="wrap luxe-admin-settings-wrap">
	<header class="luxe-header">
		<div class="luxe-branding">
			<h1>Luxe Admin</h1>
			<p class="subtitle">Premium White-Label Dashboard</p>
		</div>
		<div class="luxe-actions">
			<button id="luxe-save-settings" class="button button-primary button-hero">Save Changes</button>
		</div>
	</header>

	<div class="luxe-main-grid">
		<aside class="luxe-sidebar">
			<nav class="luxe-tabs">
				<a href="#general" class="active" data-tab="general"><span class="dashicons dashicons-admin-generic"></span> General Skins</a>
				<a href="#login" data-tab="login"><span class="dashicons dashicons-lock"></span> Login Page</a>
				<a href="#menu" data-tab="menu"><span class="dashicons dashicons-menu"></span> Menu Control</a>
				<a href="#dashboard" data-tab="dashboard"><span class="dashicons dashicons-dashboard"></span> Dashboard</a>
			</nav>
		</aside>

		<main class="luxe-content">
			<!-- General Section -->
			<section id="tab-general" class="tab-content active">
				<h3>Admin Appearance</h3>
				<p>Select a modern skin for your WordPress dashboard.</p>
				
				<div class="luxe-skin-selector">
					<label class="skin-option <?php echo ( $settings['theme'] === 'default' ) ? 'selected' : ''; ?>">
						<input type="radio" name="theme" value="default" <?php checked( $settings['theme'], 'default' ); ?>>
						<div class="skin-preview default"></div>
						<span>Default WP</span>
					</label>
					<label class="skin-option <?php echo ( $settings['theme'] === 'midnight' ) ? 'selected' : ''; ?>">
						<input type="radio" name="theme" value="midnight" <?php checked( $settings['theme'], 'midnight' ); ?>>
						<div class="skin-preview midnight"></div>
						<span>Midnight Dark</span>
					</label>
					<label class="skin-option <?php echo ( $settings['theme'] === 'glass' ) ? 'selected' : ''; ?>">
						<input type="radio" name="theme" value="glass" <?php checked( $settings['theme'], 'glass' ); ?>>
						<div class="skin-preview glass"></div>
						<span>Glassmorphism</span>
					</label>
				</div>
			</section>

			<!-- Login Section -->
			<section id="tab-login" class="tab-content">
				<h3>Login Customizer</h3>
				<p>Make the login page feel like your brand.</p>
				
				<div class="luxe-field-group">
					<label class="switch">
						<input type="checkbox" name="login_enabled" value="1" <?php checked( @$settings['login']['enabled'], 1 ); ?>>
						<span class="slider round"></span>
					</label>
					<span>Enable Custom Login Styles</span>
				</div>
				
				<div class="luxe-field-group">
					<label>Custom Login Message</label>
					<input type="text" name="login_msg" value="<?php echo esc_attr( @$settings['login']['msg'] ); ?>" placeholder="e.g. Agency Client Portal">
				</div>
			</section>

			<!-- Menu Section -->
			<section id="tab-menu" class="tab-content">
				<h3>Menu & Toolbar</h3>
				<div class="luxe-field-group">
					<label class="switch">
						<input type="checkbox" name="hide_wp_logo" value="1" <?php checked( @$settings['menu']['hide_wp_logo'], 1 ); ?>>
						<span class="slider round"></span>
					</label>
					<span>Hide WordPress Logo in Toolbar</span>
				</div>

				<hr style="border:0; border-top: 1px solid #eee; margin:30px 0;">
				
				<h3>Hide Sidebar Items</h3>
				<p>Select which core items to hide for non-admin users.</p>
				<div class="luxe-checkbox-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
					<?php 
					$core_menus = [
						'edit.php' => 'Posts',
						'upload.php' => 'Media',
						'edit.php?post_type=page' => 'Pages',
						'edit-comments.php' => 'Comments',
						'themes.php' => 'Appearance',
						'plugins.php' => 'Plugins',
						'users.php' => 'Users',
						'tools.php' => 'Tools',
						'options-general.php' => 'Settings',
					];
					foreach($core_menus as $slug => $label): 
						$checked = (isset($settings['menu']['hidden']) && in_array($slug, $settings['menu']['hidden'])) ? 'checked' : '';
					?>
						<label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
							<input type="checkbox" name="hide_menu[]" value="<?php echo esc_attr($slug); ?>" <?php echo $checked; ?>>
							<?php echo esc_html($label); ?>
						</label>
					<?php endforeach; ?>
				</div>
			</section>

			<!-- Dashboard Section -->
			<section id="tab-dashboard" class="tab-content">
				<h3>Dashboard Workspace</h3>
				<div class="luxe-field-group">
					<label class="switch">
						<input type="checkbox" name="hide_default_widgets" value="1" <?php checked( @$settings['dashboard']['hide_default'], 1 ); ?>>
						<span class="slider round"></span>
					</label>
					<span>Hide All Default WP Widgets</span>
				</div>
				<div class="luxe-field-group">
					<label>Welcome Message</label>
					<textarea name="welcome_msg"><?php echo esc_textarea( @$settings['dashboard']['welcome_msg'] ); ?></textarea>
				</div>
			</section>
		</main>
	</div>
</div>
