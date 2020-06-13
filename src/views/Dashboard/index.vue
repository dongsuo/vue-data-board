<template>
  <div v-loading="loading" class="container">
    <el-card body-style="padding: 0px;" class="dashboard-list" shadow="never">
      <div slot="header">
        <span>{{ $t('common.dashboard') }}</span>
        <i class="el-icon-plus" @click="addDashboard" />
      </div>
      <ul>
        <draggable v-model="dashboardList" :group="{name: 'dashboard',pull: true}" class="draggable-wrapper" @change="handleOrderChange">
          <li v-for="item in dashboardList" :key="item.dashboard_id" :class="{'dashboard-list-item': true, 'high-light-dashboard': currentDashboard.dashboard_id === item.dashboard_id}">
            <span @click="switchDb(item)">
              <i class="el-icon-document" />
              <span>{{ item.name }}</span>
            </span>
            <el-dropdown szie="mini" trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    type: 'edit',
                    target: item
                  }"
                >
                  {{ $t('common.edit') }}
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{
                    type: 'delete',
                    target: item
                  }"
                >
                  {{ $t('common.delete') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          <!-- {{ item.desc }} -->
          </li>
        </draggable>
      </ul>
    </el-card>
    <dashboardItem :dashboard="currentDashboard" mode="edit" />
    <el-dialog :title="$t('dashboard.addOrEditDashboard')" width="750px" :visible.sync="editDialogVisible">
      <el-form label-width="160px">
        <el-form-item :label="$t('dashboard.dashboardName')">
          <el-input v-model="dbObj.name" size="small" style="width: 450px;" :placeholder="$t('dashboard.dashboardNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('dashboard.dashboardDesc')">
          <el-input v-model="dbObj.desc" type="textarea" :rows="5" size="small" style="width: 450px;" :placeholder="$t('dashboard.dashboardDescPlaceholder')" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="editDialogVisible = false"> {{ $t('common.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="handleSubmit"> {{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import dashboardItem from './dashboardItem'
import { addDashboard, updateDashboard, dashboardList, deleteDashboard, dbOrder } from '@/api/dashboard'

export default {
  components: { dashboardItem, draggable },
  data() {
    return {
      dashboardList: [],
      currentDashboard: undefined,
      editDialogVisible: false,
      dbObj: {},
      loading: false,
      isCollapse: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      dashboardList().then(resp => {
        this.loading = false
        this.dashboardList = []
        resp.data.order.forEach((id, index) => {
          const itemIndex = resp.data.dashboards.findIndex(item => item.dashboard_id === id)
          if (itemIndex >= 0) {
            this.dashboardList.push(resp.data.dashboards[itemIndex])
            resp.data.dashboards.splice(itemIndex, 1)
          } else {
            console.log(id, index)
          }
        })
        this.dashboardList = this.dashboardList.concat(resp.data.dashboards)
        const dashboard = this.dashboardList.find(item => item.dashboard_id === this.$route.query.id)
        if (dashboard) {
          this.currentDashboard = dashboard
        } else {
          this.currentDashboard = this.dashboardList[0]
        }
        if (this.currentDashboard) {
          this.$router.push(`/dashboard?id=${this.currentDashboard.dashboard_id}`).catch(_ => {})
        }
      })
    },
    switchDb(db) {
      if (db.dashboard_id === this.currentDashboard.dashboard_id) {
        this.getList()
        return
      }
      // this.$confirm('确定要离开当前页面吗?系统可能不会保存您所做的更改。', '提示').then(() => {
      this.currentDashboard = db
      this.$router.push(`/dashboard?id=${this.currentDashboard.dashboard_id}`)
      // })
    },
    addDashboard() {
      this.dbObj = {}
      this.editDialogVisible = true
    },
    editDashboard(db) {
      this.dbObj = Object.assign({}, db)
      this.editDialogVisible = true
    },
    handleCommand(cmd) {
      if (cmd.type === 'edit') {
        this.editDashboard(cmd.target)
      } else {
        this.deleteDashboard(cmd.target)
      }
    },
    handleSubmit() {
      if (this.dbObj.dashboard_id) {
        updateDashboard(this.dbObj).then(resp => {
          this.getList()
          this.editDialogVisible = false
        })
      } else {
        addDashboard(this.dbObj).then(resp => {
          this.getList()
          this.editDialogVisible = false
        })
      }
    },
    handleOrderChange(evt) {
      const data = {
        order: this.dashboardList.map(item => item.dashboard_id)
      }
      dbOrder(data)
    },
    deleteDashboard(db) {
      this.$confirm(this.$t('dashboard.deleteConfirm', db.name), this.$t('common.confirm')).then(() => {
        deleteDashboard({ dashboard_id: db.dashboard_id }).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: this.$t('common.deleteSuccess')
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  min-height: calc(100vh - 62px);
  align-items: stretch;
  .dashboard-list {
    width: 250px;
    min-height: 100%;
    padding: 20px 10px;
    /deep/ .el-card__header {
      div {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #606266;
        i {
          cursor: pointer;
        }
      }
      padding: 5px 0px;
    }
    .dashboard-list-item {
      display: flex;
      justify-content: space-between;
      line-height: 35px;
      font-size: 14px;
      cursor: pointer;
      color: #606266;
      i {
        margin-right: 10px;
        line-height: 35px;
      }
    }
    .high-light-dashboard {
      color: #205cd8;
    }
  }
  .dashboard-wrapper {
    width: 100%;
  }
}
</style>
