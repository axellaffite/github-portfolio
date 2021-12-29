import {help} from "./help";
import {list} from "./list";
import {clear} from "./clear";
import {show} from "./show";
import {addToCommandHistory} from "../commandHistory";
import {Terminal} from "../terminal";

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

    addToCommandHistory(args)
    const [command, commandArgs] = [args[0], args.slice(1)]
    commands[command]?.execute(commandArgs, terminal)
}