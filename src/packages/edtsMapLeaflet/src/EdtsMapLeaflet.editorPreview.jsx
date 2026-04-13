import { createElement } from "react";

export function preview() {
    return (
        <div
            style={{
                padding: 18,
                borderRadius: 24,
                border: "1px solid rgba(191, 219, 254, 0.95)",
                background:
                    "radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 26%), linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                boxShadow: "0 24px 54px rgba(15, 23, 42, 0.08)"
            }}
        >
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Leaflet Map Preview</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>OpenStreetMap with custom markers</div>
            <div
                style={{
                    marginTop: 16,
                    height: 220,
                    borderRadius: 18,
                    background:
                        "linear-gradient(135deg, rgba(191, 219, 254, 0.4), rgba(255,255,255,0.92)), radial-gradient(circle at 30% 30%, rgba(34,197,94,0.18), transparent 20%)",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {[
                    { left: "18%", top: "28%", color: "#2563eb" },
                    { left: "46%", top: "40%", color: "#16a34a" },
                    { left: "68%", top: "24%", color: "#f97316" }
                ].map((pin, index) => (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            left: pin.left,
                            top: pin.top,
                            width: 22,
                            height: 22,
                            borderRadius: "50% 50% 50% 0",
                            transform: "rotate(-45deg)",
                            background: pin.color,
                            boxShadow: "0 12px 24px rgba(15, 23, 42, 0.18)"
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
