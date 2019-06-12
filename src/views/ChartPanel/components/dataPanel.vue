<template>
  <div>
    <el-form label-position="top" class="panel" style="text-align:left;">
      <el-form-item v-show="dataSrcVisible" label="数据源:">
        <el-select v-model="selectedTable" size="mini" filterable placeholder="选择数据源" style="width:200px;" clearable @change="handleDataSrcChange">
          <el-option v-for="item in dataSourceList" :key="item.tableId" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>

      <el-form-item v-show="!dataSrcVisible" label="当前表：">
        <span style="font-size: 12px;margin-right: 5px;">{{ selectedTable }}</span>
        <el-button type="text" size="mini" @click="editDataSrc">
          修改
        </el-button>
      </el-form-item>
      <el-form-item label="字段：">
        <draggable v-model="tableSchema" v-loading="schemaLoading" :group="{name: 'col',pull: 'clone', put: false}" :move="handleMove">
          <div v-for="col in tableSchema" :key="col.Column" class="drag-list-item">
            <i class="el-icon-rank" style="font-size: 12px;color:#409EFF;" />
            {{ col.Column }}
          </div>
        </draggable>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { tables } from '@/mock/dataSource'
import draggable from 'vuedraggable'
import exeSql from '@/api/exeSql'
import store from '../store'

export default {
  components: { draggable },
  props: {
    resultLoading: {
      default: false
    },
    dataSrc: {
      requred: true
    }
  },
  data() {
    return {
      schemaLoading: false,
      dataSourceList: [],
      selectedTable: undefined,
      tableSchema: undefined,
      dataSrcVisible: this.$route.params.id === 'create',
      existWarning: null
    }
  },
  computed: {
    allSelected() {
      return store.state.caculCols.concat(store.state.dimensions)
    }
  },
  created() {
    this.dataSourceList = tables
  },
  methods: {
    initWithDataSrc(dataSrc) {
      this.selectedTable = dataSrc
      this.fetchSchema()
    },
    editDataSrc() {
      this.dataSrcVisible = true
      this.selectedTable = undefined
    },
    handleDataSrcChange() {
      this.dataSrcVisible = false
      this.fetchSchema()
      store.setAllColsAction([])
      this.$emit('change', this.selectedTable)
    },
    fetchSchema() {
      if (!this.selectedTable) {
        this.tableSchema = []
        return
      }
      this.schemaLoading = true
      exeSql(`desc ${this.selectedTable}`).then(resp => {
        this.schemaLoading = false
        this.tableSchema = resp.data.map((item, index) => {
          return {
            Column: item.Field,
            Type: item.Type,
            id: index
          }
        })
        store.setAllColsAction(this.tableSchema)
      })
    },
    handleCloseDialog(done) {
      if (this.selectedTable) {
        done()
      } else {
        this.$message({
          type: 'warning',
          message: 'You Need Select Data Source First.'
        })
        done()
      }
    },
    handleMove(evt, originalEvent) {
      if (this.allSelected.find(item => item.Column === evt.draggedContext.element.Column)) {
        if (!this.existWarning) {
          this.existWarning = this.$message({
            type: 'warning',
            message: 'Field Already Existed',
            onClose: (instance) => {
              this.existWarning = null
            }
          })
        }
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.panel {
  /deep/ .el-form-item__label {
    line-height: initial;
  }
   /deep/ .el-form-item__content {
    line-height: initial;
  }
}
.drag-list-item {
  line-height: 1.5;
  font-size: 14px;
  color:#606266;
  cursor: -webkit-grab;
}
</style>
