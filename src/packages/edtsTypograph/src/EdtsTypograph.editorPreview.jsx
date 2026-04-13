import { createElement } from "react";

import "./ui/EdtsTypograph.css";

function hasWidgetContent(slot) {
    return Boolean(slot && typeof slot === "object" && slot.renderer);
}

function renderWidgetSlot({ slot, fallback, label, className }) {
    const Renderer = hasWidgetContent(slot) ? slot.renderer : null;

    if (!Renderer) {
        return fallback;
    }

    return (
        <Renderer>
            <span className={className || "edts-typograph__slot-placeholder"}>
                {label}
            </span>
        </Renderer>
    );
}

export function preview(values = {}) {
    const detailItems = Array.isArray(values.detailItems) && values.detailItems.length > 0
        ? values.detailItems.map((item, index) => ({
            icon: renderWidgetSlot({
                slot: item.iconContent,
                fallback: String(index + 1),
                label: "Icon",
                className: "edts-typograph__slot-placeholder edts-typograph__slot-placeholder--icon"
            }),
            content: renderWidgetSlot({
                slot: item.content,
                fallback: item.text || "Detail item",
                label: "Drop row content"
            })
        }))
        : [
            {
                icon: "◆",
                content: renderWidgetSlot({
                    slot: values.categoryContent,
                    fallback: values.categoryText || "Respect",
                    label: "Drop primary bar content"
                })
            },
            {
                icon: "●",
                content: renderWidgetSlot({
                    slot: values.ownerContent,
                    fallback: values.ownerText || "Adreansyah Aswafi ( PT ASIK BANGET )",
                    label: "Drop secondary bar content"
                })
            }
        ];

    return (
        <div style={{ width: "100%", maxWidth: 560 }}>
            <article
                className={`edts-typograph edts-typograph--${values.variant || "lined"}`}
                style={{ "--edts-typograph-accent": values.accentColor || "#14236f" }}
            >
                <div className="edts-typograph__content">
                    <header className="edts-typograph__header">
                        <h2>
                            {renderWidgetSlot({
                                slot: values.titleContent,
                                fallback: values.title || "tostx",
                                label: "Drop title content"
                            })}
                        </h2>
                        <p>
                            {renderWidgetSlot({
                                slot: values.scheduleContent,
                                fallback: values.scheduleText || "Friday, 10 April 2026 04:30 - 05:30",
                                label: "Drop schedule content"
                            })}
                        </p>
                    </header>
                    <div className="edts-typograph__rows">
                        {detailItems.map((item, index) => (
                            <div key={index} className="edts-typograph__row">
                                <span className="edts-typograph__icon">{item.icon}</span>
                                <span className="edts-typograph__row-content">{item.content}</span>
                            </div>
                        ))}
                    </div>
                    {values.showActions !== false ? (
                        <footer className="edts-typograph__actions">
                            <button type="button">⌫</button>
                            <button type="button">✎</button>
                        </footer>
                    ) : null}
                </div>
            </article>
        </div>
    );
}
