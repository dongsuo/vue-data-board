<template>
  <div v-loading="loading" class="container">
    <el-card body-style="padding: 0px;" class="dashboard-list" shadow="never">
      <div slot="header">
        <span>仪表盘</span>
        <i class="el-icon-plus" @click="addDashboard" />
      </div>
      <ul>
        <draggable v-model="dashboardList" :group="{name: 'dashboard',pull: true}" class="draggable-wrapper" @change="handleOrderChange">
          <li v-for="item in dashboardList" :key="item.objectId" :class="{'dashboard-list-item': true, 'high-light-dashboard': currentDashboard.objectId === item.objectId}">
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
                  编辑
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{
                    type: 'delete',
                    target: item
                  }"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          <!-- {{ item.desc }} -->
          </li>
        </draggable>
      </ul>
    </el-card>
    <dashboardItem :dashboard="currentDashboard" mode="edit" />
    <el-dialog title="编辑/新建看板" :visible.sync="editDialogVisible">
      <el-form label-width="100px;">
        <el-form-item label=" 看板名称：">
          <el-input v-model="dbObj.name" size="small" style="width: 250px;" placeholder="请输入看板名称" />
        </el-form-item>
        <el-form-item label=" 看板描述：">
          <el-input v-model="dbObj.desc" size="small" style="width: 250px;" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
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
          const itemIndex = resp.data.dashboards.findIndex(item => item.objectId === id)
          if (itemIndex >= 0) {
            this.dashboardList.push(resp.data.dashboards[itemIndex])
            resp.data.dashboards.splice(itemIndex, 1)
          } else {
            console.log(id, index)
          }
        })
        this.dashboardList = this.dashboardList.concat(resp.data.dashboards)
        const dashboard = this.dashboardList.find(item => item.objectId === this.$route.query.id)
        if (dashboard) {
          this.currentDashboard = dashboard
        } else {
          this.currentDashboard = this.dashboardList[0]
        }
        if (this.currentDashboard) {
          this.$router.push(`/dashboard?id=${this.currentDashboard.objectId}`)
        }
      })
    },
    switchDb(db) {
      if (db.objectId === this.currentDashboard.objectId) {
        this.getList()
        return
      }
      // this.$confirm('确定要离开当前页面吗?系统可能不会保存您所做的更改。', '提示').then(() => {
      this.currentDashboard = db
      this.$router.push(`/dashboard?id=${this.currentDashboard.objectId}`)
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
      if (this.dbObj.objectId) {
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
        order: this.dashboardList.map(item => item.objectId)
      }
      dbOrder(data).then(() => {
        console.log('order')
      })
    },
    deleteDashboard(db) {
      this.$confirm(`确定要删除${db.name}仪表盘吗？`, '提示').then(() => {
        deleteDashboard({ id: db.objectId }).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功！'
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
