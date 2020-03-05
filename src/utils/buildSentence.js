import { dataType } from './configs'

export function trimColType(str) {
  let colType
  if (str.indexOf('(') >= 0) {
    colType = dataType.find(type => type.name === str.split('(')[0])
  } else {
    colType = dataType.find(type => type.name === str)
  }
  return colType
}

export function buildSqlSentence({ dataSrc, selectedCalcul, selectedDimension, orderByStrs, filterStr, limit }) {
  let fields = []
  const groups = []
  let groupBy
  let orderBy
  let where
  let allSelected = []
  allSelected = allSelected.concat(selectedCalcul).concat(selectedDimension)
  fields = allSelected.map(field => {
    const calculField = selectedCalcul.find(col => col.Column === field.Column)
    if (calculField && calculField.calculFunc !== 'none') {
      return `${calculField.calculFunc || trimColType(calculField.Type).availableFunc[0]}(${calculField.Column}) as ${calculField.Column}`
    } else {
      groups.push(field.Column)
      return field.Column
    }
  })
  if (fields.length === 0 || !dataSrc) return
  if (groups.length > 0) {
    groupBy = `GROUP BY ${groups.join()}`
  }
  if (orderByStrs.length > 0) {
    orderBy = `ORDER BY ${orderByStrs.join()}`
  }
  if (filterStr) {
    where = `where ${filterStr}`
  }

  return `SELECT ${fields.join()} FROM ${dataSrc} ${where || ''} ${groupBy || ''} ${orderBy || ''} LIMIT ${limit || 200}`
}

export function buildFilterSentence(filter) {
  let filterSentence
  let valueObj = filter.value
  if (trimColType(filter.colType).needQuotation) {
    valueObj = addQuotation(filter.value)
  }
  if (filter.operatorParamNum === 1) {
    filterSentence = `${filter.filteCol} ${filter.filterOperator} ${valueObj.value1}`
  } else if (filter.operatorParamNum === 2) {
    filterSentence = `${filter.filteCol} ${filter.filterOperator} ${valueObj.value1} and ${valueObj.value2}`
  } else {
    filterSentence = `${filter.filteCol} ${filter.filterOperator} ('${valueObj.arrValue.join(',')}')`
  }
  return filterSentence
  function addQuotation(valueObj) {
    return {
      value1: `'${valueObj.value1}'`,
      value2: `'${valueObj.value2}'`,
      arrValue: valueObj.arrValue.map(value => `'${value}'`)
    }
  }
}
