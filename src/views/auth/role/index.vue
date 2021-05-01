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
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['auth:role:query']">搜索</el-button>
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
          v-hasPermi="['auth:role:create']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['auth:role:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['auth:role:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['auth:role:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-tools"
          size="mini"
          @click="handleRefreshSystemConfig"
          v-hasPermi="['auth:role:refreshSystemConfig']"
        >刷新缓存</el-button>
      </el-col>
    </el-row>

    <!--列表数据-->
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="120px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.orderIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权" width="80" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleAuth(row)"><svg-icon icon-class="tree" /></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" active-value="ENABLE" inactive-value="DISABLE" @change="handleStatusChange(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['auth:role:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['auth:role:delete']"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderIndex">
          <el-input-number v-model="form.orderIndex" controls-position="right" :min="0" :controls="true" :precision="0"/>
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in commonStatusOptions"
              :key="dict.id"
              :label="dict.id"
            >{{dict.text}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 角色授权对话框 -->
    <el-dialog :title="authTitle" :visible.sync="authOpen" width="500px" append-to-body>
      <el-form ref="authForm" :model="authForm" v-loading="authLoading" label-width="80px">
        <el-form-item label="权限列表">
          <el-tree
            :data="roleFunctionOptions"
            show-checkbox
            ref="roleFuncTree"
            node-key="id"
            :default-expanded-keys="defaultExpandedKeys"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAuthForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,refreshSystemConfig,getRoleFunctionTree,changeRoleStatus,getRole,createRole,updateRole,deleteRole,saveRoleFunction} from "@/api/auth/role";

export default {
  name: "Role",
  data() {
    return {
      // 授权遮罩层
      authLoading:false,
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
      roleList:[],
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
      //授权
      authTitle:'',
      authOpen:false,
      authForm:{},
      roleFunctionOptions:[],
      defaultExpandedKeys:[0],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        orderIndex: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeRoleStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "ENABLE" ? "DISABLE" : "ENABLE";
        });
    },
    // 刷新缓存
    handleRefreshSystemConfig(){
      refreshSystemConfig().then(
        response => {
          this.msgSuccess("刷新成功");
        }
      );
    },
    // 授权按钮
    handleAuth(row){
      this.authTitle="["+row.name+"]授权";
      this.authOpen = true;
      this.authForm.roleId = row.id;
      this.authForm.functionIds=undefined;
      if (this.$refs.roleFuncTree != undefined) {
        this.$refs.roleFuncTree.setCheckedKeys([]);
      }
      getRoleFunctionTree(row.id,true,true).then(
        response => {
          this.roleFunctionOptions = response.treeData;
          //设置已经勾选
          //默认选中的树的数据
          let that = this;
          setTimeout(function() {
            response.checkedKeys.forEach(value => {
              that.$refs.roleFuncTree.setChecked(value, true, false);
            });
          }, 500);
          //setCheckedKeys有父子节点的级联显示勾选问题
          //this.$refs.roleFuncTree.setCheckedKeys(response.checkedKeys,true);
        }
      );
    },
    //保存权限
    submitAuthForm(){
      // 目前半选中的节点
      let checkedKeys = this.$refs.roleFuncTree.getHalfCheckedKeys();
      // 被选中的节点
      let halfCheckedKeys = this.$refs.roleFuncTree.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      this.authForm.functionIds = checkedKeys.join(',');
      this.authLoading=true;
      saveRoleFunction(this.authForm).then(
        response => {
          this.authOpen = false;
          this.authLoading=false;
          this.msgSuccess("修改成功");
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
        status: "ENABLE"
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
      getRole(id).then(response => {
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
            updateRole(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            createRole(this.form).then(response => {
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
          return deleteRole(ids);
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
          return exportRole(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
