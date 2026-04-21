import { createElement } from "react";

function PreviewNavItem({ active = false, label }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minHeight: 42,
                padding: "8px 10px",
                borderRadius: 14,
                background: active ? "#e0f2fe" : "transparent",
                color: active ? "#075985" : "#334155",
                fontSize: 12,
                fontWeight: 800
            }}
        >
            <span
                style={{
                    display: "grid",
                    placeItems: "center",
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    background: active ? "#bae6fd" : "#f1f5f9"
                }}
            >
                {label.slice(0, 1)}
            </span>
            <span>{label}</span>
        </div>
    );
}

export function preview(values) {
    const logoText = values.logoText || "EDTS";

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "180px minmax(0, 1fr)",
                width: "100%",
                minHeight: 112,
                overflow: "hidden",
                borderRadius: 20,
                border: "1px solid #e5e7eb",
                background: "radial-gradient(circle at 88% 8%, rgba(14, 165, 233, 0.14), transparent 28%), #f5f7fb"
            }}
        >
            <aside style={{ padding: 14, background: "#ffffff", borderRight: "1px solid #e5e7eb" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 3,
                        width: 36,
                        height: 36,
                        marginBottom: 18,
                        borderRadius: 13,
                        background: "linear-gradient(135deg, #7dd3fc, #38bdf8)",
                        color: "#082f49",
                        fontWeight: 900
                    }}
                >
                    <span style={{ width: 14, height: 2, borderRadius: 999, background: "currentColor" }} />
                    <span style={{ width: 14, height: 2, borderRadius: 999, background: "currentColor" }} />
                    <span style={{ width: 14, height: 2, borderRadius: 999, background: "currentColor" }} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                    <PreviewNavItem active label="Navigation" />
                    <PreviewNavItem label="Menu item" />
                    <PreviewNavItem label="Menu item" />
                </div>
            </aside>
            <div style={{ minWidth: 0 }}>
                <header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 14,
                        padding: 14,
                        background: "rgba(255, 255, 255, 0.78)",
                        borderBottom: "1px solid #e5e7eb"
                    }}
                >
                    <div
                        style={{
                            minWidth: 96,
                            padding: "12px 16px",
                            borderRadius: 14,
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
                            color: "#0f172a",
                            fontSize: 16,
                            fontWeight: 900,
                            letterSpacing: 1
                        }}
                    >
                        {logoText}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#0f172a", fontWeight: 800 }}>
                        <span style={{ width: 28, height: 28, borderRadius: 999, background: "#cbd5e1" }} />
                        <span>Profile slot</span>
                    </div>
                </header>
            </div>
        </div>
    );
}
