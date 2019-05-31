<template>
  <div>
    <el-card body-style="padding: 0px;" class="tool-bar">
      <div slot="header" style="display: flex; justify-content:space-between;">
        <span>Default Dashboard</span>
        <el-button type="primary" size="mini" @click="$router.push('/chartpanel/create')">
          Add Chart
        </el-button>
      </div>
    </el-card>
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
          <i class="el-icon-edit" @click="handleEdit(charts[index].index)" />
          <i class="el-icon-delete" @click="handleDelete(charts[index].index)" />
        </div>
        <visualize-panel :key="item.index" :ref="`chartInstance${index}`" :data="results[index]" :schema="charts[index].allSelected" :chart-type.sync="charts[index].chartType" :is-edit-mode="false" :chart-style="{height: `${item.h*30 + 10 * (item.h-1) - 40}px`}" />
      </grid-item>
    </grid-layout>
    <div v-else v-loading="loading" class="welcome-container">
      <el-button type="primary" size="mini" @click="$router.push('/chartpanel/create')">
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
  </div>
</template>
<script>
import { GridLayout } from 'vue-grid-layout'
import { GridItem } from 'vue-grid-layout'
import visualizePanel from '../ChartPanel/components/visualizePanel'
import exeSql from '@/mock/exeSql'
import { getChart, deleteChart } from '@/mock/chart'
import { buildSqlSentence, buildFilterSentence } from '@/utils/buildSentence'

export default {
  components: { GridLayout, GridItem, visualizePanel },
  data() {
    return {
      charts: [],
      results: [],
      loading: false,
      mode: 'edit',
      layout: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // init
      this.charts = []
      this.layout = []
      this.loading = true
      setTimeout(() => {
        this.charts = getChart()
        this.loading = this.charts.length !== 0
        this.layout = this.charts.map((item, index) => {
          this.results.push([])
          item.allSelected = []
          item.allSelected = item.allSelected.concat(item.selectedCalcul).concat(item.selectedDimension)
          console.log(item.allSelected)
          const filterStrs = item.filters.map(buildFilterSentence)

          const sqlSentence = buildSqlSentence({
            dataSrc: item.dataSrc,
            selectedCalcul: item.selectedCalcul,
            selectedDimension: item.selectedDimension,
            orderByStrs: item.orderByStrs,
            filterStr: filterStrs.join(' and '),
            limit: item.limit
          })
          this.exeSql(sqlSentence, item, index)
          return {
            id: index, x: index % 2 === 0 ? 0 : 12, y: Math.floor(index / 2), w: 12, h: 9, i: index
          }
        })
      }, 1000)
    },
    handleEdit(index) {
      console.log(index)
      this.$router.push(`/chartpanel/${index}`)
    },
    handleDelete(index) {
      this.$confirm('确认从该 Dashboard 中删除该图表?', '提示', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteChart(index)
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    handleResize(i, newH, newW, newHPx, newWPx) {
      this.$refs[`chartInstance${i}`][0].$children[0].$emit('resized')
    },
    exeSql(sqlSentence, item, index) {
      exeSql(sqlSentence).then(resp => {
        this.loading = false
        this.results.splice(index, 1, resp)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-bar {
  position: absolute;
  top:0;
  right:0;
  padding: 10px 10px 0 0;
  z-index: 9;
  i {
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
