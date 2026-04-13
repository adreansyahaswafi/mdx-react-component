import { createElement } from "react";

export function preview() {
    return (
        <div
            style={{
                padding: 22,
                borderRadius: 28,
                background:
                    "radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 30%), linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                border: "1px solid rgba(191, 219, 254, 0.9)",
                boxShadow: "0 28px 60px rgba(15, 23, 42, 0.1)"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
                        Chart Preview
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
                        ApexCharts graph from Mendix datasource
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <div
                        style={{
                            padding: "10px 12px",
                            borderRadius: 16,
                            background: "rgba(255,255,255,0.82)",
                            border: "1px solid rgba(191, 219, 254, 0.95)",
                            minWidth: 82
                        }}
                    >
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                            Total
                        </div>
                        <div style={{ marginTop: 4, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>432</div>
                    </div>
                    <div
                        style={{
                            padding: "10px 12px",
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                            minWidth: 82
                        }}
                    >
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#dbeafe", textTransform: "uppercase" }}>
                            Top
                        </div>
                        <div style={{ marginTop: 4, fontSize: 16, fontWeight: 800, color: "#ffffff" }}>April</div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    marginTop: 22,
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 14,
                    alignItems: "end",
                    height: 180
                }}
            >
                {[72, 124, 94, 142].map((value, index) => (
                    <div key={index} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                        <div
                            style={{
                                width: "100%",
                                borderRadius: 18,
                                background: "linear-gradient(180deg, #2563eb 0%, #60a5fa 100%)",
                                boxShadow: "0 18px 28px rgba(37, 99, 235, 0.18)",
                                height: value
                            }}
                        />
                        <div style={{ fontSize: 12, color: "#475569" }}>Item {index + 1}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
