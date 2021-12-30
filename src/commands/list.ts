import {Command} from "./commands";
import {getPortfolio} from "../project";
import {Terminal} from "../terminal";

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

    execute(args: string[], terminal: Terminal): void {
        const show = (res: Resource) => listResource(terminal, res)
        args.forEach(show)
    }
}

function listResource(terminal: Terminal, res: Resource): void {
    switch (res) {
        case 'projects':
            listProjects(terminal)
            break;

        default: break
    }
}

function listProjects(terminal: Terminal): void {
    const portfolio = getPortfolio()
    const projectsDescription = portfolio.projects.map(project => {
        return `{%center {%h2 {%color[green] ${project.name.toUpperCase()} %} %} %}`    + '\n' +
            `{%center ${project.short} %}`                                              + '\n' +
            `{%center Technologies: ${project.technologies.join(", ")} %} `             + '\n'
    }).join('\n')

    terminal.display(projectsDescription, true)
}