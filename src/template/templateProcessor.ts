import {colors} from "../colors";

function escapeHTML(html: string) {
    let escape = document.createElement('textarea');
    escape.textContent = html;
    const result = escape.innerHTML;
    escape.remove()
    return result
}

export function processTemplates(text: string): string {
    return escapeHTML(text)
        .replace(/{%img(\[(.*?)\])? (.*?) %}/g, (_, __, cls, url) => {
            return `<a href="${url}" target="_blank"><img class="${(cls ?? '').replace(/,/g, ' ')}" src="${url}"</a>`
        })
        .replace(/{%url(\[(.*?)\])? (.*?) %}/g, (_, __, rplc, url) => {
            return `<a href="${url}" target="_blank">${rplc ?? url}</a>`
        })
        .replace(/{%video(\[(.*?)\])? (.*?) %}/g, (_, __, cls, url) => {
            return `<video controls src="${url}" class="${(cls ?? '').replace(/,/g, ' ')}"></video>`
        })
        .replace(/{%color\[(.*?)\] (.*?) %}/g, (_, clr, m) => {
            const color: string = (clr as string).startsWith('#')
                ? clr
                : ((colors as any)[clr]) ?? colors.default
            return `<span style="color: ${color}">${m}</span>`
        })
        .replace(/{%h(\d) (.*?) %}/g, (_, lvl, m) => `<h${lvl}>${m}</h${lvl}>`)
        .replace(/{%b (.*?) %}/g, (_, m) => `<span class="bold-text">${m}</span>`)
        .replace(/{%i (.*?) %}/g, (_, m) => `<span class="italic-text">${m}</span>`)
        .replace(/{%center (.*?) %}/g, (_, m) => `<span class="center">${m}</span>`)
        .replace(/{%evenly (.*?) %}/g, (_, m) => `<span class="evenly">${m}</span>`)

}