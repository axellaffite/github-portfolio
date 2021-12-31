import {availableCommands, Command, commands} from "./commands";
import {Terminal} from "../terminal";

function generateDescription(): string {
    const commandsWithShorts = Object.entries(commands).map(([key, command]) => {
        return `${key}: ${command.short}`
    }).join("\n - ")

    const helpText =
        "----------------------------------------"  + '\n' +
        "Available commands"                        + '\n' +
        "----------------------------------------"  + '\n' +
        " - " + commandsWithShorts                  + '\n' +
        "To get help for a specific command "       +
        "please enter: help [command]"              + '\n' +
        "Replace [command] by the command "         +
        "you want to display."                      + '\n' +
        "Example :"                                 + '\n' +
        "help list"

    return helpText
}

function getDetailedDescription(command: string): string {
    const targetCommand = commands[command]
    if (targetCommand == undefined) {
        return `${command}: Unknown command`
    }
    return targetCommand.description
}

export const help: Command = {
    short: 'Show a help dialog',
    get description(): string { return generateDescription() },
    hasValue: true,
    get acceptedValues() { return new Set<string>(availableCommands) },

    autocomplete(args: string[], trailingSpace: boolean): string[] {
        const prefix = trailingSpace ? '' : ' '
        const arg = args[0]
        if (!arg) return availableCommands.map(it => `${prefix}${it}`)

        return availableCommands.filter(it => it.startsWith(arg))
    },

    execute(args: string[], terminal: Terminal): void {
        if (args.length > 0) {
            const displayCommand = (command: string) => terminal.display(getDetailedDescription(command), true)
            args.forEach(displayCommand)
        } else {
            terminal.display(this.description, true)
        }
    }
}