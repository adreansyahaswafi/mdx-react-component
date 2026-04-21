function isValidHexColor(value) {
    return /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(String(value || "").trim());
}

/**
 * @param {Object} values
 * @returns {Array}
 */
export function check(values) {
    const errors = [];

    if (values.defaultColor && !isValidHexColor(values.defaultColor)) {
        errors.push({
            property: "defaultColor",
            severity: "error",
            message: "Default Color must be a valid hex color such as #2563eb.",
            studioMessage: "Enter a valid hex color.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
