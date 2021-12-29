import {Command} from "./commands";
import {Terminal} from "../terminal";

export const clear: Command = {
    short: "Clear the terminal",
    description: "Clear everything that has been previously shown on the terminal",
    hasValue: false,

    execute(args: string[], terminal: Terminal): void {
        terminal.clear()
    }
}