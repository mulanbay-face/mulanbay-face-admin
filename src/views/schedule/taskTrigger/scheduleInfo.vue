<template>
  <div class="app-container">

    <!--列表数据-->
    <el-table :data="dataList" >
      <el-table-column label="字段" prop="key" align="center">
        <template slot-scope="{row}">
          <span>{{ row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值" prop="value" align="center">
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>
    </el-table>

    <span style="font-weight:bold;font-size: 14px;color:#778899;">
      <br><br>
      <i class="el-icon-user-solid" />正在执行中的调度
      <br><br>
    </span>
    <el-table :data="cecJobsList" >
      <el-table-column label="编号" prop="key" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度名称" prop="value" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度信息" prop="value" align="center" width="80">
        <template slot-scope="{row}">
          <span>--</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getScheduleInfo} from "@/api/schedule/taskTrigger";

export default {
  name: "ScheduleInfo",
  data() {
    return {
      //列表数据
      dataList:[],
      cecJobsList:[]
    };
  },
  created() {
    this.initData();
  },
  //监听父层带过来的账户信息值
  watch:{
  },
  methods: {
    //处理数据
    initData(){
      getScheduleInfo().then(response => {
        let list = new Array();
        list.push({key:'服务器节点',value:response.scheduleInfo.deployId});
        list.push({key:'调度是否启用',value:response.scheduleInfo.schedule});
        list.push({key:'支持分布式',value:response.scheduleInfo.supportDistri});
        list.push({key:'是否定时检查',value:response.scheduleInfo.check});
        list.push({key:'定时检查周期',value:response.scheduleInfo.interval+'秒'});
        list.push({key:'已经被调度的任务数',value:response.scheduleInfo.scheduleJobsCount+'个'});
        list.push({key:'正在执行中的任务数',value:response.scheduleInfo.currentlyExecutingJobsCount+'个'});
        this.dataList= list;
        //调度列表
        const ceJobs = response.currentlyExecutingJobs;
        let ceList = new Array();
        if(ceJobs!=null&&ceJobs.length>0){
          for (let i = 0; i < ceJobs.length; i++) {
            let row = {
                id:ceJobs[i].id,
                name:ceJobs[i].name
            };
            ceList.push(row);
          }
        }
        this.cecJobsList = ceJobs;
      });
    }
  }
};
</script>
