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
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:databaseClean:query']">搜索</el-button>
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
          v-hasPermi="['system:databaseClean:create']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:databaseClean:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:databaseClean:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:databaseClean:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <!--列表数据-->
    <el-table v-loading="loading" :data="databaseCleanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleCounts(row)">{{ row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间字段" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.dateField }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保留天数" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleManualClean(row)">{{ row.days }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含附加条件" align="center" width="120">
        <template slot-scope="{row}">
           <span v-if="row.extraCondition==null" style="color: red;">
            <i class="el-icon-error" />
           </span>
           <span v-else>
             <i class="el-icon-success" style="color: green;"/>
           </span>
        </template>
      </el-table-column>
      <el-table-column label="清空库表" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleTruncateTable(row)"><i class="el-icon-circle-close" /></span>
        </template>
      </el-table-column>
      <el-table-column label="删除类型" align="center"  width="120">
        <template slot-scope="{row}">
          <span>{{ row.cleanTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后一次更新时间" align="center"  width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastCleanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后一次更新条数" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastCleanCounts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" active-value="ENABLE" inactive-value="DISABLE" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orderIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:databaseClean:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:databaseClean:delete']"
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
            <el-form-item label="名称" prop="name">
             <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="表名" prop="tableName">
             <el-input v-model="form.tableName" placeholder="请输入表名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间字段" prop="dateField">
             <el-input v-model="form.dateField" placeholder="请输入时间字段" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保留天数" prop="days">
             <el-input-number v-model="form.days" style="width: 225px" placeholder="" controls-position="right" :min="0" :controls="false" :precision="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="删除类型" prop="cleanType">
             <el-radio-group v-model="form.cleanType">
               <el-radio label="DATE_COMPARE">按时间条件</el-radio>
               <el-radio label="TRUNCATE">全表删除</el-radio>
             </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附加条件" prop="extraCondition">
             <el-input v-model="form.extraCondition" placeholder="请输入附加条件" />
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
            <el-form-item label="排序号" prop="orderIndex">
              <el-input-number v-model="form.orderIndex" style="width: 225px" placeholder="" controls-position="right" :min="0" :controls="false" :precision="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 手动清理对话框 -->
    <el-dialog :title="mcTitle" :visible.sync="mcOpen" width="500px" append-to-body>
      <el-form ref="mcForm" :model="mcForm" label-width="80px">
        <el-form-item label="配置" prop="days">
          清理
          <el-input-number v-model="mcForm.days" controls-position="right" :min="0" :controls="true" :precision="0"/>
          天前的数据
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitManualCLeanForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,getCounts,manualClean,truncate,getDatabaseClean,createDatabaseClean,updateDatabaseClean,deleteDatabaseClean} from "@/api/system/databaseClean";

export default {
  name: "DatabaseClean",
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
      databaseCleanList:[],
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
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        tableName: [
          { required: true, message: "表名不能为空", trigger: "blur" }
        ],
        dateField: [
          { required: true, message: "时间字段不能为空", trigger: "blur" }
        ],
        days: [
          { required: true, message: "保留天数不能为空", trigger: "blur" }
        ],
        orderIndex: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        cleanType: [
          { required: true, message: "删除类型不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //总记录数
    handleCounts(row){
      getCounts(row.id).then(
        response => {
          this.msgAlert('提示','表['+row.tableName+']当前数据库中总记录数:'+response+'条');
        }
      );
    },
    //手动清理
    handleManualClean(row){
      this.mcTitle='清理库表['+row.tableName+']';
      this.mcOpen=true;
      this.mcForm.id=row.id;
      this.mcForm.days= row.days;
    },
    submitManualCLeanForm(){
      manualClean(this.mcForm);
      this.msgSuccess("清理成功");
      this.mcOpen=false;
    },
    //清空库表
    handleTruncateTable(row){
      this.$confirm('是否确认清空表["' + row.tableName + '"]的所有数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return truncate(row.id);
        }).then(() => {
          this.msgSuccess("清空成功");
        }).catch(function() {});
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.databaseCleanList = response.rows;
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
        orderIndex: 0,
        status: "ENABLE",
        days: 7,
        cleanType:'DATE_COMPARE',
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids.join(",")
      getDatabaseClean(id).then(response => {
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
            updateDatabaseClean(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            createDatabaseClean(this.form).then(response => {
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
          return deleteDatabaseClean(ids);
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
          return exportDatabaseClean(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
