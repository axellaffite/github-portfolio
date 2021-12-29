import {Command} from "./commands";
import {getPortfolio} from "../project";

const description =
`List all available options for a specific resource.
To use it:
list [resource_name]

Replace [resource_name] with the resource you want to list.
Example:
list projects

Resource types available: projects, languages, interests`

type Resource = 'projects' | 'languages' | 'interests'
export const list: Command = {
    short: "List a resource (projects, interests, ...)",
    description: description,
    hasValue: true,
    acceptedValues: new Set<string>(["projects", "languages", "interests"]),

    execute(args: string[], display: (lines: string, interpret: boolean) => void): void {
        const show = (res: Resource) => listResource(display, res)
        args.forEach(show)
    }
}

function listResource(display: (lines: string, interpret: boolean) => void, res: Resource): void {
    switch (res) {
        case 'projects':
            listProjects(display)
            break;

        default: break
    }
}

function listProjects(display: (lines: string, interpret: boolean) => void): void {
    const portfolio = getPortfolio()
    const projectsDescription = portfolio.projects.map(project => {
        return `{%h2 ${project.name.toUpperCase()} %}`          + '\n' +
            `{%i ${project.short} %}`                           + '\n' +
            "Technologies: " + project.technologies.join(", ")  + '\n'
    }).join('\n')

    display(projectsDescription, true)
}