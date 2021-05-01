<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="card-box">
          <div>
            <el-form :model="queryParams" ref="queryForm" :inline="true">
              <el-form-item label="自动刷新" prop="seconds">
                <el-input-number
                  v-model="seconds"
                  size="small"
                  :precision="0"
                  style="width: 120px"
                />秒
              </el-form-item>
              <el-form-item>
                <el-button type="stat" icon="el-icon-refresh" size="mini" @click="handleQuery" v-hasPermi="['system:systemMonitor:query']">刷新</el-button>
                <el-button type="query" icon="el-icon-info" size="mini" @click="handleMoreDetail" v-hasPermi="['system:systemMonitor:query']">更多详情</el-button>
              </el-form-item>
            </el-form>
          </div>
      </el-col>

      <el-col :span="8" class="card-box">
        <el-card>
          <div class="chart-wrapper" align="center" >
            <disk-monitor-chart :chartData="diskMonitorChartData"/>
          </div>
          <div align="center">
            <el-button type="stat" icon="el-icon-s-data" size="mini" @click="statTimeLine('DISK')" >统计</el-button>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="handleDiskMng" >操作</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box"  align="center">
        <el-card>
          <div class="chart-wrapper">
            <memory-monitor-chart :chartData="memoryMonitorChartData"/>
          </div>
          <div align="center">
            <el-button type="stat" icon="el-icon-s-data" size="mini" @click="statTimeLine('MEMORY')" >统计</el-button>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="handleMemoryMng" >操作</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box" align="center">
        <el-card>
          <div class="chart-wrapper">
            <cpu-monitor-chart :chartData="cpuMonitorChartData"/>
          </div>
          <div align="center">
            <el-button type="stat" icon="el-icon-s-data" size="mini" @click="statTimeLine('CPU')" >统计</el-button>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="handleCpuMng" >操作</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <div v-loading="tlLoading" class="chart-wrapper">
            <timeline-chart :chartData="timelineChartData"/>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--更多详情 -->
    <el-dialog :title="sdTitle" width="700px" :visible.sync="sdOpen">
      <system-detail/>
    </el-dialog>

    <!--磁盘操作 -->
    <el-dialog title="磁盘空间释放" width="300px" :visible.sync="diskMngOpen">
      <el-button type="primary" icon="el-icon-setting" size="mini" @click="diskMngRedirect('DatabaseClean')" v-hasPermi="['system:databaseClean:query']">数据库清理</el-button>
      <el-button type="primary" icon="el-icon-setting" size="mini" @click="diskMngRedirect('Backup')" v-hasPermi="['system:backup:query']">备份清理</el-button>
    </el-dialog>

  </div>

</template>

<script>
  import {getSystemDetail,stat} from "@/api/system/systemMonitor";
  import {sendCmd} from "@/api/system/commandConfig";
  import GaugeChart from '../../chart/gauge'
  import LineChart from '../../chart/lineChart'
  import SystemDetail from './detail'

