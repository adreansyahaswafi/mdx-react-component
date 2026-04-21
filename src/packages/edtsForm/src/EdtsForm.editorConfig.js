/**
 * @param {object} values
 * @param {object} defaultProperties
 * @returns {object}
 */
export function getProperties(values, defaultProperties) {
    if (values.showActionButtons === false && defaultProperties.properties) {
        delete defaultProperties.properties.submitCaption;
        delete defaultProperties.properties.cancelCaption;
        delete defaultProperties.properties.showCancelButton;
        delete defaultProperties.properties.submitOnEnter;
        delete defaultProperties.properties.onSubmitAction;
        delete defaultProperties.properties.onCancelAction;
        delete defaultProperties.properties.showFooter;
        delete defaultProperties.properties.footerAlign;
        delete defaultProperties.properties.fullWidthButtons;
    }

    if (values.showFooter === false && defaultProperties.properties) {
        delete defaultProperties.properties.footerAlign;
        delete defaultProperties.properties.fullWidthButtons;
    }

    return defaultProperties;
}

/**
 * @param {Object} values
 * @returns {Array}
 */
export function check(values) {
    const errors = [];

    if (!values.content) {
        errors.push({
            property: "content",
            severity: "warning",
            message: "Add child widgets to the form content area so the wrapper has something to submit.",
            studioMessage: "Add child widgets to the form content area.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.showActionButtons !== false && values.showCancelButton && !values.onCancelAction) {
        errors.push({
            property: "onCancelAction",
            severity: "warning",
            message: "The cancel button is visible but no cancel action is configured.",
            studioMessage: "Set a cancel action or hide the cancel button.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.showActionButtons !== false && !values.onSubmitAction) {
        errors.push({
            property: "onSubmitAction",
            severity: "warning",
            message: "The submit button is visible but no submit action is configured.",
            studioMessage: "Set a submit action or hide the built-in buttons.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
