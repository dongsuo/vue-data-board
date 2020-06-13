<template>
  <div>
    <dashboardItem :dashboard="currentDashboard" mode="view" />
  </div>
</template>
<script>
import dashboardItem from './dashboardItem'
import { getdDashboardById } from '@/api/dashboard'

export default {
  components: { dashboardItem },
  data() {
    return {
      currentDashboard: undefined
    }
  },
  created() {
    getdDashboardById(this.$route.params.id).then(resp => {
      resp.data.content = JSON.parse(resp.data.content)
      this.currentDashboard = resp.data
    })
  }
}
</script>
