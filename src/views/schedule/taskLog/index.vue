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
      <el-form-item label="调度器" prop="taskTriggerId">
        <treeselect
         v-model="queryParams.taskTriggerId"
         @input="handleQuery"
         style="width: 240px"
         :options="taskTriggerOptions"
         :disable-branch-nodes="true"
         :show-count="true"
         :searchable="true"
         placeholder="请选择调度器"
         />
      </el-form-item>
      <el-form-item label="执行结果" prop="executeResult">
        <el-select
          v-model="queryParams.executeResult"
          placeholder="执行结果"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in executeResultOptions"
            :key="dict.id"
            :label="dict.text"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="query" icon="el-icon-s-data" size="mini" @click="handleQuery" v-hasPermi="['schedule:taskLog:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table v-loading="loading" :data="taskLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" fixed="left" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度名称" align="center" fixed="left" min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.taskTrigger.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务日期" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.bussDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度执行ID" align="center"  min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.scheduleIdentityId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行结果" align="center">
        <template slot-scope="{row}">
           <span v-if="row.executeResult=='SUCCESS'">
             <span class="link-type" @click="showLogComment(row)" style="color:green ;">
               <i class="el-icon-success" />
             </span>
           </span>
           <span v-else-if="row.executeResult=='FAIL'">
             <span class="link-type" @click="showLogComment(row)" style="color:red ;">
               <i class="el-icon-error" />
             </span>
           </span>
           <span v-else>
             <span @click="showLogComment(row)">
               {{ row.executeResult }}
             </span>
           </span>
        </template>
      </el-table-column>
      <el-table-column label="运行开始时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行结束时间" align="center"  width="180">
        <template slot-scope="{row}">
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="花费时间" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.costTime>=1000" style="color:red ;">
            {{ (row.costTime/1000).toFixed(1) +'秒' }}
           </span>
           <span v-else>
             {{ row.costTime+'毫秒'  }}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="服务器节点" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.deployId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务器IP" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.ipAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重做次数" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.redoTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后一次重做开始时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后一次重做结束时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh-right"
            @click="handleRedo(scope.row)"
            v-hasPermi="['schedule:taskLog:redo']"
          >重做</el-button>
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
import {fetchList,redo} from "@/api/schedule/taskLog";
import {getTaskTriggerTree} from "@/api/schedule/taskTrigger";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "TaskLog",
  components: {
    Treeselect
  },
  data() {
    return {
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
      taskLogList:[],
      taskTriggerOptions:[],
      executeResultOptions:[],
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
    getTaskTriggerTree(false).then(response => {
      this.taskTriggerOptions = response;
    });
    this.getEnumTree('cn.mulanbay.schedule.enums.JobExecuteResult','FIELD',false).then(response => {
      this.executeResultOptions = response;
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.taskLogList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 执行结果操作 */
    showLogComment(row){
      this.msgAlert('执行结果',row.logComment);
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
    // 重做
    handleRedo(row){
      const id = row.id;
      const title ='是否确定要重做['+row.taskTrigger.name+']在'+row.bussDate+'的编号为'+id+'调度？';
      this.$confirm(title, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return redo(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("重做成功");
        }).catch(function() {});
    }
  }
};
</script>
