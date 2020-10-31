import { trimColType } from '@/utils/buildSentence'
import { sqlFunc } from '@/utils/configs'

export default {
  namespaced: true,
  state: {
    dimensions: [],
    caculCols: [],
    allCols: []
  },
  mutations: {
    SET_ALL_COLS(state, allCols) {
      state.allCols = allCols
    },
    SET_CACUL_COLS(state, cols) {
      state.caculCols = cols
    },
    ADD_CACUL_COL(state, col) {
      const caculCols = state.caculCols
      const colType = trimColType(col.Type)
      const index = caculCols.findIndex((item) => item.Column === col.Column)
      const caculCol = {
        Column: col.Column,
        calculFunc: colType.availableFunc[0],
        Type: col.Type,
        availableFunc: colType.availableFunc.map((func) => {
          return {
            name: sqlFunc[func],
            func
          }
        })
      }
      caculCols.splice(index, 1, caculCol)
      state.caculCols = caculCols
    },
    DELETE_CACUL_COL(state, col) {
      const caculCols = state.caculCols
      const index = caculCols.findIndex((c) => c.Column === col.Column)
      caculCols.splice(index, 1)
      state.caculCols = caculCols
    },
    SET_DIMENSIONS(state, cols) {
      state.dimensions = cols
    },
    ADD_DIMENSION_COL(state, col) {
      // state.dimensions = cols
      const dimensions = state.dimensions
      col.isDimension = true
      const index = dimensions.findIndex((c) => c.Column === col.Column)
      dimensions.splice(index, 1, col)
      state.dimensions = dimensions
    },
    DELETE_DIMENSION_COL(state, col) {
      // state.dimensions = cols
      const dimensions = state.dimensions
      const index = dimensions.findIndex((c) => c.Column === col.Column)
      dimensions[index].isDimension = false
      dimensions.splice(index, 1)
      state.dimensions = dimensions
    }
  }
}
