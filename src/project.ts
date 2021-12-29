import {load} from "js-yaml"

export interface Portfolio {
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
    const response = await fetch("assets/data.yaml")
    const text = await response.text()
    portfolio = load(text) as Portfolio
}

export const getPortfolio = () => portfolio