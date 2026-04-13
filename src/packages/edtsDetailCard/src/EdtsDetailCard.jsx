import { Children, createElement } from "react";

import "./ui/EdtsDetailCard.css";

function getAttributeValue(attribute, item, fallback = "") {
    if (!attribute) {
        return fallback;
    }

    const attributeValue =
        typeof attribute.get === "function" && item
            ? attribute.get(item)
            : attribute.value != null || typeof attribute.displayValue !== "undefined"
              ? attribute
              : null;

    if (!attributeValue) {
        return fallback;
    }

    if (attributeValue.displayValue != null && String(attributeValue.displayValue).trim() !== "") {
        return String(attributeValue.displayValue);
    }

    if (attributeValue.value != null && String(attributeValue.value).trim() !== "") {
        return String(attributeValue.value);
    }

    return fallback;
}

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function hasWidgetContent(slot) {
    return Children.count(slot) > 0;
}

function renderWebIcon(iconValue, className) {
    if (!iconValue) {
        return <div className={className}>•</div>;
    }

    if (iconValue.type === "image") {
        const imageSource = iconValue.imageUrl || iconValue.iconUrl;

        if (imageSource) {
            return <img className={`${className} ${className}--image`} src={imageSource} alt="" aria-hidden="true" />;
        }
    }

    if ((iconValue.type === "glyph" || iconValue.type === "icon") && iconValue.iconClass) {
        return (
            <span className={`${className} ${className}--glyph`} aria-hidden="true">
                <span className={iconValue.iconClass} />
            </span>
        );
    }

    return <div className={className}>•</div>;
}

export function EdtsDetailCard({
    eyebrowAttr,
    firstNameAttr,
    lastNameAttr,
    titleAttr,
    subtitleAttr,
    descriptionAttr,
    valueAttr,
    badgeAttr,
    imageUrlAttr,
    imageUrl,
    visualContent,
    detailItems,
    variant,
    accentColor,
    onClickAction
}) {
    const eyebrow = getAttributeValue(eyebrowAttr, null);
    const firstName = getAttributeValue(firstNameAttr, null);
    const lastName = getAttributeValue(lastNameAttr, null);
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    const title = fullName || getAttributeValue(titleAttr, null);
    const subtitle = getAttributeValue(subtitleAttr, null);
    const description = getAttributeValue(descriptionAttr, null);
    const value = getAttributeValue(valueAttr, null);
    const badge = getAttributeValue(badgeAttr, null);
    const resolvedImageUrl = getAttributeValue(imageUrlAttr, null, imageUrl).trim();
    const resolvedVariant = variant || "soft";
    const clickable = Boolean(onClickAction && onClickAction.canExecute);
    const style = accentColor ? { "--edts-detail-card-accent": accentColor } : undefined;
    const detailList = Array.isArray(detailItems) ? detailItems.filter(Boolean) : [];
    const hasHeaderMeta = Boolean(eyebrow || title || subtitle || value || badge);
    const hasVisualContent = hasWidgetContent(visualContent);
    const hasVisual = Boolean(resolvedImageUrl || hasVisualContent);

    return (
        <div
            className={`edts-detail-card edts-detail-card--${resolvedVariant} ${clickable ? "edts-detail-card--clickable" : ""}`}
            style={style}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={() => executeAction(onClickAction)}
            onKeyDown={event => {
                if (clickable && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    executeAction(onClickAction);
                }
            }}
        >
            <div className="edts-detail-card__shell">
                <div className="edts-detail-card__panel">
                    {hasVisual ? (
                        <div className="edts-detail-card__top edts-detail-card__top--with-visual">
                            <div className="edts-detail-card__visual">
                                {hasVisualContent ? (
                                    <div className="edts-detail-card__visual-slot">{visualContent}</div>
                                ) : (
                                    <img className="edts-detail-card__visual-image" src={resolvedImageUrl} alt={title || "Detail"} />
                                )}
                            </div>
                            {hasHeaderMeta ? (
                                <div className="edts-detail-card__meta">
                                    <div className="edts-detail-card__titles">
                                        {eyebrow ? <div className="edts-detail-card__eyebrow">{eyebrow}</div> : null}
                                        {title ? <div className="edts-detail-card__title">{title}</div> : null}
                                        {subtitle ? <div className="edts-detail-card__subtitle">{subtitle}</div> : null}
                                    </div>

                                    {value || badge ? (
                                        <div className="edts-detail-card__head-side">
                                            {badge ? <div className="edts-detail-card__badge">{badge}</div> : null}
                                            {value ? <div className="edts-detail-card__value">{value}</div> : null}
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {!hasVisual && hasHeaderMeta ? (
                        <div className="edts-detail-card__meta">
                            <div className="edts-detail-card__titles">
                                {eyebrow ? <div className="edts-detail-card__eyebrow">{eyebrow}</div> : null}
                                {title ? <div className="edts-detail-card__title">{title}</div> : null}
                                {subtitle ? <div className="edts-detail-card__subtitle">{subtitle}</div> : null}
                            </div>

                            {value || badge ? (
                                <div className="edts-detail-card__head-side">
                                    {badge ? <div className="edts-detail-card__badge">{badge}</div> : null}
                                    {value ? <div className="edts-detail-card__value">{value}</div> : null}
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {description ? <div className="edts-detail-card__description">{description}</div> : null}

                    {detailList.length ? (
                        <div className="edts-detail-card__details">
                            {detailList.map((detailItem, index) => {
                                const detailLabel = detailItem.label;
                                const detailText = getAttributeValue(detailItem.textAttr, null, detailItem.text);
                                const detailIcon =
                                    detailItem.icon && detailItem.icon.status === "available" ? detailItem.icon.value : undefined;

                                return (
                                    <div className="edts-detail-card__detail" key={`${detailLabel || detailText || "detail"}-${index}`}>
                                        <div className="edts-detail-card__detail-icon">
                                            {renderWebIcon(detailIcon, "edts-detail-card__detail-icon-fallback")}
                                        </div>
                                        <div className="edts-detail-card__detail-body">
                                            {detailLabel ? <div className="edts-detail-card__detail-label">{detailLabel}</div> : null}
                                            {detailText ? (
                                                <div className="edts-detail-card__detail-text">{detailText}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
