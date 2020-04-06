<template>
  <div>
    <el-form label-position="top" class="panel" style="text-align:left;">
      <el-form-item v-show="dataSrcVisible" label="数据源:">
        <el-select v-model="selectedTable" size="mini" filterable placeholder="选择数据源" style="width:200px;" clearable @change="handleDataSrcChange">
          <el-option v-for="item in dataSourceList" :key="item.tableId" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>

      <el-form-item v-show="!dataSrcVisible" class="data-src" label="当前表：">
        <span style="font-size: 12px;margin-right: 5px;">{{ selectedTable }}</span>
        <i class="el-icon el-icon-edit" @click="editDataSrc" />
        <svg-icon icon-class="chart_table" class="data-src-icon" @click.native="viewData" />
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
    <el-dialog title="查看数据" :visible.sync="dialogVisible" width="1000px">
      <DataTable :data="chartData" :schema="tableSchema" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { tables } from '@/mock/dataSource'
import draggable from 'vuedraggable'
import exeSql from '@/api/exeSql'
import store from '../store'
import DataTable from '@/widgets/DataTable'

export default {
  components: { draggable, DataTable },
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
      existWarning: null,
      dialogVisible: false,
      chartData: []
    }
  },
  computed: {
    allSelected() {
      return store.state.dimensions.concat(store.state.caculCols)
    }
  },
  created() {
    this.dataSourceList = tables
  },
  methods: {
    initWithDataSrc(dataSrc) {
      if (dataSrc) {
        this.selectedTable = dataSrc
        this.fetchSchema()
      } else {
        this.selectedTable = dataSrc
        this.tableSchema = []
        this.dataSrcVisible = true
      }
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
      exeSql().fetch(`desc ${this.selectedTable}`).then(resp => {
        this.schemaLoading = false
        this.tableSchema = resp.data.map((item, index) => {
          return {
            Column: item.Field,
            Type: item.Type,
            id: index,
            name: item.Field
          }
        })
        store.setAllColsAction(this.tableSchema)
      })
    },
    async viewData() {
      this.dialogVisible = true
      const { data } = await exeSql().fetch(`select * from ${this.selectedTable} limit 200`)
      this.chartData = data
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
  .data-src {
    .data-src-icon {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      cursor: pointer;
    }
    .el-icon-edit {
      cursor: pointer;
      font-size: 12px;
      bottom: -1px;
      position: relative;
      &:hover {
        color: #409EFF;
      }
    }
  }
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
