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
      <el-form-item label="错误代码" prop="errorCode">
        <el-input
          v-model="queryParams.errorCode"
          placeholder="错误代码"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['log:errorCodeDefine:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
          v-hasPermi="['log:errorCodeDefine:create']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['log:errorCodeDefine:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['log:errorCodeDefine:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['log:errorCodeDefine:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="mini"
          @click="handleReloadCacheConfig"
          v-hasPermi="['log:errorCodeDefine:reloadCacheConfig']"
        >刷新缓存</el-button>
      </el-col>
    </el-row>

    <!--列表数据-->
    <el-table v-loading="loading" :data="errorCodeDefineList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="代码" prop="code" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="180px"  :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" align="center" width="80">
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
      <el-table-column label="是否提醒" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.notifiable"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="实时提醒" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.realtimeNotify"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="记录日志" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.loggable"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="系统分类" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bussTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计次数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="限流秒数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.limitPeriod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['log:errorCodeDefine:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['log:errorCodeDefine:delete']"
          >删除</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="错误代码" prop="code">
              <el-input-number v-model="form.code" style="width: 505px" align="left" controls-position="right" :min="0" :controls="true" :precision="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="代码名称" prop="name">
              <el-input v-model="form.name" style="width: 505px" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="等级" prop="level">
             <el-select
               v-model="form.level"
               placeholder="等级"
               clearable
               collapse-tags
               size="small"
               style="width: 200px"
             >
               <el-option
                 v-for="dict in levelOptions"
                 :key="dict.id"
                 :label="dict.text"
                 :value="dict.id"
               />
             </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="bussType">
             <el-select
               v-model="form.bussType"
               placeholder="分类"
               clearable
               collapse-tags
               size="small"
               style="width: 200px"
             >
               <el-option
                 v-for="dict in bussTypeOptions"
                 :key="dict.id"
                 :label="dict.text"
                 :value="dict.id"
               />
             </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发送消息" prop="notifiable">
              <el-switch
                v-model="form.notifiable">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实时提醒" prop="realtimeNotify">
              <el-switch
                v-model="form.realtimeNotify">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="记录日志" prop="loggable">
              <el-switch
                v-model="form.loggable">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消息限流" prop="limitPeriod">
              <el-input-number v-model="form.limitPeriod" controls-position="right" :min="0" :controls="true" :precision="0"/>
              秒
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="产生原因" prop="causes">
              <el-input v-model="form.causes" type="textarea" :rows="4"  style="width: 505px"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="解决方法" prop="solutions">
              <el-input v-model="form.solutions" type="textarea" :rows="4"  style="width: 505px"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="4"  style="width: 505px"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {fetchList,reloadCacheConfig,getErrorCodeDefine,createErrorCodeDefine,updateErrorCodeDefine,deleteErrorCodeDefine} from "@/api/log/errorCodeDefine";

export default {
  name: "ErrorCodeDefine",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      codes: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 列表数据
      errorCodeDefineList:[],
      levelOptions:[],
      bussTypeOptions:[],
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
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "代码不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "等级不能为空", trigger: "blur" }
        ],
        bussType: [
          { required: true, message: "分类不能为空", trigger: "blur" }
        ],
        causes: [
          { required: true, message: "产生原因不能为空", trigger: "blur" }
        ]

      }
    };
  },
  created() {
    this.getList();
    this.getEnumTree('LogLevel','FIELD',false).then(response => {
      this.levelOptions = response;
    });
    this.getEnumTree('MonitorBussType','FIELD',false).then(response => {
      this.bussTypeOptions = response;
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.errorCodeDefineList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 刷新缓存
    handleReloadCacheConfig(){
      reloadCacheConfig().then(response => {
        this.msgSuccess('刷新成功');
      });
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
        level:'NORMAL',
        bussType:'SYSTEM',
        realtimeNotify:false,
        notifiable:true,
        loggable:true,
        limitPeriod:0
      };
      this.resetForm("form");
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
      this.codes = selection.map(item => item.code)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleCreate() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const code = row.code || this.codes.join(",")
      getErrorCodeDefine(code).then(response => {
        this.form = response;
        //适配以前的判断逻辑
        this.form.id=0;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateErrorCodeDefine(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            createErrorCodeDefine(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const codes = row.code || this.codes.join(",");
      this.$confirm('是否确认删除编号为"' + codes + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteErrorCodeDefine(codes);
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
          return exportErrorCodeDefine(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
