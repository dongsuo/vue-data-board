const steps = [
  {
    element: '#dataPanel',
    popover: {
      title: '数据面板',
      description: '这里是数据源以及数据源的字段列表，你可以在这里切换数据源、将字段拖拽到数据查询面板进行查询',
      position: 'right'
    }
  },
  {
    element: '#formPanel',
    popover: {
      title: '数据查询面板',
      description: '这里进行数据查询，你可以在这里构建、调整查询语句，实现对数据的查询',
      position: 'bottom'
    }
  },
  {
    element: '#dimensionInput',
    popover: {
      title: '维度编辑',
      description: '维度是指数据归纳的角度，如时间维度、类别维度等，维度一般不宜超过 2 个',
      position: 'top'
    }
  },
  {
    element: '#fieldInput',
    popover: {
      title: '字段编辑',
      description: '字段是指查询数据的内容，如个数、总和等，字段可以有多个，但是不宜过多以免影响可视化效果',
      position: 'bottom'
    }
  },
  {
    element: '#vizPanel',
    popover: {
      title: '可视化面板',
      description: '这里是可视化面板，可以在此对数据进行可视化，选择不同的图表类型和样式等等',
      position: 'top'
    }
  }
]

export default steps
