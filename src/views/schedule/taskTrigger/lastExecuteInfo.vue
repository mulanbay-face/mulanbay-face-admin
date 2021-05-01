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

    <br><br>
    <div slot="footer" class="dialog-footer" align="right">
      <el-button type="primary" @click="handleRedo" v-hasPermi="['schedule:taskLog:redo']">重做</el-button>
      <el-button type="stat" @click="refresh" v-hasPermi="['schedule:taskLog:redo']">刷新</el-button>
    </div>

  </div>
</template>

<script>
  import {getLastTaskLog,redo} from "@/api/schedule/taskLog";

export default {
  name: "LastExecuteInfo",
  props: {
    //父层带过来的列表值
    triggerData: {
      id:undefined
    }
  },
  data() {
    return {
      //列表数据
      dataList:[],
      taskLogId:undefined
    };
  },
  created() {
    this.handleReceiveData(this.triggerData);
  },
  //监听父层带过来的账户信息值
  watch:{
    triggerData(newVal,oldVal){
      this.triggerData = newVal;
      this.handleReceiveData(this.triggerData);
    }
  },
  methods: {
    //刷新
    refresh(){
      this.handleReceiveData(this.triggerData);
    },
    //处理数据
    handleReceiveData(data){
      getLastTaskLog(data.id).then(response => {
        let list = new Array();
        if(response==null){
          this.msgError('未找到最近一次执行记录,可能该调度配置为不记录日志');
          this.taskLogId= undefined;
          this.dataList= list;
          //调用父组件的方法来关闭子组件
          //this.$emit('closeMe');
          return;
        }else{
          list.push({key:'调度名称',value:response.taskTrigger.name});
          list.push({key:'调度结果',value:response.executeResultName});
          list.push({key:'执行时长',value:response.costTime+'毫秒'});
          list.push({key:'执行时间',value:response.startTime});
          list.push({key:'最后一次重做时间',value:response.lastStartTime});
          list.push({key:'重做次数',value:response.redoTimes});
          list.push({key:'执行情况',value:response.logComment});
          this.taskLogId = response.id;
        }
        this.dataList= list;
      });
    },
    //重做
    handleRedo(){
      if(this.taskLogId==undefined){
        this.msgError('未找到最近一次执行记录');
        return;
      }
      this.redoSchedule();
    },
    redoSchedule(){
      redo(this.taskLogId).then(response => {
        this.msgSuccess('重做成功');
        this.handleReceiveData(this.triggerData);
      });
    }
  }
};
</script>
