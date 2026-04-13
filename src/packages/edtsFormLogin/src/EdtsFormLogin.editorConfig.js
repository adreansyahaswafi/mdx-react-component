export function getProperties(values, defaultProperties) {
    return defaultProperties;
}

export function check(values) {
    const errors = [];

    if (!values.content) {
        errors.push({
            property: "content",
            severity: "warning",
            message: "Add login fields into the content area.",
            studioMessage: "Add login fields into the content area.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.showSecondaryButton && !values.onSecondaryAction) {
        errors.push({
            property: "onSecondaryAction",
            severity: "warning",
            message: "The secondary button is visible but no secondary action is configured.",
            studioMessage: "Set a secondary action or hide the button.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
