/**
 * @param {object} values
 * @param {object} defaultProperties
 * @returns {object}
 */
export function getProperties(values, defaultProperties) {
    if (values.inputType !== "password" && defaultProperties.properties) {
        delete defaultProperties.properties.confirmPassword;
        delete defaultProperties.properties.confirmWithAttribute;
        delete defaultProperties.properties.confirmPasswordMessage;
    }

    if (!values.confirmPassword && defaultProperties.properties) {
        delete defaultProperties.properties.confirmWithAttribute;
        delete defaultProperties.properties.confirmPasswordMessage;
    }

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

    if (values.confirmPassword && values.inputType !== "password") {
        errors.push({
            property: "confirmPassword",
            severity: "error",
            message: "Confirm Password can only be used when Input Type is Password.",
            studioMessage: "Use Password input type for confirmation.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.confirmPassword && !values.confirmWithAttribute) {
        errors.push({
            property: "confirmWithAttribute",
            severity: "error",
            message: "Select Compare With Attribute when Confirm Password is enabled.",
            studioMessage: "Select an attribute to compare with.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
