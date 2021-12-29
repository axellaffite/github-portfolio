import {help} from "./commands/help";
import {list} from "./commands/list";
import {clear} from "./commands/clear";
import {show} from "./commands/show";

export interface Argument {
    hasValue: boolean,
    acceptedValues?: Set<string>
}

export interface Command extends Argument {
    short: string,
    description: string,
    args?: { [key: string]: Argument },
    execute: (args: string[], display: (lines: string, interpret: boolean) => void) => void
}

export const commands: { [key: string]: Command } = {
    "help": help,
    "list": list,
    "clear": clear,
    "show": show
}

export function executeCommand(args: string[], display: (lines: string, interpret: boolean) => void) {
    if (args.length == 0) return

    const [command, commandArgs] = [args[0], args.slice(1)]
    commands[command]?.execute(commandArgs, display)
}