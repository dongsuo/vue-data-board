import { trimColType } from '@/utils/buildSentence'
import { sqlFunc } from '@/utils/configs'

const store = {
  debug: process.env.NODE_ENV === 'development',
  state: {
    dimensions: [],
    caculCols: [],
    allCols: []
  },
  // dimensions actions
  addDimensionAction(col) {
    if (this.debug) console.log('adddimensionAction triggered with', col)
    col.isDimension = true
  },
  deleteDimensionAction(col) {
    if (this.debug) console.log('deleteDimensionAction triggered with', col)
    const index = this.state.dimensions.findIndex(c => c.Column === col.Column)
    this.state.dimensions[index].isDimension = false
    this.state.dimensions.splice(index, 1)
  },
  setDimensionsAction(dimensions) {
    if (this.debug) console.log('setDimensionsAction triggered')
    this.state.dimensions = dimensions
  },
  // caculCols actions
  addCaculColAction(col) {
    if (this.debug) console.log('addCaculColAction triggered with', col)
    const colType = trimColType(col.Type)
    const index = this.state.caculCols.findIndex(item => item.Column === col.Column)
    const caculCol = {
      Column: col.Column,
      calculFunc: colType.availableFunc[0],
      Type: col.Type,
      availableFunc: colType.availableFunc.map(func => {
        return {
          name: sqlFunc[func],
          func
        }
      })
    }
    this.state.caculCols.splice(index, 1, caculCol)
  },
  deleteCaculColAction(col) {
    if (this.debug) console.log('deleteCaculColAction triggered with', col)
    const index = this.state.caculCols.findIndex(c => c.Column === col.Column)
    this.state.caculCols.splice(index, 1)
  },
  setCaculColsAction(caculCols) {
    if (this.debug) console.log('setCaculColsAction triggered')
    this.state.caculCols = caculCols
  },
  // allCols action
  setAllColsAction(allCols) {
    if (this.debug) console.log('setAllColsAction triggered width', allCols)
    this.state.allCols = allCols
  }
}

export default store
