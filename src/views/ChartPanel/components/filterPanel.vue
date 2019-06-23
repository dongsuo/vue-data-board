<template>
  <el-form-item label="筛选">
    <el-tag v-for="(item,index) in currentFilters" :key="index" closable @close="handleClosefilter(index)" @click="handleEditFilter(item)">
      {{ generateFilterSentence(item) }}
    </el-tag>
    <el-button :disabled="disabled" type="primary" size="mini" style="width: 120px;" @click="visible=true">
      添加筛选条件
    </el-button>

    <el-dialog :visible="visible" title="添加筛选项">
      <el-form label-width="150px">
        <el-form-item label="请选择筛选字段" class="el-form-item">
          <el-select v-model="filteCol" size="mini" placeholder="选择筛选字段">
            <el-option v-for="item in sharedState.allCols" :key="item.Column" :label="item.Column" :value="item.Column" />
          </el-select>
        </el-form-item>

        <el-form-item label="请选择筛选方式" class="el-form-item">
          <el-select v-model="filterOperator" size="mini" placeholder="选择筛选方式">
            <el-option v-for="item in filterOperatorOpts" :key="item.name" :label="item.name" :value="item.operator" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="currentOperatorParamNum===-1" label="请输入判断条件值" class="el-form-item">
          <el-tag v-for="(item,index) in arrValue" :key="index" closable @close="handleRemove">
            {{ item }}
          </el-tag>
          <el-input v-model="value3" size="mini" type="text" style="width: 200px;" />
          <el-button size="mini" type="primary" @click="handleAdd">
            Add
          </el-button>
        </el-form-item>

        <el-form-item v-else label="请输入判断条件值" class="el-form-item">
          <el-input v-model="value1" size="mini" type="text" style="width: 200px;" />
          <span v-show="currentOperatorParamNum===2">~</span>
          <el-input v-show="currentOperatorParamNum===2" v-model="value2" style="width: 200px;" type="text" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="visible=false">Cancel</el-button>
        <el-button size="mini" type="primary" @click="handleConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </el-form-item>
</template>
<script>
import { filterOperator, dataType } from '@/utils/configs'
import { buildFilterSentence } from '@/utils/buildSentence'
import store from '../store'

export default {
  props: {
    disabled: {
      default: false
    },
    filters: {
      type: Array
    }
  },
  data() {
    return {
      visible: false,
      filterOperatorOpts: filterOperator,
      filterStrs: [],
      filteCol: undefined,
      filterOperator: undefined,
      value1: undefined,
      value2: undefined,
      value3: undefined,
      arrValue: [],
      currentFilters: [],
      sharedState: store.state
    }
  },
  computed: {
    currentOperatorParamNum() {
      const a = filterOperator.find(item => item.operator === this.filterOperator)
      return a ? a.paramNum : 1
    }
  },
  watch: {
    filters: {
      deep: true,
      handler(value) {
        this.currentFilters = value
      }
    }
  },
  methods: {
    handleClosefilter(index) {
      this.currentFilters.splice(index, 1)
      this.handleSubmit()
    },
    handleEditFilter(filter) {
      this.visible = true
      this.filteCol = filter.filteCol
      this.filterOperator = filter.filterOperator
      this.value1 = filter.value.value1
      this.value2 = filter.value.value2
      this.arrValue = filter.value.arrValue
    },
    handleAdd() {
      this.arrValue.push(this.value3)
      this.value3 = undefined
    },
    handleRemove(value) {
      this.arrValue.splice(this.arrValue.indexOf(value), 1)
    },
    handleConfirm() {
      if (!this.filteCol || !this.filterOperator) {
        this.$message({
          type: 'warning',
          message: '筛选字段和筛选方式不可为空'
        })
        return
      }
      const filterObj = {
        filteCol: this.filteCol,
        colType: this.sharedState.allCols.find(item => item.Column === this.filteCol).Type,
        filterOperator: this.filterOperator,
        value: {
          value1: this.value1,
          value2: this.value2,
          arrValue: this.arrValue
        },
        operatorParamNum: this.operatorParamNum(this.filterOperator)
      }
      const filterIndex = this.currentFilters.findIndex(item => {
        return item.filteCol === this.filteCol && item.filterOperator === this.filterOperator
      })
      if (filterIndex >= 0) {
        this.currentFilters.splice(filterIndex, 1, filterObj)
      } else {
        this.currentFilters.push(filterObj)
      }
      this.handleSubmit()
    },
    handleSubmit() {
      const filterStrs = this.currentFilters.map(buildFilterSentence)
      this.$emit('change', filterStrs.join(' and '))
      this.$emit('update: filters', this.currentFilters)
      this.visible = false
    },
    generateFilterSentence(item) {
      return buildFilterSentence(item)
    },
    operatorParamNum(operator) {
      const a = filterOperator.find(item => item.operator === operator)
      return a ? a.paramNum : 1
    },
    needQuotation(col) {
      const colType = this.sharedState.allCols.find(item => item.Column === col).Type
      if (colType.indexOf('(') >= 0) {
        return dataType.find(type => type.name === colType.split('(')[0].toLowerCase()).needQuotation
      } else {
        return dataType.find(type => type.name === colType.toLowerCase()).needQuotation
      }
    },
    addQuotation(valueObj) {
      return {
        value1: `'${valueObj.value1}'`,
        value2: `'${valueObj.value2}'`,
        arrValue: valueObj.arrValue.map(value => `'${value}'`)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
