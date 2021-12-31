import {formatArgumentForCommand, splitCommand} from "./parser/command-splitter"
import {ColoredKeyword, highlightSyntax} from "./parser/highlighter";
import {autocompleteCommand, executeCommand} from "./commands/commands";
import {history} from "./commandHistory";
import {processTemplates} from "./template/templateProcessor";
import {autocompleteColor, keywordColor, variable_paramColor} from "./colors";
import {autocomplete} from "./autocomplete";

const prompt = [{ color: keywordColor, keyword: '$visitor: '}]

export interface Terminal {
    initWith(initialMessage: string, interpret: boolean): void
    display(text: string, interpret: boolean, modifiers?: (el: HTMLElement, lineIndex: number) => void): void
    displayPrompt(): void
    clear(): void
    enableInput(): void
    getInputValue(): string
    setInput(text: string, updateAutocomplete?: boolean): void
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

    getInputValue(): string {
        return input.value ?? ''
    },

    setInput(text: string, updateAutocomplete: boolean = false) {
        input.value = text
        input.focus()
        onType(input, false, updateAutocomplete)

        setTimeout(() => { input.selectionStart = input.selectionEnd = 10000 }, 0)
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
            terminal.setInput(history.currentCommand ?? '', true)
            break;

        case 'arrowdown':
            history.moveForward()
            terminal.setInput(history.currentCommand ?? '', true)
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