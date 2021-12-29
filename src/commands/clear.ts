import {Command} from "../commands";
import {clearTerminal} from "../terminal";

export const clear: Command = {
    short: "Clear the terminal",
    description: "Clear everything that has been previously shown on the terminal",
    hasValue: false,

    execute(args: string[], display: (lines: string, interpret: boolean) => void): void {
        clearTerminal()
    }
}