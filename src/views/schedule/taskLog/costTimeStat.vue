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
        <el-button type="stat" icon="el-icon-s-data" size="mini" @click="handleQuery" v-hasPermi="['schedule:taskLog:costTimeStat']">统计</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--图表数据-->
    <div>
      <common-chart :chartData="chartData"/>
    </div>

  </div>
</template>

<script>
  import {getTaskTriggerTree} from "@/api/schedule/taskTrigger";
  import {getTaskLogCostTimeStat} from "@/api/schedule/taskLog";
  import {getQueryObject} from "@/utils/index";

  import CommonChart from '../../chart/commonChart'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "CostTimeStat",
  components: {
    Treeselect,
    'common-chart':CommonChart
  },
  mounted() {
     //this.initChart();
  },
  data() {
    return {
      //图表数据
      chartData:{},
      // 加载层信息
      loading: [],
      //加载层配置
      loadingOptions:this.loadingOptions,
      taskTriggerOptions:[],
      executeResultOptions:[],
      //日期范围快速选择
      datePickerOptions:this.datePickerOptions,
      // 日期范围
      dateRange: this.getYearDateRange(0),
      // 查询参数
      queryParams: {
        minPrice:0,
        dateGroupTypeStr:'MONTH',
        compliteDate:true
      }
    };
  },
  created() {
    getTaskTriggerTree(false).then(response => {
      this.taskTriggerOptions = response;
    });
    let qb = getQueryObject(null);
    if(!this.isObjectEmpty(qb.taskTriggerId)){
      this.queryParams.taskTriggerId = qb.taskTriggerId;
    }
    this.initChart();
    this.getEnumTree('cn.mulanbay.schedule.enums.JobExecuteResult','FIELD',false).then(response => {
      this.executeResultOptions = response;
    });
  },
  methods: {
    // 打开加载层
    openLoading() {
      this.loading = this.$loading(this.loadingOptions);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.initChart();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.initChart();
    },
    initChart() {
      this.openLoading();
      let qp = this.addDateRange(this.queryParams, this.dateRange);
      getTaskLogCostTimeStat(qp).then(
        response => {
          //组装chart数据
          response.chartType='LINE';
          this.chartData = response;
          this.loading.close();
        }
      );
    }
  }
};
</script>
