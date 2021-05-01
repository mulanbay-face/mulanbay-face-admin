<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="datePickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="名称检索" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="关联类名" prop="beanName">
       <el-select
         v-model="queryParams.beanName"
         placeholder="关联类名"
         clearable
         collapse-tags
         size="small"
         style="width: 240px"
       >
         <el-option
           v-for="dict in beanNameOptions"
           :key="dict.id"
           :label="dict.text"
           :value="dict.id"
         />
       </el-select>
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="功能选择" prop="functionId">
        <treeselect
         v-model="queryParams.functionId"
         style="width: 240px"
         :options="functionOptions"
         :disable-branch-nodes="false"
         :show-count="true"
         :searchable="true"
         placeholder="请选择功能" />
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="功能类型" prop="functionType">
       <el-select
         v-model="queryParams.functionType"
         placeholder="功能类型"
         clearable
         collapse-tags
         size="small"
         style="width: 240px"
       >
         <el-option
           v-for="dict in functionTypeOptions"
           :key="dict.id"
           :label="dict.text"
           :value="dict.id"
         />
       </el-select>
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="主键编号" prop="idValue">
        <el-input
          v-model="queryParams.idValue"
          placeholder="请输入名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['log:operationLog:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-more" size="mini" @click="handleMoreCdn">{{cdnTitle}}</el-button>
        <el-button type="query" icon="el-icon-s-tools" size="mini" @click="handleSetFunctionId" v-hasPermi="['log:operationLog:setFunctionId']">关联功能点</el-button>
        <el-button type="query" icon="el-icon-s-tools" size="mini" @click="setIdValue" v-hasPermi="['log:operationLog:setIdValue']">设置主键值</el-button>
        <el-button type="stat" icon="el-icon-s-data" size="mini" @click="handleTreeStat" v-hasPermi="['log:operationLog:treeStat']">树形统计</el-button>
        <el-button type="stat" icon="el-icon-s-data" size="mini" @click="handleStat" v-hasPermi="['log:operationLog:stat']">分页统计</el-button>
        <el-button type="stat" icon="el-icon-s-data" size="mini" @click="handleDateStat" v-hasPermi="['log:operationLog:dateStat']">分时统计</el-button>

      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table v-loading="loading" :data="operationLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" fixed="left" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center"  min-width="120px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能点" align="center" min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.systemFunction == null ? '--': row.systemFunction.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求地址" align="center"  min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.urlAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求参数" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="showParasDetail(row)">
            <i class="el-icon-info" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="主键值" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.idValue!=null" class="link-type" @click="showBeanDetail(row)">
            <i class="el-icon-info" />
           </span>
           <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="修改日志" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.idValue!=null" class="link-type" @click="showLogCompare(row)">
            <i class="el-icon-info" />
           </span>
           <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="请求开始时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.occurStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求结束时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.occurEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求处理时间" align="center" width="160">
        <template slot-scope="{row}">
          <span v-if="row.handleDuration>=1000" style="color: red;">
           {{ (row.handleDuration/1000).toFixed(1) }}秒
          </span>
          <span v-else-if="row.handleDuration>=500" style="color: purple;">
           {{ row.handleDuration }}毫秒
          </span>
          <span v-else>{{ row.handleDuration }}毫秒</span>
        </template>
      </el-table-column>
      <el-table-column label="保存时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.storeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保存延迟时间(毫秒)" align="center" width="160">
        <template slot-scope="{row}">
          <span v-if="row.storeDuration>=1000" style="color: red;">
           {{ (row.storeDuration/1000).toFixed(1) }}秒
          </span>
          <span v-else-if="row.storeDuration>=500" style="color: purple;">
           {{ row.storeDuration }}毫秒
          </span>
          <span v-else>{{ row.storeDuration }}毫秒</span>
        </template>
      </el-table-column>
      <el-table-column label="请求IP" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.ipAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务器IP" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.hostIpAddress }}</span>
        </template>
      </el-table-column>
    </el-table>


    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 设置功能点对话框 -->
    <el-dialog :title="setFcIdTitle" :visible.sync="setFcIdOpen" width="500px"  append-to-body>
      <el-radio-group v-model="needReSet">
          <el-radio :label="true">全部重新设置</el-radio>
          <el-radio :label="false">设置遗漏的</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setFunctionId">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 参数/主键详情 -->
    <el-dialog :title="sourceTitle" width="600px" :visible.sync="sourceOpen"  append-to-body>
      <source-detail :jsonData="jsonData"/>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,getBeanDetail,setOperationLogFunctionId,setOperationLogIdValue} from "@/api/log/operationLog";
