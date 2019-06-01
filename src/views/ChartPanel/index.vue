<template>
  <div>
    <el-card body-style="padding:0;" style="margin-bottom: 20px;" class="panel-header">
      <div slot="header" style="display: flex; justify-content:space-between;">
        <span>Edit Chart</span>
        <span>
          <el-button size="mini" type="primary" style="float: right;margin:0 10px 0 0;" @click="handleDownload">Export Data</el-button>
          <el-button size="mini" type="primary" style="float: right;margin:0 10px 0 0;" @click="handleSave"> Save </el-button>
        </span>
      </div>
    </el-card>

    <div class="app-container" style="display: flex;">
      <el-card style="width:300px;margin-right: 20px;text-align:center;">
        <data-panel :result-loading="loading" :data-src="dataSrc" @change="handleDataSrcChange" />
      </el-card>

      <el-card style="width: 100%;" body-style="padding: 10px 20px;">
        <el-form size="mini" class="analysis-form">
          <el-form-item label="维度">
            <draggable v-model="sharedState.dimensions" :group="{name: 'col',pull: true, put: true}" class="draggable-wrapper" @change="handleDimensionChange">
              <el-tag v-for="col in sharedState.dimensions" :key="col.Column" class="draggable-item" size="small" closable @close="handleCloseDimensionTag(col)">
                {{ col.Column }}
              </el-tag>
            </draggable>
          </el-form-item>

          <el-form-item label="字段">
            <draggable v-model="sharedState.caculCols" :group="{name: 'col',pull: true, put: true}" class="draggable-wrapper" @change="handleColChange">
              <el-tag v-for="col in sharedState.caculCols" :key="col.Column" size="small" closable class="selected-field" @close="handleCloseColTag(col)">
                <el-select v-model="col.calculFunc" class="draggable-item" size="mini" closable style="background: rgba(0,0,0,0);">
                  <el-option v-for="(item, optIndex) in col.availableFunc" :key="optIndex" :label="`${col.Column}(${item.name})`" :value="item.func" />
                </el-select>
              </el-tag>
            </draggable>
          </el-form-item>

          <orderPanel v-model="orderByStrs" />

          <filterPanel :filters.sync="currentFilters" :disabled="!allSelected || allSelected.length===0" @change="handleAddFilter" />

          <el-form-item>
            <div class="limit-input">
              <span v-show="!editLimit">
                查询前{{ limit }}条数据
                <el-button type="text" @click="editLimit=true">修改</el-button>
              </span>
              <span v-show="editLimit">
                <el-input-number v-model="limit" :disabled="loading" size="mini" placeholder="数据条数" style="width:100px;" @blur="editLimit=false" />
                <el-button size="mini" @click="editLimit=false">确认</el-button>
              </span>
            </div>
          </el-form-item>
        </el-form>

        <visualize-panel v-loading="loading" :data="result" :chart-type.sync="chartType" :schema="allSelected" />
      </el-card>
    </div>
  </div>
</template>
<script>
import visualizePanel from './components/visualizePanel'
import dataPanel from './components/dataPanel'
import { parseTime } from '@/utils'
import draggable from 'vuedraggable'
import filterPanel from './components/filterPanel'
import orderPanel from './components/orderPanel'
import exeSql from '@/mock/exeSql'
import { buildSqlSentence } from '@/utils/buildSentence'
import { saveChart, getChartById, putChart } from '@/mock/chart'
import store from './store'

