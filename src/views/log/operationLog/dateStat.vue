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
      <el-form-item label="统计分类" prop="dateGroupType">
        <el-select
          v-model="queryParams.dateGroupType"
          placeholder="统计分类"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in dateGroupTypeOptions"
            :key="dict.id"
            :label="dict.text"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单类型" prop="functionDataType">
       <el-select
         v-model="queryParams.functionDataType"
         placeholder="菜单类型"
         clearable
         collapse-tags
         size="small"
         style="width: 120px"
       >
         <el-option
           v-for="dict in functionDataTypeOptions"
           :key="dict.id"
           :label="dict.text"
           :value="dict.id"
         />
       </el-select>
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="功能类型" prop="functionType">
       <el-select
         v-model="queryParams.functionType"
         placeholder="功能类型"
         clearable
         collapse-tags
         size="small"
         style="width: 120px"
       >
         <el-option
           v-for="dict in functionTypeOptions"
           :key="dict.id"
           :label="dict.text"
           :value="dict.id"
         />
       </el-select>
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="用户筛选" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名或者手机号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="补全日期" prop="compliteDate">
        <el-switch v-model="queryParams.compliteDate"  @change="handleQuery"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="stat" icon="el-icon-s-data" size="mini" @click="handleQuery" v-hasPermi="['log:operationLog:stat']">统计</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-more" size="mini" @click="handleMoreCdn">{{cdnTitle}}</el-button>
      </el-form-item>
    </el-form>

    <!--图表数据-->
    <div>
      <common-chart :chartData="chartData"/>
    </div>

  </div>
</template>

<script>
  import {getOperationLogDateStat } from "@/api/log/operationLog";
  import CommonChart from '../../chart/commonChart'


export default {
  name: "DateStat",
  components: {
    'common-chart':CommonChart
  },
  mounted() {
     this.initChart();
  },
  data() {
    return {
      //查询条件更多属性 start
      cdnTitle:'更多',
      moreCdn:false,
      //查询条件更多属性 end
      functionTypeOptions:[],
      functionDataTypeOptions:[],
      //图表数据
      chartData:{},
      //统计分类
      dateGroupTypeOptions:[],
      //图表类型
      chartTypeOptions:[
        {
          id: 'BAR',
          text: '柱状图'
        },
        {
          id: 'LINE',
          text: '折线图'
        }
      ],
      //日期范围快速选择
      datePickerOptions:this.datePickerOptions,
      // 日期范围
      dateRange: this.getYearDateRange(0),
      // 查询参数
      queryParams: {
        name: undefined,
        chartType: 'BAR',
        dateGroupType:'MONTH',
        compliteDate:true
      }
    };
  },
  created() {
    this.getEnumTree('FunctionType','ORDINAL',false).then(response => {
      this.functionTypeOptions = response;
    });
    this.getEnumTree('FunctionDataType','ORDINAL',false).then(response => {
      this.functionDataTypeOptions = response;
    });
    this.getDictItemTree('CHART_DATE_GROUP_FULL',false).then(response => {
      this.dateGroupTypeOptions = response;
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
      getOperationLogDateStat(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          //组装chart数据
          const dateGroupType = this.queryParams.dateGroupType;
          const chartType = this.queryParams.chartType;
          if(dateGroupType=='DAYCALENDAR'){
            response.chartType='CALANDER';
          }else if(chartType=='BAR'){
            response.chartType='BAR';
          }else{
            response.chartType='LINE';
          }
          this.chartData = response;
        }
      );
    }
  }
};
</script>
