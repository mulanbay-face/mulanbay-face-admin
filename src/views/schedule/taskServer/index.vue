<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="节点名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['schedule:taskServer:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table v-loading="loading" :data="taskServerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" fixed="left" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节点" align="center" >
        <template slot-scope="{row}">
          <span>{{ formatDeployId(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" align="center"  min-width="120px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.ipAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="支持分布式" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.supportDistri" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="正在运行job数" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.cejc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已被调度job数" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.sjc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启动时间" align="center" width="180" >
        <template slot-scope="{row}">
          <span>{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" align="center" width="180">
        <template slot-scope="{row}">
           <span v-if="row.lutSeconds==null">
            --
           </span>
           <span v-else-if="row.lutSeconds<=-180" style="color:red ;">
            {{ row.lastUpdateTime }}
           </span>
           <span v-else>
             {{ row.lastUpdateTime }}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="停止时间" align="center"  width="180" >
        <template slot-scope="{row}">
          <span>{{ row.shutdownTime }}</span>
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

  </div>
</template>

<script>
import {fetchList} from "@/api/schedule/taskServer";
import {tillNowSeconds} from "@/utils/datetime";
export default {
  name: "TaskServer",
  data() {
    return {
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
      taskServerList:[],
      logLevelOptions:[],
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    formatDeployId(row){
      if(row.lastUpdateTime==null){
        row.lastUpdateTime='--' ;
      }else{
        let ss = tillNowSeconds(null,row.lastUpdateTime);
        row.lutSeconds = ss;
      }
      return row.deployId;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.taskServerList = response.rows;
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
