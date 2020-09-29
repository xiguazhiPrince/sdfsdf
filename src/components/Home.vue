<template>
  <div class="hello">
    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>首页</BreadcrumbItem>
    </Breadcrumb>
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank">
          Core Docs
        </a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank">
          Forum
        </a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank">
          Community Chat
        </a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank">
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a href="http://vuejs-templates.github.io/webpack/" target="_blank">
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a href="http://router.vuejs.org/" target="_blank">
          vue-router
        </a>
      </li>
      <li>
        <a href="http://vuex.vuejs.org/" target="_blank" >
          vuex
        </a>
      </li>
      <li>
        <a href="http://vue-loader.vuejs.org/" target="_blank">
          vue-loader
        </a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank">
          awesome-vue
        </a>
      </li>
    </ul>
    <Button @click="show">发送ipcRenderer消息</Button>
    <Button @click="create">创建子窗口</Button>
    <Button @click="function() {
        $router.push({
            path: '/customerList',
            query: {}
        });
    }">客户列表</Button>

    <div id="aaa">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted(){
    setTimeout(()=>{
      var aaa = document.getElementById('aaa');
      var html;
      html=document.createElement('a');
      html.setAttribute('href', 'www.baidu.com');
      html.style.display='block';
      html.innerText='测试dom节点更新后是否能检测到';
      aaa.appendChild(html)
    },5000)
  },
  methods:{
    show(){
      console.log('windoes',window)
      console.log('ipcRenderer',ipcRenderer)
      // shell.openExternal('http://electron.atom.io')
      // ipcRenderer.send('show-context-menu')
    },
    create(){

      let win = new remoteBrowserWindow({ width: 400, height: 320 })

      win.on('close', () => { win = null })
      // win.loadURL(modalPath)
      win.show()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
