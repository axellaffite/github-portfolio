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
        const show = (res: Resource) => showResource(display, res)
        args.forEach(show)
    }
}

function showResource(display: (lines: string, interpret: boolean) => void, res: Resource): void {
    switch (res) {
        case 'projects':
            showProjects(display)
            break;

        default: break
    }
}

function showProjects(display: (lines: string, interpret: boolean) => void): void {
    const portfolio = getPortfolio()
    const projectsDescription = portfolio.projects.map(project => {
        return "----------------------------------------"       + '\n' +
            project.name.toUpperCase()                          + '\n' +
            "----------------------------------------"          + '\n' +
            "Technologies: " + project.technologies.join(", ")  + '\n' +
            project.short                                       + '\n'
    }).join('\n')

    display(projectsDescription, true)
}