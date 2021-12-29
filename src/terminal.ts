import {formatArgumentForCommand, splitCommand} from "./parser/command-splitter"
import {ColoredKeyword, highlightSyntax, keywordColor, variable_paramColor} from "./parser/highlighter";
import {executeCommand} from "./commands/commands";
import {getCurrentHistory, moveBackward, moveForward} from "./commandHistory";

const terminal: HTMLElement = document.getElementById('terminal')
const command: HTMLElement = document.getElementById('command')
const display: HTMLElement = document.getElementById('display')
const sizeComputeText: HTMLElement = document.getElementById('size-compute')
const input: HTMLInputElement = document.getElementById('input') as HTMLInputElement

window.addEventListener('resize', () => { resizeFont() })
document.addEventListener('readystatechange', () => { resizeFont() })
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
    text.split(/\r\n|\n/g)
        .map(line => { return {color: variable_paramColor, keyword: line} })
        .forEach(line => displayContent(display, true, [line]))
}

function getOptimalFontSize(): number {
    const precision = 100
    sizeComputeText.style.fontSize = `${precision}px`

    const currentWidth = sizeComputeText.clientWidth
    const desiredWidth = terminal.clientWidth
    const targetWidth = desiredWidth - (desiredWidth / sizeComputeText.innerText.length * 2)
    const ratio = targetWidth / currentWidth

    return precision * ratio
}

export function resizeFont() {
    setTimeout(() => {
        document.body.style.fontSize = `${getOptimalFontSize()}px`
    })
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

function displayContent(targetElement: HTMLElement, block: boolean, coloredKeywords: ColoredKeyword[]): void {
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
        } else {
            node.innerText = str.keyword
        }
        finalTarget.appendChild(node)
    }
}