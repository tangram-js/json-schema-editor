<template xmlns:v-on="">
  <div class="json-schema-editor">
    <div class="container" :style="containerStyle">
      <split-panel ref="splitPanel" orientation="vertical" :show-border="false" :init-position="180">
        <split-panel orientation="horizontal" :show-border="false" :init-position="400" slot="panel1">
          <div class="panel" slot="panel1">
            <toolbox
              ref="toolbox"
              :components="componentData"
              :options="toolboxOptions"
              v-on:dragged="startDrag"
            ></toolbox>
          </div>
          <div class="user-schemas__panel" slot="panel2">
            <div class="user-schemas__container">
              <div class="user-schemas__toolbox-container">
                <toolbox
                  ref="userSchemas"
                  :options="userSchemasOptions"
                  v-on:dragged="startDrag"
                  v-on:select="userSchemaSelected = true"
                ></toolbox>
              </div>
              <div class="user-schemas__buttons-container">
                <md-button
                  class="md-dense user-schemas__button"
                  :disabled="!signIn"
                  @click.native="saveSchema"
                >Save Schema</md-button>
                <md-button
                  class="md-dense user-schemas__button"
                  :disabled="loadAndDeleteDisabled"
                  @click.native="loadSchema()"
                >Load Schema</md-button>
                <md-button
                  class="md-dense user-schemas__button"
                  :disabled="loadAndDeleteDisabled"
                  @click.native="deleteSchema"
                >Delete Schema</md-button>
                <md-button
                  class="md-dense user-schemas__button"
                  :disabled="!signIn"
                  @click.native="importSchema"
                >Import Schema</md-button>
              </div>
            </div>
          </div>
        </split-panel>
        <split-panel orientation="vertical" :show-border="false" :init-position="380" slot="panel2">
          <div class="panel" slot="panel1">
            <tree
              ref="tree"
              :options="treeOptions"
              v-on:context="contextMenu"
              v-on:select="select"
              v-on:rename="updated"
              v-on:beforeappend="beforeAppend"
              v-on:append="updated"
              v-on:remove="removed"
              v-on:moveup="updated"
              v-on:movedown="updated"
            ></tree>
          </div>
          <split-panel orientation="vertical" :show-border="false" :init-position="440" slot="panel2">
            <div class="panel" slot="panel1">
              <property-inspector ref="propertyInspector" v-on:updated="updated"></property-inspector>
            </div>
            <div class="json-schema-content__panel" slot="panel2">
              <div class="json-schema-content__container">
                <div class="json-schema-content__textarea-container">
                  <textarea
                    ref="jsonSchemaContent"
                    class="json-schema-content__textarea"
                    readonly="readonly"
                    v-model="jsonSchemaContent"
                  ></textarea>
                </div>
                <div class="json-schema-content__buttons-container">
                  <div class="json-schema-content__button-bar">
                    <md-button
                      class="md-dense json-schema-content__button"
                      @click.native="newSchema"
                    >New Schema</md-button>
                    <md-button
                      class="md-dense json-schema-content__button"
                      :disabled="undoDisabled"
                      @click.native="undo"
                    >Undo</md-button>
                    <md-button
                      class="md-dense json-schema-content__button"
                      :disabled="redoDisabled"
                      @click.native="redo"
                    >Redo</md-button>
                  </div>
                  <div class="json-schema-content__button-bar">
                    <md-button
                      class="md-dense json-schema-content__button"
                      @click.native="copyJsonSchemaToClipboard"
                    >Copy to Clipboard</md-button>
                    <md-button
                      class="md-dense json-schema-content__button"
                      @click.native="downloadJsonSchemaToFile"
                    >Download to File</md-button>
                    <a
                      ref="downloadLink"
                      :download="downloadFilename"
                      :href="downloadLink"
                      style="display: none;"
                    ></a>
                    <md-button
                      class="md-dense json-schema-content__button"
                      @click.native="loadJsonSchemaFromFile"
                    >Load from File</md-button>
                  </div>
                </div>
              </div>
            </div>
          </split-panel>
        </split-panel>
      </split-panel>
    </div>
    <context-menu ref="context" :menu="menuData" v-on:select="menuSelected"></context-menu>
    <md-dialog-alert
      ref="alert"
      :md-title="alert.title"
      :md-content="alert.content"
      :md-ok-text="alert.ok"
    ></md-dialog-alert>
    <md-dialog-confirm
      ref="confirm"
      :md-title="confirm.title"
      :md-content="confirm.content"
      :md-ok-text="confirm.ok"
      :md-cancel-text="confirm.cancel"
      @close="confirmClosed"
    ></md-dialog-confirm>
    <md-snackbar
      ref="snackbar"
      :md-duration="snackbar.duration"
      v-on:open="snackbar.visible=true"
      v-on:close="snackbar.visible=false"
    >
      <span>{{snackbar.content}}</span>
      <md-spinner v-if="snackbar.showSpinner" md-indeterminate :md-size="20"></md-spinner>
      <md-button primary @click.native="hideSnackbar">Close</md-button>
    </md-snackbar>
    <md-dialog ref="loadSchemaDialog">
      <md-dialog-title>Load schema from file</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <label>Upload Json Schema File</label>
          <md-file v-model="uploadFilename" placeholder="Select json schema files" :multiple="multipleUpload" @selected="getUploadFiles($event)"></md-file>
        </md-input-container>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click.native="loadJsonSchemaFromFileCanceled">Cancel</md-button>
        <md-button class="md-primary" @click.native="loadJsonSchemaFromFileConfirmed">Confirm</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import SplitPanel from './SplitPanel.vue'
