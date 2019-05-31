<template>
  <div>
    <el-form label-position="top" class="panel" style="text-align:left;">
      <el-form-item label="Current Table">
        <span style="font-size: 12px;margin-right: 5px;">{{ selectedTable }}</span>
        <el-button type="text" size="mini" @click="dataSrcVisible=true">
          {{ selectedTable?'Change':'Select Data Source' }}
        </el-button>
      </el-form-item>
      <el-form-item label="Fields">
        <draggable v-model="tableSchema" v-loading="schemaLoading" :group="{name: 'col',pull: 'clone', put: false}" :move="handleMove">
          <div v-for="col in tableSchema" :key="col.Column" class="drag-list-item">
            <i class="el-icon-rank" style="font-size: 12px;color:#409EFF;" />
            {{ col.Column }}
          </div>
        </draggable>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dataSrcVisible" :before-close="handleCloseDialog" title="Select Data Source" width="500px">
      <el-form label-width="150px">
        <el-form-item label="Data Source:">
          <el-select v-model="selectedTable" size="mini" filterable placeholder="Select Data Source" style="width:200px;" clearable @change="handleDataSrcChange">
            <el-option v-for="item in dataSourceList" :key="item.tableId" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dataSrcVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { tables } from '@/mock/dataSource'
import draggable from 'vuedraggable'
import exeSql from '@/mock/exeSql'
import store from '../store'

export default {
  components: { draggable },
  props: {
    resultLoading: {
      default: false
    },
    allCols: {
      requred: true,
      default: () => []
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
      dataSrcVisible: true,
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
    if (this.$route.params.id !== 'create') {
      this.dataSrcVisible = false
      this.selectedTable = this.dataSrc
      this.fetchSchema()
    }
  },
  methods: {
    handleDataSrcChange() {
      this.fetchSchema()
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
        this.tableSchema = resp.map((item, index) => {
          return {
            Column: item.Field,
            Type: item.Type,
            id: index
          }
        })
        this.$emit('update:allCols', this.tableSchema)
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
