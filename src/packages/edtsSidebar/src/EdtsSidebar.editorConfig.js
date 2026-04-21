/**
 * @param {Object} values
 * @returns {Array}
 */
export function check(values) {
    const errors = [];

    if (!values.logoImageUrl && !values.logoText) {
        errors.push({
            property: "logoText",
            severity: "warning",
            message: "Provide Logo Text when Logo Image URL is empty.",
            studioMessage: "Provide fallback logo text.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
