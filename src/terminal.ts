import {formatArgumentForCommand, splitCommand} from "./parser/command-splitter"
import {ColoredKeyword, highlightSyntax} from "./parser/highlighter";
import {executeCommand} from "./commands/commands";
import {history} from "./commandHistory";
import {processTemplates} from "./template/templateProcessor";
import {keywordColor, variable_paramColor} from "./colors";

const prompt = [{ color: keywordColor, keyword: '$visitor: '}]

export interface Terminal {
    display(text: string, interpret: boolean, modifiers?: (el: HTMLElement, lineIndex: number) => void): void
    displayPrompt(): void
    clear(): void
    enableInput(): void
    setInput(text: string): void
}

export const getTerminal = () => terminal

const terminal: Terminal = {
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

    console.log(event.key.toLowerCase())
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
    }

    if (event.key.toLowerCase())

    event.preventDefault()
}

function onType(el: HTMLInputElement, confirm = false): void {
    const value = el.value
    const splitted = splitCommand(value)
    const highlighted = highlightSyntax(splitted)
    while (command.firstChild) {
        command.removeChild(command.firstChild)
    }

    const withPrompt = prompt.concat(highlighted)
    const target = confirm ? display : command
    if (confirm) {
        terminal.displayPrompt()
    }

    displayContent(target, confirm, withPrompt, 0, false)

    if (confirm) {
        executeCommand(formatArgumentForCommand(splitted), terminal)
    }

    if (confirm) {
        input.value = ''
    }

    input.scrollIntoView({behavior: "smooth"})
}

function displayContent(
    targetElement: HTMLElement,
    block: boolean,
    coloredKeywords: ColoredKeyword[],
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