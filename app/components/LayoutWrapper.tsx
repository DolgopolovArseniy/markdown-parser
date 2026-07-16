'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar_open');
    if (savedState !== null) {
      const isOpen = savedState === 'true';
      requestAnimationFrame(() => {
        setIsSidebarOpen(isOpen);
      });
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('sidebar_open', String(newState));
  };

  return (
    <div className="retro-container">
      {isSidebarOpen && (
        <aside className="retro-sidebar">
          <div className="retro-sidebar-header">
            <span style={{ fontWeight: 'bold' }}>MENU</span>
            <button
              className="retro-sidebar-close-btn"
              onClick={toggleSidebar}
              title="Close sidebar"
            >
              &lt;-
            </button>
          </div>
          <nav>
            <ul className="retro-sidebar-nav">
              <li>
                <Link
                  href="/"
                  className={`nav-link ${pathname === '/' ? 'active' : ''}`}
                >
                  [Index/Home]
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`nav-link ${pathname === '/about' ? 'active' : ''}`}
                >
                  [About/Docs]
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      <div className="retro-content-area">
        <header className="retro-header-bar">
          {!isSidebarOpen && (
            <button
              className="retro-sidebar-open-btn"
              onClick={toggleSidebar}
              title="Open sidebar"
            >
              -&gt;
            </button>
          )}
          <Link href="/" className="site-title">
            <span className="title-en">.md parser</span>
            <span className="title-ja">.md パーサー</span>
          </Link>
        </header>

        <main className="retro-main-content">{children}</main>
      </div>
    </div>
  );
}
