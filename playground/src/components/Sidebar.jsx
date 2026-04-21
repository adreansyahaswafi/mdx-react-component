import { createElement } from "react";
import { NavLink } from "react-router-dom";

import { sidebarSections } from "./sidebarConfig";

export function Sidebar() {
  return (
    <aside className="playground-sidebar">
      <div className="playground-sidebar__brand">
        <div className="playground-sidebar__logo">EDTS</div>
        <div>
          <div className="playground-sidebar__title">Widget Lab</div>
          <div className="playground-sidebar__subtitle">Browser Playground</div>
        </div>
      </div>

      <nav className="playground-sidebar__nav">
        {sidebarSections.map((section) => (
          <div key={section.title} className="playground-sidebar__section">
            <div className="playground-sidebar__section-title">{section.title}</div>
            <div className="playground-sidebar__section-links">
              {section.items.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `playground-sidebar__link${isActive ? " is-active" : ""}`
                  }
                >
                  <span className="playground-sidebar__link-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="playground-sidebar__link-label">{item.label}</span>
                  <span className="playground-sidebar__link-meta">{item.meta}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="playground-sidebar__footer">
        <div className="playground-sidebar__footer-title">Tips</div>
        <p>
          Gunakan halaman ini untuk cek behavior widget lebih cepat sebelum
          build ke Mendix.
        </p>
      </div>
    </aside>
  );
}
