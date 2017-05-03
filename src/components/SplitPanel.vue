<template>
  <div
    class="split-panel"
    :class="{ 'split-panel--unselectable': isResizing }"
    :style="containerStyle"
    @mousemove="resizing"
    @mouseup="stopResize"
  >
    <div class="split-panel__panel-container" :style="panel1Style">
      <slot name="panel1"></slot>
    </div>
    <div class="split-panel__panel-container" :style="panel2Style">
      <slot name="panel2"></slot>
    </div>
    <div class="split-panel__size-handle" :style="handleStyle" @mousedown="startResize"></div>
  </div>
</template>
<script>
  export default {
    created () {
      this.$root.$on('splitter-size-changed', this.sizeChanged)
      /*
      // register window resize event handler
      window.addEventListener('resize', () => {
        // only process resize event each 0.066 sec (about 15 fts)
        if (!this.timeout) {
          this.timeout = window.setTimeout(() => {
            this.timeout = null
            this.$root.$emit('splitter-size-changed', this.$root)
          }, 66)
        }
      })
      */
    },
    mounted () {
      this.panel1 = this.$el.children[0]
      this.panel2 = this.$el.children[1]
    },
    data () {
      return {
        containerWidth: 0,
        containerHeight: 0,
        SplitPosition: this.InitPosition,
        handlePosition: 1,
        isResizing: false,
        panel1: null,
        panel2: null,
        startPos: 0,
        diff: 0,
        timeout: null
      }
    },
    computed: {
      containerStyle () {
        var style = {}
        if (this.Width) style.width = this.Width + 'px'
        if (this.Height) style.height = this.Height + 'px'
        if (this.ShowBorder) style.border = '1px solid grey'
        if (this.Orientation === 'horizontal') style['flex-direction'] = 'column'
        return style
      },
      panel1Style () {
        var style = {}
        var border = this.ShowBorder ? 1 : 0
        if (this.Orientation === 'vertical') {
          style.width = (this.SplitPosition > 0 && this.containerWidth > 0) ? (this.SplitPosition - border) + 'px' : '50%'
          style.height = '100%'
        } else {
          style.width = '100%'
          style.height = (this.SplitPosition > 0 && this.containerHeight > 0) ? (this.SplitPosition - border) + 'px' : '50%'
        }
        return style
      },
      panel2Style () {
        var style = { 'flex': 1 }
        if (this.Orientation === 'vertical') {
          style.height = '100%'
        } else {
          style.width = '100%'
        }
        return style
      },
      handleStyle () {
        var pos
        if (this.isResizing) {
          pos = this.handlePosition
        } else {
          pos = this.SplitPosition
        }
        if (this.Orientation === 'vertical') {
          return {
            width: '2px',
            height: '100%',
            top: '0',
            left: pos + 'px',
            'border-left': '1px solid grey',
            cursor: 'col-resize'
          }
        } else {
          return {
            width: '100%',
            height: '2px',
            left: '0',
            top: pos + 'px',
            'border-top': '1px solid grey',
            cursor: 'row-resize'
          }
        }
      }
    },
    props: {
      Orientation: {
        type: String,
        default: 'vertical'
      },
      InitPosition: {
        type: Number
      },
      ShowBorder: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      validateSettings () {
        // validate the properties
        if (this.Orientation === 'vertical') {
          if (this.containerWidth) {
            if (this.SplitPosition) {
              if (this.SplitPosition > this.containerWidth - 10) this.SplitPosition = this.containerWidth - 10
            } else {
              this.SplitPosition = this.containerWidth / 2
            }
          }
        } else {
          if (this.containerHeight) {
            if (this.SplitPosition) {
              if (this.SplitPosition > this.containerHeight - 10) this.SplitPosition = this.containerHeight - 10
            } else {
              this.SplitPosition = this.containerHeight / 2
            }
          }
        }
      },
      setSize () {
        // setup init size and pos
        this.containerWidth = this.$el.offsetWidth
        this.containerHeight = this.$el.offsetHeight
        this.validateSettings()
        this.handlePosition = this.SplitPosition
        // console.log(`w: ${this.containerWidth}, h: ${this.containerHeight}, s: ${this.SplitPosition}`)
      },
      isParent (component) {
        if (component === this.$root) return true
        let parent = this.$parent
        while (parent !== this.$root) {
          if (parent === component) return true
          parent = parent.$parent
        }
        return false
      },
      sizeChanged (source) {
        // if parent's size changed then set size
        if (this.isParent(source)) {
          this.setSize()
          this.$nextTick(() => {
            // notify children to set size
            this.$root.$emit('splitter-size-changed', this)
          })
        }
      },
      startResize (e) {
        this.isResizing = true
        if (this.Orientation === 'vertical') {
          this.startPos = e.clientX
        } else {
          this.startPos = e.clientY
        }
        this.diff = 0
      },
      resizing (e) {
        var newPos
        if (!this.isResizing) return
        if (this.Orientation === 'vertical') {
          newPos = this.SplitPosition + (e.clientX - this.startPos)
          if (newPos > 10 && newPos < this.containerWidth - 10) {
            this.diff = e.clientX - this.startPos
            this.handlePosition = this.SplitPosition + this.diff
          }
        } else {
          newPos = this.SplitPosition + (e.clientY - this.startPos)
          if (newPos > 10 && newPos < this.containerHeight - 10) {
            this.diff = e.clientY - this.startPos
            this.handlePosition = this.SplitPosition + this.diff
          }
        }
      },
      stopResize () {
        if (!this.isResizing) return
        this.SplitPosition += this.diff
        this.handlePosition = this.SplitPosition
        this.isResizing = false
        this.$nextTick(() => {
          // notify children to set size
          this.$root.$emit('splitter-size-changed', this)
        })
      }
    }
  }
</script>
<style scoped>
  .split-panel {
    position: relative;
    box-sizing: border-box;
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    display: flex;
  }
  .split-panel__panel-container {
    box-sizing: border-box;
    border-collapse: collapse;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .split-panel__size-handle {
    position: absolute;
  }
  .split-panel--unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
