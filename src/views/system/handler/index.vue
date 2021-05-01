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
      <el-form-item label="状态" prop="status">
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
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:handler:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table v-loading="loading" :data="handlerList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="160px" >
        <template slot-scope="{row}">
          <span>{{ row.handlerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类名" min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="HASH值" >
        <template slot-scope="{row}">
          <span>{{ row.hash }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleHandlerInfo(row)">
            <i class="el-icon-info" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="发送命令" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleCmd(row)">
            <i class="el-icon-s-tools" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="自检" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleCheck(row)">
            <i class="el-icon-s-tools" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="重新加载" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleReload(row)">
            <i class="el-icon-s-tools" />
          </span>
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

    <!-- 线程详情 -->
    <el-dialog :title="tiTitle" width="500px" :visible.sync="tiVisible">
      <handle-info :keyValueListData="keyValueListData"/>
    </el-dialog>

    <!-- 命令列表 -->
    <el-dialog :title="cmdTitle" width="500px" :visible.sync="cmdOpen">
      <el-table :data="cmdList" >
        <el-table-column label="命令名称" prop="key" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="命令代码" prop="value" align="center">
          <template slot-scope="{row}">
            <span>{{ row.cmd }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送" prop="value" align="center" width="60">
          <template slot-scope="{row}">
            <span class="link-type" @click="sendCmd(row)">
              <i class="el-icon-s-tools" />
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,getHandlerInfo,getSupportCmd,handCmd,check,reload} from "@/api/system/handler";
import HandleInfo from '../../common/keyValueTable'

export default {
  name: "Handler",
  components: {
    'handle-info':HandleInfo
  },
  data() {
    return {
      //命令列表
      cmdTitle:'',
      cmdOpen:false,
      cmdList:[],
      //详情
      tiTitle:'',
      tiVisible:false,
      keyValueListData:[],
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
      handlerList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      commonStatusOptions:this.commonStatusOptions,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        name: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleHandlerInfo(row){
      getHandlerInfo(row.className).then(
        response => {
          if(response.details==null){
            this.msgError('没有该处理器的详情');
            return;
          }
          let brData  = new Array();
          let ti = response.details;
          for (let i = 0; i < ti.length; i++) {
            brData.push({
              key:ti[i].key,
              value:ti[i].value
            });
          }
          this.keyValueListData =brData;
          this.tiTitle='['+row.handlerName+']详情';
          this.tiVisible=true;
        }
      );
    },
    //命令处理
    handleCmd(row){
      getSupportCmd(row.className).then(
        response => {
          if(response==null){
            this.msgError('没有该处理器的命令列表');
            return;
          }
          let brData  = new Array();
          let ti = response;
          for (let i = 0; i < ti.length; i++) {
            brData.push({
              name:ti[i].name,
              cmd:ti[i].cmd,
              className:row.className
            });
          }
          this.cmdList =brData;
          this.cmdTitle='['+row.handlerName+']命令列表';
          this.cmdOpen=true;
        }
      );
    },
    //发送命令
    sendCmd(row){
      let postData={
        className:row.className,
        cmd:row.cmd
      };
      handCmd(postData).then(
        response => {
          this.msgSuccess('执行结果:code='+response.code+",msg="+response.message);
        }
      );
    },
    //自检
    handleCheck(row){
      let postData={
        className:row.className
      };
      check(postData).then(
        response => {
          let mm='';
          if(response==true){
            mm='自检成功';
          }else{
            mm='自检失败';
          }
          this.msgSuccess('执行结果:'+mm);
        }
      );
    },
    //重新加载
    handleReload(row){
      let postData={
        className:row.className
      };
      reload(postData).then(
        response => {
          let mm='';
          if(response==true){
            mm='重新加载成功';
          }else{
            mm='重新加载失败';
          }
          this.msgSuccess('执行结果:'+mm);
        }
      );
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.handlerList = response.rows;
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
    }
  }
};
</script>
