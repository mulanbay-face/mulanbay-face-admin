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
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:thread:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table v-loading="loading" :data="threadList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.threadName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleThreadInfo(row)">
            <i class="el-icon-info" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="周期(秒)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.interval }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持续时间(秒)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.continuedSeconds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败总次数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.failCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行总次数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
           <span v-if="row.stop==true" style="color: red;">
            <i class="el-icon-error" />
           </span>
           <span v-else>
             <i class="el-icon-success" style="color: green;"/>
           </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近一次执行时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastExecuteTime }}</span>
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
      <thread-info :keyValueListData="keyValueListData"/>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,getThreadInfo} from "@/api/system/thread";
import ThreadInfo from '../../common/keyValueTable'

export default {
  name: "Thread",
  components: {
    'thread-info':ThreadInfo
  },
  data() {
    return {
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
      threadList:[],
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
    handleThreadInfo(row){
      getThreadInfo(row.id).then(
        response => {
          let brData  = new Array();
          if(response==null){
            this.msgError('没有该线程详情');
            return;
          }
          let ti = response;
          for (let i = 0; i < ti.length; i++) {
            brData.push({
              key:ti[i].name,
              value:ti[i].value
            });
          }
          this.keyValueListData =brData;
          this.tiTitle='['+row.threadName+']详情';
          this.tiVisible=true;
        }
      );
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.threadList = response.rows;
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
