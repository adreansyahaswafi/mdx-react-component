import { createElement } from "react";
import classNames from "classnames";

import "./ui/EdtsBreadCrumbs.css";

function isEnabled(value, fallback = false) {
    if (typeof value === "boolean") {
        return value;
    }

    if (value && typeof value === "object") {
        if (typeof value.value === "boolean") {
            return value.value;
        }

        if (typeof value.value === "string") {
            return value.value === "true";
        }
    }

    if (typeof value === "string") {
        return value === "true";
    }

    return fallback;
}

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function resolveIcon(iconValue) {
    if (!iconValue) {
        return undefined;
    }

    if ("status" in iconValue) {
        return iconValue.status === "available" ? iconValue.value : undefined;
    }

    return iconValue;
}

function renderIcon(iconValue) {
    const resolvedIcon = resolveIcon(iconValue);

    if (!resolvedIcon) {
        return null;
    }

    if ((resolvedIcon.type === "glyph" || resolvedIcon.type === "icon") && resolvedIcon.iconClass) {
        return <span className={resolvedIcon.iconClass} aria-hidden="true" />;
    }

    if (resolvedIcon.type === "image" && (resolvedIcon.iconUrl || resolvedIcon.imageUrl)) {
        return <img src={resolvedIcon.iconUrl || resolvedIcon.imageUrl} alt="" aria-hidden="true" />;
    }

    return null;
}

function renderSeparator(separatorStyle) {
    if (separatorStyle === "slash") {
        return "/";
    }

    if (separatorStyle === "dot") {
        return "•";
    }

    return "›";
}

export function EdtsBreadCrumbs({ items, separatorStyle, compact, showHomePill }) {
    const resolvedItems = (Array.isArray(items) ? items : [])
        .filter(item => item && String(item.label || "").trim())
        .map(item => ({
            label: String(item.label || "").trim(),
            icon: item.icon,
            active: isEnabled(item.active),
            disabled: isEnabled(item.disabled),
            onClickAction: item.onClickAction
        }));

    if (!resolvedItems.length) {
        return null;
    }

    return (
        <nav
            className={classNames("edts-breadcrumbs", {
                "edts-breadcrumbs--compact": isEnabled(compact)
            })}
            aria-label="Breadcrumb"
        >
            <ol className="edts-breadcrumbs__list">
                {resolvedItems.map((item, index) => {
                    const icon = renderIcon(item.icon);
                    const isClickable = !item.active && !item.disabled && item.onClickAction && item.onClickAction.canExecute;

                    return (
                        <li
                            key={`${item.label}-${index}`}
                            className={classNames("edts-breadcrumbs__item", {
                                "edts-breadcrumbs__item--active": item.active,
                                "edts-breadcrumbs__item--disabled": item.disabled,
                                "edts-breadcrumbs__item--home-pill": isEnabled(showHomePill) && index === 0
                            })}
                        >
                            {isClickable ? (
                                <button
                                    type="button"
                                    className="edts-breadcrumbs__link"
                                    onClick={() => executeAction(item.onClickAction)}
                                >
                                    {icon ? <span className="edts-breadcrumbs__icon">{icon}</span> : null}
                                    <span className="edts-breadcrumbs__label">{item.label}</span>
                                </button>
                            ) : (
                                <span className="edts-breadcrumbs__link" aria-current={item.active ? "page" : undefined}>
                                    {icon ? <span className="edts-breadcrumbs__icon">{icon}</span> : null}
                                    <span className="edts-breadcrumbs__label">{item.label}</span>
                                </span>
                            )}
                            {index < resolvedItems.length - 1 ? (
                                <span className="edts-breadcrumbs__separator" aria-hidden="true">
                                    {renderSeparator(separatorStyle)}
                                </span>
                            ) : null}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
