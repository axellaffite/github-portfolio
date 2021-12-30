import {help} from "./help";
import {list} from "./list";
import {clear} from "./clear";
import {show} from "./show";
import {Terminal} from "../terminal";
import {history} from "../commandHistory";

export interface Argument {
    hasValue: boolean,
    acceptedValues?: Set<string>
}

export interface Command extends Argument {
    short: string,
    description: string,
    args?: { [key: string]: Argument },
    execute: (args: string[], terminal: Terminal) => void
}

export const commands: { [key: string]: Command } = {
    "help": help,
    "list": list,
    "clear": clear,
    "show": show
}

export function executeCommand(args: string[], terminal: Terminal) {
    if (args.length == 0) return

    history.addCommand(args)
    const [command, commandArgs] = [args[0], args.slice(1)]
    commands[command]?.execute(commandArgs, terminal)
}