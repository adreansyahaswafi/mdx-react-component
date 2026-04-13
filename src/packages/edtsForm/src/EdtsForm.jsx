import { createElement } from "react";
import classNames from "classnames";

import "./ui/EdtsForm.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

export function EdtsForm({
    title,
    description,
    content,
    submitCaption,
    cancelCaption,
    showCancelButton,
    submitOnEnter,
    onSubmitAction,
    onCancelAction,
    showFooter,
    footerAlign,
    fullWidthButtons,
    compact
}) {
    function handleSubmit(event) {
        event.preventDefault();
        executeAction(onSubmitAction);
    }

    function handleKeyDown(event) {
        if (!submitOnEnter || event.key !== "Enter") {
            return;
        }

        const targetTagName = event.target && event.target.tagName ? String(event.target.tagName).toLowerCase() : "";

        if (targetTagName === "textarea") {
            return;
        }

        handleSubmit(event);
    }

    return (
        <form className={classNames("edts-form", { "edts-form--compact": compact })} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            {title || description ? (
                <div className="edts-form__header">
                    {title ? <div className="edts-form__title">{title}</div> : null}
                    {description ? <div className="edts-form__description">{description}</div> : null}
                </div>
            ) : null}

            <div className="edts-form__body">{content}</div>

            {showFooter ? (
                <div
                    className={classNames(
                        "edts-form__footer",
                        footerAlign === "left" ? "edts-form__footer--left" : "edts-form__footer--right",
                        fullWidthButtons && "edts-form__footer--full-width"
                    )}
                >
                    {showCancelButton ? (
                        <button
                            type="button"
                            className="edts-form__button edts-form__button--secondary"
                            onClick={() => executeAction(onCancelAction)}
                        >
                            {cancelCaption || "Cancel"}
                        </button>
                    ) : null}
                    <button type="submit" className="edts-form__button edts-form__button--primary">
                        {submitCaption || "Submit"}
                    </button>
                </div>
            ) : null}
        </form>
    );
}
