import {Argument, Command, commands} from "../commands/commands";
import {importColor, stringColor, textColor, variableColor} from "../colors";

export interface Colored { color: string }

export interface ColoredKeyword extends Colored {
    keyword: string
}

export function highlightSyntax(args: string[]): ColoredKeyword[] {
    console.log(args)
    const result: ColoredKeyword[] = []

    const iterator = function* (values: string[]) {
        for (const val of values) {
            if (val.trim().length === 0) {
                result.push({ color: textColor, keyword: val })
            } else {
                yield val
            }
        }
    }

    const ite = iterator(args)
    const nextValue = (): string | undefined => {
        const {value, done} = ite.next()
        if (done) return undefined
        return value as string
    }

    let currentValue = nextValue()
    if (!currentValue) return result

    try {
        const command: Command | null = commands[currentValue]
        if (!command) throw 'Unknown command'
        result.push({ color: importColor, keyword: currentValue })

        const parseArg = (current: Argument & Command, requiredDone = false): void => {
            currentValue = nextValue()
            if (!currentValue) return

            if (currentValue.trim().length === 0) {
                result.push({ color: textColor, keyword: currentValue })
                return parseArg(current, requiredDone)
            }
            if (!current.hasValue) throw "No argument expected"
            if (current.acceptedValues && !current.acceptedValues.has(currentValue)) throw "Not in required values"
            if (current.acceptedValues && current.acceptedValues.has(currentValue)) {
                if (requiredDone) throw "Only one unnamed argument is accepted"

                result.push({ color: stringColor, keyword: currentValue })
                return parseArg(current, true)
            }
            if (current.args) {
                if (!current.args[currentValue]) throw "Not in possible arguments"
                result.push({ color: variableColor, keyword: currentValue })
                return parseArg(current.args[currentValue] as Command, requiredDone)
            }

            result.push({ color: stringColor, keyword: currentValue })
            return parseArg(command, requiredDone)
        }

        parseArg(command)
    } catch (e) {
        console.log(e)

        do {
            result.push({ color: textColor, keyword: currentValue })
            currentValue = nextValue()
        } while (currentValue !== undefined)
    }

    console.log(result)
    return result
}