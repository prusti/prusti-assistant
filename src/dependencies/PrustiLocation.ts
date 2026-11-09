import { Location } from "vs-verification-toolbox";
import * as fs from "fs-extra";
import * as path from "path";

export class PrustiLocation {
    constructor(
        private readonly prustiLocation: Location,
        private readonly viperToolsLocation: Location,
        public readonly rustToolchainFile: Location,
        private readonly cargoLocation: Location
    ) {
        // Set execution flags (ignored on Windows)
        fs.chmodSync(this.prustiDriver, 0o775);
        fs.chmodSync(this.prustiRustc, 0o775);
        fs.chmodSync(this.cargoPrusti, 0o775);
        fs.chmodSync(this.z3, 0o775);
        fs.chmodSync(this.boogie, 0o775);
        fs.chmodSync(this.prustiServerDriver, 0o775);
        fs.chmodSync(this.prustiServer, 0o775);
    }

    public get cargo(): string {
        return this.cargoLocation.path();
    }

    public get rustToolchain(): string {
        return path.basename(
            this.cargoLocation.enclosingFolder.enclosingFolder.path()
        );
    }

    public get cargoPrustiEnv(): Record<string, string> {
        return {
            PRUSTI_CARGO_PATH: this.cargo,
            RUSTUP_TOOLCHAIN: this.rustToolchain,
        };
    }

    public get prustiDriver(): string {
        return this.prustiLocation.executable("prusti-driver");
    }

    public get prustiRustc(): string {
        return this.prustiLocation.executable("prusti-rustc");
    }

    public get cargoPrusti(): string {
        return this.prustiLocation.executable("cargo-prusti");
    }

    public get prustiServerDriver(): string {
        return this.prustiLocation.executable("prusti-server-driver");
    }

    public get prustiServer(): string {
        return this.prustiLocation.executable("prusti-server");
    }

    public get z3(): string {
        return this.viperToolsLocation.child("z3").child("bin")
            .executable("z3");
    }

    public get boogie(): string {
        return this.viperToolsLocation.child("boogie")
            .child("Binaries").executable("Boogie");
    }
}
