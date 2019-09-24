<template>
  <div>
    <el-card body-style="padding:0;" style="margin-bottom: 20px;" class="panel-header">
      <div slot="header" style="display: flex; justify-content:space-between;">
        <span>
          <span class="back-button" @click="$router.go(-1)">
            <i class="el-icon-back" />
            <span>返回</span>
          </span>
          <span v-if="this.$route.params.id !== 'create'">编辑图表</span>
          <span v-else>创建图表</span>
          <el-button size="mini" type="text" style="margin-left:10px;" @click="viewAllChart">
            全部图表
          </el-button>
        </span>
        <span>
          <el-button size="mini" type="primary" style="float: right;margin:0 10px 0 0;" icon="el-icon-download" @click="handleDownload" />
          <el-button v-if="this.$route.params.id !== 'create'" size="mini" type="primary" style="float: right;margin:0 10px 0 0;" @click="handleLinkDB">添加到仪表盘</el-button>
          <el-button size="mini" type="primary" style="float: right;margin:0 10px 0 0;" icon="el-icon-save" @click="handleSave">保存 </el-button>
          <el-button v-if="this.$route.params.id !== 'create'" size="mini" type="primary" style="float: right;margin:0 10px 0 0;" @click="$router.replace(`/chartpanel/create`)">新建图表</el-button>
        </span>
      </div>
    </el-card>

    <div class="app-container" style="display: flex;">
      <el-card id="dataPanel" style="width:300px;margin-right: 20px;text-align:center;">
        <data-panel ref="dataPanel" :result-loading="loading" :data-src="dataSrc" @change="handleDataSrcChange" />
      </el-card>

      <el-card style="width: 100%;" body-style="padding: 10px 20px;">
        <div class="form-wrapper">
          <el-form id="formPanel" size="mini" class="analysis-form">
            <el-form-item id="dimensionInput" label="维度">
              <draggable v-model="sharedState.dimensions" :group="{name: 'col',pull: true, put: true}" class="draggable-wrapper" @change="handleDimensionChange">
                <el-tag v-for="col in sharedState.dimensions" :key="col.Column" class="draggable-item" size="small" closable @close="handleCloseDimensionTag(col)">
                  {{ col.Column }}
                </el-tag>
              </draggable>
            </el-form-item>

            <el-form-item id="fieldInput" label="数值">
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
          <el-form class="chart-form" size="mini" label-position="top">
            <el-form-item label="图表名称:">
              <el-input v-model="chartName" size="mini" placeholder="未命名" />
            </el-form-item>
            <el-form-item label="图表描述:">
              <el-input v-model="chartDesc" size="mini" placeholder="请输入图表描述" />
            </el-form-item>
          </el-form>
        </div>

        <visualize-panel id="vizPanel" v-loading="loading" :data="result" :chart-type.sync="chartType" :schema="allSelected" />
      </el-card>
    </div>
    <el-dialog title="我的图表" :visible.sync="showMyCharts">
      <el-table :data="myChartList">
        <el-table-column label="名称" width="200" prop="chart_name" />
        <el-table-column label="描述" prop="desc" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="switchChart(scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteChart(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showMyCharts = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Dashboard 列表" :visible.sync="showDashboards">
      <div style="text-align:center;">
        <el-select v-model="selectedDb" size="small">
          <el-option v-for="item in dashboardList" :key="item.objectId" :label="item.name" :disabled="isDbDisbaled(item)" :value="item.objectId" />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="showDashboards = false">取消</el-button>
        <el-button type="primary" size="small" @click="linkDb">确定</el-button>
      </span>
    </el-dialog>
    <!-- <el-tooltip content="帮助中心" placement="top"> -->
    <el-dropdown class="help-center-wrapper" placement="top" size="mini" @command="handleHelp">
      <div class="help-center">
        <i class="el-icon-question" />
      </div>
      <el-dropdown-menu slot="dropdown" size="mini">
        <el-dropdown-item command="guide">
          开启新手引导
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- </el-tooltip> -->
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css

import filterPanel from './components/filterPanel'
import orderPanel from './components/orderPanel'
import visualizePanel from './components/visualizePanel'
import dataPanel from './components/dataPanel'

import { createChart, updateChart, getChartById, chartList, deleteChart } from '@/api/chart'
import { dashboardList, addChartToDB, dbByChart } from '@/api/dashboard'
import exeSql from '@/api/exeSql'
import { parseTime } from '@/utils'
import { buildSqlSentence } from '@/utils/buildSentence'

import steps from './guideSteps'
import store from './store'

const driver = new Driver()

