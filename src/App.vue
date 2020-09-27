<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted(){
    this.querySelectorAllahref()
    this.observerBodyChange()

  },
  methods:{
    observerBodyChange(){
      let _this = this

      // Select the node that will be observed for mutations
      const targetNode = document.getElementById('body');

      // Options for the observer (which mutations to observe)
      const config = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true
      };

      // Callback function to execute when mutations are observed
      const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
          console.log('mutation',mutation)
          if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
            _this.querySelectorAllahref()
          }
          else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
          }
        }
      };

      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);

      // Later, you can stop observing
      // observer.disconnect();

    },
    querySelectorAllahref() {

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
        alert('a标签节点获取失败')
      }
    }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
