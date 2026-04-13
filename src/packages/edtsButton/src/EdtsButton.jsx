import { createElement } from "react";
import classNames from "classnames";

import "./ui/EdtsButton.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function renderIcon(icon) {
    switch (icon) {
        case "plus":
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
            );
        case "check":
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
            );
        case "search":
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
            );
        case "download":
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
            );
        case "login":
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M9 7 4 12l5 5M4 12h11M12 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    />
                </svg>
            );
        case "logout":
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 17l5-5-5-5M20 12H9M12 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
            );
        default:
            return null;
    }
}

export function EdtsButton({
    caption,
    leftIcon,
    variant,
    outline,
    size,
    fullWidth,
    buttonType,
    disabled,
    loading,
    onClickAction
}) {
    const resolvedVariant = variant || "primary";
    const resolvedSize = size || "md";
    const isDisabled = Boolean(disabled || loading);
    const icon = !loading ? renderIcon(leftIcon) : null;

    return (
        <div className={classNames("edts-button", fullWidth && "edts-button--block")}>
            <button
                type={buttonType || "button"}
                className={classNames(
                    "btn",
                    `btn-${outline ? "outline-" : ""}${resolvedVariant}`,
                    resolvedSize !== "md" && `btn-${resolvedSize}`,
                    fullWidth && "w-100",
                    "edts-button__control"
                )}
                disabled={isDisabled}
                onClick={() => executeAction(onClickAction)}
            >
                {loading ? <span className="edts-button__spinner" aria-hidden="true" /> : null}
                {!loading && icon ? <span className="edts-button__icon">{icon}</span> : null}
                <span className="edts-button__label">{caption || "Button"}</span>
            </button>
        </div>
    );
}
