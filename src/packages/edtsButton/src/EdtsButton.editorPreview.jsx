import { createElement } from "react";

function iconLabel(leftIcon) {
    switch (leftIcon) {
        case "plus":
            return "+";
        case "check":
            return "✓";
        case "search":
            return "⌕";
        case "download":
            return "↓";
        case "login":
            return "↩";
        case "logout":
            return "↪";
        default:
            return "";
    }
}

export function preview(values) {
    const variant = values.variant || "primary";
    const outline = values.outline === true;
    const size = values.size || "md";
    const icon = iconLabel(values.leftIcon);

    const palette = {
        primary: ["#0d6efd", "#ffffff"],
        secondary: ["#6c757d", "#ffffff"],
        success: ["#198754", "#ffffff"],
        danger: ["#dc3545", "#ffffff"],
        warning: ["#ffc107", "#212529"],
        info: ["#0dcaf0", "#0b1f2a"],
        light: ["#f8f9fa", "#212529"],
        dark: ["#212529", "#ffffff"],
        link: ["transparent", "#0d6efd"]
    };

    const [background, color] = palette[variant] || palette.primary;
    const isSmall = size === "sm";
    const isLarge = size === "lg";

    return (
        <div style={{ width: values.fullWidth ? "100%" : "auto", display: "inline-flex" }}>
            <button
                type="button"
                style={{
                    width: values.fullWidth ? "100%" : "auto",
                    minHeight: isLarge ? 46 : isSmall ? 32 : 38,
                    padding: isLarge ? "0.72rem 1.2rem" : isSmall ? "0.4rem 0.75rem" : "0.52rem 1rem",
                    borderRadius: 6,
                    border: `1px solid ${outline ? background === "transparent" ? "#0d6efd" : background : background === "transparent" ? "transparent" : background}`,
                    background: outline ? "transparent" : background,
                    color: outline ? (background === "transparent" ? "#0d6efd" : background) : color,
                    fontSize: isLarge ? 16 : isSmall ? 13 : 15,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: outline || variant === "link" ? "none" : "0 8px 20px rgba(13,110,253,0.12)"
                }}
            >
                {values.loading ? <span style={{ width: 14, height: 14, borderRadius: 999, border: "2px solid currentColor", borderRightColor: "transparent" }} /> : null}
                {!values.loading && icon ? <span>{icon}</span> : null}
                <span>{values.caption || "Button"}</span>
            </button>
        </div>
    );
}
