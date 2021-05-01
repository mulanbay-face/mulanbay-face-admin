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
      <el-form-item v-if="moreCdn==true" label="日志级别" prop="logLevel">
       <el-select
         v-model="queryParams.logLevel"
         placeholder="日志级别"
         clearable
         collapse-tags
         size="small"
         style="width: 240px"
       >
         <el-option
           v-for="dict in logLevelOptions"
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
      <el-form-item v-if="moreCdn==true" label="错误代码" prop="errorCode">
        <el-input
          v-model="queryParams.errorCode"
          placeholder="错误代码"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['log:systemLog:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-more" size="mini" @click="handleMoreCdn">{{cdnTitle}}</el-button>
        <el-button type="stat" icon="el-icon-s-data" size="mini" @click="handleAnalyseStat" v-hasPermi="['log:systemLog:analyseStat']">日志分析</el-button>

      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table v-loading="loading" :data="systemLogList" @selection-change="handleSelectionChange">
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
      <el-table-column label="错误代码" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.errorCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center"  min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="msgAlert('提示',row.content)">
            <i class="el-icon-info" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="异常类型" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="msgAlert('提示',row.exceptionClassName)">
            <i class="el-icon-info" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="日志级别" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.logLevel=='NORMAL'" style="color:black ;">
            {{ row.logLevelName }}
           </span>
           <span v-else-if="row.logLevel=='WARNING'" style="color:burlywood ;">
            {{ row.logLevelName }}
           </span>
           <span v-else-if="row.logLevel=='ERROR'" style="color:red ;">
            {{ row.logLevelName }}
           </span>
           <span v-else style="color:darkmagenta ;">
             {{ row.logLevelName }}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="功能点" align="center" min-width="120px" :show-overflow-tooltip="true">
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
      <el-table-column label="发生时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.occurTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保存时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.storeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保存延迟时间" align="center" width="160">
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

    <!-- 参数/主键详情 -->
    <el-dialog :title="sourceTitle" width="600px" :visible.sync="sourceOpen"  append-to-body>
      <source-detail :jsonData="jsonData"/>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,getBeanDetail} from "@/api/log/systemLog";
import {getDomainClassNamesTree,getSystemFunctionTree} from "@/api/auth/systemFunction";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SourceDetail from '../../common/jsonTreeTable'

export default {
  name: "SystemionLog",
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
      systemLogList:[],
      logLevelOptions:[],
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
    getSystemFunctionTree(true).then(response => {
      this.functionOptions = response;
    });
    this.getEnumTree('LogLevel','FIELD',false).then(response => {
      this.logLevelOptions = response;
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
    /** 日志分析 */
    handleAnalyseStat(){
      //路由定向
      this.$router.push({name:'SystemLog/analyseStat',query: {}})
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
          this.systemLogList = response.rows;
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
    }
  }
};
</script>
