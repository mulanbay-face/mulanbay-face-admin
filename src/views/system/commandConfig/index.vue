<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="级别" prop="level">
       <el-select
         v-model="queryParams.level"
         placeholder="级别"
         clearable
         collapse-tags
         size="small"
         style="width: 240px"
       >
         <el-option
           v-for="dict in levelOptions"
           :key="dict.id"
           :label="dict.text"
           :value="dict.id"
         />
       </el-select>
      </el-form-item>
      <el-form-item  v-if="moreCdn==true" label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in commonStatusOptions"
            :key="dict.id"
            :label="dict.text"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:commandConfig:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-more" size="mini" @click="handleMoreCdn">{{cdnTitle}}</el-button>

      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table v-loading="loading" :data="commandConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" fixed="left" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="命令名称" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="命令代码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.scode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.level=='NORMAL'" style="color:black ;">
            {{ row.levelName }}
           </span>
           <span v-else-if="row.level=='WARNING'" style="color:burlywood ;">
            {{ row.levelName }}
           </span>
           <span v-else-if="row.level=='ERROR'" style="color:red ;">
            {{ row.levelName }}
           </span>
           <span v-else style="color:darkmagenta ;">
             {{ row.levelName }}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="路径" align="center"  min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行" align="center" width="80">
        <template slot-scope="{row}">
           <span class="link-type" @click="handleSendCmd(row)">
            <i class="el-icon-s-tools" />
           </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" active-value="ENABLE"  disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
    </el-table>


    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 执行命令对话框 -->
    <el-dialog :title="cmdTitle" :visible.sync="cmdOpen" width="350px" append-to-body>
      <el-form ref="cmdForm" :model="cmdForm"  label-width="80px">
        <el-form-item label="命令名称" prop="name">
         <el-input v-model="cmdForm.name" disabled placeholder="" />
        </el-form-item>
        <el-form-item label="同步执行" prop="sync">
          <el-switch v-model="cmdForm.sync"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSendCmd">确 定</el-button>
        <el-button @click="cancelSendCmd">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,sendCmd} from "@/api/system/commandConfig";

export default {
  name: "CommandConfig",
  data() {
    return {
      //查询条件更多属性 start
      cdnTitle:'更多',
      moreCdn:false,
      //查询条件更多属性 end
      //执行命令
      cmdTitle:'',
      cmdOpen:false,
      cmdForm:{},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 列表数据
      commandConfigList:[],
      levelOptions:[],
      commonStatusOptions:this.commonStatusOptions,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
    this.getEnumTree('LogLevel','FIELD',false).then(response => {
      this.logLevelOptions = response;
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
    /** 命令发送按钮列表 */
    handleSendCmd(row){
      this.cmdTitle = '执行命令';
      this.cmdOpen = true;
      this.cmdForm.name = row.name;
      this.cmdForm.id = row.id;
      this.cmdForm.sync= false;
    },
    submitSendCmd(){
      sendCmd(this.cmdForm).then(
        response => {
          this.msgSuccess("发送成功,执行结果:"+response);
          this.cmdOpen = false;
        }
      );
    },
    cancelSendCmd(){
      this.cmdOpen = false;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.commandConfigList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    }
  }
};
</script>
