/**
 * @param {object} values
 * @param {object} defaultProperties
 * @returns {object}
 */
export function getProperties(values, defaultProperties) {
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

    if (values.showCancelButton && !values.onCancelAction) {
        errors.push({
            property: "onCancelAction",
            severity: "warning",
            message: "The cancel button is visible but no cancel action is configured.",
            studioMessage: "Set a cancel action or hide the cancel button.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
