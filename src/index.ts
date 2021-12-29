import "./terminal"
import "./command-splitter"
import {displayText, initCommandPrompt} from "./terminal";
import {loadPortfolio} from "./project";


initCommandPrompt()
displayText(
`Hello, welcome to my portfolio !
It's an interactive terminal.
If you need help, type 'help'.`
)

loadPortfolio().then(() => console.log("Portfolio downloaded"))