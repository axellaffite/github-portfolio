import {Command} from "./commands";
import {getPortfolio, Project} from "../project";

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
    return "----------------------------------------"       + '\n' +
        project.name.toUpperCase()                          + '\n' +
        "----------------------------------------"          + '\n' +
        "Technologies: " + project.technologies.join(', ')  + '\n' +
        ""                                                  + '\n' +
        project.description
}

function showProject(display: (lines: string, interpret: boolean) => void, args: string[]): void {
    if (args.length < 2) {
        display("Missing argument 'project name'", true)
        return
    }

    const projectName = args[1].toLowerCase()
    const portfolio = getPortfolio()
    const project = portfolio.projects.find(project => project.name.toLowerCase() === projectName)
    if (project === undefined) {
        display(`Unable to find project '${projectName}'`, true)
        return
    }

    display(projectAsString(project), true)
}

function showContact(display: (lines: string, interpret: boolean) => void) {
    const portfolio = getPortfolio()
    const contact =
        `Name: ${portfolio.firstName} ${portfolio.lastName}` + '\n' +
        `E-mail: ${portfolio.mail}`                          + '\n' +
        `Github: ${portfolio.github}`

    display(contact, true)
}

export const show: Command = {
    short: "Show a specific resource (project, contact, ...)",
    description: description,
    hasValue: true,
    args: {
        "project": { hasValue: true },
        "contact": { hasValue: false }
    },

    execute(args: string[], display: (lines: string, interpret: boolean) => void): void {
        const resourceType = args[0]

        switch (resourceType) {
            case 'project':
                showProject(display, args)
                break;

            case 'contact':
                showContact(display)
        }
    },
}