import {getDomainClassNamesTree,getSystemFunctionTree} from "@/api/auth/systemFunction";
import {tillNowSeconds} from "@/utils/datetime";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SourceDetail from '../../common/jsonTreeTable'

export default {
  name: "OperationLog",
  components: {
    Treeselect,
    'source-detail':SourceDetail
  },
  data() {
    return {
      //查询条件更多属性 start
      cdnTitle:'更多',
      moreCdn:false,
      //查询条件更多属性 end
      // 关联功能点 start
      setFcIdTitle:'',
      setFcIdOpen:false,
      needReSet:false,
      // 关联功能点 end
      // 参数详情 start
      sourceTitle: "",
      // 是否显示弹出层
      sourceOpen: false,
      // 详情数据
      jsonData:{
        jsonObject:undefined
      },
      // 参数详情 end
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 列表数据
      operationLogList:[],
      beanNameOptions:[],
      functionOptions:[],
      functionTypeOptions:[],
      //日期范围快速选择
      datePickerOptions:this.datePickerOptions,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
    getDomainClassNamesTree().then(response => {
      this.beanNameOptions = response;
    });
    getSystemFunctionTree(true).then(response => {
      this.functionOptions = response;
    });
    this.getEnumTree('FunctionType','FIELD',false).then(response => {
      this.functionTypeOptions = response;
    });

  },
  methods: {
    /** 更多查询条件处理 */
    handleMoreCdn(){
      if(this.moreCdn==true){
        //this.resetForm("queryForm");
        this.moreCdn=false;
        this.cdnTitle='更多';
      }else{
        this.moreCdn=true;
        this.cdnTitle='取消';
      }
    },
    /** 统计 */
    handleTreeStat(){
      //路由定向
      this.$router.push({name:'OperationLog/treeStat',query: {}})
    },
    /** 统计 */
    handleStat(){
      //路由定向
      this.$router.push({name:'OperationLog/stat',query: {}})
    },
    /** 分时统计 */
    handleDateStat(){
      //路由定向
      this.$router.push({name:'OperationLog/dateStat',query: {}})
    },
    /** 修改日志 */
    showLogCompare(row){
      //路由定向
      this.$router.push({name:'OperationLog/logCompare',query: {operationLogId:row.id}})
    },
    /** 关联功能点 */
    handleSetFunctionId(){
      this.setFcIdTitle='关联功能点';
      this.setFcIdOpen=true;
    },
    /** 关联功能点 */
    setFunctionId(){
      setOperationLogFunctionId(this.needReSet).then(response => {
        this.setFcIdOpen=false;
        this.msgSuccess('操作成功');
      });
    },
    /** 设置主键值 */
    setIdValue(){
      setOperationLogIdValue().then(response => {
        this.msgSuccess('操作成功');
      });
    },
    /** 参数详情 */
    showParasDetail(row){
      this.sourceOpen = true;
      this.sourceTitle ='ID['+row.id+']请求参数详情';
      this.jsonData = Object.assign({}, this.jsonData, {
        jsonObject: eval('(' + row.paras + ')')
      });
    },
    /** 主键值详情 */
    showBeanDetail(row){
      getBeanDetail(row.id).then(response => {
        this.sourceOpen = true;
        this.sourceTitle = '操作对象('+response.beanName+'),ID='+response.idValue;;
        this.jsonData = Object.assign({}, this.jsonData, {
          jsonObject: response.beanData
        });
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.operationLogList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.join(",");
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteOperationLog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>
