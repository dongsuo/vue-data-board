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
        <data-panel :result-loading="resultLoading" :all-cols.sync="allCols" :all-selected="allSelected" :data-src="dataSrc" @change="handleDataSrcChange" />
      </el-card>

      <el-card style="width: 100%;" body-style="padding: 10px 20px;">
        <el-form size="mini" class="analysis-form">
          <el-form-item label="维度">
            <draggable v-model="selectedDimension" :group="{name: 'col',pull: true, put: true}" class="draggable-wrapper" @change="handleDimensionChange">
              <el-tag v-for="col in selectedDimension" :key="col.Column" class="draggable-item" size="mini" closable @close="handleCloseDimensionTag(col)">
                {{ col.Column }}
              </el-tag>
            </draggable>
          </el-form-item>
          <el-form-item label="字段">
            <draggable v-model="selectedCalcul" :group="{name: 'col',pull: true, put: true}" class="draggable-wrapper" @change="handleColChange">
              <el-tag v-for="(col,index) in selectedCalcul" :key="col.Column" size="mini" closable class="selected-field" @close="handleCloseColTag(col)">
                <el-select v-model="selectedCalcul[index].calculFunc" class="draggable-item" size="mini" closable style="background: rgba(0,0,0,0);">
                  <el-option v-for="(item, optIndex) in col.availableFunc" :key="optIndex" :label="`${col.Column}(${item.name})`" :value="item.func" />
                </el-select>
              </el-tag>
            </draggable>
          </el-form-item>
          <el-form-item label="排序">
            <el-tag v-for="(item,index) in orderByStrs" :key="index" size="mini" closable @close="handleCloseOrderBy">
              {{ item }}
            </el-tag>
            <el-cascader v-model="orderBy" :disabled="!allSelected || allSelected.length===0" :options="orderByOption" size="mini" placeholder="选择排序方式" style="width: 120px;" @change="handleOrderByChange" />
          </el-form-item>
          <el-form-item label="筛选">
            <filterPanel :all-cols="allCols" :filters.sync="currentFilters" :disabled="!allSelected || allSelected.length===0" @change="handleAddFilter" />
          </el-form-item>
          <el-form-item>
            <div class="limit-input">
              <span v-show="!editLimit">
                查询前{{ limit }}条数据
                <el-button type="text" @click="editLimit=true">修改</el-button>
              </span>
              <span v-show="editLimit">
                <el-input-number v-model="limit" :disabled="resultLoading" size="mini" placeholder="数据条数" style="width:100px;" @blur="editLimit=false" />
                <el-button size="mini" @click="editLimit=false">确认</el-button>
              </span>
            </div>
          </el-form-item>
        </el-form>
        <visualize-panel v-loading="resultLoading" :data="result" :chart-type.sync="chartType" :schema="allSelected" />
      </el-card>
    </div>
  </div>
</template>
<script>
import visualizePanel from '@/components/visualizePanel'
import dataPanel from './components/dataPanel'
import { parseTime } from '@/utils'
import draggable from 'vuedraggable'
import { sqlFunc } from '@/utils/configs'
import filterPanel from './components/filterPanel'
import exeSql from '@/mock/exeSql'
import { trimColType, buildSqlSentence } from '@/utils/buildSentence'
import { saveChart, getChartById, putChart } from '@/mock/chart'

