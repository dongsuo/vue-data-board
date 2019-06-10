<template>
  <div v-loading="loading" class="container">
    <el-card body-style="padding: 0px;" class="dashboard-list" shadow="never">
      <div slot="header">
        <span>仪表盘</span>
        <i class="el-icon-plus" @click="addDashboard" />
      </div>
      <ul>
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
      </ul>
    </el-card>
    <dashboardItem :dashboard="currentDashboard" />
    <el-dialog title="编辑/新建 Dashboard" :visible.sync="editDialogVisible">
      <el-form label-width="100px;">
        <el-form-item label=" Dashboard 名称：">
          <el-input v-model="dbObj.name" size="small" style="width: 250px;" placeholder="请输入 Dashboard 名称" />
        </el-form-item>
        <el-form-item label=" Dashboard 描述：">
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
import dashboardItem from './dashboardItem'
import { addDashboard, updateDashboard, dashboardList } from '@/api/dashboard'
export default {
  components: { dashboardItem },
  data() {
    return {
      dashboardList: [],
      currentDashboard: undefined,
      editDialogVisible: false,
      dbObj: {},
      loading: false
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
        this.dashboardList = resp.data
        if (this.$route.query.id) {
          this.currentDashboard = this.dashboardList.find(item => item.objectId === this.$route.query.id)
        } else {
          this.currentDashboard = this.dashboardList[0]
        }
        if (this.currentDashboard) {
          this.$router.push(`/dashboard?id=${this.currentDashboard.objectId}`)
        }
      })
    },
    switchDb(db) {
      this.$confirm('确定要离开当前页面吗?系统可能不会保存您所做的更改。', '提示').then(() => {
        this.currentDashboard = db
        this.$router.push(`/dashboard?id=${this.currentDashboard.objectId}`)
      })
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
    deleteDashboard(db) {
      console.log(db)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: calc(100vh - 62px);
  align-items: stretch;
  .dashboard-list {
    width: 250px;
    height: 100%;
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
