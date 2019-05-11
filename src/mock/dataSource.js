export const sources = [
  { id: 2, name: 'mysql' }
]

export const bases = [
  { id: 9, name: 'datadrug' }
]

export const tables = [
  { id: 2496, name: 'order_analysis' }
]

export const tableSchema = [
  {
    'Type': 'varchar(19)',
    'Column': 'date'
  },
  {
    'Type': 'varchar(9)',
    'Column': 'user_src'
  },
  {
    'Type': 'varchar(11)',
    'Column': 'order_src'
  },
  {
    'Type': 'varchar(2)',
    'Column': 'order_location'
  },
  {
    'Type': 'int(5)',
    'Column': 'new_order'
  },
  {
    'Type': 'int(5)',
    'Column': 'payed_order'
  },
  {
    'Type': 'int(4)',
    'Column': 'pending_order'
  },
  {
    'Type': 'int(4)',
    'Column': 'cancel_order'
  },
  {
    'Type': 'int(4)',
    'Column': 'reject_order'
  },
  {
    'Type': 'int(4)',
    'Column': 'good_order'
  },
  {
    'Type': 'int(4)',
    'Column': 'report_order'
  }
]

export const tempMockData = {
  'schema': {
    'primaryKey': [
      'index'
    ],
    'pandas_version': '0.20.0',
    'fields': [
      {
        'type': 'integer',
        'name': 'index'
      },
      {
        'type': 'string',
        'name': 'total_amount'
      },
      {
        'type': 'string',
        'name': 'month_date_time'
      }
    ]
  },
  'data': [
    {
      'index': 0,
      'total_amount': '397223.12',
      'month_date_time': '2008-12'
    },
    {
      'index': 1,
      'total_amount': '444678.56',
      'month_date_time': '2008-09'
    },
    {
      'index': 2,
      'total_amount': '382070.24',
      'month_date_time': '2008-02'
    },
    {
      'index': 3,
      'total_amount': '486527.22',
      'month_date_time': '2008-08'
    },
    {
      'index': 4,
      'total_amount': '406257.49',
      'month_date_time': '2008-11'
    },
    {
      'index': 5,
      'total_amount': '540227.86',
      'month_date_time': '2008-04'
    },
    {
      'index': 6,
      'total_amount': '388797.98',
      'month_date_time': '2007-11'
    },
    {
      'index': 7,
      'total_amount': '523384.42',
      'month_date_time': '2008-03'
    },
    {
      'index': 8,
      'total_amount': '487726.83',
      'month_date_time': '2008-07'
    },
    {
      'index': 9,
      'total_amount': '412314.96',
      'month_date_time': '2008-10'
    },
    {
      'index': 10,
      'total_amount': '515657.99',
      'month_date_time': '2008-06'
    },
    {
      'index': 11,
      'total_amount': '435124.44',
      'month_date_time': '2007-12'
    },
    {
      'index': 12,
      'total_amount': '181152.41',
      'month_date_time': '2007-10'
    },
    {
      'index': 13,
      'total_amount': '10023.33',
      'month_date_time': '2007-07'
    },
    {
      'index': 14,
      'total_amount': '124292.90',
      'month_date_time': '2007-08'
    },
    {
      'index': 15,
      'total_amount': '479521.70',
      'month_date_time': '2008-01'
    },
    {
      'index': 16,
      'total_amount': '149727.25',
      'month_date_time': '2007-09'
    },
    {
      'index': 17,
      'total_amount': '539288.53',
      'month_date_time': '2008-05'
    }
  ]
}
