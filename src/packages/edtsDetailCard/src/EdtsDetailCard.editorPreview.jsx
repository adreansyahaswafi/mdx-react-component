import { createElement } from "react";

function renderSlotPreview(slot, label, style) {
    if (!slot || typeof slot !== "object" || !slot.renderer) {
        return null;
    }

    const Renderer = slot.renderer;

    return (
        <div style={style}>
            <Renderer>
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2563eb"
                    }}
                >
                    {label}
                </span>
            </Renderer>
        </div>
    );
}

function renderPreviewIcon(icon, fallback) {
    if (!icon) {
        return <div style={{ fontSize: 22, lineHeight: 1.3 }}>{fallback}</div>;
    }

    if (icon.type === "image") {
        const imageSource = icon.imageUrl || icon.iconUrl;

        if (imageSource) {
            return (
                <img
                    src={imageSource}
                    alt=""
                    style={{ width: 24, height: 24, objectFit: "contain", display: "block" }}
                />
            );
        }
    }

    if ((icon.type === "glyph" || icon.type === "icon") && icon.iconClass) {
        return (
            <span style={{ fontSize: 22, lineHeight: 1.3, color: "#0f172a" }}>
                <span className={icon.iconClass} />
            </span>
        );
    }

    return <div style={{ fontSize: 22, lineHeight: 1.3 }}>{fallback}</div>;
}

export function preview(values) {
    return (
        <div
            style={{
                width: 520,
                padding: 20,
                background: "transparent",
                display: "grid",
                gap: 20
            }}
        >
            <div
                style={{
                    display: "grid",
                    gap: 24,
                    padding: "34px 40px",
                    borderRadius: 24,
                    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                    border: "1px solid rgba(203,213,225,0.92)",
                    boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)"
                }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "start" }}>
                    {renderSlotPreview(values.visualContent, "IMAGE", {
                        width: 88,
                        height: 88,
                        borderRadius: 18,
                        overflow: "hidden",
                        border: "1px dashed rgba(37,99,235,0.35)",
                        background: "rgba(37,99,235,0.08)"
                    }) || (
                        <div
                            style={{
                                width: 88,
                                height: 88,
                                borderRadius: 18,
                                overflow: "hidden",
                                border: "1px solid rgba(191,219,254,0.95)",
                                background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)"
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                                alt="Preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                        </div>
                    )}
                    <div style={{ display: "grid", gap: 6, alignContent: "start" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "#64748b" }}>OWNER</span>
                        <strong style={{ fontSize: 24, color: "#14213d", lineHeight: 1.15 }}>Jordan Mercer</strong>
                        <span style={{ fontSize: 15, color: "#5b6b86" }}>Product lead</span>
                    </div>
                </div>
                <div style={{ display: "grid", gap: 0 }}>
                    {[
                        ["PARTICIPANTS", "Product, Ops, and Design stakeholders", "👥"],
                        ["EQUIPMENT", "Projector, Zoom screen, and wireless mic", "🖥"],
                        ["NOTES", "Keep room setup in boardroom layout before 08:00", "✦"]
                    ].map(([label, text, icon], index) => (
                        <div
                            key={label}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "36px 1fr",
                                gap: 18,
                                padding: index === 0 ? "0 0 20px" : "20px 0",
                                borderTop: index === 0 ? "0" : "1px solid rgba(226,232,240,0.92)"
                            }}
                        >
                            {renderPreviewIcon(values.detailItems?.[index]?.icon, icon)}
                            <div style={{ display: "grid", gap: 6 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "#64748b" }}>{label}</span>
                                <strong style={{ fontSize: 16, color: "#14213d" }}>{text}</strong>
                            </div>
                        </div>
                            ))}
                </div>
            </div>
        </div>
    );
}
