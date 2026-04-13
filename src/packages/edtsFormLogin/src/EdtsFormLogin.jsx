import { createElement, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./ui/EdtsFormLogin.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function joinClassNames(...classNames) {
    return classNames.filter(Boolean).join(" ");
}

function normalizeText(value) {
    if (value == null) {
        return "";
    }

    return String(value).trim();
}

function getAttributeText(attribute) {
    if (!attribute) {
        return "";
    }

    const displayValue = normalizeText(attribute.displayValue);

    if (displayValue) {
        return displayValue;
    }

    return normalizeText(attribute.value);
}

function clearAttributeText(attribute) {
    if (attribute && typeof attribute.setValue === "function" && !attribute.readOnly) {
        attribute.setValue("");
    }
}

const toastPositions = {
    topRight: "top-right",
    topCenter: "top-center",
    topLeft: "top-left",
    bottomRight: "bottom-right",
    bottomCenter: "bottom-center",
    bottomLeft: "bottom-left"
};

export function EdtsFormLogin(props) {
    const {
        showHeader = false,
        backCaption,
        helperCaption,
        title,
        description,
        content,
        submitCaption = "Login",
        secondaryCaption = "Cancel",
        showSecondaryButton = false,
        submitOnEnter = true,
        showToastOnSubmit = true,
        toastMessage = "",
        toastMessageAttribute,
        toastType = "error",
        toastPosition = "topRight",
        toastAutoClose = 2400,
        compact = false,
        onBackAction,
        onHelperAction,
        onSubmitAction,
        onSecondaryAction
    } = props;
    const previousAttributeMessageRef = useRef("");
    const lastToastAttemptRef = useRef(0);
    const [toastAttempt, setToastAttempt] = useState(0);
    const hasToastMessageAttribute = Boolean(toastMessageAttribute);
    const attributeToastMessage = getAttributeText(toastMessageAttribute);

    useEffect(() => {
        if (!showToastOnSubmit || !hasToastMessageAttribute) {
            previousAttributeMessageRef.current = attributeToastMessage;
            return;
        }

        if (!attributeToastMessage) {
            previousAttributeMessageRef.current = "";
            return;
        }

        const shouldShowRepeatedMessage = toastAttempt !== 0 && toastAttempt !== lastToastAttemptRef.current;
        const messageChanged = attributeToastMessage !== previousAttributeMessageRef.current;

        if (messageChanged || shouldShowRepeatedMessage) {
            const toastMethod = toast[toastType] || toast;
            toastMethod(attributeToastMessage);
            lastToastAttemptRef.current = toastAttempt;
            clearAttributeText(toastMessageAttribute);
        }

        previousAttributeMessageRef.current = attributeToastMessage;
    }, [attributeToastMessage, hasToastMessageAttribute, showToastOnSubmit, toastAttempt, toastType]);

    const handleSubmit = event => {
        event.preventDefault();
        const resolvedToastMessage = hasToastMessageAttribute ? "" : normalizeText(toastMessage);

        if (hasToastMessageAttribute) {
            setToastAttempt(current => current + 1);
        }

        if (showToastOnSubmit && !hasToastMessageAttribute && resolvedToastMessage) {
            const toastMethod = toast[toastType] || toast;
            toastMethod(resolvedToastMessage);
        }
        executeAction(onSubmitAction);
    };

    const handleKeyDown = event => {
        const target = event.target;
        const isTextArea = target && target.tagName === "TEXTAREA";

        if (submitOnEnter && event.key === "Enter" && !isTextArea) {
            event.preventDefault();
            executeAction(onSubmitAction);
        }
    };

    return (
        <form
            className={joinClassNames("edts-form-login", compact && "edts-form-login--compact")}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
        >
            {showHeader ? (
                <div className="edts-form-login__topbar">
                    {backCaption ? (
                        <button
                            type="button"
                            className="edts-form-login__link"
                            onClick={() => executeAction(onBackAction)}
                        >
                            {backCaption}
                        </button>
                    ) : (
                        <span />
                    )}
                    {helperCaption ? (
                        <button
                            type="button"
                            className="edts-form-login__link edts-form-login__link--right"
                            onClick={() => executeAction(onHelperAction)}
                        >
                            {helperCaption}
                        </button>
                    ) : null}
                </div>
            ) : null}

            {title || description ? (
                <div className="edts-form-login__intro">
                    {title ? <h2 className="edts-form-login__title">{title}</h2> : null}
                    {description ? <p className="edts-form-login__description">{description}</p> : null}
                </div>
            ) : null}

            <div className="edts-form-login__body">{content}</div>

            <div className="edts-form-login__actions" aria-label="Form actions">
                {showSecondaryButton ? (
                    <button type="button" className="edts-form-login__button edts-form-login__button--secondary" onClick={() => executeAction(onSecondaryAction)}>
                        {secondaryCaption}
                    </button>
                ) : null}
                <button type="submit" className="edts-form-login__button edts-form-login__button--primary">
                    {submitCaption}
                </button>
            </div>

            <ToastContainer
                className="edts-form-login__toast"
                position={toastPositions[toastPosition] || "top-right"}
                autoClose={toastAutoClose > 0 ? toastAutoClose : false}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </form>
    );
}
