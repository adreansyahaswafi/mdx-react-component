import { createElement } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/form",
    label: "Form Widgets",
    meta: "Input, select, datepicker, form",
  },
  {
    to: "/calendar",
    label: "Calendar",
    meta: "Day, month, list, drag, resize",
  },
  {
    to: "/data",
    label: "Data Widgets",
    meta: "Board, chart, map",
  },
];

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
        {navItems.map((item, index) => (
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
