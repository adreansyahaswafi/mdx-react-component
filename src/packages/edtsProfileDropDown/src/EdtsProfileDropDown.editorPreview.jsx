import { createElement } from "react";

function hasWidgetContent(slot) {
    return Boolean(slot && typeof slot === "object" && slot.renderer);
}

function renderAvatarPreview(values, fullName) {
    if (hasWidgetContent(values.avatarContent)) {
        const Renderer = values.avatarContent.renderer;

        return (
            <div
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    overflow: "hidden",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed rgba(255,255,255,0.45)",
                    background: "rgba(255,255,255,0.16)"
                }}
            >
                <Renderer>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#ffffff"
                        }}
                    >
                        IMG
                    </span>
                </Renderer>
            </div>
        );
    }

    if (values.avatarImageUrl) {
        return (
            <img
                src={values.avatarImageUrl}
                alt={fullName}
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    objectFit: "cover"
                }}
            />
        );
    }

    return (
        <div
            style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                color: "#ffffff",
                fontSize: 10,
                fontWeight: 800
            }}
        >
            {(values.avatarText || fullName.slice(0, 2) || "PR").slice(0, 2).toUpperCase()}
        </div>
    );
}

export function preview(values) {
    const fullName = [values.firstName, values.lastName].filter(Boolean).join(" ") || "Profile";

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minWidth: 220,
                minHeight: 38,
                padding: "10px 12px",
                maxWidth: 260,
                borderRadius: 14,
                background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #1e40af 100%)",
                boxShadow: "0 12px 28px rgba(37, 99, 235, 0.24)",
                color: "#ffffff"
            }}
        >
            {renderAvatarPreview(values, fullName)}
            <div
                style={{
                    display: "grid",
                    gap: 2,
                    minWidth: 0,
                    textAlign: "left"
                }}
            >
                <div
                    style={{
                        color: "#ffffff",
                        fontSize: 13,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    {fullName}
                </div>
                {values.roleLabel ? (
                    <div
                        style={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: 10,
                            fontWeight: 600,
                            lineHeight: 1.1
                        }}
                    >
                        {values.roleLabel}
                    </div>
                ) : null}
            </div>
            <div
                style={{
                    marginLeft: 2,
                    width: 16,
                    height: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.86)"
                }}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
                    <path
                        d="M6 9l6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                    />
                </svg>
            </div>
        </div>
    );
}
