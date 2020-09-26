<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="goodsList.name" placeholder="商品名称" style="width: 160px;" class="filter-item" size="small"/>
      <tree-select
        :props="props"
        :options="goodsTypeOptions"
        :value="valueId"
        :clearable="isClearable"
        :accordion="isAccordion"
        @getValue="getValue($event)"
        style="padding-left: 5px"
        class="filter-item"
      />
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" size="small" icon="el-icon-search" @click="handleQuery">
        查找
      </el-button>
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-edit" @click="handleAddCategory">
        添加分类
      </el-button>
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-edit" @click="handleAddGoods">
        添加商品
      </el-button>
<!--      <el-button class="filter-item" type="primary" size="small" icon="el-icon-edit" @click="handleAddGoodsSpec">-->
<!--        添加商品规格-->
<!--      </el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="goodsDataList"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <li>商品分类：</li>
          <span style="padding-left: 80px;display: flex;flex-direction: row;align-items: center">{{row.categoryDTO.name}}<img :src="row.categoryDTO.bannerUrl" alt="" width="60px" style="padding-left: 10px"></span>
          <li>商品规格：</li>
          <div style="padding-left: 80px;display: flex;flex-direction: row;align-items: center;line-height: 32px;" v-for="item in row.spectficationDTOS">
            <el-input v-if="!item.status" v-model="item.value" class="edit-input" size="mini" style="width:150px;"/>
            <span v-else>{{item.value}}</span>
            <img :src="item.picUrl" alt="" width="40px" style="margin: 0 30px;">
            <el-input v-if="!item.status" v-model="item.price" class="edit-input" size="mini" style="width:100px;margin-right:30px"/>
            <span v-else style="margin-right:30px">{{item.price}}元</span>
            <el-button v-if="!item.status" type="success" size="mini" @click="handleSpecUpdate(item,row.id)" round>
              确认
            </el-button>
            <el-button v-else type="primary" size="mini" @click="item.status = !item.status" round>
              编辑
            </el-button>
            <el-button slot="reference" size="mini" type="danger" round @click="handleSpecdelect(item.id)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
<!--      <el-table-column type="index"></el-table-column>-->
      <el-table-column label="商品名称" prop="name" align="center"></el-table-column>
      <el-table-column label="商品展示" align="center">
        <template slot-scope="{row}">
          <img :src="row.picture" alt="" width="80px">
        </template>
      </el-table-column>
      <el-table-column label="商品描述" prop="introduce" align="center"></el-table-column>
      <el-table-column label="是否在售" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isSale==1?true:false"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" prop="price" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="280" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="warning" size="mini" @click="handleAddGoodsSpec(row)">
            添加商品规格
          </el-button>
          <el-popconfirm
            title="这是一段内容确定删除吗？"
            @onConfirm="handleDelete(row)"
            style="padding-left: 5px;"
          >
          <el-button slot="reference" size="mini" type="danger">
            删除
          </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getGoodsDataList" />
    <el-dialog title="添加分类" :visible.sync="dialogCategoryFormVisible">
      <el-form ref="dialogCategoryForm" :model="dialogCategoryForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分类名称" prop="name" required>
          <el-input v-model="dialogCategoryForm.name" />
        </el-form-item>
        <el-form-item label="分类等级" prop="level" required>
