<template>
  <div>
    <el-form label-position="top" class="panel" style="text-align:left;">
      <el-form-item v-show="dataSrcVisible" :label="$t('common.dataSource')+':'">
        <el-select v-model="selectedBase" size="mini" filterable :placeholder="$t('dataSource.sourcePlaceholder')" style="width:200px;" clearable @change="handleBaseChange">
          <el-option v-for="item in baseList" :key="item.source_id" :label="item.base_alias || item.database" :value="item.source_id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-show="dataSrcVisible" v-model="selectedTable" :disabled="!selectedBase" size="mini" filterable :placeholder="$t('dataSource.tablePlaceholder')" style="width:200px;" clearable @change="handleDataSrcChange">
          <el-option v-for="item in tableList" :key="item.table" :label="item.table_alias || item.table" :value="item.table" />
        </el-select>
      </el-form-item>

      <el-form-item v-show="!dataSrcVisible" :label="$t('dataSource.table')+':'">
        <span style="font-size: 12px;margin-right: 5px;">{{ selectedBaseName }}/{{ selectedTableName }}</span>
        <el-button type="text" size="mini" @click="editDataSrc">
          {{ $t('common.edit') }}
        </el-button>
      </el-form-item>
      <el-form-item :label="$t('dataSource.fields')+':'">
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
import { sourceList, linkedTablesByBase } from '@/api/source'
import draggable from 'vuedraggable'
import exeSql from '@/api/exeSql'

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
      baseList: [],
      tableList: [],
      selectedTable: undefined,
      tableSchema: undefined,
      dataSrcVisible: this.$route.params.id === 'create',
      existWarning: null,
      selectedBase: undefined
    }
  },
  computed: {
    caculCols() {
      return this.$store.state.chart.caculCols
    },
    dimensions() {
      return this.$store.state.chart.dimensions
    },
    allSelected() {
      return this.dimensions.concat(this.caculCols)
    },
    selectedBaseName() {
      const selectedBase = this.baseList.find(item => item.source_id === this.selectedBase)
      if (!selectedBase) return ''
      return selectedBase.base_alias || selectedBase.database
    },
    selectedTableName() {
      const selectedTable = this.tableList.find(item => item.table === this.selectedTable)
      if (!selectedTable) return ''
      return selectedTable.table_alias || selectedTable.table
    }
  },
  created() {
    this.getBaseList()
  },
  methods: {
    async getBaseList() {
      const { data } = await sourceList()
      this.baseList = data
    },
    initWithDataSrc(dataSrc) {
      if (dataSrc) {
        this.selectedTable = dataSrc.table
        this.selectedBase = dataSrc.source_id
        this.fetchTables()
        this.fetchSchema()
      } else {
        this.selectedTable = ''
        this.selectedBase = ''
        this.tableSchema = []
        this.dataSrcVisible = true
      }
    },
    editDataSrc() {
      this.dataSrcVisible = true
      this.selectedTable = undefined
    },
    handleBaseChange() {
      this.fetchTables()
    },
    async fetchTables() {
      const { data } = await linkedTablesByBase(this.selectedBase)
      this.tableList = data
    },
    handleDataSrcChange() {
      this.dataSrcVisible = false
      this.fetchSchema()
      this.$store.commit('chart/SET_ALL_COLS', [])
      this.$emit('change', {
        table: this.selectedTable,
        source_id: this.selectedBase
      })
    },

    fetchSchema() {
      if (!this.selectedTable) {
        this.tableSchema = []
        return
      }
      this.schemaLoading = true
      exeSql().fetch({ source_id: this.selectedBase, sql: `desc ${this.selectedTable}` }).then(resp => {
        this.schemaLoading = false
        this.tableSchema = resp.data.map((item, index) => {
          return {
            Column: item.Field,
            Type: item.Type,
            id: index
          }
        })
        this.$store.commit('chart/SET_ALL_COLS', this.tableSchema)
      })
    },
    handleMove(evt, originalEvent) {
      if (this.allSelected.find(item => item.Column === evt.draggedContext.element.Column)) {
        if (!this.existWarning) {
          this.existWarning = this.$message({
            type: 'warning',
            message: this.$t('chart.fieldExisted'),
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
