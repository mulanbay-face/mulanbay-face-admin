<template>
  <div class="app-container">

    <!--列表数据-->
    <el-table :data="dataList" >
      <el-table-column label="磁盘路径" prop="key" align="center">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="盘符类型" prop="value" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sysTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件类型" prop="value" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总空间" prop="value" align="center">
        <template slot-scope="{row}">
          <span>{{ convertToString(row.totalSpace) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="空闲空间" prop="value" align="center">
        <template slot-scope="{row}">
          <span>{{ convertToString(row.freeSpace) }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>

export default {
  name: "diskData",
  props: {
    //父层带过来的列表值
    diskData: {}
  },
  data() {
    return {
      //列表数据
      dataList:[]
    };
  },
  created() {
    this.dataList  = this.diskData;
  },
  //监听父层带过来的账户信息值
  watch:{
    diskData(newVal,oldVal){
      this.dataList  = newVal;
    }
  },
  methods: {
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
