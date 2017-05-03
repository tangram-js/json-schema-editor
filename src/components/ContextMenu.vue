<template>
  <div>
    <!-- A dummy context menu for sizing -->
    <ul
      class="context-menu__root"
      style="left: -1000px; top: -1000px;"
    >
      <context-menu-item
        v-for="item in menuItems"
        :key="item.id"
        :menu="item"
        :context="context"
      >
      </context-menu-item>
    </ul>
    <!-- Actual context menu -->
    <transition name="fade">
      <ul
        v-if="visible"
        class="context-menu__root"
        :style="styleObject"
        @contextmenu="contextMenu"
        @click="clicked"
      >
        <context-menu-item
          v-for="item in menuItems"
          :key="item.id"
          :menu="item"
          :context="context"
        >
        </context-menu-item>
      </ul>
    </transition>
  </div>
</template>
<script>
  import ContextMenuItem from './ContextMenuItem.vue'

  function generateId () {
    return (new Date()).getTime() + ('000000000' + Math.floor((Math.random() * 10000) + 1)).substr(-4)
  }

  function populateMenuId (menuItems) {
    menuItems.forEach(menu => {
      menu.id = generateId()
      if (Array.isArray(menu.menuItems)) populateMenuId(menu.menuItems)
    })
  }

  function resetDropLeft (menu) {
    menu.isDropLeft = false
    if (menu.menuItems) {
      menu.menuItems.forEach(item => {
        resetDropLeft(item)
      })
    }
  }

  export default {
    beforeMount () {
      // add click event handler to document to hide the context menu
      document.addEventListener('click', () => {
        this.hide()
      })
    },
    props: {
      menu: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        menuItems: [],
        context: this,
        source: null,
        styleObject: {},
        dummyId: '',
        visible: false
      }
    },
    methods: {
      clicked (e) {
        e.preventDefault()
        e.stopPropagation()
      },
      contextMenu (e) {
        e.preventDefault()
      },
      show (e, source, addons) {
        this.menuItems = [].concat(this.menu.menuItems)
        if (Array.isArray(addons)) {
          this.menuItems = this.menuItems.concat(addons)
        }
        populateMenuId(this.menuItems)
        this.source = source
        let style = {}
        // get size from dummy context menu
        let rect = this.$el.children[0].getBoundingClientRect()
        let autoH = rect.bottom - rect.top + 12
        // set position of context menu
        if ((e.pageY + autoH) > window.innerHeight) {
          style.top = (e.pageY - 20 - autoH) + 'px'
          style.left = (e.pageX - 13) + 'px'
        } else {
          style.top = (e.pageY + 10) + 'px'
          style.left = (e.pageX - 13) + 'px'
        }
        this.styleObject = style
        this.visible = true
        this.$nextTick(() => {
          this.$emit('retrieve-value')
        })
      },
      hide () {
        this.visible = false
        // notify all context menu items to hide
        resetDropLeft(this.menu)
      },
      menuSelected (payload) {
        this.$emit('select', payload)
      }
    },
    components: {
      ContextMenuItem
    }
  }
</script>
<style scoped>
  .context-menu__root {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    float: left;
    min-width: 160px;
    padding: 4px 0;
    margin: 1px 0 0;
    list-style: none;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    /*font-size: 14px;*/
    *border-right-width: 2px;
    *border-bottom-width: 2px;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    -webkit-background-clip: padding-box;
    -moz-background-clip: padding;
    background-clip: padding-box;
    text-align:left;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
</style>
