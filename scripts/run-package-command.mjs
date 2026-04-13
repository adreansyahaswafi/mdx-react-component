import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, "src", "packages");
const linkedDependencies = ["@mendix/pluggable-widgets-tools"];

function normalizeKey(value) {
    return String(value || "")
        .replace(/^--/, "")
        .replace(/[^a-zA-Z0-9]+/g, "")
        .toLowerCase();
}

function getPackageEntries() {
    if (!fs.existsSync(packagesDir)) {
        return [];
    }

    return fs
        .readdirSync(packagesDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => {
            const packageDir = path.join(packagesDir, entry.name);
            const packageJsonPath = path.join(packageDir, "package.json");
            const packageJson = fs.existsSync(packageJsonPath)
                ? JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
                : {};

            return {
                dirName: entry.name,
                packageDir,
                packageName: packageJson.name || entry.name,
                widgetName: packageJson.widgetName || ""
            };
        });
}

function resolveTarget(entries, args) {
    const flagArg = args.find(arg => arg.startsWith("--"));

    if (!flagArg) {
        return null;
    }

    const requestedKey = normalizeKey(flagArg);

    return (
        entries.find(entry => {
            return [entry.dirName, entry.packageName, entry.widgetName].some(value => normalizeKey(value) === requestedKey);
        }) || null
    );
}

function runCommand(command, args) {
    const result = spawnSync(command, args, {
        cwd: rootDir,
        stdio: "inherit",
        shell: false
    });

    if (result.error) {
        throw result.error;
    }

    process.exit(result.status ?? 0);
}

function ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function ensureLocalPackageLinks(packageDir) {
    const packageNodeModulesDir = path.join(packageDir, "node_modules");

    ensureDirectory(packageNodeModulesDir);

    for (const dependencyName of linkedDependencies) {
        const rootDependencyPath = path.join(rootDir, "node_modules", ...dependencyName.split("/"));

        if (!fs.existsSync(rootDependencyPath)) {
            continue;
        }

        const dependencySegments = dependencyName.split("/");
        const localDependencyPath = path.join(packageNodeModulesDir, ...dependencySegments);
        const localParentDir = path.dirname(localDependencyPath);

        ensureDirectory(localParentDir);

        if (fs.existsSync(localDependencyPath)) {
            const currentStat = fs.lstatSync(localDependencyPath);

            if (currentStat.isSymbolicLink()) {
                const currentTarget = fs.readlinkSync(localDependencyPath);
                const expectedTarget = path.relative(localParentDir, rootDependencyPath);

                if (currentTarget === expectedTarget) {
                    continue;
                }
            } else {
                continue;
            }

            fs.rmSync(localDependencyPath, { recursive: true, force: true });
        }

        const relativeTarget = path.relative(localParentDir, rootDependencyPath);
        fs.symlinkSync(relativeTarget, localDependencyPath, "dir");
    }
}

function runInPackage(packageDir, scriptName) {
    ensureLocalPackageLinks(packageDir);

    const result = spawnSync("npm", ["run", scriptName], {
        cwd: packageDir,
        stdio: "inherit",
        shell: false
    });

    if (result.error) {
        throw result.error;
    }

    return result.status ?? 0;
}

function installInPackage(packageDir) {
    const result = spawnSync("npm", ["install"], {
        cwd: packageDir,
        stdio: "inherit",
        shell: false
    });

    if (result.error) {
        throw result.error;
    }

    if ((result.status ?? 0) === 0) {
        ensureLocalPackageLinks(packageDir);
    }

    return result.status ?? 0;
}

function main() {
    const [, , scriptName, ...extraArgs] = process.argv;

    if (!scriptName) {
        console.error("Missing script name.");
        process.exit(1);
    }

    const entries = getPackageEntries();
    const target = resolveTarget(entries, extraArgs);

    if (target) {
        console.log(`Running ${scriptName} for ${target.dirName}`);
    } else {
        console.log(`Running ${scriptName} for all packages`);
    }

    if (scriptName === "install") {
        if (target) {
            process.exit(installInPackage(target.packageDir));
        }

        for (const entry of entries) {
            console.log(`Installing dependencies for ${entry.dirName}`);
            const status = installInPackage(entry.packageDir);

            if (status !== 0) {
                process.exit(status);
            }
        }

        process.exit(0);
    }

    if (target) {
        process.exit(runInPackage(target.packageDir, scriptName));
    }

    for (const entry of entries) {
        console.log(`Running ${scriptName} for ${entry.dirName}`);
        const status = runInPackage(entry.packageDir, scriptName);

        if (status !== 0) {
            process.exit(status);
        }
    }
}

main();
