<template>
  <div class="page-container">
    <el-button type="primary" icon="el-icon-plus" size="small" class="add-source-btn" @click="dialogVisible=true">
      {{ $t('dataSource.addDataSource') }}
    </el-button>
    <el-table v-loading="loading" :data="list" border highlight-current-row stripe class="source-table">
      <el-table-column :label="$t('dataSource.baseName')" prop="base_alias" align="center" width="200px" />
      <el-table-column :label="$t('dataSource.host')" prop="host" width="120px" />
      <el-table-column :label="$t('dataSource.port')" prop="port" width="60px" />
      <el-table-column :label="$t('dataSource.user')" prop="username" />
      <el-table-column :label="$t('dataSource.dataBase')" prop="database" />
      <el-table-column :label="$t('dataSource.createdAt')" prop="created_at" width="155px">
        <template slot-scope="scope">
          {{ parseTime(scope.row.created_at) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="status" prop="status" /> -->
      <el-table-column :label="$t('common.operation')" align="center" width="230px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleAddTable(scope.row)">
            {{ $t('dataSource.manageTables') }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="$t('dataSource.addDataSource')" :visible.sync="dialogVisible" width="600px">
      <el-form label-width="100px" size="small">
        <el-form-item :label="$t('dataSource.host') + ':' ">
          <el-input v-model="formData.host" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('dataSource.port') + ':' ">
          <el-input v-model="formData.port" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('dataSource.user') + ':' ">
          <el-input v-model="formData.username" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('dataSource.password') + ':' ">
          <el-input v-model="formData.password" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('dataSource.dataBase') + ':' ">
          <el-input v-model="formData.database" class="source-input" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('dataSource.baseName') + ':' ">
          <el-input v-model="formData.base_alias" class="source-input" placeholder="" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('dataSource.manageTables')" :visible.sync="showTableDialog">
      <el-table :data="tables">
        <el-table-column :label="$t('dataSource.tableName')" prop="table">
          <template slot-scope="scope">
            <el-input v-model="scope.row.table_alias" size="mini" placeholder="" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('dataSource.table')" prop="table" />
        <el-table-column :label="$t('dataSource.linked')">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-text="$t('common.open')" :inactive-text="$t('common.closed')" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showTableDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button size="small" type="primary" @click="saveTableConfig">{{ $t('common.confirm') }}</el-button>
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
      source_id: undefined,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    parseTime,
    async getList() {
      this.loading = true
      const { data } = await sourceList()
      this.list = data
      this.loading = false
    },
    handleEdit(row) {
      this.formData = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm(this.$t('dataSource.deleteConfirm'), this.$t('common.confirm')).then(async() => {
        // await deleteSource({ source_id: row.source_id })
        this.$message.success(this.$t('common.deleteSuccess'))
        this.$message.warning('But You cant really delete it, because we need this demo.')
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
  width: 250px;
}
</style>
