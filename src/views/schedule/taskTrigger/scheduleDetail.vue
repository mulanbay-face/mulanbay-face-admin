<template>
  <div class="app-container">

    <!--调度比较数据-->
    <el-row>
      <el-col :span="24" align="center" style="font-weight:bold;font-size: 16px;color:#6495ED;">
        <i class="el-icon-user-solid" />调度信息：{{ scheduleInfo }}<br><br>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" align="center" style="font-weight:bold;font-size: 14px;color:	#778899;" >
        <i class="el-icon-info" />数据库中最新内容
      </el-col>
      <el-col :span="12"  align="center" style="font-weight:bold;font-size: 14px;color:	#778899;">
        <i class="el-icon-info" />调度服务器中内容
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-table
          :data="dbData"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column label="字段" align="center">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="值"  :show-overflow-tooltip="true">
            <template slot-scope="{row}">
              <span>{{ row.text }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table
          :data="scheduleData"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column label="字段" align="center">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="值"  :show-overflow-tooltip="true">
            <template slot-scope="{row}">
              <span>{{ row.text }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {getScheduleDetail} from "@/api/schedule/taskTrigger";
  import {parseJsonToTree} from "@/utils/mulanbay";

export default {
  name: "ScheduleDetail",
  props: {
    //父层带过来的列表值
    triggerData: {
      id:undefined
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "text"
      },
      scheduleInfo:'',
      //数据库里面的数据
      dbData:[],
      //调度服务器里的数据
      scheduleData:[]
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
    //处理数据
    handleReceiveData(data){
      getScheduleDetail(data.id).then(response => {
        this.dbData = parseJsonToTree(response.dbInfo);
        //console.log(JSON.stringify(this.dbData));
        this.scheduleData = parseJsonToTree(response.scheduleInfo);
        let ss ='加入调度器时间:'+response.addToScheduleTime+",当前状态:";
        if(response.isExecuting!=null&&response.isExecuting==true){
          ss+='正在运行中';
        }else{
          ss+='未运行';
        }
        this.scheduleInfo = ss;
      });
    }
  }
};
</script>
