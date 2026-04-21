=== Plugin & Theme Downloader ===
Contributors: Winston
Tags: backup, plugin, theme, download, zip, exporter, development
Requires at least: 5.6
Tested up to: 6.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Download any installed plugin or theme as a ZIP file directly from your WordPress dashboard.

== Description ==

Plugin & Theme Downloader is a utility designed for developers, site administrators, and agencies who need a quick way to backup or export themes and plugins.

Whether you need to move a custom theme to another site or backup a specific version of a plugin, this tool provides a clean, intuitive interface to get the job done in seconds.

**Features:**
*   **Download any Plugin:** Download active or inactive plugins as clean ZIP files.
*   **Download any Theme:** Full support for downloading themes (including child themes).
*   **Clean Dashboard:** A modern, easy-to-use management interface.
*   **Security First:** Uses WordPress nonces and capability checks to ensure only administrators have access.
*   **Zero Footprint:** Automatically cleans up temporary files after download.

== Installation ==

1. Upload the `plugin-downloader` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Access the dashboard via the **Downloader** menu in your WordPress sidebar.

== Frequently Asked Questions ==

= Does this modify my plugins or themes? =
No. It only reads the files and packages them into a ZIP for download.

= Is it safe? =
Yes. Only users with the `activate_plugins` capability can access the download features.

== Screenshots ==

1. The premium Downloader Dashboard showing the Plugins and Themes tabs.

== Changelog ==

= 1.0.0 =
*   Initial Pro release with Theme support and new Dashboard UI.
