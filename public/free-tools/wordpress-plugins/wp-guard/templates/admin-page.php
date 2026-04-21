<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>

<div id="wp-guard-app" class="wp-guard-app">
    <div class="app-container">
        <!-- Sidebar: Controls -->
        <aside class="sidebar">
            <header class="sidebar-header">
                <div class="logo">
                     <span class="logo-icon">🛡️</span>
                     <div class="logo-text">
                        <h1>WP Guard</h1>
                        <p>Security Hardening</p>
                     </div>
                </div>
            </header>

            <nav class="controls-nav">
                <div class="control-group">
                    <h2>General Hardening</h2>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Clean WP Header</span>
                            <span class="toggle-desc">Remove version, generator tags, and junk links.</span>
                        </div>
                        <input type="checkbox" id="clean_header" checked>
                        <span class="slider"></span>
                    </label>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Disable File Editor</span>
                            <span class="toggle-desc">Prevent direct editing of themes/plugins.</span>
                        </div>
                        <input type="checkbox" id="disable_editor" checked>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="control-group">
                    <h2>API & XML-RPC</h2>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Disable XML-RPC</span>
                            <span class="toggle-desc">Block legacy communication and pingbacks.</span>
                        </div>
                        <input type="checkbox" id="disable_xmlrpc" checked>
                        <span class="slider"></span>
                    </label>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Restrict REST API</span>
                            <span class="toggle-desc">Only authenticated users can access the API.</span>
                        </div>
                        <input type="checkbox" id="restrict_rest" checked>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="control-group">
                    <h2>Login Protection</h2>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Generic Login Errors</span>
                            <span class="toggle-desc">Hide specific username/password failures.</span>
                        </div>
                        <input type="checkbox" id="generic_errors" checked>
                        <span class="slider"></span>
                    </label>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Disable Login Hints</span>
                            <span class="toggle-desc">Remove shake effect and helpful hints.</span>
                        </div>
                        <input type="checkbox" id="disable_hints">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="control-group">
                    <h2>Optimization</h2>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Disable Emojis</span>
                            <span class="toggle-desc">Remove heavy scripts and CSS styles.</span>
                        </div>
                        <input type="checkbox" id="disable_emojis" checked>
                        <span class="slider"></span>
                    </label>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Limit Heartbeat</span>
                            <span class="toggle-desc">Reduce server CPU by slowing API pings.</span>
                        </div>
                        <input type="checkbox" id="limit_heartbeat">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="control-group">
                    <h2>Enumeration</h2>
                    <label class="toggle-item">
                        <div class="toggle-info">
                            <span class="toggle-title">Disable Author Archive</span>
                            <span class="toggle-desc">Block ?author=N scanning for usernames.</span>
                        </div>
                        <input type="checkbox" id="disable_author_archive" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </nav>

            <footer class="sidebar-footer">
                <button id="download_plugin" class="btn btn-secondary">Download as Plugin</button>
            </footer>
        </aside>

        <!-- Main: Code Preview -->
        <main class="canvas">
            <div class="preview-header">
                <div class="preview-title">
                    <h2>functions.php Snippet</h2>
                    <p>Copy and paste this into your theme or child theme.</p>
                </div>
                <button id="copy_code" class="btn btn-primary">Copy Code</button>
            </div>
            
            <div class="code-container">
                <pre id="code_output"><code></code></pre>
            </div>

            <section class="security-meta">
                <div class="meta-card">
                    <h3>Implementation Note</h3>
                    <p>For maximum security, disabling the File Editor should also be set in your <code>wp-config.php</code> file using: <code>define('DISALLOW_FILE_EDIT', true);</code></p>
                </div>
            </section>
        </main>
    </div>
</div>
