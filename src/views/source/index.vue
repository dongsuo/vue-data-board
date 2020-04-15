<template>
  <div class="page-container">
    <el-button type="primary" icon="el-icon-plus" size="small" class="add-source-btn" @click="dialogVisible=true">
      添加数据源
    </el-button>
    <el-table :data="list" border highlight-current-row stripe class="source-table">
      <el-table-column label="Base Name" prop="base_alias" align="center" width="200px" />
      <el-table-column label="Host" prop="host" />
      <el-table-column label="Port" prop="port" />
      <el-table-column label="User" prop="username" />
      <el-table-column label="Database" prop="database" />
      <el-table-column label="Created Time" prop="created_at" width="155px">
        <template slot-scope="scope">
          {{ parseTime(scope.row.created_at) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="status" prop="status" /> -->
      <el-table-column label="Operations" align="center" width="280px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleAddTable(scope.row)">
            接入数据表
          </el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加数据源" :visible.sync="dialogVisible">
      <el-form label-width="100px" size="mini">
        <el-form-item label="Host: ">
          <el-input v-model="formData.host" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item label="Port: ">
          <el-input v-model="formData.port" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item label="User Name: ">
          <el-input v-model="formData.username" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item label="Password: ">
          <el-input v-model="formData.password" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item label="Database: ">
          <el-input v-model="formData.database" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item label="Base Name: ">
          <el-input v-model="formData.base_alias" class="source-input" placeholder="" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addSource, sourceList, updateSource, deleteSource } from '@/api/source'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      dialogVisible: false,
      list: [],
      formData: {
        host: '',
        port: '',
        username: '',
        password: '',
        database: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    parseTime,
    async getList() {
      const { data } = await sourceList()
      this.list = data
    },
    handleEdit(row) {
      this.formData = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('删除后不可撤销，确定要删除该Base的接入?', '确认').then(async() => {
        await deleteSource({ source_id: row.source_id })
        this.$message.success('删除成功')
        this.getList()
      })
    },
    async handleSubmit() {
      if (this.formData.source_id) {
        await updateSource(this.formData)
      } else {
        await addSource(this.formData)
      }
      this.getList()
      this.dialogVisible = false
    },
    handleAddTable(row) {

    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
}
.add-source-btn {
  margin-bottom: 24px;
}
.source-input {
  width: 200px;
}
</style>
