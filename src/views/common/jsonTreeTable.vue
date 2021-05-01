<template>
  <div class="app-container">

    <!--列表数据-->
    <el-table
      :data="dataList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="字段" prop="id" sortable="custom" align="center">
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

  </div>
</template>

<script>
  import {parseJsonToTree} from "@/utils/mulanbay";

export default {
  name: "jsonTreeTable",
  props: {
    //父层带过来的列表值
    jsonData: {
      jsonObject:undefined
    }
  },
  data() {
    return {
      //列表数据
      dataList:[],
      defaultProps: {
        children: "children",
        label: "label"
      },
    };
  },
  created() {
    this.handleReceiveData(this.jsonData);
  },
  //监听父层带过来的账户信息值
  watch:{
    jsonData(newVal,oldVal){
      this.handleReceiveData(newVal);
    }
  },
  methods: {
    /** 处理父类发起的数据 */
    handleReceiveData(data){
      let jo = data.jsonObject;
      if(this.isObjectEmpty(jo)){
        this.dataList=[];
      }else{
        this.dataList = parseJsonToTree(jo);
        //console.log(JSON.stringify(this.dataList));
      }
    }
  }
};
</script>
