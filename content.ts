import { sendToBackground } from '@plasmohq/messaging'
import styleText from 'data-text:./style.css'
import type {PlasmoCSConfig} from 'plasmo'

export const config: PlasmoCSConfig = {
  exclude_matches: ["https://github.com/*"]
}

const popup = document.createElement('div')
popup.className = 'hvcard'
popup.style.position = 'absolute'
popup.style.display = 'none'
document.body.appendChild(popup)

const appendStyles = () => {
  const s = document.createElement('style')
  s.textContent = styleText
  document.head.appendChild(s)
}

const createHovercard = (html: string, e: MouseEvent) => {
  popup.innerHTML = html
  popup.style.left = e.pageX + 16 + 'px'
  popup.style.top = e.pageY + 16 + 'px'
  popup.style.display = 'block'
}

const isRepoLink = (el: HTMLElement): el is HTMLLinkElement => {

  const isLink = el.tagName === 'A';
  const validRepoLink =  (href: string) => {
    const count = (href.match(new RegExp('/', 'g')) || []).length
    return count === 4
  }
  if (isLink) {
    const linkEl = el as HTMLLinkElement;
    return linkEl.href.startsWith('https://github.com') && validRepoLink(linkEl.href)
  }

  return false
}

window.addEventListener('mouseover', (event) => {
  const element = event.target as HTMLElement
  if (isRepoLink(element)) {
    const repo = element.href
    .split('/')
    .splice(3, 2)
    .join('/');

    
    sendToBackground({
      name: 'fetchHovercard',
      body: {
        repo: repo 
      }
    })
      .then(data => data.message)
      .then(html => {
        createHovercard(html, event)
        element.addEventListener('mouseout', () => {
          popup.innerHTML = ''
          popup.style.display = 'none'
        })
      })
  }
})

appendStyles()