import Toolbox from './Toolbox.vue'
import Tree from './Tree.vue'
import ContextMenu from './ContextMenu.vue'
import PropertyInspector from './json-schema-editor/PropertyInspector.vue'
import iconModule from './icon-module'
import {
  convertTreeToSchema,
  convertSchemaToTree,
  authentication,
  repository,
  componentData,
  treeData,
  menuData
} from './json-schema-editor'

function cloneNode (source) {
  // skip json schema from cloning
  if (source.type === 'jsonSchema') source = source.children[0]
  let node = {}
  if (source) {
    Object.keys(source).forEach(p => {
      if (p !== 'id' && p !== 'tooltip' && p !== 'children' && typeof source[p] !== 'undefined') {
        node[p] = JSON.parse(JSON.stringify(source[p]))
      }
    })
    node.funcs = source.funcs
    if (source.children) {
      node.children = []
      source.children.forEach(child => {
        node.children.push(cloneNode(child))
      })
    }
  }
  return node
}

function cloneTree (source) {
  let node = {}
  Object.keys(source).forEach(p => {
    if (p !== 'parent' && p !== 'children' && typeof source[p] !== 'undefined') {
      node[p] = JSON.parse(JSON.stringify(source[p]))
    }
  })
  node.funcs = source.funcs
  if (source.children) {
    node.children = []
    source.children.forEach(child => {
      node.children.push(cloneTree(child))
    })
  }
  return node
}

var clipboard = {}

