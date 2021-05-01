<template>
  <div class="app-container">

    <!--列表数据-->
    <el-table :data="dataList" >
      <el-table-column label="键" prop="key" align="center">
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

  </div>
</template>

<script>

export default {
  name: "keyValueTable",
  props: {
    //父层带过来的列表值
    keyValueListData: {}
  },
  data() {
    return {
      //列表数据
      dataList:[]
    };
  },
  created() {
    this.dataList  = this.keyValueListData;
  },
  //监听父层带过来的账户信息值
  watch:{
    keyValueListData(newVal,oldVal){
      this.dataList  = newVal;
    }
  },
  methods: {

  }
};
</script>
