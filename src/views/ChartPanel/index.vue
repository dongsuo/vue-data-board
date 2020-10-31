<template>
  <div>
    <el-card body-style="padding:0;" style="margin-bottom: 20px;" class="panel-header">
      <div slot="header" style="display: flex; justify-content:space-between;">
        <span>
          <span class="back-button" @click="$router.go(-1)">
            <i class="el-icon-back" />
            <span>{{ $t('common.back') }}</span>
          </span>
          <span v-if="this.$route.params.id !== 'create'">{{ $t('chart.createNewChart') }}</span>
          <span v-else>{{ $t('chart.editChart') }}</span>
          <el-button size="mini" type="text" style="margin-left:10px;" @click="viewAllChart">
            {{ $t('chart.allCharts') }}
          </el-button>
        </span>
        <span>
          <el-button size="mini" type="primary" style="float: right;margin:0 10px 0 0;" icon="el-icon-download" @click="handleDownload" />
          <el-button v-if="this.$route.params.id !== 'create'" size="mini" type="primary" style="float: right;margin:0 10px 0 0;" @click="handleLinkDB">{{ $t('chart.addToDashboard') }}</el-button>
          <el-button size="mini" type="primary" style="float: right;margin:0 10px 0 0;" icon="el-icon-save" @click="handleSave">{{ $t('common.save') }} </el-button>
          <el-button v-if="this.$route.params.id !== 'create'" size="mini" type="primary" style="float: right;margin:0 10px 0 0;" @click="$router.replace(`/chartpanel/create`)">{{ $t('chart.createNewChart') }}</el-button>
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
            <el-form-item id="dimensionInput" :label="$t('chart.dimensions')">
              <draggable v-model="dimensions" :group="{name: 'col',pull: true, put: true}" class="draggable-wrapper" @change="handleDimensionChange">
                <el-tag v-for="col in dimensions" :key="col.Column" class="draggable-item" size="small" closable @close="handleCloseDimensionTag(col)">
                  {{ col.Column }}
                </el-tag>
              </draggable>
            </el-form-item>

            <el-form-item id="fieldInput" :label="$t('chart.values')">
              <draggable v-model="caculCols" :group="{name: 'col',pull: true, put: true}" class="draggable-wrapper" @change="handleColChange">
                <el-tag v-for="col in caculCols" :key="col.Column" size="small" closable class="selected-field" @close="handleCloseColTag(col)">
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
                  {{ $t('chart.limit', [limit]) }}
                  <el-button type="text" @click="editLimit=true">{{ $t('common.edit') }}</el-button>
                </span>
                <span v-show="editLimit">
                  <el-input-number v-model="limit" :disabled="loading" size="mini" style="width:100px;" @blur="editLimit=false" />
                  <el-button size="mini" @click="editLimit=false">{{ $t('common.confirm') }}</el-button>
                </span>
              </div>
            </el-form-item>
          </el-form>
          <el-form class="chart-form" size="mini" label-position="top">
            <el-form-item :label="$t('chart.chartName')+':'">
              <el-input v-model="chartName" size="mini" :placeholder="$t('chart.namePlaceholder')" />
            </el-form-item>
            <el-form-item :label="$t('chart.chartDesc')+':'">
              <el-input v-model="chartDesc" size="mini" :placeholder="$t('chart.descPlaceholder')" />
            </el-form-item>
          </el-form>
        </div>

        <visualize-panel id="vizPanel" v-loading="loading" :data="result" :chart-type.sync="chartType" :schema="allSelected" />
      </el-card>
    </div>
    <el-dialog :title="$t('chart.myChart')" :visible.sync="showMyCharts">
      <el-table :data="myChartList">
        <el-table-column :label="$t('chart.chartName')" width="200" prop="chart_name" />
        <el-table-column :label="$t('chart.chartDesc')" prop="desc" />
        <el-table-column :label="$t('common.operation')" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="switchChart(scope.row)">
              {{ $t('common.edit') }}
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteChart(scope.row)">
              {{ $t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showMyCharts = false">{{ $t('common.close') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('dashboard.dashboardList')" :visible.sync="showDashboards">
      <div style="text-align:center;">
        <el-select v-model="selectedDb" size="small">
          <el-option v-for="item in dashboardList" :key="item.objectId" :label="item.name" :disabled="isDbDisbaled(item)" :value="item.objectId" />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="showDashboards = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="linkDb">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- <el-tooltip content="帮助中心" placement="top"> -->
    <el-dropdown class="help-center-wrapper" placement="top" size="mini" @command="handleHelp">
      <div class="help-center">
        <i class="el-icon-question" />
      </div>
      <el-dropdown-menu slot="dropdown" size="mini">
        <el-dropdown-item command="guide">
          {{ this.$t('common.openGuide') }}
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

const driver = new Driver()

export default {
  name: 'ChartPanel',
  components: { visualizePanel, dataPanel, draggable, filterPanel, orderPanel },
  data() {
    return {
      loading: false,
      result: [],
      dataSrc: {},
      limit: 200,
      orderByStrs: [],
      filterStr: undefined,
      editLimit: false,
      currentFilters: [],
      chartType: 'table',
      chartName: undefined,
      chartDesc: undefined,
      showMyCharts: false,
      myChartList: [],
      showDashboards: false,
      dashboardList: [],
      selectedDb: undefined,
      linkedDbIds: [],
      execInstance: null
    }
  },
  computed: {
    caculCols: {
      get() {
        return this.$store.state.chart.caculCols
      }, set(value) {
        this.$store.commit('chart/SET_CACUL_COLS', value)
      }
    },
    dimensions: {
      get() {
        return this.$store.state.chart.dimensions
      },
      set(value) {
        this.$store.commit('chart/SET_DIMENSIONS', value)
      }
    },
    allSelected() {
      return this.dimensions.concat(this.caculCols)
    },
    sqlSentence() {
      return buildSqlSentence({
        dataSrc: this.dataSrc.table,
        selectedCalcul: this.caculCols,
        selectedDimension: this.dimensions,
        orderByStrs: this.orderByStrs,
        filterStr: this.filterStr,
        limit: this.limit
      })
    }
  },
  watch: {
    sqlSentence(value) {
      if (value) {
        this.fetchData(value)
      } else {
        this.result = []
      }
    },
    '$route.params.id': {
      immediate: true,
      handler() {
        if (this.$route.params.id !== 'create') {
          getChartById(this.$route.params.id).then(resp => {
            const chart = resp.data
            this.chartName = chart.chart_name
            this.chartDesc = chart.desc
            const content = JSON.parse(chart.content) || {}
            this.dataSrc.table = content.dataSrc
            this.dataSrc.source_id = chart.source_id
            this.chartType = content.chartType
            this.limit = content.limit || 200
            this.currentFilters = content.filters
            this.orderByStrs = content.orderByStrs
            this.$store.commit('chart/SET_CACUL_COLS', content.selectedCalcul)
            this.$store.commit('chart/SET_DIMENSIONS', content.selectedDimension)
            this.$refs.dataPanel.initWithDataSrc(this.dataSrc)
          })
        } else {
          this.chartName = undefined
          this.chartDesc = undefined
          this.$store.commit('chart/SET_CACUL_COLS', [])
          this.$store.commit('chart/SET_DIMENSIONS', [])
          this.$nextTick(() => {
            this.$refs.dataPanel.initWithDataSrc()
          })
        }
      }
    }
  },
  methods: {
    fetchData(sqlSentence) {
      if (this.loading) {
        this.execInstance && this.execInstance.cancel()
      }
      this.loading = true
      this.execInstance = exeSql()
      this.execInstance.fetch({ source_id: this.dataSrc.source_id, sql: sqlSentence }).then(resp => {
        this.loading = false
        this.result = resp.data
      })
    },
    handleDataSrcChange(value) {
      this.dataSrc = value
      this.$store.commit('chart/SET_CACUL_COLS', [])
      this.$store.commit('chart/SET_DIMENSIONS', [])
      this.filterStr = undefined
      this.orderByStrs = []
    },
    handleColChange(evt) {
      if (evt.added) {
        this.$store.commit('chart/ADD_CACUL_COL', evt.added.element)
      }
    },
    handleDimensionChange(evt) {
      if (evt.added) {
        this.$store.commit('chart/ADD_DIMENSION_COL', evt.added.element)
      }
    },
    handleCloseColTag(col) {
      this.$store.commit('chart/DELETE_CACUL_COL', col)
    },
    handleCloseDimensionTag(col) {
      this.$store.commit('chart/DELETE_DIMENSION_COL', col)
    },
    handleAddFilter(value) {
      this.filterStr = value
    },
    handleSave() {
      if (!this.chartName) {
        this.$message({
          type: 'warning',
          message: this.$t('chart.chartNameWarning')
        })
        return
      }
      const chartId = this.$route.params.id === 'create' ? undefined : this.$route.params.id
      const obj = {
        dataSrc: this.dataSrc.table,
        source_id: this.dataSrc.source_id,
        orderByStrs: this.orderByStrs,
        limit: this.limit,
        selectedCalcul: this.caculCols,
        selectedDimension: this.dimensions,
        chartType: this.chartType,
        filters: this.currentFilters
      }
      const data = {
        id: chartId,
        chart_name: this.chartName,
        source_id: this.dataSrc.source_id,
        desc: this.chartDesc,
        content: obj
      }
      if (chartId) {
        updateChart(data).then(resp => {
          this.$message({
            type: 'success',
            message: this.$t('common.saveSuccess')
          })
        })
      } else {
        createChart(data).then(resp => {
          // console.log(resp)
          this.$router.replace(`/chartpanel/${resp.data.id}`)
          this.$message({
            type: 'success',
            message: this.$t('common.saveSuccess')
          })
        })
      }
    },
    handleLinkDB() {
      this.showDashboards = true
      this.getDbByChart(this.$route.params.id)
      dashboardList().then(resp => {
        this.dashboardList = resp.data.dashboards
      })
    },
    getDbByChart(id) {
      dbByChart(id).then(resp => {
        this.linkedDbIds = resp.data || []
      })
    },
    isDbDisbaled(db) {
      return !!this.linkedDbIds.find(id => id === db.objectId)
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
          message: this.$t('common.saveSuccess')
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
      this.$confirm(this.$t('chart.beforeLeaveConfirm'), this.$t('common.confirm')).then(() => {
        this.$router.replace(`/chartpanel/${chart.chart_id}`)
        this.showMyCharts = false
      })
    },
    deleteChart(chart) {
      this.$confirm(this.$t('chart.deleteConfirm', chart.chart_name), this.$t('common.confirm')).then(() => {
        deleteChart({ chart_id: chart.chart_id }).then(() => {
          if (this.$route.params.id === chart.chart_id) {
            this.$router.push('/chartpanel/create')
            this.showMyCharts = false
          } else {
            this.viewAllChart()
          }
          this.$message({
            type: 'success',
            message: this.$t('common.deleteSuccess')
          })
        })
      })
    },
    handleHelp(command) {
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