export default {
  name: 'JsonSchemaEditor',
  created () {
    this.repository = repository
    this.setContainerHeight()
    // register window resize event handler
    window.addEventListener('resize', () => {
      // only process resize event each 0.066 sec (about 15 fts)
      if (!this.timeout) {
        this.timeout = window.setTimeout(() => {
          this.timeout = null
          this.setContainerHeight()
        }, 66)
      }
    })
    // setup after 1 sec
    window.setTimeout(this.setup, 1000)
  },
  mounted () {
    // adjust split panel size
    this.$refs.splitPanel.sizeChanged(this)
  },
  data () {
    return {
      signIn: true,
      repository: null,
      containerHeight: 400,
      // data for toolbox
      toolboxOptions: {
        iconModule: iconModule,
        clipboard: clipboard
      },
      userSchemasOptions: {
        iconModule: iconModule,
        clipboard: clipboard,
        showTypeName: false
      },
      userSchemaSelected: false,
      // custom schema list
      schemaList: [],
      // data for tree
      treeOptions: {
        editable: true,
        iconModule: iconModule,
        clipboard: clipboard,
        dragOverRule: this.dragOverRule
      },
      // data for json schema content
      jsonSchemaContent: '{}',
      downloadLink: null,
      downloadFilename: null,
      // data for init menu and toolbox
      menuData: menuData,
      componentData: componentData,
      // data for dialogs
      alert: {
        title: 'title',
        content: 'content',
        ok: 'OK'
      },
      confirm: {
        title: 'title',
        content: 'content',
        ok: 'Confirm',
        cancel: 'Cancel',
        callback: null
      },
      snackbar: {
        content: 'content',
        duration: 90000,
        showSpinner: false,
        visible: false
      },
      // data for undo/redo
      treeDataBackups: [],
      currentVersionNo: 0,
      // data for upload files
      uploadFilename: null,
      multipleUpload: false,
      uploadFiles: null
    }
  },
  computed: {
    containerStyle () {
      return { 'height': `${this.containerHeight}px` }
    },
    undoDisabled () {
      return this.currentVersionNo === 0
    },
    redoDisabled () {
      return this.currentVersionNo === (this.treeDataBackups.length - 1)
    },
    loadAndDeleteDisabled () {
      return !this.signIn || !this.userSchemaSelected
    }
  },
  methods: {
    async setup () {
      // retrieve current user
      try {
        await authentication.retrieveCurrentUser()
      } catch (err) {
      }
      if (authentication.currentUser === null) {
        this.signIn = false
        this.$nextTick(() => {
          this.alert.title = 'User not sign in'
          this.alert.content = 'User can not retrieve and store custom schema, please sign in to access these features.'
          this.$refs.alert.open()
        })
      }
      if (this.signIn) {
        // display loading notification
        this.showSnackbar('Loading custom schemas', 90000, true)
        await this.repository.init()
        // retrieve types
        try {
          this.schemaList = await this.repository.retrieveTypes()
        } catch (err) {
          console.log(`Retrieve types error: ${err.message}`)
          this.showSnackbar(`Retrieve custom schema types error: ${err.message}`, 4000)
        }
        // retrieve all user schemas and init user schemas toolbox
        try {
          let schemaList = await this.repository.retrieveAllSchemas()
          schemaList.forEach(schema => {
            let tree = convertSchemaToTree(schema, schema.schemaName)
            this.$refs.userSchemas.append(tree)
          })
        } catch (err) {
          console.log(`Retrieve all schemas error: ${err.message}`)
          this.showSnackbar(`Retrieve custom schemas error: ${err.message}`, 4000)
        }
        // init tree data
        if (this.$route.query.schema) {
          let loadOk = await this.loadSchemaConfirmed(true, this.$route.query.schema)
          if (!loadOk) {
            this.newSchemaConfirmed(true)
          }
        } else {
          this.newSchemaConfirmed(true)
        }
        // close loading notification
        this.$refs.snackbar.close()
      } else {
        // init tree data
        this.newSchemaConfirmed(true)
      }
    },
    confirmClosed (result) {
      if (typeof this.confirm.callback === 'function') {
        this.confirm.callback(result === 'ok')
      }
    },
    showSnackbar (content, duration, showSpinner) {
      if (this.snackbar.visible) this.$refs.snackbar.close()
      this.snackbar.content = content
      this.snackbar.duration = typeof duration === 'undefined' ? 5000 : duration
      this.snackbar.showSpinner = typeof showSpinner === 'undefined' ? false : showSpinner
      this.$refs.snackbar.open()
    },
    hideSnackbar () {
      this.$refs.snackbar.close()
    },
    setContainerHeight () {
      this.containerHeight = window.innerHeight - 60
    },
    // method for drag over in tree
    dragOverRule (dest, source) {
      if (typeof dest.funcs.accept === 'function') return dest.funcs.accept(dest, source)
    },
    // method for display context menu
    contextMenu (e, source) {
      // populate additional menu items
      let dest = source.node
      let addons = [] // additional menu items
      // if editable then add rename menu item
      if (dest.editable) {
        addons.push({
          name: 'rename',
          type: 'text-input-menu-item',
          label: 'Rename',
          getValue: source => {
            return source.node.name
          },
          setValue: (source, name) => {
            source.name = name
            source.changeName()
          }
        })
      }
      // add append buttons
      if (dest.funcs && typeof dest.funcs.acceptList === 'function') {
        // retrieve available child
        let types = dest.funcs.acceptList(dest)
        if (types.length > 0) {
          let selections = [{ value: '', label: '' }]
          // add append menu items
          types.forEach(t => {
            selections.push({ value: t, label: t })
          })
          addons.push({
            name: 'append',
            type: 'select-menu-item',
            label: 'Append',
            getValue: source => {
              return ''
            },
            setValue: (source, value) => {
              // append specific component to source
              let component = this.$refs.toolbox.retrieve(value)
              source.append(cloneNode(component))
            },
            selectItems: selections
          })
        }
      }
      // for jason schema, add save schema button
      if (dest.type === 'jsonSchema') {
        addons.push({
          name: 'saveSchema',
          label: 'Save Schema',
          action: source => {
            this.saveSchema()
          }
        })
      }
      // for ref, add select type menu item
      if (dest.type === 'ref') {
        let props = [{ value: '', label: '' }]
        this.schemaList.forEach(type => {
          props.push({ value: type, label: type })
        })
        addons.push({
          name: 'selectReferencedType',
          type: 'select-menu-item',
          label: 'Select Referenced Schema',
          getValue: source => {
            return source.node.value['$ref'].replace(/repository:\/\//i, '')
          },
          setValue: (source, value) => {
            // update value of ref
            source.node.value['$ref'] = `repository://${value}`
            // update property inspector and json schema content
            this.valueUpdated(source.node)
          },
          selectItems: props
        })
      }
      // for dependencyItem, add select property menu item
      if (dest.type === 'dependencyItem') {
        // populate available properties
        let properties = dest.parent.parent.children.find(element => {
          return element.type === 'properties'
        })
        let props = [{ value: '', label: '' }]
        properties.children.forEach(child => {
          props.push({ value: child.name, label: child.name })
        })
        addons.push({
          name: 'selectProperty',
          type: 'select-menu-item',
          label: 'Select Property',
          getValue: source => {
            return source.node.name
          },
          setValue: (source, name) => {
            source.name = name
            source.changeName()
          },
          selectItems: props
        })
      }
      // add divider menu items if addons exist
      if (addons.length > 0) {
        addons.splice(0, 0, { name: 'divider', type: 'divider-menu-item' })
      }
      this.$refs.context.show(e, source, addons)
    },
    startDrag (source, clone) {
      // clone the dragged node and put it into clipboard
      clipboard.draggedObject = {
        node: cloneNode(source)
      }
    },
    // method for selection in tree
    select (source) {
      this.$refs.propertyInspector.set(source)
    },
    undo () {
      if (this.currentVersionNo === 0) return
      this.currentVersionNo--
      let treeData = this.treeDataBackups[this.currentVersionNo]
      this.setTree(treeData)
    },
    redo () {
      if (this.currentVersionNo === this.treeDataBackups.length - 1) return
      this.currentVersionNo++
      let treeData = this.treeDataBackups[this.currentVersionNo]
      this.setTree(treeData)
    },
    // backup tree data for undo/redo
    backupTreeData () {
      let treeData = cloneTree(this.$refs.tree.root)
      this.currentVersionNo++
      if (this.currentVersionNo === this.treeDataBackups.length) {
        this.treeDataBackups.push(treeData)
      } else {
        this.treeDataBackups.splice(this.currentVersionNo, this.treeDataBackups.length - this.currentVersionNo - 1)
        this.treeDataBackups[this.currentVersionNo] = treeData
      }
    },
    // method for node value updated outside property inspector
    // reset value of property inspector
    valueUpdated (source) {
      this.$refs.propertyInspector.set(source)
      this.updated()
    },
    // method for value updated in property inspector
    updated () {
      let schema = convertTreeToSchema(this.$refs.tree.root)
      this.jsonSchemaContent = JSON.stringify(schema, null, 4)
      this.backupTreeData()
    },
    // method for node removed in tree
    removed () {
      this.jsonSchemaContent = JSON.stringify(convertTreeToSchema(this.$refs.tree.root), null, 4)
      this.backupTreeData()
    },
    // method for before append node to tree
    beforeAppend (dest, source) {
      if (typeof dest.funcs.beforeAppend === 'function') return dest.funcs.beforeAppend(dest, source)
    },
    // method for menu item selected
    menuSelected (payload) {
      // process for append menu items
      if (payload.menu.append) {
        let component = this.$refs.toolbox.retrieve(payload.menu.name)
        // clone toolbox component then append to tree node
        payload.source.append(cloneNode(component))
      }
    },
    // method for new schema
    newSchema () {
      // if there is unsaved tree data, then confirm to discard it
      if (this.currentVersionNo !== 0) {
        this.confirm.title = 'New Schema'
        this.confirm.content = `Current schema would lost, Are you sure?`
        this.confirm.callback = this.newSchemaConfirmed
        this.$refs.confirm.open()
        return
      }
      this.newSchemaConfirmed(true)
    },
    newSchemaConfirmed (confirmResult) {
      if (!confirmResult) return
      this.setTree(treeData)
      // reset backup of tree data
      this.treeDataBackups = [treeData]
      this.currentVersionNo = 0
    },
    // method for save custom schema
    async saveSchema () {
      // check for existence of schema
      let schemaTree = this.$refs.tree.root
      let isExist = false
      try {
        await this.repository.retrieveSchema(schemaTree.name, false)
        isExist = true
      } catch (err) {
        if (err.name !== 'SchemaNotExistError') {
          console.log(`Retrieve schema error: ${err.message}`)
          this.showSnackbar(`Retrieve custom schema error: ${err.message}`, 4000)
          return
        }
      }
      // if schema already exist, then confirm to update it
      if (isExist) {
        // confirm for update
        this.confirm.title = 'Update schema'
        this.confirm.content = `Schema ${schemaTree.name} already exist, update it?`
        this.confirm.callback = this.saveSchemaConfirmed
        this.$refs.confirm.open()
        return
      }
      this.saveSchemaConfirmed(true)
    },
    async saveSchemaConfirmed (confirmResult) {
      if (!confirmResult) return
      let schemaTree = this.$refs.tree.root
      let schema = convertTreeToSchema(schemaTree)
      try {
        await this.repository.saveSchema(schema, schemaTree.name)
      } catch (err) {
        console.log(`Save schema error: ${err.message}`)
        this.showSnackbar(`Save custom schema error: ${err.message}`, 4000)
        return
      }
      // add schema name into schema list
      if (this.schemaList.indexOf(schemaTree.name) === -1) this.schemaList.push(schemaTree.name)
      // add or update user schema
      let treeData = convertSchemaToTree(schema, schemaTree.name)
      this.$refs.userSchemas.append(treeData)
    },
    // method for load custom schema
    loadSchema () {
      // if there is unsaved tree data, then confirm to discard it
      if (this.currentVersionNo !== 0) {
        this.confirm.title = 'Load Schema'
        this.confirm.content = `Current schema would lost, Are you sure?`
        this.confirm.callback = this.loadSchemaConfirmed
        this.$refs.confirm.open()
        return
      }
      this.loadSchemaConfirmed(true)
    },
    async loadSchemaConfirmed (confirmResult, schemaName) {
      if (!confirmResult) return
      if (!schemaName) {
        schemaName =
          this.$refs.userSchemas.selectedComponent
            ? this.$refs.userSchemas.selectedComponent.node.name : null
      }
      if (!schemaName) return
      try {
        let schema = await this.repository.retrieveSchema(schemaName, false)
        this.setSchemaToTree(schema, schemaName)
        return true
      } catch (err) {
        console.log(`Load schema error: ${err.message}`)
        this.showSnackbar(`Retrieve custom schema error: ${err.message}`, 4000)
        return false
      }
    },
    setSchemaToTree (schema, name) {
      let treeData = convertSchemaToTree(schema, name)
      this.setTree(treeData)
      // reset backup of tree data
      this.treeDataBackups = [treeData]
      this.currentVersionNo = 0
    },
    setTree (treeData) {
      this.$refs.tree.init(treeData)
      this.jsonSchemaContent = JSON.stringify(convertTreeToSchema(this.$refs.tree.root), null, 4)
      let source = this.$refs.tree.store.selectedNode
      this.$refs.propertyInspector.set(source)
    },
    // method for delete custom schema
    deleteSchema () {
      let node = this.$refs.userSchemas.selectedComponent
        ? this.$refs.userSchemas.selectedComponent.node : null
      if (!node) return
      let schemaName = node.name
      this.confirm.title = 'Delete schema'
      this.confirm.content = `Are you sure to delete schema: ${schemaName}?`
      this.confirm.callback = this.deleteConfirmed
      this.$refs.confirm.open()
    },
    async deleteConfirmed (confirmResult) {
      if (!confirmResult) return
      let node = this.$refs.userSchemas.selectedComponent
        ? this.$refs.userSchemas.selectedComponent.node : null
      if (!node) return
      let schemaName = node.name
      try {
        await this.repository.deleteSchema(schemaName)
        // remove type from schema list
        let index = this.schemaList.indexOf(schemaName)
        if (index >= 0) this.schemaList.splice(index, 1)
        // remove schema from user schemas
        this.$refs.userSchemas.remove(node)
        return true
      } catch (err) {
        console.log(`Delete schema error: ${err.message}`)
        this.showSnackbar(`Delete custom schema error: ${err.message}`, 4000)
        return false
      }
    },
    importSchema () {
      this.uploadFilename = null
      this.multipleUpload = true
      this.uploadFiles = null
      this.$refs.loadSchemaDialog.open()
    },
    copyJsonSchemaToClipboard () {
      let source = this.$refs.jsonSchemaContent
      source.select()
      try {
        window.document.execCommand('copy')
      } catch (err) {
        this.showSnackbar('Unable copy json schema to clipboard, please press Ctrl/Cmd+C to copy.', 4000)
      }
      source.blur()
    },
    downloadJsonSchemaToFile () {
      if (window.document.createEvent) {
        if (this.downloadLink !== null) window.URL.revokeObjectURL(this.downloadLink)
        this.downloadLink = window.URL.createObjectURL(new window.Blob([this.jsonSchemaContent], { type: 'application/json' }))
        this.downloadFilename = `${this.$refs.tree.root.name}.json`
        this.$nextTick(() => {
          let link = this.$refs.downloadLink
          link.click()
        })
      }
    },
    loadJsonSchemaFromFile () {
      this.uploadFilename = null
      this.multipleUpload = false
      this.uploadFiles = null
      this.$refs.loadSchemaDialog.open()
    },
    getUploadFiles (event) {
      this.uploadFiles = event
    },
    loadJsonSchemaFromFileCanceled () {
      this.$refs.loadSchemaDialog.close()
    },
    loadJsonSchemaFromFileConfirmed () {
      if (this.uploadFiles) {
        for (let i = 0; i < this.uploadFiles.length; i++) {
          let file = this.uploadFiles[i]
          if (!file) continue
          let reader = new FileReader()
          reader.onload = async (e) => {
            try {
              let schema = JSON.parse(e.target.result)
              if (this.multipleUpload) {
                let treeData = convertSchemaToTree(schema)
                await this.repository.saveSchema(schema, treeData.name)
                // add schema name into schema list
                if (this.schemaList.indexOf(treeData.name) === -1) this.schemaList.push(treeData.name)
                // add or update user schema
                this.$refs.userSchemas.append(treeData)
              } else {
                this.setSchemaToTree(schema)
              }
            } catch (err) {
              console.log(`load schema from file error: ${err.message}`)
              this.showSnackbar(`Load schema from file error: ${err.message}`, 4000)
            }
          }
          reader.readAsText(file)
        }
      }
      this.$refs.loadSchemaDialog.close()
    }
  },
  components: {
    SplitPanel,
    Toolbox,
    Tree,
    ContextMenu,
    PropertyInspector
  }
}
</script>

<style scoped>
  .json-schema-editor {
    font-size: 12px;
  }

  .container {
    /*height: 600px;*/
    border: solid 1px black;
    font-size: 12px;
  }

  .panel {
    padding: 10px;
    height: 100%;
    overflow: auto;
  }

  .user-schemas__panel {
    margin: 0;
    padding: 0px;
    height: 100%;
  }

  .user-schemas__container {
    margin: 0;
    padding: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .user-schemas__toolbox-container {
    padding: 10px;
    height: 100%;
    overflow: auto;
    flex-grow: 1;
  }

  .user-schemas__buttons-container {
    border-top: solid 1px black;
    padding: 0px;
    flex: 1;
  }

  .user-schemas__button {
    width: 100%;
    font-size: 12px;
    height: 28px;
    min-height: 28px;
    margin: 2px;
  }

  .json-schema-content__panel {
    margin: 0;
    padding: 0px;
    height: 100%;
  }

  .json-schema-content__container {
    margin: 0;
    padding: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .json-schema-content__textarea-container {
    margin: 0;
    padding: 0px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .json-schema-content__textarea {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;/*reset from inline*/
    width: 100%;
    margin: 0;/*remove defaults*/
    padding: 4px;
    border: none;
    overflow-y: auto;/*resets IE*/
    overflow-x: hidden;/*resets IE*/
    height: 100%;
    flex-grow: 1;
    resize: none;
    font-size: 12px;
    font-family: Arial;
  }

  .json-schema-content__buttons-container {
    border-top: solid 1px black;
  }

  .json-schema-content__button-bar {
    display: inline-flex;
  }

  .json-schema-content__button {
    font-size: 12px;
    height: 28px;
    min-height: 28px;
    margin: 4px;
  }

  .context-menu {
    font-size: 12px;
  }
</style>