export default {
  name: 'ChartPanel',
  components: { visualizePanel, dataPanel, draggable, filterPanel, orderPanel },
  data() {
    return {
      loading: false,
      result: [],
      schema: [],
      dataSrc: undefined,
      limit: 200,
      orderByStrs: [],
      filterStr: undefined,
      editLimit: false,
      chartType: 'table',
      currentFilters: [],
      sharedState: store.state
    }
  },
  computed: {
    allSelected() {
      return store.state.caculCols.concat(store.state.dimensions)
    },
    sqlSentence() {
      return buildSqlSentence({
        dataSrc: this.dataSrc,
        selectedCalcul: this.sharedState.caculCols,
        selectedDimension: this.sharedState.dimensions,
        orderByStrs: this.orderByStrs,
        filterStr: this.filterStr,
        limit: this.limit
      })
    }
  },
  watch: {
    sqlSentence(value) {
      if (value) {
        console.log(value)
        this.fetchData(value)
      } else {
        this.result = []
        this.schema = []
      }
    }
  },
  created() {
    if (this.$route.params.id !== 'create') {
      const chart = getChartById(this.$route.params.id)
      this.dataSrc = chart.dataSrc
      this.chartType = chart.chartType
      this.limit = chart.limit
      this.currentFilters = chart.filters
      this.orderByStrs = chart.orderByStrs
      store.setCaculColsAction(chart.selectedCalcul)
      store.setDimensionsAction(chart.selectedDimension)
    }
    console.log(this.selectedDimension, this.selectedCalcul)
  },
  methods: {
    fetchData(sqlSentence) {
      this.loading = true
      exeSql(sqlSentence).then(resp => {
        this.loading = false
        this.result = resp
      })
    },
    handleDataSrcChange(value) {
      this.dataSrc = value
      store.setCaculColsAction([])
      store.setDimensionsAction([])
      this.filterStr = undefined
      this.orderByStrs = []
    },
    handleColChange(evt) {
      if (evt.added) {
        store.addCaculColAction(evt.added.element)
      }
    },
    handleDimensionChange(evt) {
      if (evt.added) {
        store.addDimensionAction(evt.added.element)
      }
    },
    handleCloseColTag(col) {
      store.deleteCaculColAction(col)
    },
    handleCloseDimensionTag(col) {
      store.deleteDimensionAction(col)
    },
    handleAddFilter(value) {
      this.filterStr = value
    },
    handleSave() {
      const obj = {
        dataSrc: this.dataSrc,
        orderByStrs: this.orderByStrs,
        limit: this.limit,
        selectedCalcul: this.sharedState.caculCols,
        selectedDimension: this.sharedState.dimensions,
        chartType: this.chartType,
        filters: this.currentFilters,
        index: this.$route.params.id === 'create' ? undefined : this.$route.params.id
      }
      if (obj.index) {
        putChart(obj)
      } else {
        saveChart(obj)
      }
      this.$message({
        dangerouslyUseHTMLString: true,
        type: 'success',
        message: 'Successfully Saved，<a href="/dashboard">Go Check Dashboard!</a>',
        duration: 20000
      })
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.schema.map(item => item.name)
        const filterVal = tHeader
        const data = this.formatJson(filterVal, this.result)
        excel.export_json_to_excel({ header: tHeader, data, filename: 'DataExport' + parseTime(Date.now(), '{m}{d}{h}{i}{s}'), autoWidth: true })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          const tempArr = j.split('.')
          if (tempArr.length <= 1) {
            return v[j]
          } else {
            return tempArr.reduce(
              (pre, cur) => (pre[cur] ? pre[cur] : '--'),
              v
            )
          }
        })
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.analysis-form {
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 10px;
  }
  /deep/ .el-form-item--mini .el-form-item__label,.limit-input {
    color: #909399;
    font-size: 14px;
  }
}

.draggable-wrapper {
  font-size: 14px;
  min-height: 30px;
  border-bottom: 1px solid #E4E7ED;
  .draggable-item {
    margin-right: 10px;
  }
  /deep/ .el-select--mini {
      margin: 0;
    }
}
.selected-field {
   /deep/ .el-input__inner {
    height: 20px;
    line-height: 20px;
    border: none;
    background-color: rgba($color: #fff, $alpha: 0);
    padding: 0;
  }
  /deep/ .el-input__suffix {
      right: 0px;
    .el-input__suffix-inner {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      .el-input__icon {
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>
