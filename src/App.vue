<template>
  <div id="app">
    <div class="layout" v-if="!isStartInitProject">
      <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
        <Menu :active-name="'1-1'" :theme="'dark'" :width="'auto'" :open-names="['1']">
          <Submenu name="1" :to="'/home'">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              客户列表
            </template>
            <MenuItem name="1-1" :to="'/'">首页</MenuItem>
            <MenuItem name="1-2" :to="'/customerList'">客户列表</MenuItem>
          </Submenu>
          <!--<Submenu name="2">-->
            <!--<template slot="title">-->
              <!--<Icon type="ios-keypad"></Icon>-->
              <!--Item 2-->
            <!--</template>-->
            <!--<MenuItem name="2-1">Option 1</MenuItem>-->
            <!--<MenuItem name="2-2">Option 2</MenuItem>-->
          <!--</Submenu>-->
        </Menu>
      </Sider>
      <Layout :style="{marginLeft: '200px'}">
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"></Header>
        <Content :style="{padding: '0 16px 16px'}">
          <Card :style="{marginTop: '24px'}">
            <div style="min-height: 80vh">
              <router-view/>
            </div>
          </Card>
        </Content>
      </Layout>
    </div>
    <initProject v-if="isStartInitProject"></initProject>
  </div>
</template>

<script>
import {Breadcrumb, Content, Layout, Sider, MenuItem, BreadcrumbItem, Submenu, Icon} from 'view-design';
import initProject from './components/initProject'

export default {
  name: 'App',
  components: {
    Breadcrumb,
    Content,
    Layout,
    Sider,
    MenuItem,
    BreadcrumbItem,
    Submenu,
    Icon,
    initProject
  },
  data(){
    return{
        isStartInitProject: false
    }
  },
  mounted(){
    this.querySelectorAllahref();
    this.observerBodyChange();
    this.checkInitProject();

    ipcRenderer.on('resize-window', (event, arg) => {
      // console.log('resize-window', event, arg)
    })

  },
  methods:{
    checkInitProject(){ // 检查是否需要初始化项目
      const isStartInitProject = ipcRenderer.sendSync('check_init_project', null)
      this.isStartInitProject = isStartInitProject
    },
    observerBodyChange(){
      let _this = this;

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
          // console.log('mutation',mutation)
          if (mutation.type === 'childList') {
            // console.log('A child node has been added or removed.');
            _this.querySelectorAllahref()
          }
          else if (mutation.type === 'attributes') {
            // console.log('The ' + mutation.attributeName + ' attribute was modified.');
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
      // console.log('document',document)
      // console.log('links',links)

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

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}

.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
</style>
