import {Argument, Command, commands} from "./commands";

export const backgroundColor = '#282C34';
export const background_bisColor = '#1b2b34';
export const keywordColor = '#ec5f67';
export const keyword_bisColor = '#e78a4e';
export const importColor = '#d16d92';
export const attributeColor = '#d8a657';
export const stringColor = '#a9b665';
export const variable_paramColor = '#62b3b2';
export const variableColor = '#6699cc';
export const textColor = '#ffffff';

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