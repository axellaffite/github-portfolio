import {Command, commands} from "../commands";



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
    hasValue: false,

    execute(args: string[], display: (lines: string, interpret: boolean) => void): void {
        if (args.length > 0) {
            const displayCommand = (command: string) => display(getDetailedDescription(command), true)
            args.forEach(displayCommand)
        } else {
            display(this.description, true)
        }
    }
}