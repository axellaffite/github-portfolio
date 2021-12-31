import {getTerminal} from "./terminal";

export const autocomplete = {
    values: [] as string[],
    index: 0,

    setValues(values: string[]) {
        this.values = values
        this.index = 0
    },

    get currentValueOrEmpty(): string {
        return this.values[this.index] ?? ''
    },

    nextValue() {
        this.updateIndex(+1)
    },
    prevValue() {
        this.updateIndex(-1)
    },

    updateIndex(offset: number) {
        const mod = (a: number, b: number) => ((a % b) + b) % b
        if (this.values.length == 0) {
            this.index = 0
        } else {
            this.index = mod((this.index + offset), this.values.length)
        }

        getTerminal().setInput(getTerminal().getInputValue())
    },

    apply() {
        const toApply = this.values[this.index]
        if (!toApply) return

        const terminal = getTerminal()
        getTerminal().setInput(terminal.getInputValue() + toApply, true)
    }
}