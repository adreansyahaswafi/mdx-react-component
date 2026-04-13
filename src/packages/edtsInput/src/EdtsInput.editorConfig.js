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

    if (values.minLength != null && values.maxLength != null && values.minLength > values.maxLength) {
        errors.push({
            property: "minLength",
            severity: "error",
            message: "Minimum Length cannot be greater than Maximum Length.",
            studioMessage: "Minimum Length cannot be greater than Maximum Length.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.pattern) {
        try {
            new RegExp(values.pattern);
        } catch (error) {
            errors.push({
                property: "pattern",
                severity: "error",
                message: "Pattern must be a valid regular expression.",
                studioMessage: "Pattern must be a valid regular expression.",
                url: "",
                studioUrl: ""
            });
        }
    }

    return errors;
}
