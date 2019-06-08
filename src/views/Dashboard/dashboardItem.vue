<template>
  <div class="dashboard-wrapper">
    <div class="tool-bar">
      <div>
        <span class="db-name">{{ dashboard.name }}</span>
        <span>{{ dashboard.desc }}</span>
      </div>
      <el-button type="primary" size="mini" @click="handleLinkChart">
        Add Chart
      </el-button>
    </div>
    <grid-layout
      v-if="charts.length!==0"
      v-loading="loading"
      :layout="layout || []"
      :col-num="24"
      :row-height="30"
      :is-draggable="mode === 'edit'"
      :is-resizable="mode === 'edit'"
      :is-mirrored="false"
      :vertical-compact="true"
      :pane-container="false"
      :margin="[10, 10]"
      :use-css-transforms="true"
      style="min-height: 500px;"
      @layout-updated="handleLayoutChange"
    >
      <grid-item
        v-for="(item, index) in layout || []"
        :key="item.index"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resized="handleResize"
      >
        <div class="operation-bar">
          <span style="float:left;">{{ charts[index].chart_name }}</span>
          <i class="el-icon-edit" @click="handleEdit(charts[index])" />
          <i class="el-icon-delete" @click="handleDelete(charts[index])" />
        </div>
        <visualize-panel :key="item.index" :ref="`chartInstance${item.i}`" :data="results[index]" :schema="charts[index].content.allSelected" :chart-type.sync="charts[index].content.chartType" :is-edit-mode="false" :chart-style="{height: `${item.h*30 + 10 * (item.h-1) - 40}px`}" />
      </grid-item>
    </grid-layout>
    <div v-else v-loading="loading" class="welcome-container">
      <el-button type="primary" size="mini" @click="handleLinkChart">
        Add Chart
      </el-button>
      <div>
        <el-link type="info" :underline="false">
          <router-link to="/chartpanel/create">
            Dashboard Is Empty，Go Create Your First Chart!
          </router-link>
        </el-link>
      </div>
    </div>
    <el-dialog title="我的图表" :visible.sync="showChartList">
      <el-button type="primary" size="mini" @click="$router.push('/chartpanel/create')">
        Create New Chart
      </el-button>
      <el-table :data="myChartList">
        <el-table-column label="名称" width="200" prop="chart_name" />
        <el-table-column label="描述" prop="desc" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="linkChart(scope.row)">
              Add
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="showChartList = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { GridLayout } from 'vue-grid-layout'
import { GridItem } from 'vue-grid-layout'
import visualizePanel from '../ChartPanel/components/visualizePanel'
import exeSql from '@/mock/exeSql'
import { chartByDashboard, updateDashboard, addChartToDB, unMapChartDb } from '@/api/dashboard'
import { chartList } from '@/api/chart'
import { buildSqlSentence, buildFilterSentence } from '@/utils/buildSentence'

