import { Children, createElement } from "react";
import classNames from "classnames";

import "./ui/EdtsSidebar.css";

function hasContent(content) {
    return Children.count(content) > 0;
}

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
        </svg>
    );
}

function FallbackNavigation() {
    const icons = [
        <path key="users" d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a4 4 0 0 1 8 0M13 20a4 4 0 0 1 8 0" />,
        <path key="grid" d="M4 4h5v5H4V4Zm11 0h5v5h-5V4ZM4 15h5v5H4v-5Zm11 0h5v5h-5v-5Z" />,
        <path key="card" d="M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm3 4h8M8 13h5" />,
        <path key="settings" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0-5v3m0 11v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M1 12h3m16 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />,
        <path key="mail" d="M4 6h16v12H4V6Zm0 1 8 6 8-6" />,
        <path key="calendar" d="M5 5h14v15H5V5Zm3-3v5m8-5v5M5 10h14" />
    ];

    return (
        <div className="edts-sidebar__fallback-nav" aria-label="Preview navigation">
            {icons.map((icon, index) => (
                <button
                    key={index}
                    type="button"
                    className={classNames("edts-sidebar__fallback-nav-item", index === 2 && "is-active")}
                    aria-label={`Navigation item ${index + 1}`}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8">
                        {icon}
                    </svg>
                </button>
            ))}
        </div>
    );
}

export function EdtsSidebar({
    logoImageUrl,
    logoText,
    brandName,
    navigationContent,
    profileContent,
    variant,
    compact
}) {
    const hasNavigationContent = hasContent(navigationContent);
    const hasProfileContent = hasContent(profileContent);

    return (
        <div
            className={classNames(
                "edts-sidebar",
                variant === "darkBlue" ? "edts-sidebar--dark-blue" : "edts-sidebar--blue",
                compact && "edts-sidebar--compact"
            )}
        >
            <aside className="edts-sidebar__rail">
                <button type="button" className="edts-sidebar__menu-button" aria-label="Toggle navigation">
                    <MenuIcon />
                </button>
                <nav className="edts-sidebar__navigation-slot" aria-label="Sidebar navigation">
                    {hasNavigationContent ? navigationContent : <FallbackNavigation />}
                </nav>
            </aside>

            <section className="edts-sidebar__topbar">
                <header className="edts-sidebar__header">
                    <div className="edts-sidebar__brand-card">
                        {logoImageUrl ? (
                            <img className="edts-sidebar__brand-image" src={logoImageUrl} alt={brandName || "Brand"} />
                        ) : (
                            <span className="edts-sidebar__brand-text">{logoText || brandName || "EDTS"}</span>
                        )}
                    </div>
                    <div className="edts-sidebar__header-spacer" />
                    {hasProfileContent ? (
                        <div className="edts-sidebar__profile-slot">{profileContent}</div>
                    ) : (
                        <div className="edts-sidebar__profile-preview">
                            <span className="edts-sidebar__profile-avatar" />
                            <span>Profile</span>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                            </svg>
                        </div>
                    )}
                </header>
            </section>
        </div>
    );
}
