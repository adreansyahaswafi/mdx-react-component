import { createElement } from "react";
import classNames from "classnames";

import "./ui/EdtsBreadCrumbs.css";

function renderPreviewIcon(icon) {
    if (!icon) {
        return null;
    }

    if ((icon.type === "glyph" || icon.type === "icon") && icon.iconClass) {
        return <span className={icon.iconClass} aria-hidden="true" />;
    }

    if (icon.type === "image" && (icon.iconUrl || icon.imageUrl)) {
        return <img src={icon.iconUrl || icon.imageUrl} alt="" aria-hidden="true" />;
    }

    return null;
}

function renderSeparator(style) {
    if (style === "slash") {
        return "/";
    }

    if (style === "dot") {
        return "•";
    }

    return "›";
}

export function preview({ items, separatorStyle, compact, showHomePill }) {
    const previewItems =
        Array.isArray(items) && items.length
            ? items
            : [
                  { label: "Dashboard", active: false },
                  { label: "Users", active: false },
                  { label: "Detail", active: true }
              ];

    return (
        <nav
            className={classNames("edts-breadcrumbs", {
                "edts-breadcrumbs--compact": compact
            })}
            aria-label="Breadcrumb"
        >
            <ol className="edts-breadcrumbs__list">
                {previewItems.map((item, index) => (
                    <li
                        key={`${item.label || "item"}-${index}`}
                        className={classNames("edts-breadcrumbs__item", {
                            "edts-breadcrumbs__item--active": item.active,
                            "edts-breadcrumbs__item--home-pill": showHomePill && index === 0
                        })}
                    >
                        <span className="edts-breadcrumbs__link">
                            {item.icon ? <span className="edts-breadcrumbs__icon">{renderPreviewIcon(item.icon)}</span> : null}
                            <span className="edts-breadcrumbs__label">{item.label || "Item"}</span>
                        </span>
                        {index < previewItems.length - 1 ? (
                            <span className="edts-breadcrumbs__separator" aria-hidden="true">
                                {renderSeparator(separatorStyle)}
                            </span>
                        ) : null}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