export default {
  components: { GridLayout, GridItem, visualizePanel },
  props: {
    dashboard: {
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      charts: [],
      results: [],
      loading: false,
      mode: 'edit',
      layout: [],
      myChartList: [],
      showChartList: false
    }
  },
  watch: {
    'dashboard.objectId': {
      immediate: true,
      handler(value) {
        if (!value) return
        this.getList(value)
      }
    }
  },
  methods: {
    getList() {
      this.charts = []
      this.layout = []
      this.loading = true
      chartByDashboard(this.dashboard.objectId).then(resp => {
        this.loading = false
        this.charts = resp.data
        let filterStrs = []
        const layout = (this.dashboard.content && this.dashboard.content.layout) || []
        this.charts.forEach((chart, index) => {
          this.results.push([])
          chart.content.allSelected = []
          chart.content.allSelected = chart.content.allSelected.concat(chart.content.selectedCalcul).concat(chart.content.selectedDimension)
          if (chart.content.filters) {
            filterStrs = chart.content.filters.map(buildFilterSentence)
          }
          const sqlSentence = buildSqlSentence({
            dataSrc: chart.content.dataSrc,
            selectedCalcul: chart.content.selectedCalcul,
            selectedDimension: chart.content.selectedDimension,
            orderByStrs: chart.content.orderByStrs,
            filterStr: filterStrs.join(' and '),
            limit: chart.content.limit
          })
          this.exeSql(sqlSentence, chart, index)
          if (!layout.find(layoutItem => layoutItem.id === chart.objectId)) {
            this.generatePosition(chart, layout, index)
          }
        })
        this.layout = layout.filter(item => {
          return this.charts.find(chart => chart.objectId === item.id)
        })
        this.handleLayoutChange()
        // console.log('generated', layout)
      })
    },
    generatePosition(chart, layout, index) {
      let posObj
      if (layout.length === 0) {
        posObj = {
          id: chart.objectId,
          x: 0,
          y: 0,
          w: 12,
          h: 9,
          i: chart.objectId
        }
      } else {
        layout.forEach(item => {
          item.yOffSet = item.h + item.y
          item.xOffSet = item.x + item.w
        })
        layout.sort((a, b) => {
          return (b.yOffSet) - (a.yOffSet)
        })
        const endElement = layout[0]
        // console.log('generating', layout)
        const secondElementH = layout[1] ? layout[1].yOffSet : 0

        const isNewline = endElement.xOffSet > 12 || (endElement.yOffSet - secondElementH) < 5
        posObj = {
          id: chart.objectId,
          x: isNewline ? 0 : endElement.xOffSet,
          y: isNewline ? endElement.yOffSet : endElement.y,
          w: 12,
          h: isNewline ? 9 : endElement.yOffSet - secondElementH,
          i: chart.objectId
        }
        // console.log(endElement.xOffSet, endElement.yOffSet, secondElementH, isNewline, posObj.id, posObj.x, posObj.y, posObj.w, posObj.h)
      }
      layout.push(posObj)
    },
    handleLinkChart() {
      chartList().then(resp => {
        this.myChartList = resp.data
        this.showChartList = true
      })
    },
    linkChart(chart) {
      const data = {
        chart_id: chart.chart_id,
        dashboard_id: this.dashboard.objectId
      }
      addChartToDB(data).then(resp => {
        this.showChartList = false
        this.getList()
        this.$message({
          type: 'success',
          message: '添加成功！'
        })
      })
    },
    handleEdit(chart) {
      this.$router.push(`/chartpanel/${chart.objectId}`)
    },
    handleDelete(chart) {
      this.$confirm('该操作将从该 Dashboard 中删除该图表，并不会删除原图表，确认继续?', '提示', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // deleteChart(index)
        const deleteChartIndex = this.layout.findIndex(item => item.id === chart.objectId)
        const layout = JSON.parse(JSON.stringify(this.layout))
        layout.splice(deleteChartIndex, 1)
        this.dashboard.content.layout = layout
        const data = {
          chart_id: chart.objectId,
          dashboard_id: this.dashboard.objectId
        }
        Promise.all([updateDashboard(this.dashboard), unMapChartDb(data)]).then(resp => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    handleLayoutChange() {
      this.dashboard.content = this.dashboard.content || {}
      this.dashboard.content.layout = this.layout
      updateDashboard(this.dashboard).then(() => {
        console.log('layout saved')
      })
    },
    handleResize(i, newH, newW, newHPx, newWPx) {
      this.$refs[`chartInstance${i}`][0].$children[0].$emit('resized')
    },
    exeSql(sqlSentence, item, index) {
      exeSql(sqlSentence).then(resp => {
        this.loading = false
        this.results.splice(index, 1, resp.data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-bar {
  display: flex;
  justify-content: space-between;
  border-top: none;
  height: 45px;
  line-height: 45px;
  color:#303133;
  padding: 0 10px;
  position: relative;
  .db-name {
    font-size: 1.2em;
    font-weight: 600;
    color: #909399;
    margin-left: 0;
  }
  span {
    color: #C0C4CC;
    font-size: 0.8em;
    margin-left: 10px;
  }
  .el-button {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 28px;
    margin-right: 20px;
  }

}
.operation-bar {
  position: absolute;
  top:0;
  right:0;
  left:0;
  padding: 10px 10px 0 0;
  z-index: 9;
  i {
    float: right;
    margin-right: 10px;
    color: #409EFF;
    cursor: pointer;
  }
}
.welcome-container {
  text-align: center;
  height: 500px;
  color:#C0C4CC;
  /deep/ .el-button {
    margin-top: 200px;
    margin-bottom: 25px;
  }
}
</style>
