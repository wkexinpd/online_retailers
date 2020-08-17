<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" size="small"/>
      <el-select v-model="listQuery.typeId" placeholder="用户角色" clearable style=" margin-left: 3px;width: 110px" class="filter-item" size="small">
        <el-option v-for="item in typeOptions" :key="item.id" :label="item.type" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="listQuery.startTime"
        type="date"
        placeholder="开始日期"
        style="margin-left: 3px;"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        size="small"
        class="filter-item">
      </el-date-picker>
      <el-date-picker
        v-model="listQuery.endTime"
        type="date"
        placeholder="截止日期"
        style="margin-left: 3px;"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        size="small"
        class="filter-item">
      </el-date-picker>
      <el-button v-waves class="filter-item" style="margin-left: 5px;" type="primary" size="small" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" size="small" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="用户名" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="80px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邀请码" min-width="180px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.inviteCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" width="130px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getPersonList" />
      <el-dialog :title="dialogTitle[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dialogForm" :rule="dialogRules" :model="dialogForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="dialogForm.username" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="dialogForm.sex" label="男">男</el-radio>
            <el-radio v-model="dialogForm.sex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="dialogForm.phone" />
          </el-form-item>
          <el-form-item label="邀请码" prop="inviteCode">
            <el-input v-model="dialogForm.inviteCode" disabled/>
          </el-form-item>
          <el-form-item label="用户类型" prop="type">
            <el-select v-model="dialogForm.type" class="filter-item" placeholder="请选择">
              <el-option v-for="item in dialogTypeOptions" :key="item.id" :label="item.type" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间" prop="createTime">
            <el-input v-model="dialogForm.createTime" disabled/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="updateData()">
            确定
          </el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {getPersonList, updatePerson, deletePerson} from '@/api/person'
  import Pagination from '@/components/Pagination'
  export default {
    name: "addPerson",
    components: { Pagination },
    directives: { waves },
    data(){
      return {
        listQuery: {
          phone: undefined,
          typeId: undefined,
          startTime: undefined,
          endTime: undefined
        },
        page: 1,
        limit: 10,
        downloadLoading: false,
        tableKey: 0,
        listLoading: true,
        list:null,
        typeOptions: [{id:1,type:'普通用户'}, {id:2,type:'会员'}, {id:3,type:'客服'}],
        total: 0,
        dialogFormVisible: false,
        dialogStatus:'',
        dialogTitle:{
          update: '编辑'
        },
        dialogRules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          type: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
          phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
        },
        dialogForm: {
          username:'',
          sex:'',
          phone:'',
          inviteCode:'',
          type:'',
          createTime:''
        },
        dialogTypeOptions: [{id:1,type:'普通用户'}, {id:2,type:'会员'}, {id:3,type:'客服'}]
      }
    },
    created() {
      this.getPersonList()
    },
    methods: {
      getPersonList(){
        this.listLoading = true
        let page = this.page
        let limit = this.limit
        getPersonList(this.listQuery,page,limit).then(response => {
          this.list = response.data.user
          this.total = response.data.total
          // console.log(this.total);
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      handleFilter(){
        this.page = 1
        this.getPersonList()
      },
      handleDownload(){

      },
      handleUpdate(row){
        // console.log(row);
        this.dialogForm = Object.assign({},row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dialogForm'].clearValidate()
        })
      },
      handleDelete(row){
        deletePerson(row.id).then(response => {
          this.getPersonList()
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })

      },
      updateData(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.dialogForm)
            updatePerson(tempData).then(() => {
              this.getPersonList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
</script>

<style>
  .el-dialog{
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);
  }
  .el-dialog .el-dialog__body{
    flex:1;
    overflow: auto;
  }
</style>
