<template>
  <div>
    <el-form label-position="top" class="panel" style="text-align:left;">
      <el-form-item label="当前工作表">
        <span style="font-size: 12px;">{{ selectedTable }}</span>
        <el-tag size="mini" @click="dataSrcVisible=true">
          {{ selectedTable?'修改':'选择数据源' }}
        </el-tag>
      </el-form-item>
      <el-form-item label="字段">
        <draggable v-model="tableSchema" :group="{name: 'col',pull: 'clone', put: false}" :move="handleMove">
          <div v-for="col in tableSchema" :key="col.Column" class="drag-list-item">
            <i class="el-icon-rank" style="font-size: 12px;color:#409EFF;" />
            {{ col.Column }}
          </div>
        </draggable>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dataSrcVisible" :before-close="handleCloseDialog" title="选择数据源" width="500px">
      <el-form label-width="150px">
        <el-form-item label="数据源:">
          <el-select v-model="selectedTable" size="mini" filterable placeholder="选择表" style="width:200px;" clearable @change="handleDataSrcChange">
            <el-option v-for="item in dataSourceList" :key="item.tableId" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataSrcVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { tables } from '@/mock/dataSource'
import draggable from 'vuedraggable'
import exeSql from '@/mock/exeSql'

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
    allSelected: {
      requred: true,
      default: () => []
    }
  },
  data() {
    return {
      optLoading: false,
      dataSourceList: [],
      selectedTable: undefined,
      tableSchema: undefined,
      dataSrcVisible: true,
      existWarning: null
    }
  },
  mounted() {
    this.dataSourceList = tables
    exeSql('desc order_analysis').then(resp => {
      this.tableSchema = resp.map(item => {
        return {
          Column: item.Field,
          Type: item.Type
        }
      })
    })
  },
  methods: {
    handleDataSrcChange() {
      this.$emit('change', this.selectedTable)
    },
    handleCloseDialog(done) {
      if (this.selectedTable) {
        done()
      } else {
        this.$message({
          type: 'error',
          message: '请选择数据源'
        })
      }
    },
    handleMove(evt, originalEvent) {
      if (this.allSelected.find(item => item.Column === evt.draggedContext.element.Column)) {
        if (!this.existWarning) {
          this.existWarning = this.$message({
            type: 'warning',
            message: '字段已存在',
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
