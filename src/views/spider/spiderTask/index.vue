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
      <el-form-item label="平台" prop="platform">
        <el-select
          v-model="queryParams.platform"
          placeholder="平台"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in platformOptions"
            :key="dict.id"
            :label="dict.text"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="taskType">
        <el-select
          v-model="queryParams.taskType"
          placeholder="类型"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in taskTypeOptions"
            :key="dict.id"
            :label="dict.text"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="周期" prop="taskPeriod">
        <el-select
          v-model="queryParams.taskPeriod"
          placeholder="周期"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in taskPeriodOptions"
            :key="dict.id"
            :label="dict.text"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
          style="width: 120px"
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
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['spider:spiderTask:query']">搜索</el-button>
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
          v-hasPermi="['spider:spiderTask:create']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :disabled="single"
          @click="handleCreateAsTemplate"
          v-hasPermi="['spider:spiderTask:create']"
        >以此为模板</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['spider:spiderTask:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['spider:spiderTask:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload"
          size="mini"
          :disabled="multiple"
          @click="handleAddTask"
          v-hasPermi="['spider:spider:addTask']"
        >调度任务</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['spider:spiderTask:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <!--列表数据-->
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="150px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL" min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          {{ row.urlPattern }}
        </template>
      </el-table-column>
      <el-table-column label="当前页" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.page }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大页" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.maxPage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.taskTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.taskSourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.taskPeriodName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" active-value="ENABLE" inactive-value="DISABLE" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center"  width="180">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center"  width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastModifyTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['spider:spiderTask:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['spider:spiderTask:delete']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="handleAddTask(scope.row)"
            v-hasPermi="['spider:spider:addTask']"
          >调度</el-button>
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
            <el-form-item label="名称" prop="name">
             <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="平台" prop="platform">
              <el-select
                v-model="form.platform"
                placeholder="平台"
                clearable
                allow-create
                collapse-tags
                size="medium"
                style="width: 225px"
              >
                <el-option
                  v-for="dict in platformOptions"
                  :key="dict.id"
                  :label="dict.text"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="taskType">
             <el-select
               v-model="form.taskType"
               placeholder="状态"
               clearable
               allow-create
               collapse-tags
               size="medium"
               style="width: 225px"
             >
               <el-option
                 v-for="dict in taskTypeOptions"
                 :key="dict.id"
                 :label="dict.text"
                 :value="dict.id"
               />
             </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="URL" prop="urlPattern">
             <el-input v-model="form.urlPattern" placeholder="请输入URL" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="正则" prop="regex">
             <el-input v-model="form.regex" placeholder="请输入正则表达式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="周期" prop="taskPeriod">
             <el-select
               v-model="form.taskPeriod"
               placeholder="状态"
               clearable
               allow-create
               collapse-tags
               size="medium"
               style="width: 225px"
             >
               <el-option
                 v-for="dict in taskPeriodOptions"
                 :key="dict.id"
                 :label="dict.text"
                 :value="dict.id"
               />
             </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-input-number v-model="form.priority" style="width: 225px" placeholder="" controls-position="right" :min="0" :controls="false" :precision="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="状态"
                clearable
                allow-create
                collapse-tags
                size="medium"
                style="width: 225px"
              >
                <el-option
                  v-for="dict in commonStatusOptions"
                  :key="dict.id"
                  :label="dict.text"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源" prop="taskSource">
             <el-select
               v-model="form.taskSource"
               placeholder="状态"
               clearable
               allow-create
               collapse-tags
               size="medium"
               style="width: 225px"
             >
               <el-option
                 v-for="dict in taskSourceOptions"
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
            <el-form-item label="当前页" prop="page">
              <el-input-number v-model="form.page" style="width: 225px" placeholder="" controls-position="right" :min="0" :controls="false" :precision="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大页" prop="maxPage">
              <el-input-number v-model="form.maxPage" style="width: 225px" placeholder="" controls-position="right" :min="0" :controls="false" :precision="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
import {fetchList,getSpiderTask,createSpiderTask,updateSpiderTask,deleteSpiderTask} from "@/api/spider/spiderTask";
import {addTask} from "@/api/spider/spider";

export default {
  name: "SpiderTask",
  data() {
    return {
      //手动清理
      mcTitle:'',
      mcOpen:false,
      mcForm:{},
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
      dataList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      commonStatusOptions:this.commonStatusOptions,
      platformOptions:[],
      taskTypeOptions:[],
      taskSourceOptions:[],
      taskPeriodOptions:[],
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
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        platform: [
          { required: true, message: "平台不能为空", trigger: "blur" }
        ],
        urlPattern: [
          { required: true, message: "URL不能为空", trigger: "blur" }
        ],
        regex: [
          { required: true, message: "正则表达式不能为空", trigger: "blur" }
        ],
        taskType: [
          { required: true, message: "任务类型不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        priority: [
          { required: true, message: "优先级不能为空", trigger: "blur" }
        ],
        taskSource: [
          { required: true, message: "来源不能为空", trigger: "blur" }
        ],
        taskPeriod: [
          { required: true, message: "周期不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEnumTree('Platform','FIELD',false).then(response => {
      this.platformOptions = response;
    });
    this.getEnumTree('TaskType','FIELD',false).then(response => {
      this.taskTypeOptions = response;
    });
    this.getEnumTree('TaskSource','FIELD',false).then(response => {
      this.taskSourceOptions = response;
    });
    this.getEnumTree('TaskPeriod','FIELD',false).then(response => {
      this.taskPeriodOptions = response;
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
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
        name: undefined,
        platform: 'BBS_8264',
        urlPattern: undefined,
        status: "ENABLE",
        page: 1,
        regex:undefined,
        taskType:'PICTURE',
        priority:2,
        remark:undefined,
        taskSource:'MANUAL',
        taskPeriod:'ONCE',
        status:'ENABLE'
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleCreate() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 以模板新增按钮操作 */
    handleCreateAsTemplate() {
      this.reset();
      const id = this.ids.join(",");
      getSpiderTask(id).then(response => {
        this.form = response;
        this.form.id=undefined;
        this.form.name=undefined;
        this.form.page=undefined;
        this.form.status="ENABLE",
        this.open = true;
        this.title = "添加";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids.join(",")
      getSpiderTask(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSpiderTask(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            createSpiderTask(this.form).then(response => {
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
      const ids = row.id || this.ids.join(",");
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteSpiderTask(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleAddTask(row) {
      const ids = row.id || this.ids.join(",");
      this.$confirm('是否确认将编号为"' + ids + '"的任务添加到爬虫调度里面?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return addTask(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("添加成功");
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
          return exportDatabaseClean(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
