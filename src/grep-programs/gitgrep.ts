const child_process = require("child_process");
import { IGrep } from "../interfaces/IGrep";
import { Printer } from "../printer";
import { Selector } from "../selector";
import { Selectors } from "../selectors";

class GitGrep implements IGrep {

    public readonly executable: string = "git";
    public readonly ignoreCase: string = "-i";
    public readonly filesToIgnore: string = ":!*.css";

    public run(cssFilePath: string, searchOnly: string = "", printer: Printer | null = null): Selector[]  {
        const selectors = new Selectors();
        const cleanSelectors = selectors.clean(selectors.fromFile(cssFilePath));
        return selectors.findUsages(this, searchOnly, cleanSelectors, printer);
    }

    public call(selector: string, path: string) {

        const call = child_process.spawnSync(
            this.executable,
            [
                "grep", // subcommand
                this.ignoreCase,
                selector,
                this.filesToIgnore,
                ":!*.scss", // put it in separately because it doesn't like spaces in the command, refactor this.
                path,
            ],
            {
                stdio: "pipe",
                encoding: "utf-8",
            },
        );

        return call;
    }
}

export { GitGrep };
