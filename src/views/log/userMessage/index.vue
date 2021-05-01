<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="datePickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="名称检索" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item v-if="moreCdn==true" label="发送状态" prop="sendStatus">
        <el-select
          v-model="queryParams.sendStatus"
          filterable
          clearable
          default-first-option>
          <el-option
            v-for="dict in sendStatusOptions"
            :key="dict.id"
            :label="dict.text"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['log:userMessage:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-more" size="mini" @click="handleMoreCdn">{{cdnTitle}}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
          v-hasPermi="['log:userMessage:send']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['log:userMessage:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['log:userMessage:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <!--列表数据-->
    <el-table v-loading="loading" :data="userMessageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" fixed="left" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center"  min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送状态" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.sendStatus=='SEND_SUCCESS'" style="color:green ;">
            {{ row.sendStatusName }}
           </span>
           <span v-else-if="row.sendStatus=='SEND_FAIL'" style="color:red ;">
            {{ row.sendStatusName }}
           </span>
           <span v-else style="color:darkmagenta ;">
             {{ row.sendStatusName }}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="重发" align="center" width="60">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleReSend(row)">
            <i class="el-icon-refresh" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" width="60">
        <template slot-scope="{row}">
          <span class="link-type" @click="msgAlert('消息内容',row.content)">
            <i class="el-icon-info" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="失败次数" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.failCount>0" style="color:red ;">
            {{ row.failCount }}
           </span>
           <span v-else style="color:black ;">
             {{ row.failCount }}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="期望发送时间" align="center" width="180" >
        <template slot-scope="{row}">
          <span>{{ row.expectSendTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后一次发送时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ formatLastSendTime(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="延迟时间" align="center"  min-width="100px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span v-if="row.delaySeconds==null">
           --
          </span>
         <span v-else-if="row.delaySeconds<=10" style="color: green;">
          实时
         </span>
         <span v-else-if="row.delaySeconds<=60" style="color: purple;">
          <span>{{ row.delaySeconds +'秒'}}</span>
         </span>
         <span v-else style="color: red;">
          <span>{{ row.delay}}</span>
         </span>
        </template>
      </el-table-column>
      <el-table-column label="服务器节点" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.nodeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="180">
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


    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="580px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户名/手机号" prop="username">
          <el-input v-model="form.username" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="5"  placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="发送时间" prop="notifyTime">
          <el-date-picker type="datetime" v-model="form.notifyTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                    :style="{width: '200px'}" placeholder="请选择时间" clearable >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="消息代码" prop="code">
          <el-input-number v-model="form.code"  controls-position="right" :min="0" :controls="true" :precision="0"/>
          <span class="link-type" @click="msgAlert('提示','不填表示为立即发送')"><i class="el-icon-question" /></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,resendUserMessage,sendUserMessage} from "@/api/log/userMessage";
import {tillNowSeconds,formatSeconds } from "@/utils/datetime";
export default {
  name: "UserMessage",
  data() {
    return {
      //查询条件更多属性 start
      cdnTitle:'更多',
      moreCdn:false,
      //查询条件更多属性 end
      title:'',
      open:false,
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
      userMessageList:[],
      sendStatusOptions:[],
      //日期范围快速选择
      datePickerOptions:this.datePickerOptions,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名/手机号不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        notifyTime: [
          { required: true, message: "发送时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEnumTree('MessageSendStatus','FIELD',false).then(response => {
      this.sendStatusOptions = response;
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
    /** 格式化 */
    formatLastSendTime(row){
      if(row.lastSendTime==null){
        row.delay = '--';
      }else{
        let s = tillNowSeconds(row.expectSendTime,row.lastSendTime);
        row.delay = formatSeconds(s);
        row.delaySeconds = s;
      }
      return row.lastSendTime;
    },
    /** 重发 */
    handleReSend(row){
      const id = row.id;
      this.$confirm('是否确认重新发送编号为"' + id + '"的消息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return resendUserMessage(id);
        }).then(() => {
          this.getList();
          this.msgSuccess('重发成功');
        }).catch(function() {});
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.userMessageList = response.rows;
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
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        username: undefined,
        title: undefined,
        content:undefined,
        notifyTime:undefined
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleCreate() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            sendUserMessage(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            sendUserMessage(this.form).then(response => {
              this.msgSuccess("发送成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.join(",");
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteUserMessage(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有购买来源数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUserMessage(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
