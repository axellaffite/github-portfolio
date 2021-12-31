import {help} from "./help";
import {list} from "./list";
import {clear} from "./clear";
import {show} from "./show";
import {Terminal} from "../terminal";
import {history} from "../commandHistory";

export interface Argument {
    hasValue: boolean,
    acceptedValues?: Set<string>,
    autocomplete(args: string[], trailingSpace: boolean): string[]
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

export const availableCommands = Object.keys(commands).sort()

export function executeCommand(args: string[], terminal: Terminal) {
    if (args.length == 0) return

    history.addCommand(args)
    const [command, commandArgs] = [args[0], args.slice(1)]
    commands[command]?.execute(commandArgs, terminal)
}

export function autocompleteCommand(args: string[], trailingSpace: boolean): string[] {
    if (args.length == 0) {
        return availableCommands
    }

    const command = args[0]
    const targetCommand = commands[command]
    const autocomplete = targetCommand
        ? targetCommand.autocomplete(args.slice(1), trailingSpace)
        : args.length == 1
            ? availableCommands
                .filter(it => it.startsWith(command))
                .map(it => it.replace(suffixReplace, ''))
            : []

    const lastKeyword = targetCommand ? args[args.length - 1] : command
    const suffixReplace = new RegExp(`^${lastKeyword}`, 'g')
    return autocomplete.map(it => it.replace(suffixReplace, ''))
}