export default {
  name: 'ChartPanel',
  components: { visualizePanel, dataPanel, draggable, filterPanel, orderPanel },
  data() {
    return {
      loading: false,
      result: [],
      dataSrc: undefined,
      limit: 200,
      orderByStrs: [],
      filterStr: undefined,
      editLimit: false,
      currentFilters: [],
      sharedState: store.state,
      chartType: 'table',
      chartName: undefined,
      chartDesc: undefined,
      showMyCharts: false,
      myChartList: [],
      showDashboards: false,
      dashboardList: [],
      selectedDb: undefined
    }
  },
  computed: {
    allSelected() {
      return store.state.dimensions.concat(store.state.caculCols)
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
        // console.log(value)
        this.fetchData(value)
      } else {
        this.result = []
      }
    },
    '$route.params.id': {
      immediate: true,
      handler() {
        if (this.$route.params.id !== 'create') {
          this.getDbByChart(this.$route.params.id)
          getChartById(this.$route.params.id).then(resp => {
            const chart = resp.data
            this.chartName = chart.chart_name
            this.chartDesc = chart.desc
            const content = chart.content || {}
            this.dataSrc = content.dataSrc
            this.chartType = content.chartType
            this.limit = content.limit || 200
            this.currentFilters = content.filters
            this.orderByStrs = content.orderByStrs
            store.setCaculColsAction(content.selectedCalcul)
            store.setDimensionsAction(content.selectedDimension)
            this.$refs.dataPanel.initWithDataSrc(this.dataSrc)
          })
        } else {
          this.chartName = undefined
          this.chartDesc = undefined
          store.setCaculColsAction([])
          store.setDimensionsAction([])
          this.$nextTick(() => {
            this.$refs.dataPanel.initWithDataSrc()
          })
        }
      }
    }
  },
  methods: {
    fetchData(sqlSentence) {
      this.loading = true
      exeSql(sqlSentence).then(resp => {
        this.loading = false
        this.result = resp.data
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
      if (!this.chartName) {
        this.$message({
          type: 'warning',
          message: '保存失败，请输入图表名称'
        })
        return
      }
      const chartId = this.$route.params.id === 'create' ? undefined : this.$route.params.id
      const obj = {
        dataSrc: this.dataSrc,
        orderByStrs: this.orderByStrs,
        limit: this.limit,
        selectedCalcul: this.sharedState.caculCols,
        selectedDimension: this.sharedState.dimensions,
        chartType: this.chartType,
        filters: this.currentFilters
      }
      const data = {
        id: chartId,
        chart_name: this.chartName,
        desc: this.chartDesc,
        content: obj
      }
      if (chartId) {
        updateChart(data).then(resp => {
          this.$message({
            type: 'success',
            message: '保存成功！'
          })
        })
      } else {
        createChart(data).then(resp => {
          // console.log(resp)
          this.$router.replace(`/chartpanel/${resp.data.id}`)
          this.$message({
            type: 'success',
            message: '保存成功！'
          })
        })
      }
    },
    handleLinkDB() {
      this.showDashboards = true
      dashboardList().then(resp => {
        this.dashboardList = resp.data.dashboards
      })
    },
    getDbByChart(id) {
      dbByChart(id).then(resp => {
        this.linkedDbList = resp.data || []
      })
    },
    isDbDisbaled(db) {
      return !!this.linkedDbList.find(item => item.objectId === db.objectId)
    },
    linkDb() {
      const data = {
        chart_id: this.$route.params.id,
        dashboard_id: this.selectedDb
      }
      this.showDashboards = false
      addChartToDB(data).then(resp => {
        this.getDbByChart(this.$route.params.id)
        this.$message({
          type: 'success',
          message: '添加成功！'
        })
      })
    },
    viewAllChart() {
      this.showMyCharts = true
      chartList().then(resp => {
        this.myChartList = resp.data
      })
    },
    switchChart(chart) {
      // console.log(chart)
      this.$confirm('确定要离开当前页面吗?系统可能不会保存您所做的更改。', '提示').then(() => {
        this.$router.replace(`/chartpanel/${chart.chart_id}`)
        this.showMyCharts = false
      })
    },
    deleteChart(chart) {
      this.$confirm(`确定要删除图表：${chart.chart_name}？`, '提示').then(() => {
        console.log(chart)
        deleteChart({ id: chart.chart_id }).then(() => {
          this.viewAllChart()
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
      })
    },
    handleHelp(command) {
      console.log(command)
      if (command === 'guide') {
        driver.defineSteps(steps)
        driver.start()
      }
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.allSelected.map(item => item.Column)
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
.back-button {
  display: inline-block;
  padding-right: 10px;
  margin-right: 10px;
  border-right: 1px solid #909090;
  cursor: pointer;
  span {
    padding: 5px;
    font-size: 14px;
  }
}
.analysis-form {
  width: 100%;
  padding-right: 20px;
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 10px;
  }
  /deep/ .el-form-item--mini .el-form-item__label,.limit-input {
    color: #909399;
    font-size: 14px;
  }
}
.form-wrapper {
  display: flex;
}
.chart-form {
  width: 250px;
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 10px;
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
.help-center-wrapper {
  cursor: pointer;
  position: fixed;
  bottom: 25px;
  right: 25px;
  .help-center {
    width: 45px;
    height: 45px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    line-height: 45px;
    font-size: 20px;
    color: #205cd8;
    text-align: center;
    /deep/ .el-dropdown {
      font-size: 20px;
      color: #205cd8;
    }

  }
}

</style>
