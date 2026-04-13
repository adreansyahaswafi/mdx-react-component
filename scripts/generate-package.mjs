import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, "src", "packages");

function parseArgs(argv) {
    const result = {};

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];

        if (arg === "--name" || arg === "-n") {
            result.name = argv[index + 1];
            index += 1;
        } else if (arg === "--widgetName" || arg === "-w") {
            result.widgetName = argv[index + 1];
            index += 1;
        } else if (arg === "--description" || arg === "-d") {
            result.description = argv[index + 1];
            index += 1;
        } else if (arg === "--author" || arg === "-a") {
            result.author = argv[index + 1];
            index += 1;
        } else if (arg === "--projectPath" || arg === "-p") {
            result.projectPath = argv[index + 1];
            index += 1;
        } else if (!result.name) {
            result.name = arg;
        } else if (!result.widgetName) {
            result.widgetName = arg;
        }
    }

    return result;
}

function toKebabCase(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

function toPascalCase(value) {
    return value
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, contents) {
    fs.writeFileSync(filePath, contents, "utf8");
}

function createPackageJson({ packageName, widgetName, description, author, projectPath }) {
    return `${JSON.stringify(
        {
            name: packageName,
            widgetName,
            version: "1.0.0",
            description,
            copyright: "© Mendix Technology BV 2026. All rights reserved.",
            author,
            engines: {
                node: ">=16"
            },
            license: "Apache-2.0",
            config: {
                projectPath: projectPath || "",
                mendixHost: "http://localhost:8080",
                developmentPort: 3000
            },
            packagePath: "edts-mendix",
            scripts: {
                start: "pluggable-widgets-tools start:server",
                dev: "pluggable-widgets-tools start:web",
                build: "pluggable-widgets-tools build:web",
                lint: "pluggable-widgets-tools lint",
                "lint:fix": "pluggable-widgets-tools lint:fix",
                prerelease: "npm run lint",
                release: "pluggable-widgets-tools release:web"
            },
            devDependencies: {
                "@mendix/pluggable-widgets-tools": "11.3.1"
            },
            resolutions: {
                react: "18.2.0",
                "react-dom": "18.2.0",
                "react-native": "0.72.7",
                "@types/react": "18.2.0",
                "@types/react-dom": "18.2.0"
            },
            overrides: {
                react: "18.2.0",
                "react-dom": "18.2.0",
                "react-native": "0.72.7",
                "@types/react": "18.2.0",
                "@types/react-dom": "18.2.0"
            }
        },
        null,
        2
    )}\n`;
}

function createWidgetXml({ widgetName, description, packageId }) {
    return `<?xml version="1.0" encoding="utf-8"?>
<widget id="${packageId}.${widgetName}" pluginWidget="true" needsEntityContext="true" offlineCapable="true" supportedPlatform="Web"
    xmlns="http://www.mendix.com/widget/1.0/"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.mendix.com/widget/1.0/ ../node_modules/@mendix/pluggable-widgets-api/widget.xsd">

    <name>${widgetName}</name>
    <description>${description}</description>
    <icon/>

    <properties>
        <propertyGroup caption="General">
            <property key="caption" type="string" required="false">
                <caption>Caption</caption>
                <description>Optional caption shown above the widget.</description>
            </property>
        </propertyGroup>
    </properties>
</widget>
`;
}

function createWidgetJsx(widgetName) {
    return `import { createElement } from "react";

import "./ui/${widgetName}.css";

export function ${widgetName}({ caption }) {
    return (
        <div className="${toKebabCase(widgetName)}">
            {caption ? <div className="${toKebabCase(widgetName)}__caption">{caption}</div> : null}
            <div className="${toKebabCase(widgetName)}__body">${widgetName} widget is ready.</div>
        </div>
    );
}
`;
}

function createEditorConfig() {
    return `/**
 * @param {object} values
 * @param {object} defaultProperties
 * @returns {object}
 */
export function getProperties(values, defaultProperties) {
    return defaultProperties;
}
`;
}

function createEditorPreview(widgetName) {
    return `import { createElement } from "react";

export function preview() {
    return (
        <div
            style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid #dbeafe",
                background: "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)"
            }}
        >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>${widgetName}</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>Generated widget preview</div>
        </div>
    );
}
`;
}

function createCss(widgetName) {
    const className = toKebabCase(widgetName);

    return `.${className} {
    width: 100%;
    padding: 16px;
    border: 1px solid #dbeafe;
    border-radius: 18px;
    background: linear-gradient(180deg, #ffffff 0%, #eff6ff 100%);
}

.${className}__caption {
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
}

.${className}__body {
    font-size: 14px;
    color: #475569;
}
`;
}

function createPackageXml(widgetName) {
    return `<?xml version="1.0" encoding="utf-8" ?>
<package xmlns="http://www.mendix.com/package/1.0/">
    <clientModule name="${widgetName}" version="1.0.0" xmlns="http://www.mendix.com/clientModule/1.0/">
        <widgetFiles>
            <widgetFile path="${widgetName}.xml"/>
        </widgetFiles>
        <files>
            <file path="edts-mendix/${toKebabCase(widgetName)}"/>
        </files>
    </clientModule>
</package>
`;
}

function createReadme(packageName, widgetName) {
    return `## ${widgetName}

Generated Mendix pluggable widget package.

### Package
- Name: \`${packageName}\`
- Widget: \`${widgetName}\`

### Commands
- \`npm run dev\`
- \`npm run build\`
- \`npm run lint\`
`;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const packageName = args.name ? toKebabCase(args.name) : "";
    const widgetName = args.widgetName ? toPascalCase(args.widgetName) : packageName ? toPascalCase(packageName) : "";

    if (!packageName) {
        console.error("Missing package name.");
        console.error("Usage: npm run generate:package -- --name my-widget --widgetName MyWidget");
        process.exit(1);
    }

    if (!widgetName) {
        console.error("Missing widget name.");
        process.exit(1);
    }

    const description = args.description || `${widgetName} Mendix widget`;
    const author = args.author || "edts";
    const packageId = "edts-mendix";
    const packageDir = path.join(packagesDir, packageName);

    if (fs.existsSync(packageDir)) {
        console.error(`Package already exists: ${packageDir}`);
        process.exit(1);
    }

    ensureDir(path.join(packageDir, "src", "ui"));

    writeFile(path.join(packageDir, "package.json"), createPackageJson({ packageName, widgetName, description, author, projectPath: args.projectPath }));
    writeFile(path.join(packageDir, "README.md"), createReadme(packageName, widgetName));
    writeFile(path.join(packageDir, "src", `${widgetName}.xml`), createWidgetXml({ widgetName, description, packageId }));
    writeFile(path.join(packageDir, "src", `${widgetName}.jsx`), createWidgetJsx(widgetName));
    writeFile(path.join(packageDir, "src", `${widgetName}.editorConfig.js`), createEditorConfig());
    writeFile(path.join(packageDir, "src", `${widgetName}.editorPreview.jsx`), createEditorPreview(widgetName));
    writeFile(path.join(packageDir, "src", "package.xml"), createPackageXml(widgetName));
    writeFile(path.join(packageDir, "src", "ui", `${widgetName}.css`), createCss(widgetName));

    console.log(`Created package at src/packages/${packageName}`);
    console.log(`Widget name: ${widgetName}`);
    console.log(`Next step: cd src/packages/${packageName} && npm install`);
}

main();
