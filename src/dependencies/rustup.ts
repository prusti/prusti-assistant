import * as vscode from "vscode";
import { Location } from "vs-verification-toolbox";
import * as util from "../util";

export async function ensureRustToolchainInstalled(context: vscode.ExtensionContext, toolchainFile: Location): Promise<Location> {
    util.log("Checking rust toolchain version and components...");
    util.log(`Using rust-toolchain at ${toolchainFile}`);

    if (!await toolchainFile.exists()) {
        throw new Error(`The rust-toolchain file at ${toolchainFile} does not exist.`);
    }

    const cwd = toolchainFile.enclosingFolder.path();

    // `rustup show` will install the missing toolchain and components
    const rustupOutput = await util.spawn(
        "rustup",
        ["show"],
        { options: { cwd }}
    );

    if (rustupOutput.code != 0) {
        throw new Error(`Rustup terminated with exit code ${rustupOutput.code} and signal ${rustupOutput.signal}`);
    }

    const cargoOutput = await util.spawn(
        "rustup",
        ["which", "cargo"],
        { options: { cwd }}
    );

    if (cargoOutput.code != 0) {
        throw new Error(`Rustup which cargo terminated with exit code ${cargoOutput.code} and signal ${cargoOutput.signal}`);
    }

    return new Location(cargoOutput.stdout.trim());
}
