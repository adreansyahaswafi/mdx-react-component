export function getProperties(values, defaultProperties) {
    return defaultProperties;
}

export function check(values) {
    const errors = [];

    if (!values.firstNameAttr && !values.lastNameAttr && !values.titleAttr) {
        errors.push({
            property: "firstNameAttr",
            severity: "warning",
            message: "Bind first name and last name, or provide a title fallback, so the detail card has a clear heading.",
            studioMessage: "Bind first/last name or a title fallback.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
