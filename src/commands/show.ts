import {Command} from "./commands";
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
        "project": { hasValue: true },
        "contact": { hasValue: false }
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