export default {
  name: "SystemMonitor",
  components: {
    'disk-monitor-chart':GaugeChart,
    'memory-monitor-chart':GaugeChart,
    'cpu-monitor-chart':GaugeChart,
    'timeline-chart':LineChart,
    'system-detail':SystemDetail
  },
  data() {
    return {
      seconds:5,
      //系统详情
      sdTitle:'',
      sdOpen:false,
      diskMngOpen:false,
      // 加载层信息
      tlLoading:false,
      loading: [],
      loadingOptions:this.loadingOptions,
      queryParams:{},
      diskMonitorChartData:{},
      memoryMonitorChartData:{},
      cpuMonitorChartData:{},
      timelineChartData:{},
      resourceType:'MEMORY',
      systemDetails:{}
    };
  },
  created() {
    this.handleQuery();
    //每秒检查参数
    //setInterval(this.autoRefresh, 1000);
  },
  methods: {
    /** 更多详情按钮操作 */
    handleMoreDetail(){
      this.sdTitle='系统详情';
      this.sdOpen=true;
    },
    /** 自动刷新 */
    autoRefresh(){
      if(!this.isObjectEmpty(this.seconds)&&this.seconds>0){
        //setTimeout(this.getList(), this.seconds*1000);
      }
    },
    /** 磁盘操作 */
    handleDiskMng(){
      this.diskMngOpen=true;
    },
    /** 磁盘操作重新定向 */
    diskMngRedirect(path) {
      this.diskMngOpen=false;
      //路由定向
      this.$router.push({name:path,query: {}})
    },
    /** 内存操作 */
    handleMemoryMng(){
      this.$confirm('是否确认要进行缓存释放?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          //目前编号写死
          const cmd={
            id:6,
            sync:false
          };
          return sendCmd(cmd);
        }).then(() => {
          this.msgSuccess("发送命令成功，请稍后刷新页面");
        }).catch(function() {});
    },
    /** CPU操作 */
    handleCpuMng(){
      this.msgAlert('提示','尚未提供');
    },
    /** 统计按钮操作 */
    statTimeLine(resourceType){
      this.resourceType = resourceType;
      this.getTimeLineStat();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
      this.getTimeLineStat();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getTimeLineStat(){
      this.tlLoading = true;
      stat(this.resourceType).then(
        response => {
          this.timelineChartData = response;
          this.tlLoading = false;
        }
      );
    },
    /** 查询服务器信息 */
    getList() {
      this.openLoading();
      getSystemDetail().then(
        response => {
          this.createDiskMonitorChart(response.sysFiles);
          this.createMemoryMonitorChart(response.mem);
          this.createCpuMonitorChart(response.cpu);
          this.loading.close();
        }
      );
    },
    createDiskMonitorChart(data) {
      let di = data[0];
      let total = di.totalSpace/1.0 / 1024 / 1024 / 1024;
      let freeSpace = di.freeSpace/1.0 / 1024 / 1024 / 1024;
      let usedRate = ((total-freeSpace)/total*100).toFixed(2);
      let diskMonitorData={};
      diskMonitorData.value = usedRate;
      diskMonitorData.name = '磁盘使用率';
      diskMonitorData.title='['+di.path+']磁盘监控';
      diskMonitorData.subTitle='总空间:'+total.toFixed(0)+"G,空闲:"+freeSpace.toFixed(0)+'G';
      this.diskMonitorChartData = diskMonitorData;
    },
    createMemoryMonitorChart(data) {
      let total = data.totalMemorySize/1.0 / 1024 / 1024 / 1024;
      let freePhysicalMemorySize = data.freePhysicalMemorySize/1.0 / 1024 / 1024 / 1024;
      let usedRate = ((total-freePhysicalMemorySize)/total*100).toFixed(2);
      let memoryMonitorData={};
      memoryMonitorData.value = usedRate;
      memoryMonitorData.name = '内存使用率';
      memoryMonitorData.title='内存监控';
      memoryMonitorData.subTitle='总的物理内存:'+total.toFixed(1)+"G,空闲:"+freePhysicalMemorySize.toFixed(1)+'G';
      this.memoryMonitorChartData = memoryMonitorData;
    },
    createCpuMonitorChart(data) {
      let sysRate =  (data.sysCpuRate*100).toFixed(2);
      let cpuMonitorData={};
      cpuMonitorData.value = sysRate;
      cpuMonitorData.name = 'CPU使用率';
      cpuMonitorData.title='CPU监控';
      cpuMonitorData.subTitle='CPU总核数:'+data.physicalProcessorCount.toFixed(0)+"核,当前空闲率:"+data.idleCpuRate.toFixed(1)+'%';
      this.cpuMonitorChartData = cpuMonitorData;
    },
    // 打开加载层
    openLoading() {
      this.loading = this.$loading(this.loadingOptions);
    }
  }
};
</script>
<style lang="scss" scoped>
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
