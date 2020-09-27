// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded: page is fully loaded');
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

window.addEventListener('load', (event) => {
  console.log('load: page is fully loaded');
  querySelectorAll();
});

document.addEventListener('readystatechange', (event) => {
  console.log('readystatechange: page is fully loaded',  `readystate: ${document.readyState}`);
});

const electron = require('electron')
window.ipcRenderer = electron.ipcRenderer;
window.shell = electron.shell;
window.remoteBrowserWindow = electron.remote.BrowserWindow


function querySelectorAll() {
  let links = []

  links = document.querySelectorAll('a[href]')
  console.log('document',document)
  console.log('links',links)

  if (links.length !== 0) {
    Array.prototype.forEach.call(links, (link) => {
      const url = link.getAttribute('href')
      if (url.indexOf('http') === 0) {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          shell.openExternal(url)
        })
      }
    })
  }else {
    console.log('a标签节点为0个')
  }
}