export default {
  name: 'SqlPanel',
  components: { visualizePanel, dataPanel, draggable, filterPanel },
  data() {
    return {
      sqlFunc,
      resultLoading: false,
      result: [],
      schema: [],
      allCols: [],
      selectedDimension: [],
      dataSrc: undefined,
      limit: 200,
      selectedCalcul: [],
      orderBy: [],
      orderByStrs: [],
      filteCol: undefined,
      filterStr: undefined,
      editLimit: false,
      chartType: 'table',
      currentFilters: []
    }
  },
  computed: {
    allSelected() {
      const fields = []
      return fields.concat(this.selectedCalcul).concat(this.selectedDimension)
    },
    sqlSentence() {
      return buildSqlSentence({
        dataSrc: this.dataSrc,
        selectedCalcul: this.selectedCalcul,
        selectedDimension: this.selectedDimension,
        orderByStrs: this.orderByStrs,
        filterStr: this.filterStr,
        limit: this.limit
      })
    },
    orderByOption() {
      return this.selectedCalcul.concat(this.selectedDimension).map(col => {
        return {
          value: col.Column,
          label: col.Column,
          children: [{
            value: 'desc',
            label: '降序'
          }, {
            value: 'asc',
            label: '升序'
          }]
        }
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
    // console.log(getChartById(this.$route.params.id))
    if (this.$route.params.id !== 'create') {
      const chart = getChartById(this.$route.params.id)
      this.dataSrc = chart.dataSrc
      this.chartType = chart.chartType
      this.limit = chart.limit
      this.currentFilters = chart.filters
      this.orderByStrs = chart.orderByStrs
      this.selectedCalcul = chart.selectedCalcul
      this.selectedDimension = chart.selectedDimension
    }
    console.log(this.selectedDimension, this.selectedCalcul)
  },
  methods: {
    fetchData(sqlSentence) {
      this.resultLoading = true
      exeSql(sqlSentence).then(resp => {
        this.resultLoading = false
        this.result = resp
      })
      // this.result = tempMockData.data
      // this.schema = tempMockData.schema.fields.filter(item => {
      //   return item.name !== 'index'
      // })
    },
    handleDataSrcChange(value) {
      this.dataSrc = value
      this.selectedCalcul = []
      this.selectedDimension = []
    },
    handleColChange(evt) {
      if (evt.added) {
        const colType = trimColType(evt.added.element.Type)
        const index = this.selectedCalcul.findIndex(item => item.Column === evt.added.element.Column)
        this.selectedCalcul.splice(index, 1, {
          Column: evt.added.element.Column,
          calculFunc: colType.availableFunc[0],
          Type: evt.added.element.Type,
          availableFunc: colType.availableFunc.map(func => {
            return {
              name: this.sqlFunc[func],
              func
            }
          })
        })
      }
    },
    handleDimensionChange(evt) {
      if (evt.added) {
        const index = this.selectedDimension.findIndex(c => c.Column === evt.added.element.Column)
        evt.added.element.isDimension = true
        this.selectedDimension.splice(index, 1, evt.added.element)
      }
    },
    handleCloseColTag(col) {
      const index = this.selectedCalcul.findIndex(c => c.Column === col.Column)
      this.selectedCalcul.splice(index, 1)

      const orderByIndex = this.orderByStrs.findIndex(item => item.split(' ')[0] === col.Column)
      this.orderByStrs.splice(orderByIndex, 1)
    },
    handleCloseDimensionTag(col) {
      const index = this.selectedDimension.findIndex(c => c.Column === col.Column)
      this.selectedDimension[index].isDimension = false
      this.selectedDimension.splice(index, 1)

      const orderByIndex = this.orderByStrs.findIndex(item => item.split(' ')[0] === col.Column)
      this.orderByStrs.splice(orderByIndex, 1)
    },
    handleOrderByChange(value) {
      this.orderBy = []
      const index = this.orderByStrs.findIndex(orderBy => orderBy.indexOf(value[0]) >= 0)
      if (index >= 0) {
        this.orderByStrs.splice(index, 1, `${value[0]} ${value[1]}`)
      } else {
        this.orderByStrs.push(`${value[0]} ${value[1]}`)
      }
    },
    handleCloseOrderBy(value) {
      this.orderByStrs.splice(this.orderByStrs.indexOf(value), 1)
    },
    handleAddFilter(value) {
      this.filterStr = value
    },
    handleSave() {
      const obj = {
        dataSrc: this.dataSrc,
        orderByStrs: this.orderByStrs,
        limit: this.limit,
        selectedCalcul: this.selectedCalcul,
        selectedDimension: this.selectedDimension,
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