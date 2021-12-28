const terminal: HTMLElement = document.getElementById('terminal')
const command: HTMLElement = document.getElementById('command')
const sizeComputeText: HTMLElement = document.getElementById('size-compute')
window.addEventListener('resize', () => { resizeFont() })
document.addEventListener('readystatechange', () => { resizeFont() })


function getOptimalFontSize(): number {
    const precision = 100
    sizeComputeText.style.fontSize = `${precision}px`

    const currentWidth = sizeComputeText.clientWidth
    const desiredWidth = terminal.clientWidth
    const targetWidth = desiredWidth - (desiredWidth / sizeComputeText.innerText.length * 2)
    const ratio = targetWidth / currentWidth

    return precision * ratio
}

function resizeFont() {
    setTimeout(() => {
        document.body.style.fontSize = `${getOptimalFontSize()}px`
    })
}

function animateDisplay() {

}

function onType(el: HTMLInputElement) {
    const value = el.value
    el.value = ""

    // TODO split text and highlight it
}