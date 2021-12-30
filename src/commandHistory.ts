const commandHistory: string[] = []
let index = 0

export const history = {
    moveBackward(): void {
        index = Math.min(index + 1, commandHistory.length)
    },

    moveForward(): void {
        index = Math.max(index - 1, 0)
    },

    present(): void {
        index = 0
    },

    get currentCommand(): string | undefined {
        return commandHistory[commandHistory.length - index]
    },

    addCommand(command: string[]): void {
        commandHistory.push(
            command
                .map(arg => (arg.indexOf(' ') !== -1) ? `'${arg}'` : arg)
                .join(' ')
        )

        if (commandHistory.length > 30) {
            commandHistory.shift()
        }

        this.present()
    }
}