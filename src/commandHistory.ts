const commandHistory: string[] = []
let index = 0

export function moveBackward(): void {
    index = Math.min(index + 1, commandHistory.length)
}

export function moveForward(): void {
    index = Math.max(index - 1, 0)
}

export function present(): void {
    index = 0
}

export function getCurrentHistory(): string | undefined {
    console.log(index)
    return commandHistory[commandHistory.length - index]
}

export function addToCommandHistory(command: string[]): void {
    commandHistory.push(
        command.map(arg => (arg.indexOf(' ') !== -1) ? `'${arg}'` : arg)
            .join(' ')
    )

    if (commandHistory.length > 30) {
        commandHistory.shift()
    }

    present()
}