import {formatArgumentForCommand, splitCommand} from "./parser/command-splitter"
import {ColoredKeyword, highlightSyntax} from "./parser/highlighter";
import {autocompleteCommand, executeCommand} from "./commands/commands";
import {history} from "./commandHistory";
import {processTemplates} from "./template/templateProcessor";
import {autocompleteColor, keywordColor, variable_paramColor} from "./colors";

const prompt = [{ color: keywordColor, keyword: '$visitor: '}]

export interface Terminal {
    initWith(initialMessage: string, interpret: boolean): void
    display(text: string, interpret: boolean, modifiers?: (el: HTMLElement, lineIndex: number) => void): void
    displayPrompt(): void
    clear(): void
    enableInput(): void
    setInput(text: string): void
}

export const getTerminal = () => terminal

const terminal: Terminal = {
    initWith(initialMessage: string, interpret: boolean) {
        this.display(initialMessage, interpret)
        onType(input, false, true)
    },

    display(text: string, interpret = false, modifiers = (el: HTMLElement) => {}) {
        const splitted = text.split(/\r\n|\n/g)
        const interpreted = interpret ? splitted.map(processTemplates) : splitted

        return interpreted
            .map(line => { return {color: variable_paramColor, keyword: line} })
            .forEach((line, index) => displayContent(display, true, [line], index, interpret, modifiers))
    },

    displayPrompt() {
        displayContent(command, false, prompt, 0, false)
    },

    clear() {
        while (display.firstChild) {
            display.removeChild(display.firstChild)
        }
        input.value = ''
    },

    enableInput() {
        input.disabled = false
        input.focus({preventScroll: true})
    },

    setInput(text: string) {
        input.value = text
        input.focus()
        onType(input)
    }
}


const command: HTMLElement = document.getElementById('command')
const display: HTMLElement = document.getElementById('display')
const input: HTMLInputElement = document.getElementById('input') as HTMLInputElement

input.oninput = () => onType(input)
input.onkeydown = (event) => onKeyDown(event)

function onKeyDown(event: KeyboardEvent): void {
    if (event.key.length === 1 || event.key.toLowerCase() === 'backspace') {
        return
    }

    if (event.key.toLowerCase() === 'enter') {
        onType(event.target as HTMLInputElement, true)
    }

    switch (event.key.toLowerCase()) {
        case 'arrowup':
            history.moveBackward()
            input.value = history.currentCommand ?? ''
            onType(input)
            break;

        case 'arrowdown':
            history.moveForward()
            input.value = history.currentCommand ?? ''
            onType(input)
            break;

        case 'arrowright':
            autocomplete.nextValue()
            break;

        case 'arrowleft':
            autocomplete.prevValue()
            break;

        case 'tab':
            autocomplete.apply()
            break
    }

    if (event.key.toLowerCase())

    event.preventDefault()
}

const autocomplete = {
    values: [] as string[],
    index: 0,

    setValues(values: string[]) {
        this.values = values
        this.index = 0
    },

    get currentValueOrEmpty(): string {
        return this.values[this.index] ?? ''
    },

    nextValue() { this.updateIndex(+1) },
    prevValue() { this.updateIndex(-1) },

    updateIndex(offset: number) {
        const mod = (a: number , b: number) => ((a % b) + b) % b
        if (this.values.length == 0) this.index = 0
        else this.index = mod((this.index + offset), this.values.length)

        onType(input, false, false)
    },

    apply() {
        const toApply = this.values[this.index]
        if (!toApply) return

        input.value += toApply
        onType(input, false)
    }
}

function onType(el: HTMLInputElement, confirm = false, updateAutocomplete = true): void {
    const value = el.value
    const splitted = splitCommand(value)
    const formatted = formatArgumentForCommand(splitted)
    if (updateAutocomplete || autocomplete.values.length == 0) {
        autocomplete.setValues(
            confirm
                ? []
                : autocompleteCommand(formatted, (splitted[splitted.length - 1] ?? '').match(/\s|'/g) != null)
        )
    }

    const highlighted = highlightSyntax(splitted).concat([
        {color: autocompleteColor, keyword: (autocomplete.currentValueOrEmpty), cursor: true} as ColoredKeyword
    ])

    while (command.firstChild) {
        command.removeChild(command.firstChild)
    }

    const withPrompt = prompt.concat(highlighted)
    const target = confirm ? display : command
    displayContent(target, confirm, withPrompt, 0, false)

    if (confirm) {
        executeCommand(formatted, terminal)
        input.value = ''
        terminal.displayPrompt()
        onType(el)
    }

    input.scrollIntoView({behavior: "smooth"})
}

function displayContent(
    targetElement: HTMLElement,
    block: boolean,
    coloredKeywords: (ColoredKeyword & { cursor?: boolean })[],
    lineIndex: number,
    interpreted = false,
    modifiers?: (el: HTMLElement, lineIndex: number) => void
): void {
    let finalTarget = targetElement
    if (block) {
        const container = document.createElement('div')
        finalTarget.appendChild(container)
        finalTarget = container
    }

    for (const str of coloredKeywords) {
        const node = document.createElement('span')
        node.style.color = str.color

        if (str.cursor) {
            node.classList.add('cursor')
        }

        if (str.keyword.trim().length === 0) {
            node.innerHTML = '&nbsp;'
        } else if (interpreted) {
            node.innerHTML = str.keyword
        } else {
            node.innerText = str.keyword
        }

        if (modifiers) {
            modifiers(node, lineIndex)
        }

        finalTarget.appendChild(node)
    }
}