import * as vvt from "vs-verification-toolbox";
import * as path from "path";
import * as vscode from "vscode";
import * as process from "process";
import * as fs from "fs-extra";
import * as config from "../config";

// Prusti moved from viperproject/prusti-dev to prusti/prusti.
const PRUSTI_ORG = "prusti";
const PRUSTI_REPO = "prusti";

// The newest Prusti release that ships the `prusti-release-{macos,ubuntu,windows}.zip`
// assets expected by the 0.12.x extensions. Later releases use different asset
// names; therefore, the "Latest" setting uses this release instead of looking one
// up on GitHub.
export const LATEST_SUPPORTED_PRUSTI_TAG = "v-2024-02-28-1817";

export async function prustiTools(
    platform: vvt.Platform,
    context: vscode.ExtensionContext
): Promise<vvt.Dependency<config.PrustiVersion>> {
    const id = identifier(platform);
    const version = config.PrustiVersion;

    // Token used to avoid rate limits while testing
    const authorization_token = process.env.GITHUB_TOKEN
    if (authorization_token) {
        console.info("Using authorization token");
    }

    const getReleaseUrl = (tag: string): Promise<string> => {
        return vvt.GitHubReleaseAsset.getTaggedAssetUrl(
            PRUSTI_ORG, PRUSTI_REPO, `prusti-release-${id}.zip`, tag, authorization_token,
        );
    }

    const getLatestReleaseUrl = (): Promise<string> => getReleaseUrl(LATEST_SUPPORTED_PRUSTI_TAG);
    const getTaggedReleaseUrl = (): Promise<string> => getReleaseUrl(config.prustiTag());

    if (config.prustiVersion() == config.PrustiVersion.Local
          && !await fs.pathExists(config.localPrustiPath())) {
        throw new Error(
            `In the settings the Prusti version is ${config.PrustiVersion.Local}, but the `
            + `specified local path '${config.localPrustiPath()}' does not exist.`
        );
    }

    if (config.prustiVersion() == config.PrustiVersion.Tag && !config.prustiTag()) {
        throw new Error(
            `In the settings the Prusti version is ${config.PrustiVersion.Tag}, but `
            + `no tag has been provided. Please specify it in the prustiTag field.`
        );
    }

    return new vvt.Dependency(
        // Use a new folder so existing installations, which may contain any older
        // Prusti release, are replaced by the supported release.
        path.join(context.globalStoragePath, `prustiTools-${LATEST_SUPPORTED_PRUSTI_TAG}`),
        [version.Latest, new vvt.GitHubZipExtractor(getLatestReleaseUrl, "prusti", authorization_token)],
        [version.Tag, new vvt.GitHubZipExtractor(getTaggedReleaseUrl, "prusti", authorization_token)],
        [version.Local, new vvt.LocalReference(config.localPrustiPath())],
    );
}

function identifier(platform: vvt.Platform): string {
    switch (platform) {
        case vvt.Platform.Mac:
            return "macos";
        case vvt.Platform.Windows:
            return "windows";
        case vvt.Platform.Linux:
            return "ubuntu";
    }
}
