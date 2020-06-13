<template>
  <el-form-item :label="$t('chart.order')">
    <draggable v-model="orderByStrs" :group="{name: 'orderBy',pull: false, put: false}" style="display: inline-block;">
      <el-tag v-for="(item,index) in orderByStrs" :key="index" closable size="small" @close="handleCloseOrderBy">
        {{ item }}
      </el-tag>
    </draggable>
    <el-cascader v-model="orderBy" :options="orderByOption" :disabled="orderByOption.length===0" size="mini" :placeholder="$t('chart.selectOrderBy')" style="width: 150px;" @change="handleOrderByChange" />
  </el-form-item>
</template>
<script>
import draggable from 'vuedraggable'
import store from '../store'

export default {
  components: { draggable },
  props: {
    value: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      orderBy: []
    }
  },
  computed: {
    allSelected() {
      return store.state.caculCols.concat(store.state.dimensions)
    },
    orderByStrs: {
      set(value) {
        this.$emit('input', value)
      },
      get() {
        return this.value
      }
    },
    orderByOption() {
      return this.allSelected.map(col => {
        return {
          value: col.Column,
          label: col.Column,
          children: [{
            value: 'desc',
            label: this.$t('chart.descend')
          }, {
            value: 'asc',
            label: this.$t('chart.ascend')
          }]
        }
      })
    }
  },
  watch: {
    'store.state.dimensions': function(value) {
      this.watchHandler(value)
    },
    'store.state.caculCols': function(value) {
      this.watchHandler(value)
    }
  },
  methods: {
    watchHandler(cols) {
      this.orderByStrs.forEach((orderByStr, index) => {
        const colName = orderByStr.split(' ')[0]
        if (!cols.findIndex(col => col.Column === colName)) {
          this.orderByStrs.splice(index, 1)
        }
      })
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
    }
  }
}
</script>
