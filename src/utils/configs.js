export const sqlFunc = {
  sum: '合计',
  avg: '平均',
  max: '最大值',
  min: '最小值',
  count: '计数',
  none: '无'
}

export const filterOperator = [
  { operator: '=', name: '等于', paramNum: 1 },
  { operator: '>', name: '大于', paramNum: 1 },
  { operator: '<', name: '小于', paramNum: 1 },
  { operator: '>=', name: '大于等于', paramNum: 1 },
  { operator: '<=', name: '小于等于', paramNum: 1 },
  { operator: '!=', name: '不等于', paramNum: 1 },
  { operator: 'BETWEEN', name: '区间', paramNum: 2 },
  { operator: 'in', name: 'In', paramNum: -1 },
  { operator: 'like', name: ' 匹配', paramNum: 1 }
]

export const dataType = [
  { name: 'tinyint', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'smallint', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'mediumint', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'int', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'bigint', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'float', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'double', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'real', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'decimal', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'timestamp', needQuotation: false, availableFunc: ['count', 'none'] },
  { name: 'date', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'time', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'datetime', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'year', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'char', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'varchar', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'tinytext', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'text', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'mediumtext', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'longtext', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'integer', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] }
]
