import i18n from '@/i18n'

const steps = [
  {
    element: '#dataPanel',
    popover: {
      title: i18n.t('guide.dataPanel'),
      description: i18n.t('guide.dataPanelDesc'),
      position: 'right'
    }
  },
  {
    element: '#formPanel',
    popover: {
      title: i18n.t('guide.formPanel'),
      description: i18n.t('guide.formPanelDesc'),
      position: 'bottom'
    }
  },
  {
    element: '#dimensionInput',
    popover: {
      title: i18n.t('guide.dimensionInput'),
      description: i18n.t('guide.dimensionInputDesc'),
      position: 'top'
    }
  },
  {
    element: '#fieldInput',
    popover: {
      title: i18n.t('guide.fieldInput'),
      description: i18n.t('guide.fieldInputDesc'),
      position: 'bottom'
    }
  },
  {
    element: '#vizPanel',
    popover: {
      title: i18n.t('guide.vizPanel'),
      description: i18n.t('guide.vizPanelDesc'),
      position: 'top'
    }
  }
]

export default steps
