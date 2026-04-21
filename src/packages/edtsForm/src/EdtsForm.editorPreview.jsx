import { createElement } from "react";

export function preview(values) {
    const contentPreview = values.content;
    const ContentRenderer =
        contentPreview && typeof contentPreview === "object" && contentPreview.renderer ? contentPreview.renderer : null;
    const footerJustify = values.footerAlign === "left" ? "flex-start" : "flex-end";
    const footerFullWidth = values.fullWidthButtons === true;
    const showBuiltInButtons = values.showActionButtons !== false;

    return (
        <div
            style={{
                width: "100%",
                padding: values.compact ? 16 : 22,
                border: "1px solid #dbe7f5",
                background: "transparent"
            }}
        >
            {values.title || values.description ? (
                <div style={{ marginBottom: 14 }}>
                    {values.title ? <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{values.title}</div> : null}
                    {values.description ? (
                        <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5, color: "#64748b" }}>{values.description}</div>
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
                        <div style={{ height: 40, border: "1px solid #ced4da", background: "#ffffff" }} />
                        <div style={{ height: 40, border: "1px solid #ced4da", background: "#ffffff" }} />
                    </>
                )}
            </div>
            {showBuiltInButtons && values.showFooter !== false ? (
                <div style={{ display: "flex", justifyContent: footerJustify, gap: 10, marginTop: 16, width: "100%" }}>
                    {values.showCancelButton ? (
                        <div
                            style={{
                                padding: "10px 14px",
                                border: "1px solid #ced4da",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#334155",
                                width: footerFullWidth ? "100%" : "auto",
                                flex: footerFullWidth ? "1 1 0" : "0 0 auto",
                                textAlign: "center"
                            }}
                        >
                            {values.cancelCaption || "Cancel"}
                        </div>
                    ) : null}
                    <div
                        style={{
                            padding: "10px 14px",
                            border: "1px solid #0d6efd",
                            background: "#0d6efd",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#ffffff",
                            width: footerFullWidth ? "100%" : "auto",
                            flex: footerFullWidth ? "1 1 0" : "0 0 auto",
                            textAlign: "center"
                        }}
                    >
                        {values.submitCaption || "Submit"}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
