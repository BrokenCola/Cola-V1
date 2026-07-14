/**
 * cola.sidebar.js
 * Injects the Cola navigation sidebar into any page that loads this script.
 */
(function () {
    const currentPath = window.location.pathname;

    function isActive(path) {
        return currentPath === path || currentPath.startsWith(path.replace('.html', ''));
    }

    const links = [
        { label: 'Account', icon: 'fas fa-user',     href: '/index.html' },
        { label: 'AI',      icon: 'fas fa-robot',     href: '/pages/ai.html' },
        { label: 'Chat',    icon: 'fas fa-comments',  href: '/pages/chatrooms.html' },
        { label: 'Watch',   icon: 'fas fa-eye',       href: '/pages/watch.html' },
        { label: 'Music',   icon: 'fas fa-music',     href: '/pages/listen.html' },
        { label: 'Browse',  icon: 'fas fa-globe',     href: '/pages/browse.html' },
        { label: 'Games',   icon: 'fas fa-gamepad',   href: '/pages/games.html' },
    ];

    const menuHTML = links.map(link => {
        const active = isActive(link.href) ? ' active' : '';
        return `
        <li class="cola-sidebar-item">
            <a class="cola-sidebar-link${active}" href="${link.href}">
                <i class="${link.icon}"></i>
                <span>${link.label}</span>
            </a>
        </li>`;
    }).join('');

    const sidebarHTML = `
    <aside id="cola-nav-sidebar">
        <a class="cola-sidebar-brand" href="/index.html">🥤 Cola</a>
        <ul class="cola-sidebar-menu">${menuHTML}</ul>
        <div class="cola-sidebar-bottom">
            <div class="cola-sidebar-stat">
                <i class="fas fa-users"></i>
                <span id="cola-online-count">... online</span>
            </div>
        </div>
    </aside>`;

    const style = `
    <style id="cola-sidebar-style">
        #cola-nav-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 200px;
            height: 100vh;
            background: #111111;
            border-right: 1px solid #222;
            display: flex;
            flex-direction: column;
            padding: 18px 12px;
            z-index: 99999;
            box-sizing: border-box;
            overflow-y: auto;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .cola-sidebar-brand {
            font-size: 18px;
            font-weight: 700;
            color: #4ade80;
            margin-bottom: 24px;
            padding: 4px 8px;
            text-decoration: none;
            display: block;
            letter-spacing: -0.3px;
        }

        .cola-sidebar-menu {
            list-style: none;
            margin: 0;
            padding: 0;
            flex: 1;
        }

        .cola-sidebar-item {
            margin-bottom: 4px;
        }

        .cola-sidebar-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 8px;
            color: #9a9a9a;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s, color 0.15s;
            text-decoration: none;
        }

        .cola-sidebar-link:hover {
            background: #1e1e1e;
            color: #e0e0e0;
        }

        .cola-sidebar-link.active {
            background: #1a3a26;
            color: #4ade80;
        }

        .cola-sidebar-link i {
            width: 18px;
            text-align: center;
            font-size: 15px;
        }

        .cola-sidebar-bottom {
            margin-top: auto;
            padding-top: 12px;
            border-top: 1px solid #222;
        }

        .cola-sidebar-stat {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            background: #1a1a1a;
            border-radius: 8px;
            color: #4ade80;
            font-size: 13px;
            font-weight: 500;
        }

        /* Push page content to the right */
        body {
            margin-left: 200px !important;
        }

        @media (max-width: 640px) {
            #cola-nav-sidebar {
                width: 56px;
                padding: 18px 8px;
            }
            .cola-sidebar-brand span,
            .cola-sidebar-link span {
                display: none;
            }
            .cola-sidebar-brand {
                font-size: 20px;
                text-align: center;
                padding: 4px 0;
            }
            .cola-sidebar-link {
                justify-content: center;
                padding: 10px 0;
            }
            .cola-sidebar-stat span {
                display: none;
            }
            .cola-sidebar-stat {
                justify-content: center;
            }
            body {
                margin-left: 56px !important;
            }
        }
    </style>`;

    // Inject styles into head
    document.head.insertAdjacentHTML('beforeend', style);

    // Inject sidebar at the start of body
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    // Animate online count
    function updateOnlineCount() {
        const el = document.getElementById('cola-online-count');
        if (el) {
            const count = Math.floor(Math.random() * 150) + 50;
            el.textContent = count + ' online';
        }
    }
    updateOnlineCount();
    setInterval(updateOnlineCount, 30000);
})();
