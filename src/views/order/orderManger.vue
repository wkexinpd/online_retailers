<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="status" placeholder="订单状态" clearable style=" margin-left: 3px;width: 110px" class="filter-item" size="small">
        <el-option v-for="item in typeOrderOptions" :key="item.id" :label="item.status" :value="item.id" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" size="small" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="orderDataList"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="订单号" prop="id" align="center" width="180"></el-table-column>
      <el-table-column label="商品名称" prop="goodName" align="center" width="150"></el-table-column>
      <el-table-column label="规格名称" prop="gsname" align="center" width="150"></el-table-column>
      <el-table-column label="商品图片" align="center">
        <template slot-scope="{row}">
          <img :src="row.picture" width="60px">
        </template>
      </el-table-column>
      <el-table-column label="商品数量" prop="number" align="center" width="80"></el-table-column>
      <el-table-column label="商品单价" prop="price" align="center" width="80"></el-table-column>
      <el-table-column label="议价前价格" prop="beforePrice" align="center" width="100"></el-table-column>
      <el-table-column label="议价后价格" prop="afterPrice" align="center" width="100"></el-table-column>
      <el-table-column label="优惠价钱" prop="downPrice" align="center" width="80"></el-table-column>
      <el-table-column label="订单状态" prop="status" align="center" width="100"/>
      <el-table-column label="收货人姓名" prop="userName" align="center" width="100"/>
      <el-table-column label="联系方式" prop="telNumber" align="center" width="150"/>
      <el-table-column label="收货地址" align="center" min-width="180">
        <template slot-scope="{row}">
          <template v-if="row.editStatus">
            <el-input v-model="row.provinceName" class="edit-input" size="small" />
            <el-input v-model="row.cityName" class="edit-input" size="small" />
            <el-input v-model="row.detailedAddress" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{row.provinceName}} - {{row.cityName}} - {{row.countyName}} - {{row.detailedAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="createTime" align="center" width="100"/>
      <el-table-column label="邮政编码" prop="postalCode" align="center" width="100"></el-table-column>
      <el-table-column label="操作" align="center" width="230" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.editStatus" type="success" size="mini" @click="handleOrderAddressUpdate(row)">
           确定
          </el-button>
          <el-button v-else type="warning" size="mini" @click="row.editStatus = !row.editStatus">
            编辑地址
          </el-button>
          <el-button type="primary" size="mini" @click="handleOrderUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除用户的订单吗？"
            @onConfirm="handleOrderDelete(row)"
            style="padding-left: 5px;"
          >
            <el-button slot="reference" size="mini" type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getOrderDataList" />
    <el-dialog title="编辑" :visible.sync="dialogOrderFormVisible">
      <el-form ref="dialogOrderList" :model="dialogOrderList" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="订单订号" prop="id">
          <el-input v-model="dialogOrderList.id" disabled/>
        </el-form-item>
        <el-form-item label="议价前价格" prop="beforePrice">
          <el-input v-model="dialogOrderList.beforePrice" disabled/>
        </el-form-item>
        <el-form-item label="议价后价格" prop="afterPrice" required>
          <el-input v-model="dialogOrderList.afterPrice" />
        </el-form-item>
        <el-form-item label="订单状态" prop="status" required>
          <el-select v-model="dialogOrderList.statusId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeOrderOptions" :key="item.id" :label="item.status" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOrderFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogHandleOrderUpdate()">
          编辑
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {userGetOrder,updateOrderMessage,updateOrderAddress,deleteOrder,getAllStatus} from '@/api/order'
  export default {
    name: "orderManger",
    components: {Pagination},
    data() {
      return{
        status: null,
        listLoading: false,
      //  订单列表
        orderDataList: null,
        page: 1,
        limit: 10,
        total: 0,
        typeOrderOptions: [],
        dialogOrderList:{
          beforePrice: 0,
          afterPrice: 0,
          id: 0,
          statusId: 0,
          version: 0,
          status: ''
        },
        dialogOrderFormVisible: false
      }
    },
    created() {
      this.getOrderDataList()
      this.getStatus()
    },
    methods:{
      getOrderDataList(){
        this.listLoading = true
        let status = this.status===null?0:this.status
        userGetOrder(this.page,this.limit,undefined,status,true,{}).then(response => {
          let list = response.data.orderList
          let arr = []
          list.map((item,index) => {
            arr.push(
              Object.assign(item,{editStatus:false})
            )
          });
          this.orderDataList = arr
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      getStatus(){
        getAllStatus().then(response => {
          this.typeOrderOptions = response.data.status
        })
      },
      handleOrderUpdate(row){
        // console.log(row);
        this.dialogOrderList = Object.assign({},row)
        this.dialogOrderFormVisible = true
      },
      handleOrderDelete(row){
        deleteOrder(row.id).then(()=>{
          this.$message({
            message: '删除商品成功',
            type: 'success'
          })
          this.getOrderDataList()
        })
      },
      handleOrderAddressUpdate(row){
        // console.log(row);
        row.editStatus = false
        updateOrderAddress({
          cityName: row.cityName,
          countyName: row.countyName,
          detailedAddress: row.detailedAddress,
          id: row.id,
          postalCode: row.postalCode,
          provinceName: row.provinceName,
          telNumber: row.telNumber,
          userName: row.userName
        }).then((response)=>{
          this.$message({
            message: '收货地址已经更改',
            type: 'success'
          })
        })

      },
      handleFilter(){
        this.page = 1
        this.getOrderDataList()
      },
      dialogHandleOrderUpdate(){
        this.$refs['dialogOrderList'].validate((valid) => {
          if (valid) {
            updateOrderMessage({afterPrice:parseInt(this.dialogOrderList.afterPrice),beforePrice:parseInt(this.dialogOrderList.beforePrice),id:this.dialogOrderList.id,statusId:this.dialogOrderList.statusId,status:this.typeOrderOptions[this.dialogOrderList.statusId-1].status,version:this.dialogOrderList.version}).then(()=>{

              this.dialogOrderFormVisible = false
              this.getOrderDataList()
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
            })
          }
        })
      },
      cancelEdit(row){
        row.editStatus = false
      }
    }
  }
</script>

<style scoped>

</style>
