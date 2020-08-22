<template>
  <div class="app-container">
    <div class="filter-container top-content">
      <div>
        <el-select v-model="status" placeholder="订单状态" clearable style=" margin-left: 3px;width: 110px" class="filter-item" size="small">
          <el-option v-for="item in typeOrderOptions" :key="item.id" :label="item.status" :value="item.id" />
        </el-select>
        <el-date-picker
          v-model="orderQuery.startTime"
          type="date"
          placeholder="开始日期"
          style="margin-left: 3px;"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          size="small"
          class="filter-item">
        </el-date-picker>
        <el-date-picker
          v-model="orderQuery.endTime"
          type="date"
          placeholder="截止日期"
          style="margin-left: 3px;"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          size="small"
          class="filter-item">
        </el-date-picker>
        <el-button class="filter-item" style="margin-left: 5px;" type="primary" size="small" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
      <div>
        <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出用户订单表
        </el-button>
<!--        <router-link target="_blank" to="/order/download">-->
          <el-button class="filter-item" type="primary" icon="el-icon-download" @click="toPrint">
            打印报表
          </el-button>
<!--        </router-link>-->
      </div>

    </div>
    <el-table
      id="print"
      key="1"
      v-loading="listLoading"
      :data="userOrderList"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="订单号" prop="id" align="center" width="170"></el-table-column>
      <el-table-column label="商品" align="center" min-width="180px">
        <template slot-scope="{row}">
          <div class="userOrderGood">
            <img :src="row.picture" alt="" width="80px">
            <div>
              <div>{{row.goodName}}</div>
              <div>{{row.gsname}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品单价" prop="price" align="center" width="80"></el-table-column>
      <el-table-column label="议价前价格" prop="beforePrice" align="center" width="100"/>
      <el-table-column label="议价后价格" prop="afterPrice" align="center" width="100"/>
      <el-table-column label="优惠价" prop="downPrice" align="center"></el-table-column>
      <el-table-column label="数量" prop="number" align="center" width="80"></el-table-column>
      <el-table-column label="订单状态" prop="status" align="center" width="100"/>
      <el-table-column label="收货地址" align="center" min-width="180">
        <template slot-scope="{row}">
          <span>{{row.provinceName}} - {{row.cityName}} - {{row.countyName}} - {{row.detailedAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="createTime" align="center" width="100"/>
      <el-table-column v-if="" label="操作" align="center" width="230" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
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
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getUserOrderList" />
    <el-dialog title="编辑" :visible.sync="dialogOrderFormVisible">
      <el-form ref="dialogOrderList" :model="dialogOrderList" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="订单订号" prop="id">
          <el-input v-model="dialogOrderList.id" disabled/>
        </el-form-item>
        <el-form-item label="收货人" prop="telNumber">
          <el-input v-model="dialogOrderList.userName"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="userName">
          <el-input v-model="dialogOrderList.telNumber"/>
        </el-form-item>
        <el-form-item label="一级地址" prop="provinceName" required>
          <el-input v-model="dialogOrderList.provinceName"/>
        </el-form-item>
        <el-form-item label="二级地址" prop="cityName" required>
          <el-input v-model="dialogOrderList.cityName" />
        </el-form-item>
        <el-form-item label="三级地址" prop="countyName" required>
          <el-input v-model="dialogOrderList.countyName" />
        </el-form-item>
        <el-form-item label="详细地址" prop="detailedAddress" required>
          <el-input v-model="dialogOrderList.detailedAddress" />
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
  import {userGetOrder, deleteOrder, updateOrderMessage} from '@/api/order'
  import {mapGetters} from "vuex";
  import Pagination from "@/components/Pagination/index";
  export default {
    name: "orderCheck",
    components: {Pagination},
    data(){
      return{
        listLoading: false,
        userOrderList: null,
        page: 1,
        limit: 10,
        total: 0,
        status: null,
        dialogOrderFormVisible: false,
        dialogOrderList:{
          id:'',
          userName: '',
          telNumber: '',
          provinceName: '',
          cityName: '',
          countyName: '',
          detailedAddress: ''
        },
        typeOrderOptions: [
          {
            id: 1,
            status: '双方议价'
          },
          {
            id: 2,
            status: '买家提货'
          },
          {
            id: 3,
            status: '交易完成'
          },
        ],
        orderQuery:{
          startTime: '',
          endTime: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'id'
      ])
    },
    created() {
      this.getUserOrderList()
    },
    methods:{
      getUserOrderList(){
        this.listLoading = true
        let status = this.status===null?0:this.status
        userGetOrder(this.page,this.limit,this.id,status,false,this.orderQuery).then((response)=>{
          this.userOrderList = response.data.order
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      handleFilter(){
        this.page = 1
        this.getUserOrderList()
      },
      handleOrderUpdate(row){
        this.dialogOrderList = Object.assign({},row)
        this.dialogOrderFormVisible = true
      },
      handleOrderDelete(row){
        deleteOrder(row.id).then(()=>{
          this.$message({
            message: '删除订单成功',
            type: 'success'
          })
          this.getUserOrderList()
        })
      },
      dialogHandleOrderUpdate(){
        this.$refs['dialogOrderList'].validate((valid) => {
          if (valid) {
            updateOrderMessage(this.dialogOrderList).then(()=>{
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.dialogOrderFormVisible = false
              this.getUserOrderList()
            })
          }
        })
      },
      handleDownload(){
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单号', '商品名称', '商品型号', '商品单价','购买数量', '议价前价格','议价后价格','优惠价格','议价状态','收货人','收货人联系方式','一级地址','二级地址','三级地址','详细地址','邮政编码','下单时间']
          const filterVal = ['id', 'goodName', 'gsname', 'price','number', 'beforePrice','afterPrice','downPrice','status','userName','telNumber','provinceName','cityName','countyName','detailedAddress','postalCode','createTime']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用户订单列表'
          })
        })
      },
      formatJson(filterVal) {
        return this.userOrderList.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      toPrint() {
        const {href} = this.$router.resolve({
          path: '/order/download',
          name: 'download',
          query: {
            startTime: this.orderQuery.startTime,
            endTime: this.orderQuery.endTime,
            status: this.status
          }
        })
        window.open(href,'_blank')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .top-content{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .userOrderGood{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: left;
    align-items: center;
    /*min-width: 180px;*/
  }
</style>
