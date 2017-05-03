<template>
  <li :class="{ 'context-menu__submenu': menu.menuItems, 'context-menu__header': isHeader, 'context-menu__divider': isDivider, 'disabled': disabled }"
    @mouseenter="mouseEnter"
  >
    <component :is="type" :menu="menu" :context="context"></component>
    <ul
      v-if="menu.menuItems"
      class="context-menu__menu"
      :class="{ 'drop-left': isDropLeft }"
    >
      <context-menu-item
        v-for="item in menu.menuItems"
        :key="item.id"
        :menu="item"
        :context="context"
      >
      </context-menu-item>
    </ul>
  </li>
</template>
<script>
  import menuItems from './context-menu-items'

  export default {
    name: 'context-menu-item',
    props: {
      menu: {
        type: Object,
        required: true
      },
      context: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        isDropLeft: false
      }
    },
    computed: {
      type () {
        return this.menu.type || 'button-menu-item'
      },
      isHeader () {
        return this.menu.type === 'header-menu-item'
      },
      isDivider () {
        return this.menu.type === 'divider-menu-item'
      },
      disabled () {
        if (typeof this.menu.disabled === 'function') return this.menu.disabled(this.context.source)
        return this.menu.disabled
      }
    },
    methods: {
      mouseEnter () {
        if (!this.menu.menuItems || this.isDropLeft) return
        let sub = this.$el.children[1]
        let rect = sub.getBoundingClientRect()
        if (rect.right > window.innerWidth) {
          this.isDropLeft = true
        } else {
          this.isDropLeft = false
        }
      }
    },
    components: menuItems
  }
</script>
<style scoped>
  .context-menu__icon {
    vertical-align: middle;
  }
  .context-menu__header {
    display: block;
    padding: 4px 15px;
    font-size: 120%;
    font-weight: bold;
    line-height: 20px;
    color: #999;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
  }
  .context-menu__menu {
    display: none;
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
  .context-menu__menu .context-menu__divider, .context-menu__root .context-menu__divider {
    *width: 100%;
    height: 2px;
    margin: 6px 1px;
    *margin: -5px 0 5px;
    overflow: hidden;
    background-color: #e5e5e5;
    border-bottom: 1px solid #ffffff;
  }
  .context-menu__menu a, .context-menu__root a {
    display: block;
    padding: 2px 20px;
    clear: both;
    font-weight: normal;
    line-height: 20px;
    color: #333333;
    white-space: nowrap;
    text-decoration: none;
    cursor: default;
  }
  .context-menu__menu li > a:hover, .context-menu__menu li > a:focus,
  .context-menu__root li > a:hover, .context-menu__root li > a:focus,
  .context-menu__submenu:hover > a {
    color: #ffffff;
    text-decoration: none;
    background-color: #99deff;
    background-image: -moz-linear-gradient(top, #99deff, #00a4e5);
    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#99deff), to(#00a4e5));
    background-image: -webkit-linear-gradient(top, #99deff, #00a4e5);
    background-image: -o-linear-gradient(top, #99deff, #00a4e5);
    background-image: linear-gradient(to bottom, #99deff, #00a4e5);
    background-repeat: repeat-x;
    filter: progid: dximagetransform.microsoft.gradient(startColorstr='#ff0088cc', endColorstr='#ff0077b3', GradientType=0);
  }
  .context-menu__menu .active > a, .context-menu__menu .active > a:hover,
  .context-menu__root .active > a, .context-menu__root .active > a:hover {
    color: #ffffff;
    text-decoration: none;
    background-color: #99deff;
    background-image: linear-gradient(to bottom, #99deff, #00a4e5);
    background-image: -moz-linear-gradient(top, #99deff, #00a4e5);
    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#99deff), to(#00a4e5));
    background-image: -webkit-linear-gradient(top, #99deff, #00a4e5);
    background-image: -o-linear-gradient(top, #99deff, #00a4e5);
    background-repeat: repeat-x;
    outline: 0;
    filter: progid: dximagetransform.microsoft.gradient(startColorstr='#ff0088cc', endColorstr='#ff0077b3', GradientType=0);
  }
  .context-menu__menu .disabled > a, .context-menu__menu .disabled > a:hover,
  .context-menu__root .disabled > a, .context-menu__root .disabled > a:hover {
    color: #999999;
  }
  .context-menu__menu .disabled > a:hover, .context-menu__root .disabled > a:hover {
    text-decoration: none;
    cursor: default;
    background-color: transparent;
  }
  .context-menu__submenu {
    position: relative;
  }
  .context-menu__submenu > .context-menu__menu {
    top: 0;
    left: 100%;
    margin-top: -6px;
    margin-left: -1px;
    -webkit-border-radius: 0 6px 6px 6px;
    -moz-border-radius: 0 6px 6px 6px;
    border-radius: 0 6px 6px 6px;
  }
  .context-menu__submenu > .context-menu__menu.drop-left{
    left:-100%;
  }
  .context-menu__submenu:hover .context-menu__menu {
    display: block;
  }
  .context-menu__submenu > a:after {
    display: block;
    float: right;
    width: 0;
    height: 0;
    margin-top: 5px;
    margin-right: -10px;
    border-color: transparent;
    border-left-color: #cccccc;
    border-style: solid;
    border-width: 5px 0 5px 5px;
    content: " ";
  }
  .context-menu__submenu:hover > a:after {
    border-left-color: #ffffff;
  }
</style>
