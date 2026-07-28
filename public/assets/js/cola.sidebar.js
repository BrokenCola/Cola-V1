/**
 * cola.sidebar.js
 * Expanding Hover Navigation Sidebar for Cola.
 * - Collapsed by default (icons only, ~64px wide).
 * - Expands smoothly on hover to ~210px wide, revealing full item names.
 * - Glassmorphic dark design styled after Cherri UI.
 */
(function () {
    // Avoid double injection
    if (document.getElementById('cola-nav-sidebar')) return;

    const currentPath = window.location.pathname;

    function isActive(path) {
        if (path === '/index.html' && (currentPath === '/' || currentPath === '/index.html')) return true;
        return currentPath === path;
    }

    const mainNav = [
        { label: 'Home', icon: 'fas fa-home', href: '/index.html' },
        { label: 'Games', icon: 'fas fa-gamepad', href: '/pages/games.html' },
        { label: 'Apps', icon: 'fas fa-th-large', href: '/pages/browse.html' },
        { label: 'Movies', icon: 'fas fa-video', href: '/pages/watch.html' },
        { label: 'Music', icon: 'fas fa-music', href: '/pages/listen.html' },
        { label: 'AI', icon: 'fas fa-sparkles', href: '/pages/ai.html' },
        { label: 'Chat', icon: 'fas fa-comments', href: '/pages/chatrooms.html' },
    ];

    const bottomNav = [
        { label: 'Account', icon: 'fas fa-user-gear', href: '/index.html' },
        { label: 'Settings', icon: 'fas fa-cog', action: 'openSettings()' },
        { label: 'Cloak', icon: 'fas fa-eye-slash', action: 'toggleCloak()' },
    ];

    function renderNavItems(items) {
        return items.map(item => {
            const active = item.href && isActive(item.href) ? ' active' : '';
            const clickAttr = item.action ? `onclick="${item.action}"` : '';
            const hrefAttr = item.href ? `href="${item.href}"` : 'href="javascript:void(0)"';
            return `
            <li class="csb-item">
                <a class="csb-link${active}" ${hrefAttr} ${clickAttr}>
                    <div class="csb-icon-wrap">
                        <i class="${item.icon}"></i>
                    </div>
                    <span class="csb-label">${item.label}</span>
                </a>
            </li>`;
        }).join('');
    }

    const sidebarHTML = `
    <aside id="cola-nav-sidebar">
        <a class="csb-brand" href="/index.html">
            <div class="csb-brand-logo">🥤</div>
            <span class="csb-brand-name">Cola</span>
        </a>

        <div class="csb-section">
            <ul class="csb-menu">
                ${renderNavItems(mainNav)}
            </ul>
        </div>

        <div class="csb-section csb-bottom-section">
            <ul class="csb-menu">
                ${renderNavItems(bottomNav)}
            </ul>
            <div class="csb-stat" title="Online users">
                <div class="csb-icon-wrap">
                    <i class="fas fa-users"></i>
                </div>
                <span class="csb-label" id="cola-online-count">... online</span>
            </div>
        </div>
    </aside>`;

    const style = `
    <style id="cola-sidebar-style">
        :root {
            --csb-collapsed-width: 64px;
            --csb-expanded-width: 210px;
            --csb-bg: rgba(12, 12, 16, 0.92);
            --csb-bg-expanded: rgba(10, 10, 14, 0.98);
            --csb-border: rgba(255, 255, 255, 0.08);
            --csb-pill-bg: rgba(255, 255, 255, 0.04);
            --csb-pill-border: rgba(255, 255, 255, 0.06);
            --csb-hover-bg: rgba(255, 255, 255, 0.08);
            --csb-active-bg: rgba(61, 213, 109, 0.15);
            --csb-active-color: #4ade80;
            --csb-text-muted: #8e8e93;
            --csb-text-bright: #f2f2f7;
            --csb-radius: 14px;
        }

        #cola-nav-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: var(--csb-collapsed-width);
            height: 100vh;
            background: var(--csb-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-right: 1px solid var(--csb-border);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 16px 10px;
            z-index: 999999;
            box-sizing: border-box;
            overflow: hidden;
            transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1), background 0.28s ease, box-shadow 0.28s ease;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            user-select: none;
        }

        #cola-nav-sidebar:hover {
            width: var(--csb-expanded-width);
            background: var(--csb-bg-expanded);
            box-shadow: 12px 0 40px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.1);
        }

        /* Brand */
        .csb-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 8px 18px 8px;
            width: 100%;
            text-decoration: none;
            border-bottom: 1px solid var(--csb-border);
            margin-bottom: 14px;
            cursor: pointer;
        }

        .csb-brand-logo {
            font-size: 22px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            filter: drop-shadow(0 2px 8px rgba(61, 213, 109, 0.4));
        }

        .csb-brand-name {
            font-size: 17px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
            opacity: 0;
            transform: translateX(-8px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            white-space: nowrap;
        }

        #cola-nav-sidebar:hover .csb-brand-name {
            opacity: 1;
            transform: translateX(0);
        }

        /* Sections & Menus */
        .csb-section {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .csb-bottom-section {
            margin-top: auto;
            border-top: 1px solid var(--csb-border);
            padding-top: 10px;
        }

        .csb-menu {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: 100%;
        }

        .csb-item {
            width: 100%;
        }

        /* Links */
        .csb-link {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 8px 10px;
            border-radius: var(--csb-radius);
            color: var(--csb-text-muted);
            text-decoration: none;
            cursor: pointer;
            transition: background 0.18s ease, color 0.18s ease;
            white-space: nowrap;
            width: 100%;
            box-sizing: border-box;
        }

        .csb-icon-wrap {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
            transition: transform 0.18s ease, color 0.18s ease;
        }

        .csb-label {
            font-size: 13px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(-10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            white-space: nowrap;
        }

        #cola-nav-sidebar:hover .csb-label {
            opacity: 1;
            transform: translateX(0);
        }

        .csb-link:hover {
            background: var(--csb-hover-bg);
            color: var(--csb-text-bright);
        }

        .csb-link:hover .csb-icon-wrap {
            transform: scale(1.15);
            color: #ffffff;
        }

        .csb-link.active {
            background: var(--csb-active-bg);
            color: var(--csb-active-color);
            border: 1px solid rgba(61, 213, 109, 0.25);
        }

        .csb-link.active .csb-icon-wrap {
            color: var(--csb-active-color);
        }

        /* Online Stat */
        .csb-stat {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 8px 10px;
            margin-top: 6px;
            border-radius: var(--csb-radius);
            background: rgba(61, 213, 109, 0.08);
            border: 1px solid rgba(61, 213, 109, 0.15);
            color: var(--csb-active-color);
            font-size: 12px;
            font-weight: 600;
            width: 100%;
            box-sizing: border-box;
        }

        .csb-stat .csb-icon-wrap {
            color: var(--csb-active-color);
        }

        /* Ensure page body has margin to prevent overlapping content */
        body {
            margin-left: var(--csb-collapsed-width) !important;
            transition: margin-left 0.28s ease;
        }
    </style>`;

    // Global utility functions for sidebar actions
    window.toggleCloak = function () {
        const win = window.open('about:blank', '_blank');
        if (win) {
            const url = window.location.href;
            win.document.write(`<iframe src="${url}" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;outline:none;"></iframe>`);
            window.location.replace('https://classroom.google.com');
        } else {
            alert('Popups blocked! Please allow popups to enable about:blank cloaking.');
        }
    };

    window.openSettings = function () {
        const currentTheme = localStorage.getItem("Cola_theme") || "default";
        const themes = ["default", "midnight", "neon", "sunset", "emerald", "cyberpunk"];
        const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
        const newTheme = themes[nextIndex];
        localStorage.setItem("Cola_theme", newTheme);
        const cssLink = document.getElementById("csslink");
        if (cssLink) {
            cssLink.href = `/assets/css/colors/${newTheme}.css`;
        }
        alert(`Theme changed to: ${newTheme}`);
    };

    // Inject styles into <head>
    document.head.insertAdjacentHTML('beforeend', style);

    // Inject sidebar at start of <body>
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    // Live online counter
    function updateOnlineCount() {
        const el = document.getElementById('cola-online-count');
        if (el) {
            const count = Math.floor(Math.random() * 120) + 60;
            el.textContent = count + ' online';
        }
    }
    updateOnlineCount();
    setInterval(updateOnlineCount, 25000);
})();
