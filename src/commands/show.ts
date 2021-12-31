import {Argument, Command} from "./commands";
import {getPortfolio, Project} from "../project";
import {Terminal} from "../terminal";

const description =
`Show a specific resource.
To use it:
show [resource_type] [optional: resource_name]

Example:
show contact
show project project_name

Available resource type: 
project: followed by the project's name
contact: no additional parameter needed

If an information is needed, a project name for example, please see the list command
`

function projectAsString(project: Project) {
    return `{%center {%h1 {%color[green] ${project.name.toUpperCase()} %} %} %}`     + '\n' +
        `{%center {%color[green] Made with ${project.technologies.join(', ')} %} %}` + '\n' +
        ""                                                                           + '\n' +
        project.description
}

function showProject(terminal: Terminal, args: string[]): void {
    if (args.length < 2) {
        terminal.display("Missing argument 'project name'", true)
        return
    }

    const projectName = args[1].toLowerCase()
    const portfolio = getPortfolio()
    const project = portfolio.projects.find(project => project.name.toLowerCase() === projectName)
    if (project === undefined) {
        terminal.display(`Unable to find project '${projectName}'`, true)
        return
    }

    terminal.display(projectAsString(project), true)
}

function showContact(terminal: Terminal) {
    const portfolio = getPortfolio()
    const contact =
        `Name: ${portfolio.firstName} ${portfolio.lastName}` + '\n' +
        `E-mail: ${portfolio.mail}`                          + '\n' +
        `Github: ${portfolio.github}`

    terminal.display(contact, true)
}

export const show: Command = {
    short: "Show a specific resource (project, contact, ...)",
    description: description,
    hasValue: true,
    args: {
        "project": {
            hasValue: true,
            autocomplete(args: string[], trailingSpace: boolean): string[] {
                if (args.length > 1) return []
                const prefix = trailingSpace ? '' : ' '
                const projects = getPortfolio().projects.map(it => it.name)
                const arg = args[0]

                if (!arg) return projects.map(it => `${prefix}${it}`)
                return projects.filter(it => it.startsWith(arg))
            }
        },
        "contact": {
            hasValue: false,
            autocomplete: () => []
        }
    },

    autocomplete(args: string[], trailingSpace: boolean): string[] {
        const prefix = trailingSpace ? '' : ' '
        const availableArgs = Object.keys(this.args)
        const arg = args[0]
        if (!arg) {
            return availableArgs.sort().map(it => `${prefix}${it}`)
        }

        const targetCommand = this.args[arg] as (Argument | undefined)
        if (!targetCommand) {
            return availableArgs.filter(it => it.startsWith(arg)).sort()
        }

        return targetCommand.autocomplete(args.slice(1), trailingSpace)
    },

    execute(args: string[], terminal: Terminal): void {
        const resourceType = args[0]

        switch (resourceType) {
            case 'project':
                showProject(terminal, args)
                break;

            case 'contact':
                showContact(terminal)
        }
    },
}