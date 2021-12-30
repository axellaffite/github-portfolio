import {load} from "js-yaml"

export interface Portfolio {
    initialMessage: string,
    firstName: string,
    lastName: string,
    mail: string,
    github: string
    projects: Project[],
    languages: string[]
}

export interface Project {
    name: string,
    short: string,
    technologies: string[],
    description: string
}

let portfolio: Portfolio

export async function loadPortfolio() {
    async function download(iteration = 0): Promise<string | null> {
        if (iteration == 4) return null

        const response = await fetch("assets/data.yaml")
        return response.ok
            ? await response.text()
            : download(iteration + 1)
    }

    const text = await download()
    if (text == null) {
        throw "Unable to download the portfolio data, please try again later !"
    }

    portfolio = load(text) as Portfolio
}

export const getPortfolio = () => portfolio