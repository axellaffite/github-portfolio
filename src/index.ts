import "./terminal"
import "./parser/command-splitter"
import {getPortfolio, loadPortfolio} from "./project";
import {getTerminal} from "./terminal";
import {colors} from "./colors";


const terminal = getTerminal()

let downloaded = false
let error = false
loadPortfolio()
    .then(() => downloaded = true)
    .catch(err => {
        error = true
        downloaded = true
        terminal.clear()
        terminal.display(err, false)
    })

const loadingBars = ["|", "/", "-", "\\"]
function displayLoading(callback: () => void) {
    const availableColors = Object.keys(colors)
    function intern(iteration = 0) {
        if (downloaded) {
            return callback()
        }

        const color = availableColors[iteration % availableColors.length]
        const bar = loadingBars[iteration % loadingBars.length]
        terminal.clear()
        terminal.display(`{%color[${color}] Downloading portfolio information ${bar} %}`, true)

        setTimeout(() => {
            intern(iteration + 1)
        }, 150)
    }

    intern()
}

displayLoading(() => {
    if (!error) {
        terminal.enableInput()
        terminal.clear()
        terminal.display(getPortfolio().initialMessage, true)
        terminal.displayPrompt()
    }
})

