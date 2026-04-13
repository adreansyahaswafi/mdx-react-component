import { Children, createElement, useEffect, useRef, useState } from "react";

import "./ui/EdtsProfileDropDown.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function joinClassNames(...classNames) {
    return classNames.filter(Boolean).join(" ");
}

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

    if (attributeValue && attributeValue.value != null && String(attributeValue.value).trim() !== "") {
        return String(attributeValue.value);
    }

    return fallback;
}

function joinTextParts(...parts) {
    return parts
        .map(part => String(part || "").trim())
        .filter(Boolean)
        .join(" ");
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M15 17l5-5-5-5M20 12H9M12 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

export function EdtsProfileDropDown(props) {
    const {
        avatarImageUrlContextAttr,
        avatarTextContextAttr,
        firstNameContextAttr,
        lastNameContextAttr,
        emailContextAttr,
        roleLabelContextAttr,
        avatarContent,
        avatarImageUrl = "",
        avatarText = "",
        firstName = "",
        lastName = "",
        email = "",
        roleLabel = "",
        primaryActionCaption = "",
        logoutCaption = "",
        onPrimaryAction,
        onLogoutAction,
        compact = false,
        align = "right"
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef(null);
    const resolvedAvatarImageUrl = getAttributeValue(avatarImageUrlContextAttr, null, avatarImageUrl).trim();
    const resolvedAvatarText = getAttributeValue(avatarTextContextAttr, null, avatarText);
    const resolvedFirstName = getAttributeValue(firstNameContextAttr, null, firstName);
    const resolvedLastName = getAttributeValue(lastNameContextAttr, null, lastName);
    const resolvedDisplayName = joinTextParts(resolvedFirstName, resolvedLastName) || "Profile";
    const resolvedEmail = getAttributeValue(emailContextAttr, null, email);
    const resolvedRoleLabel = getAttributeValue(roleLabelContextAttr, null, roleLabel);
    const resolvedAvatar = resolvedAvatarText || resolvedDisplayName.slice(0, 2).toUpperCase() || "PR";
    const actionCount = [Boolean(primaryActionCaption), Boolean(logoutCaption)].filter(Boolean).length;
    const hasCustomAvatarContent = Children.count(avatarContent) > 0;

    useEffect(() => {
        function handlePointerDown(event) {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function handleAction(action) {
        setIsOpen(false);
        executeAction(action);
    }

    return (
        <div
            ref={rootRef}
            className={joinClassNames(
                "edts-profile-dropdown",
                compact && "edts-profile-dropdown--compact",
                align === "left" ? "edts-profile-dropdown--left" : "edts-profile-dropdown--right",
                isOpen && "edts-profile-dropdown--open"
            )}
        >
            <button
                type="button"
                className="edts-profile-dropdown__trigger"
                onClick={() => setIsOpen(current => !current)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <span className="edts-profile-dropdown__avatar-wrap">
                    {hasCustomAvatarContent ? (
                        <span className="edts-profile-dropdown__avatar-content">{avatarContent}</span>
                    ) : resolvedAvatarImageUrl ? (
                        <img
                            className="edts-profile-dropdown__avatar-image"
                            src={resolvedAvatarImageUrl}
                            alt={resolvedDisplayName}
                        />
                    ) : (
                        <span className="edts-profile-dropdown__avatar">{resolvedAvatar}</span>
                    )}
                </span>
                <span className="edts-profile-dropdown__summary">
                    <span className="edts-profile-dropdown__name">{resolvedDisplayName}</span>
                    {resolvedRoleLabel ? <span className="edts-profile-dropdown__role">{resolvedRoleLabel}</span> : null}
                </span>
                <span className="edts-profile-dropdown__chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M6 9l6 6 6-6"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                        />
                    </svg>
                </span>
            </button>

            {isOpen ? (
                <div className="edts-profile-dropdown__menu" role="menu">
                    <div className="edts-profile-dropdown__panel">
                        <div className="edts-profile-dropdown__hero">
                            <span className="edts-profile-dropdown__hero-visual">
                                {hasCustomAvatarContent ? (
                                    <span className="edts-profile-dropdown__hero-avatar-content">{avatarContent}</span>
                                ) : resolvedAvatarImageUrl ? (
                                    <img
                                        className="edts-profile-dropdown__hero-avatar-image"
                                        src={resolvedAvatarImageUrl}
                                        alt={resolvedDisplayName}
                                    />
                                ) : (
                                    <span className="edts-profile-dropdown__hero-avatar">{resolvedAvatar}</span>
                                )}
                            </span>
                            <div className="edts-profile-dropdown__hero-body">
                                <div className="edts-profile-dropdown__hero-name">{resolvedDisplayName}</div>
                                {resolvedEmail ? <div className="edts-profile-dropdown__hero-email">{resolvedEmail}</div> : null}
                            </div>
                        </div>

                        <div
                            className={joinClassNames(
                                "edts-profile-dropdown__actions",
                                actionCount === 2 && "edts-profile-dropdown__actions--split"
                            )}
                        >
                            {primaryActionCaption ? (
                                <button
                                    type="button"
                                    className="edts-profile-dropdown__action"
                                    onClick={() => handleAction(onPrimaryAction)}
                                >
                                    <span className="edts-profile-dropdown__action-icon">
                                        <UserIcon />
                                    </span>
                                    <span>{primaryActionCaption}</span>
                                </button>
                            ) : null}
                            {logoutCaption ? (
                                <button
                                    type="button"
                                    className="edts-profile-dropdown__action edts-profile-dropdown__action--logout"
                                    onClick={() => handleAction(onLogoutAction)}
                                >
                                    <span className="edts-profile-dropdown__action-icon">
                                        <LogoutIcon />
                                    </span>
                                    <span>{logoutCaption}</span>
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
