# Portfolio
This portfolio is an interactive terminal. You can type commands and it execute them.

## Available commands
### clear
Simply clears the terminal.

### help
This commands simply shows a help dialog.  
It explains how different commands work and which are available.  

### list
This is used to list a resource.  
Resources can be projects, interest or any other things.

### show
This is used to display a resource.  
For example, `show project 'EDT UT3'` will show the project `EDT UT3`
if its present in the projects.

## How does it work
### Syntax highlight
This part simply works by knowing which commands are available
and which parameters they accept.  
Highlighting logic: 
 - `red` prompt color
 - `white` means that the keyword isn't known / accepted by the system
 - `pink` means the keyword is known by the system
 - `blue` means the keyword is an accepted parameter by the current command
 - `green` means the keyword is accepted as a value by the current command

This logic only applies to the command interpreter, not for the 
text that is being showed by the programs.

### Template language
A template language is used to describe projects in the `assets/data.yaml` file.
Some options are available to stylish the output of the interpreter :
 - `{%img http::/url-to-image.com %}` is used to display an image from a url
 - `{%b text %}` is used to display a text in **bold**
 - `{%i text %}` is used to display a text in italic
 - `{%url http://url.com %}` is used to display a text as an url
 - `{%color[hex or name] text %}` is used to display a colored text

#### Available colors

<div style="color: white">
    <span style="padding: 0.5em; background:#282C34">dark-grey</span>
    <span style="padding: 0.5em; background:#1b2b34">deep-blue</span>
    <span style="padding: 0.5em; background:#ec5f67">mandy</span>
    <span style="padding: 0.5em; background:#e78a4e">orange</span>
    <span style="padding: 0.5em; background:#d16d92">pink</span>
    <span style="padding: 0.5em; background:#d8a657">yellow</span>
    <span style="padding: 0.5em; background:#a9b665">green</span>
    <span style="padding: 0.5em; background:#62b3b2">tradewind</span>
    <span style="padding: 0.5em; background:#6699cc">blue</span>
    <span style="color: black; padding: 0.5em; background:#ffffff">white</span>
    <span style="padding: 0.5em; background:#62b3b2">default</span>
</div>