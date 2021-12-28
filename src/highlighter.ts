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

export interface Command extends Argument {
    args?: { [key: string]: Argument }
}

export interface Argument {
    hasValue: boolean,
    acceptedValues?: Set<string>
}

export interface ColoredKeyword extends Colored {
    keyword: string
}

const commands: { [key: string]: Command } = {
    "help": { hasValue: false },

    "list": {
        hasValue: true,
        acceptedValues: new Set<string>(["projects", "languages", "interests"])
    },

    "show": {
        hasValue: true,
        args: {
            "project": {
                hasValue: true
            },

            "contact": {
                hasValue: false
            }
        }
    }
}

export function highlightSyntax(args: string[]): ColoredKeyword[] {
    const result: ColoredKeyword[] = []

    if (args.length == 0) {
        return result
    }

    let i = 1
    try {
        const command: Command | null = commands[args[0]]
        if (!command) throw 'Unknown command'
        result.push({ color: importColor, keyword: args[0] })

        const parseArg = (current: Command & Argument, requiredDone = false): void => {
            const arg = args[i++]
            if (!arg) return

            if (arg.trim().length === 0) {
                result.push({ color: textColor, keyword: arg })
                return parseArg(current, requiredDone)
            }
            if (!current.hasValue) throw "No argument expected"
            if (current.acceptedValues && !current.acceptedValues.has(arg)) throw "Not in required values"
            if (current.acceptedValues && current.acceptedValues.has(arg)) {
                if (requiredDone) throw "Only one unnamed argument is accepted"

                result.push({ color: stringColor, keyword: arg })
                return parseArg(current, true)
            }
            if (current.args) {
                if (!current.args[arg]) throw "Not in possible arguments"
                result.push({ color: variableColor, keyword: arg })
                return parseArg(current.args[arg], requiredDone)
            }

            result.push({ color: stringColor, keyword: arg })
            return parseArg(command, requiredDone)
        }

        parseArg(command)
    } catch (e) {
        console.log(e)
        i--

        for (; i < args.length; ++i) {
            result.push({ color: textColor, keyword: args[i] })
        }
    }

    return result
}