<!--          <el-input v-model="dialogGoodsForm.introduce" />-->
          <el-radio v-model="dialogCategoryForm.level" label="L1">一级</el-radio>
          <el-radio v-model="dialogCategoryForm.level" label="L2">二级</el-radio>
        </el-form-item>
        <el-form-item label="上传图标" prop="iconUrl">
          <el-upload
            class="avatar-uploader"
            action="http://49.233.7.158/shop-impl-oss/fileUpload"
            :show-file-list="false"
            :on-success="handleIconUrlCardPreview">
            <img v-if="dialogCategoryForm.iconUrl" :src="dialogCategoryForm.iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="父级类型" prop="parentId" v-show="dialogCategoryForm.level==='L2'?true:false" required>
          <tree-select
            :props="props"
            :options="goodsTypeOptions"
            :value="valueId1"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getCategoryValue($event)"
            style="padding-left: 5px"
            class="filter-item"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCategoryFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createCategoryData()">
          添加
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textGoodsMap[dialogGoodsStatus]" :visible.sync="dialogGoodsFormVisible">
      <el-form ref="dialogGoodsForm" :model="dialogGoodsForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品名称" prop="name" required>
          <el-input v-model="dialogGoodsForm.name" />
        </el-form-item>
        <el-form-item label="商品描述" prop="introduce">
          <el-input v-model="dialogGoodsForm.introduce" />
        </el-form-item>
        <el-form-item label="商品展示" prop="picture">
          <el-upload
            class="avatar-uploader"
            action="http://49.233.7.158/shop-impl-oss/fileUpload"
            :show-file-list="false"
            :on-success="handlePictureCardPreview">
            <img v-if="dialogGoodsForm.picture" :src="dialogGoodsForm.picture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId" required>
          <tree-select
          v-show="dialogGoodsStatus==='update'"
          :props="props"
          :options="goodsTypeOptions"
          :value="dialogGoodsForm.categoryId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue1($event)"
          style="padding-left: 5px"
          class="filter-item"
        />
          <tree-select
            v-show="dialogGoodsStatus==='add'"
            :props="props"
            :options="goodsTypeOptions"
            :value="valueId2"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue1($event)"
            style="padding-left: 5px"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item label="商品价格" prop="price" required>
          <el-input v-model="dialogGoodsForm.price" />
        </el-form-item>
        <el-form-item label="是否在售" prop="isSale" required>
          <el-radio v-model="dialogGoodsForm.isSale" :label="1">是</el-radio>
          <el-radio v-model="dialogGoodsForm.isSale" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGoodsFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogGoodsStatus==='add'?createData():updateGoodsData()">
          {{textGoodsMap[dialogGoodsStatus]}}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加商品规格" :visible.sync="dialogSpecFormVisible">
      <el-form ref="dialogSpecForm" :model="dialogSpecForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="规格名称" prop="value" required>
          <el-input v-model="dialogSpecForm.value" />
        </el-form-item>
        <el-form-item label="规格价钱" prop="price" required>
          <el-input v-model="dialogSpecForm.price" />
        </el-form-item>
        <el-form-item label="规格展示" prop="picUrl">
          <el-upload
            class="avatar-uploader"
            action="http://49.233.7.158/shop-impl-oss/fileUpload"
            :show-file-list="false"
            :on-success="handlePicUrlCardPreview">
            <img v-if="dialogSpecForm.picUrl" :src="dialogSpecForm.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSpecFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createSpecData()">
          添加
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getGoodsDataList,getTree,addCategory,addGood,addSpec,updateGoods,deleteGood,deleteSpec,updateSpec} from '@/api/goods'
  import Pagination from '@/components/Pagination'
  import TreeSelect from '@/components/TreeSelect'
  export default {
    name: "messageGoods",
    components: { Pagination, TreeSelect },
    data(){
      return {
        goodsList:{
            name: undefined,
            categoryId: undefined
          },
        goodsDataList: null,
        listLoading: true,
        goodsTypeOptions:[],
        page: 1,
        limit: 10,
        total:0,
        isClearable: true, // 可清空（可选）
        isAccordion: true, // 可收起（可选）
        valueId: 1, // 初始ID（可选）
        valueId1: 1,
        valueId2: 1,
        props: {
              // 配置项（必选）
              value: "id",
              label: "name",
              children: "children"
              // disabled:true
            },
        dialogGoodsFormVisible: false,
        dialogImageUrl: '',
        dialogGoodsForm:{
            name: '',
            categoryId: undefined,
            introduce: '',
            isSale: undefined,
            picture:'',
            price: 0
          },
        dialogCategoryFormVisible:false,
        dialogCategoryForm: {
            name: '',
            level: '',
            iconUrl:'',
            parentId: 0
          },
        dialogSpecFormVisible:false,
        dialogSpecForm:{
            value:'',
            price:'',
            picUrl:'',
            goods_id:0
          },
        //添加/编辑商品的title
        textGoodsMap:{
          add: '添加商品',
          update: '编辑商品'
        },
        dialogGoodsStatus: '',
      //  行内编辑商品规格
      //   specUpdate: false
      }
    },
    created() {
      this.getGoodsDataList()
      this.getGoodsTypeOptions()
    },
    methods:{
      getValue(value) {
        this.valueId = value;
        this.goodsList.categoryId = value
      },
      getValue1(value){
        this.valueId1 = value;
        this.dialogGoodsForm.categoryId = value
      },
      getGoodsDataList() {
        this.listLoading = true
        getGoodsDataList(this.goodsList,this.page,this.limit).then(response=>{
          this.goodsDataList = response.data.goods
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      getGoodsTypeOptions(){
        getTree().then(response=>{
          this.goodsTypeOptions = response.data.category
        })
      },
      handleQuery(){
        this.page = 1
        this.getGoodsDataList()
      },
      handleAddCategory(){
        this.dialogCategoryForm = {
          name: '',
          level: '',
          iconUrl:'',
          parentId: 0
        }
        this.dialogCategoryFormVisible = true
        this.$nextTick(() => {
          this.$refs['dialogCategoryForm'].clearValidate()
        })
      },
      handleAddGoods(){
        this.dialogGoodsStatus = 'add'
        this.dialogGoodsForm = {
          name: '',
          categoryId: 0,
          introduce: '',
          isSale: '',
          picture:'',
          price: 0
        }
        this.dialogGoodsFormVisible = true
        this.$nextTick(() => {
          this.$refs['dialogGoodsForm'].clearValidate()
        })
      },
      handleAddGoodsSpec(row){
        this.dialogSpecForm={
          value:'',
          price:'',
          picUrl:'',
          goods_id:0
        }
        // console.log(row);
        this.dialogSpecForm.goods_id = row.id
        this.dialogSpecFormVisible = true
        this.$nextTick(() => {
          this.$refs['dialogSpecForm'].clearValidate()
        })
      },
      handleUpdate(row){
        // console.log(row);
        this.dialogGoodsForm = Object.assign({},row)
        this.dialogGoodsStatus = 'update'
        this.dialogGoodsFormVisible = true
        this.$nextTick(() => {
          this.$refs['dialogGoodsForm'].clearValidate()
        })
      },
      handlePictureCardPreview(res) {
        this.dialogGoodsForm.picture = res.message;
      },
      handleIconUrlCardPreview(res){
        this.dialogCategoryForm.iconUrl = res.message;
        console.log(this.dialogCategoryForm.iconUrl);
      },
      createData(){
        this.$refs['dialogGoodsForm'].validate((valid) => {
          if (valid) {
            addGood(this.dialogGoodsForm).then(response => {
              this.$message({
                message: '添加商品成功',
                type: 'success'
              })
              this.dialogGoodsFormVisible = false
              this.getGoodsDataList()
            })
          }
        })
      },
      createCategoryData(){
        this.$refs['dialogCategoryForm'].validate((valid) => {
          if (valid) {
            addCategory(this.dialogCategoryForm).then(res => {
              this.$message({
                message: '添加分类成功',
                type: 'success'
              })
              this.dialogCategoryFormVisible = false
              this.getGoodsTypeOptions()
            })
          }
        })
      },
      getCategoryValue(value){
        this.valueId2 = value;
        this.dialogCategoryForm.parentId = value
      },
      createSpecData(){
        this.$refs['dialogSpecForm'].validate((valid) => {
          if (valid) {
            addSpec(this.dialogSpecForm).then(()=>{
              this.$message({
                message: '添加规格成功',
                type: 'success'
              })
              this.dialogSpecFormVisible = false
              this.getGoodsDataList()
            })
          }
        })
      },
      handlePicUrlCardPreview(res){
        this.dialogSpecForm.picUrl = res.message;
      },
    //  编辑操作
      updateGoodsData(){
        this.$refs['dialogGoodsForm'].validate((valid) => {
          if (valid) {
            updateGoods(this.dialogGoodsForm).then(()=>{
              this.$message({
                message: '编辑商品成功',
                type: 'success'
              })
              this.dialogGoodsFormVisible = false
              this.getGoodsDataList()
            })
          }
        })
      },
      handleSpecUpdate(item,id){
        // this.specUpdate=false
        console.log(item);
        item.status = true
        updateSpec({...item,goods_id:id}).then(()=>{
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.getGoodsDataList()
        })
        // console.log(item,id);
      },
    //  删除操作
    //  删除商品
      handleDelete(row){
        // console.log(row);
        deleteGood(row.id).then(()=>{
          this.$message({
            message: '删除商品成功',
            type: 'success'
          })
          this.getGoodsDataList()
        })
      },
    //  删除商品规格
      handleSpecdelect(id){
        // console.log(item,id);
        deleteSpec(id).then(()=>{
          this.$message({
            message: '删除规格成功',
            type: 'success'
          })
          this.getGoodsDataList()
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
