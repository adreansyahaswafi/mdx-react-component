import { createElement } from "react";

export function preview(values) {
    const contentPreview = values.content;
    const ContentRenderer =
        contentPreview && typeof contentPreview === "object" && contentPreview.renderer ? contentPreview.renderer : null;

    return (
        <div style={{ width: "100%", display: "grid", gap: values.compact ? 14 : 20, background: "transparent" }}>
            {values.showHeader !== false ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ color: "#1d4ed8", fontSize: 18, fontWeight: 700 }}>
                        {values.backCaption || "Kembali ke Calendar"}
                    </div>
                    {values.helperCaption ? (
                        <div style={{ color: "#1d4ed8", fontSize: 18, fontWeight: 700, textAlign: "right" }}>
                            {values.helperCaption}
                        </div>
                    ) : null}
                </div>
            ) : null}

            {values.title || values.description ? (
                <div>
                    {values.title ? <div style={{ color: "#0f172a", fontSize: 24, fontWeight: 800 }}>{values.title}</div> : null}
                    {values.description ? (
                        <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>{values.description}</div>
                    ) : null}
                </div>
            ) : null}

            <div style={{ display: "grid", gap: 10 }}>
                {ContentRenderer ? (
                    <ContentRenderer>
                        <div style={{ display: "grid", gap: 10 }} />
                    </ContentRenderer>
                ) : (
                    <>
                        <div style={{ height: 44, border: "1px solid #ced4da", background: "#ffffff" }} />
                        <div style={{ height: 44, border: "1px solid #ced4da", background: "#ffffff" }} />
                    </>
                )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
                {values.showSecondaryButton ? (
                    <div style={{ minWidth: 120, padding: "12px 18px", border: "1px solid #cbd5e1", color: "#334155", textAlign: "center", fontWeight: 700 }}>
                        {values.secondaryCaption || "Cancel"}
                    </div>
                ) : null}
                <div style={{ flex: 1, padding: "14px 18px", background: "#1e40af", color: "#ffffff", textAlign: "center", fontSize: 18, fontWeight: 700 }}>
                    {values.submitCaption || "Login"}
                </div>
            </div>

            {values.showToastOnSubmit ? (
                <div style={{ color: "#64748b", fontSize: 12, textAlign: "center" }}>
                    Toast only shows when Toast Message Attribute or Toast Message has text.
                </div>
            ) : null}
        </div>
    );
}
