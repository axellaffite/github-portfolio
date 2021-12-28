interface SplitState {
    index: number
    finished: boolean
    splitter: SplitterState
    result: string[]
    buffer: string
    currentChar: () => string
    nextChar: () => string
    next: () => SplitState
}

type SplitterState = (state: SplitState) => SplitState

const initialState: SplitterState = function(state: SplitState): SplitState {
    const c = state.currentChar()
    switch (c) {
        case ''   : return { ...state, finished: true }
        case ' '  : // Same case as \t
        case '\t' : return { ...state, splitter: spaceState }
        case "'"  : return { ...state, splitter: stringState, buffer: c, index: state.index + 1 }
        default   : return { ...state, splitter: wordState }
    }
}

const spaceState: SplitterState = function(state: SplitState): SplitState {
    const c = state.currentChar()
    switch (c) {
        case ''   : return { ...state, finished: true }
        case ' '  : // Same case as \t
        case '\t' : return { ...state, result: state.result.concat(' '), index: state.index + 1 }
        case "'"  : return { ...state, splitter: stringState, buffer: c, index: state.index + 1 }
        default   : return { ...state, splitter: wordState }
    }
}

const wordState: SplitterState = function(state: SplitState): SplitState {
    const c = state.currentChar()
    switch (c) {
        case ''   : // Same as space
        case '\t' : // Same as space
        case ' '  : return {
            ...state,
            finished : c === '',
            result   : state.buffer === '' ? state.result : state.result.concat(state.buffer),
            buffer   : '',
            index    : state.index,
            splitter : spaceState
        }

        default: return {
            ...state,
            buffer : state.buffer + c,
            index  : state.index + 1
        }
    }
}

const stringState: SplitterState = function(state: SplitState): SplitState {
    const c = state.currentChar()
    switch (c) {
        case "'": return {
            ...state,
            index    : state.index + 1,
            buffer   : '',
            result   : state.buffer === '' ? state.result : state.result.concat(state.buffer + c),
            splitter : spaceState
        }
        case '' :  return { ...state, index: state.index + 1, splitter: spaceState, result: state.result.concat(state.buffer), finished: true }
        case '\\': return { ...state, index: state.index + 1, splitter: escapedState }
        default  : return { ...state, index: state.index + 1, buffer: state.buffer + c }
    }
}

const escapedState: SplitterState = function(state: SplitState): SplitState {
    const c = state.currentChar()
    if (c == '') throw "Missing character after escape character"
    return { ...state, buffer: state.buffer + c, index: state.index + 1, splitter: stringState }
}

function createState(command: string): SplitState {
    return {
        index: 0,
        finished: command.length === 0,
        splitter: initialState,
        result: [],
        buffer: '',
        currentChar: function () { return command.charAt(this.index) },
        nextChar: function() { return command.charAt(this.index + 1) },
        next: function(): SplitState { return this.splitter(this) }
    }
}

export function splitCommand(command: string): string[] {
    let state = createState(command)

    while (!state.finished) {
        state = state.next()
    }

    return state.result
}