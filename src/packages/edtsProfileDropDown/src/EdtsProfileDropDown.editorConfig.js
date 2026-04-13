export function getProperties(values, defaultProperties) {
    return defaultProperties;
}

export function check(values) {
    const errors = [];

    if (
        !values.firstName &&
        !values.lastName &&
        !values.firstNameContextAttr &&
        !values.lastNameContextAttr
    ) {
        errors.push({
            property: "firstName",
            severity: "warning",
            message: "Set a first name or bind first and last name attributes so the profile trigger is easier to identify.",
            studioMessage: "Set a first name or bind first and last name attributes.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
