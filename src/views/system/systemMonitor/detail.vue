<template>
  <el-tabs v-loading="loading"  v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="内存信息" name="mem">
      <mem-info :keyValueListData="memData" />
    </el-tab-pane>
    <el-tab-pane label="CPU信息" name="cpu">
      <cpu-info :keyValueListData="cpuData" />
    </el-tab-pane>
    <el-tab-pane label="磁盘信息" name="disk">
      <disk-info :diskData="diskData" />
    </el-tab-pane>
    <el-tab-pane label="系统信息" name="sys">
      <sys-info :keyValueListData="sysData" />
    </el-tab-pane>
    <el-tab-pane label="JVM信息" name="jvm">
      <jvm-info :keyValueListData="jvmData" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {getSystemDetail} from "@/api/system/systemMonitor";
  import MemInfo from '../../common/keyValueTable'
  import CpuInfo from '../../common/keyValueTable'
  import SysInfo from '../../common/keyValueTable'
  import JvmInfo from '../../common/keyValueTable'
  import DiskInfo from './diskData'

export default {
  name: "TreeView",
  components: {
    'mem-info':MemInfo,
    'cpu-info':CpuInfo,
    'sys-info':SysInfo,
    'jvm-info':JvmInfo,
    'disk-info':DiskInfo,
  },
  mounted() {
     //this.initChart();
  },
  data() {
    return {
      loading:false,
      activeName:'mem',
      memData:[],
      cpuData:[],
      sysData:[],
      jvmData:[],
      diskData:[]
    };
  },
  created() {
    this.initData();
  },
  methods: {
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    initData(){
      this.loading=true;
      getSystemDetail().then(
        response => {
          this.createMemoryData(response.mem);
          this.createCpuData(response.cpu);
          this.createSysData(response.sys);
          this.createJvmData(response.jvm);
          this.diskData = response.sysFiles;
          this.loading=false;
        }
      );
    },
    createMemoryData(data){
      this.memData = new Array();
      this.memData.push({key:'总的物理内存',value:this.convertToString(data.totalMemorySize)});
      this.memData.push({key:'剩余的物理内存',value:this.convertToString(data.freePhysicalMemorySize)});
      this.memData.push({key:'已使用的物理内存',value:this.convertToString(data.usedMemory)});
    },
    createCpuData(data){
      this.cpuData = new Array();
      this.cpuData.push({key:'物理cpu核数',value:data.physicalProcessorCount});
      this.cpuData.push({key:'逻辑cpu核数',value:data.logicalProcessorCount});
      this.cpuData.push({key:'cpu总核数',value:data.totalCpu});
      this.cpuData.push({key:'cpu系统使用率',value:data.sysCpuRate});
      this.cpuData.push({key:'cpu用户使用率',value:data.userCpuRate});
      this.cpuData.push({key:'cpu当前等待率',value:data.iowaitCpuRate});
      this.cpuData.push({key:'cpu当前空闲率',value:data.idleCpuRate});
    },
    createSysData(data){
      this.sysData = new Array();
      this.sysData.push({key:'操作系统',value:data.osName});
      this.sysData.push({key:'IP地址',value:data.serverIp});
      this.sysData.push({key:'userHome',value:data.userHome});
      this.sysData.push({key:'userName',value:data.userName});
      this.sysData.push({key:'系统架构',value:data.osArch});
    },
    createJvmData(data){
      this.jvmData = new Array();
      this.jvmData.push({key:'程序启动时间',value:data.startTime});
      this.jvmData.push({key:'程序PID',value:data.pid});
      this.jvmData.push({key:'javaHome',value:data.javaHome});
      this.jvmData.push({key:'javaVersion',value:data.javaVersion});
      this.jvmData.push({key:'总线程数',value:data.totalThread});
      this.jvmData.push({key:'当前占用的内存',value:this.convertToString(data.totalMemorySize)});
      this.jvmData.push({key:'初始的总内存',value:this.convertToString(data.initTotalMemorySize)});
      this.jvmData.push({key:'最大可用内存',value:this.convertToString(data.maxMemorySize)});
      this.jvmData.push({key:'已使用的内存',value:this.convertToString(data.usedMemorySize)});

    },
    //转换
    convertToString(size){
      let ms = size/1.0 / 1024 / 1024 ;
      if(ms>1000){
        return (ms / 1024).toFixed(1)+'G';
      }else{
        return ms.toFixed(0)+'M';
      }
    }
  }
};
</script>
