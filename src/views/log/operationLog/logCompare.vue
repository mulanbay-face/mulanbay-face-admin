<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="操作对象" prop="beanName">
        <el-input
          v-model="queryParams.beanName"
          disabled
          size="small"
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item label="主键编号" prop="beanId">
        <el-input
          v-model="beanId"
          disabled
          size="small"
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="query" icon="el-icon-d-arrow-left" size="mini" @click="handleFetch('EARLY')" v-hasPermi="['log:operationLog:getNearstCompareData']">往前</el-button>
        <el-button type="query" icon="el-icon-d-arrow-right" size="mini" @click="handleFetch('LATER')" v-hasPermi="['log:operationLog:getNearstCompareData']">往后</el-button>
      </el-form-item>
    </el-form>

    <!--数据-->
    <div style="padding: 0px 20px 0px 20px;">
      <el-steps>
        <el-step title="数据库最新数据" status="finish" icon="el-icon-edit"></el-step>
        <el-step title="当前操作数据" status="finish" icon="el-icon-upload"></el-step>
        <el-step title="比较数据" status="finish" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>
    <el-row>
      <el-col :span="8" class="card-box">
        <el-card>
          <div class="chart-wrapper">
            <i class="el-icon-info" />{{dbInfo}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box"  align="left">
        <el-card>
          <div class="chart-wrapper">
            <i class="el-icon-info" />{{currentInfo}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box" align="left">
        <el-card v-loading="loading">
          <div class="chart-wrapper">
            <i class="el-icon-info" />{{compareInfo}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" class="card-box">
        <el-card>
          <div class="chart-wrapper" align="center" >
            <db-list :jsonData="dbData"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box"  align="center">
        <el-card>
          <div class="chart-wrapper">
            <current-list :jsonData="currentData"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box" align="center">
        <el-card v-loading="loading">
          <div class="chart-wrapper">
            <compare-list :jsonData="compareData"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getCompareData,getEditLogData,getNearstCompareData } from "@/api/log/operationLog";
  import {copyObject,getQueryObject} from "@/utils/index";
  import {string2Json} from "@/utils/mulanbay";

  import DataList from '../../common/jsonTreeTable'

export default {
  name: "LogCompare",
  components: {
    'db-list':DataList,
    'current-list':DataList,
    'compare-list':DataList
  },
  mounted() {
     //this.initChart();
  },
  data() {
    return {
      loading:false,
      //被操作对象的主键
      beanId:undefined,
      dbData:[],
      currentData:[],
      compareData:[],
      dbInfo:'数据库最新快照',
      currentInfo:'',
      compareInfo:'',
      // 查询参数
      queryParams: {
        currentCompareId:undefined,
        compareType:'EARLY'
      }
    };
  },
  created() {
    let qb = getQueryObject(null);
    if(qb.operationLogId!=null){
      //操作日志页面进来
      this.loadCompareData(qb.operationLogId);
    }else if(qb.beanName!=null){
      //业务页面进来
      this.queryParams.beanName = qb.beanName;
      this.beanId = qb.id;
      this.loadEditData();
    }

  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.loading = true;
      getNearstCompareData(this.queryParams).then(
        response => {
          if(response.compareData==null){
            this.msgInfo('没有更多数据');
            this.compareData={
              jsonObject:{}
            };
            this.compareInfo='';
          }else{
            this.compareData={
              jsonObject:string2Json(response.compareData.paras)
            };
            this.compareInfo=this.genOperInfo(response.compareData);
            //设置当前比较值
            this.queryParams.currentCompareId = response.compareData.id;
          }
          this.loading = false;
        }
      );

    },
    /** 重置按钮操作 */
    handleFetch(compareType){
      this.queryParams.compareType= compareType;
      this.handleQuery();
    },
    /** 操作日志页面进入:初始化获取数据 */
    loadCompareData(operationLogId) {
      let para ={
        id:operationLogId
      };
      getCompareData(para).then(
        response => {
          this.dbData={
            jsonObject:response.latestData
          };
          this.currentData={
            jsonObject:string2Json(response.currentData.paras)
          };
          this.compareData={
            jsonObject:response.compareData
          };
          //获取BeanName，无论从操作日志进来还是各业务模块进来，最终还是转换为业务类的Bean
          this.queryParams.beanName = response.currentData.systemFunction.beanName;
          this.beanId = response.currentData.idValue;
          //设置初始比较值
          this.queryParams.currentCompareId = response.currentData.id;
          this.currentInfo=this.genOperInfo(response.currentData);
        }
      );
    },
    /** 业务页面进入:初始化获取数据 */
    loadEditData(operationLogId) {
      let para ={
        id:this.beanId,
        beanName:this.queryParams.beanName,
        compareType:this.queryParams.compareType
      };
      getEditLogData(para).then(
        response => {
          this.dbData={
            jsonObject:response.latestData
          };
          if(response.currentData!=null){
            this.currentData={
              jsonObject:string2Json(response.currentData.paras)
            };
            //设置初始比较值
            this.queryParams.currentCompareId = response.currentData.id;
          }else{
            this.currentData={
              jsonObject:{}
            };
          }
          this.compareData={
            jsonObject:response.compareData
          };
          this.currentInfo=this.genOperInfo(response.currentData);
          this.compareInfo=this.genOperInfo(response.compareData);
        }
      );
    },
    //操作描述
    genOperInfo(log){
      if(log==null){
        return null;
      }else{
        return '操作人:'+log.userName
            +',时间:'+log.occurStartTime
            +',操作:'+log.systemFunction.name+',操作ID:'+log.id;
      }
    }
  }
};
</script>
