<template>
  <div class="print-content">
  <el-table
    id="print"
    key="1"
    v-loading="listLoading"
    :data="userOrderList"
    border
    fit
    highlight-current-row
    style="width: 100%;"
    :cell-style="tableCellStyle"
    :header-cell-style="tableHeaderCellStyle"
  >
    <el-table-column label="订单号" prop="id" align="center" width="170"/>
    <el-table-column label="商品" align="center" width="110">
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
    <el-table-column label="商品单价" prop="price" align="center" width="80"/>
    <el-table-column label="实付款" prop="afterPrice" align="center" width="80"/>
    <el-table-column label="优惠价" prop="downPrice" width="80" align="center"/>
    <el-table-column label="数量" prop="number" align="center" width="50"/>
    <el-table-column label="订单状态" prop="status" align="center" width="100"/>
    <el-table-column label="收货人姓名" prop="userName" align="center" width="100"/>
    <el-table-column label="联系方式" prop="telNumber" align="center" width="110"/>
    <el-table-column label="收货地址" align="center" width="130">
      <template slot-scope="{row}">
        <span>{{row.provinceName}} - {{row.cityName}} - {{row.countyName}} - {{row.detailedAddress}}</span>
      </template>
    </el-table-column>
    <el-table-column label="下单时间" prop="createTime" align="center" width="100"/>
  </el-table>
  </div>
</template>

<script>
  import {userGetOrder} from "@/api/order";
  import {mapGetters} from "vuex";

  export default {
    name: "download",
    data(){
      return{
        orderList:{
          startTime: '',
          endTime: ''
        },
        status: 0,
        listLoading: false,
        userOrderList: null
      }
    },
    computed: {
      ...mapGetters([
        'id'
      ])
    },
    created() {
      this.getParams()
    },
    async mounted() {
      await this.getUserOrderList()
      this.fetchData()
    },
    methods:{
      getParams() {
        const startTime = this.$route.query.startTime
        const endTime = this.$route.query.endTime
        const status = this.$route.query.status
        this.orderList.startTime = startTime
        this.orderList.endTime = endTime
        this.status = status===null?0:status
        console.log(this.$route.query);
      },
      async getUserOrderList(){
        this.listLoading = true
        await userGetOrder(1,20,this.id,this.status,false,this.orderList).then((response)=>{
          this.userOrderList = response.data.orderList
          this.total = response.data.total
          this.listLoading = false
          // setTimeout(() => {
          //
          // }, 0.5 * 1000)
        })
      },
      fetchData() {
        // var print= document.getElementById('print');
        // var newContent = print.innerHTML;
        // document.body.innerHTML = newContent;
        document.getElementsByTagName('body')[0].style.zoom=0.92;
        setTimeout(()=>{
          this.$nextTick(() => {
            window.print()
          })
        },1000)
        // window.print();
        // window.location.reload();
        // //将原有页面还原到页面
        // document.body.innerHTML = oldContent;
        // return false;
      },
      tableCellStyle(){
        return 'border-color: black;'
      },
      tableHeaderCellStyle() {
        return 'border-color: black;'
      }
    }
  }
</script>
<style>
  body .el-table th.gutter {
    display: table-cell !important
  }
</style>
<style scoped>
  .print-content{
    margin: 0 auto;
    width: 1111px;
  }
  .el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
    border-color: black;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    background-color: black;
  }
  .el-table--border th, .el-table--border td {
    border-right: 1px solid black !important;
  }
  .el-table th.is-leaf, .el-table td {
    border-bottom: 1px solid black !important;
  }
</style>
<style media="print">
  @page{
    size: A4 landscape; /*portrait： 纵向打印,  landscape: 横向*/
  }
  @media print {
    .el-table thead.is-group th {
      text-align: center
    }
    tbody {
      text-align: center;
      border-bottom: 1px solid #000;
    }
    table{border:1px solid #000;border-collapse: collapse}
    /*table td{border:0.3px solid #000;}*/
  /*  th {*/
  /*    border: 0.5px solid #000;*/
  /*  }*/
  /*  td {*/
  /*    border: 0.5px solid #000;*/
  /*  }*/
  }
</style>
