import {formatArgumentForCommand, splitCommand} from "./parser/command-splitter"
import {ColoredKeyword, highlightSyntax, keywordColor, variable_paramColor} from "./parser/highlighter";
import {executeCommand} from "./commands/commands";
import {getCurrentHistory, moveBackward, moveForward} from "./commandHistory";
import {processTemplates} from "./template/templateProcessor";

const terminal: HTMLElement = document.getElementById('terminal')
const command: HTMLElement = document.getElementById('command')
const display: HTMLElement = document.getElementById('display')
const input: HTMLInputElement = document.getElementById('input') as HTMLInputElement

input.oninput = (event) => onType(input)
input.onkeydown = (event) => onKeyDown(event)

export function clearTerminal(): void {
    while (display.firstChild) {
        display.removeChild(display.firstChild)
    }
}

const prompt = [{ color: keywordColor, keyword: '$visitor: '}]
export function initCommandPrompt(): void {
    displayContent(command, false, prompt)
}

export function displayText(text: string, interpret = false): void {
    const splitted = text.split(/\r\n|\n/g)
    const interpreted = interpret ? splitted.map(processTemplates) : splitted

    return interpreted
        .map(line => { return {color: variable_paramColor, keyword: line} })
        .forEach(line => displayContent(display, true, [line], interpret))
}

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
            moveBackward()
            input.value = getCurrentHistory() ?? ''
            onType(input)
            break;

        case 'arrowdown':
            moveForward()
            input.value = getCurrentHistory() ?? ''
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
        initCommandPrompt()
    }

    displayContent(target, confirm, withPrompt)

    if (confirm) {
        executeCommand(formatArgumentForCommand(splitted), displayText)
    }

    if (confirm) {
        input.value = ''
    }

    input.scrollIntoView({behavior: "smooth"})
}

function displayContent(targetElement: HTMLElement, block: boolean, coloredKeywords: ColoredKeyword[], interpreted = false): void {
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
        finalTarget.appendChild(node)
    }
}