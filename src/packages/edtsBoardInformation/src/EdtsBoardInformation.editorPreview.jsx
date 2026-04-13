import { createElement } from "react";

export function preview() {
    return (
        <div
            style={{
                padding: 24,
                borderRadius: 24,
                background:
                    "radial-gradient(circle at top right, rgba(163, 230, 53, 0.08), transparent 22%), linear-gradient(180deg, #262626 0%, #1a1a1a 100%)",
                boxShadow: "0 24px 48px rgba(0, 0, 0, 0.22)"
            }}
        >
            <div
                style={{
                    color: "rgba(255,255,255,0.74)",
                    fontSize: 16,
                    fontWeight: 700,
                    textTransform: "uppercase"
                }}
            >
                ARR
            </div>
            <div
                style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16
                }}
            >
                <div style={{ color: "#ffffff", fontSize: 42, fontWeight: 800, letterSpacing: "-0.05em" }}>$1.01M</div>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        borderRadius: 18,
                        background: "#eaf8d4",
                        color: "#3f6d1d",
                        fontSize: 16,
                        fontWeight: 800
                    }}
                >
                    ↑ 9%
                </div>
            </div>
            <div style={{ marginTop: 10, color: "rgba(255,255,255,0.62)", fontSize: 18 }}>annualized</div>
        </div>
    );
}
