<template>
  <div class="page-container">
    <el-button type="primary" icon="el-icon-plus" size="small" class="add-source-btn" @click="dialogVisible=true">
      Add Data Source
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
      <el-table-column label="Operations" align="center" width="290px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleAddTable(scope.row)">
            Manage Tables
          </el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            Edit
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加数据源" :visible.sync="dialogVisible" width="600px">
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
        <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Manage Tables" :visible.sync="showTableDialog">
      <el-table :data="tables">
        <el-table-column label="Table Name" prop="table">
          <template slot-scope="scope">
            <el-input v-model="scope.row.table_alias" size="mini" placeholder="" />
          </template>
        </el-table-column>
        <el-table-column label="Table" prop="table" />
        <el-table-column label="Linked">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-text="开启" inactive-text="关闭" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showTableDialog = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="saveTableConfig">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addSource, sourceList, updateSource, tablesByBase, saveTableConfig } from '@/api/source'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      dialogVisible: false,
      list: [],
      tables: [],
      formData: {
        host: '',
        port: '',
        username: '',
        password: '',
        database: ''
      },
      showTableDialog: false,
      source_id: undefined
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
        // await deleteSource({ source_id: row.source_id })
        this.$message.success('删除成功')
        this.$message.warn('But You cant really delete it, because we need this demo.')
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
    async handleAddTable(row) {
      this.tables = []
      this.source_id = row.source_id
      const { data } = await tablesByBase(row.source_id)
      this.tables = data.map(item => {
        item.status = item.status === 1
        return item
      })
      this.showTableDialog = true
    },
    async saveTableConfig() {
      const tables = this.tables.map(item => {
        item.status = item.status ? 1 : 0
        return item
      })
      await saveTableConfig({ source_id: this.source_id, tables })
      this.showTableDialog = false
      this.$message.success('Success!')
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
