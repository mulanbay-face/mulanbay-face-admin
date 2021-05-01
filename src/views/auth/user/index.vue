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
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['auth:user:query']">搜索</el-button>
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
          v-hasPermi="['auth:user:create']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['auth:user:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['auth:user:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['auth:user:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-s-tools"
          size="mini"
          :disabled="single"
          @click="handleOffline"
          v-hasPermi="['auth:user:offline']"
        >强制离线</el-button>
      </el-col>
    </el-row>

    <!--列表数据-->
    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="120px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" active-value="ENABLE" inactive-value="DISABLE" @change="handleStatusChange(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="角色授权" width="80" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleAuth(row)"><svg-icon icon-class="tree" /></span>
        </template>
      </el-table-column>
      <el-table-column label="监控授权" width="80" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleMonitorAuth(row)"><i class="el-icon-monitor" /></span>
        </template>
      </el-table-column>
      <el-table-column label="微信绑定" width="80" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleWxBand(row)"><svg-icon icon-class="wechat" /></span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center">
        <template slot-scope="{row}">
          <span>{{ row.points }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" min-width="120px"  :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" align="center"  width="180px">
        <template slot-scope="{row}">
          <span>{{ row.expireTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二次授权" align="center">
        <template slot-scope="{row}">
          <span>{{ row.secAuthTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登陆时间" align="center" min-width="110px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.lastLoginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登陆IP" align="center" min-width="110px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.lastLoginIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['auth:user:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['auth:user:delete']"
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
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
             <el-input v-model="form.username" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
             <el-input v-model="form.nickname" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
             <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二次认证" prop="secAuthType">
              <el-select
                v-model="form.secAuthType"
                placeholder="二次认证"
                clearable
                collapse-tags
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in secAuthTypeOptions"
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
            <el-form-item label="手机" prop="phone">
             <el-input v-model="form.phone" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
             <el-input v-model="form.email" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
             <el-date-picker type="date" v-model="form.birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                       :style="{width: '200px'}" placeholder="请选择日期" clearable >
             </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期日期" prop="expireTime">
              <el-date-picker type="datetime" v-model="form.expireTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                        :style="{width: '100%'}" placeholder="请选择时间" clearable >
              </el-date-picker>
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
                collapse-tags
                size="small"
                style="width: 200px"
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
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
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

    <!-- 角色授权对话框 -->
    <el-dialog :title="authTitle" :visible.sync="authOpen" width="500px" append-to-body>
      <el-form ref="authForm" :model="authForm" label-width="80px">
        <el-form-item label="角色列表">
          <el-tree
            :data="userRoleOptions"
            show-checkbox
            ref="userRoleTree"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAuthForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 监控授权对话框 -->
    <el-dialog :title="monitorTitle" :visible.sync="monitorOpen" width="500px" append-to-body>
      <el-form ref="monitorForm" :model="monitorForm" label-width="80px">
        <el-form-item label="监控列表">
          <el-tree
            :data="userMonitorOptions"
            show-checkbox
            ref="userMonitorTree"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMonitorForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 微信绑定对话框 -->
    <el-dialog :title="wxTitle" :visible.sync="wxOpen" width="500px"  append-to-body>
      <el-form ref="wxForm" :model="wxForm" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户编号" prop="userId">
             <el-input v-model="wxForm.userId" disabled placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="微信OpenId" prop="openId">
             <el-input v-model="wxForm.openId" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWxBandForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {fetchList,getUserRoleTree,saveSystemMonitor,getSystemMonitorTree,
        changeUserStatus,getUser,createUser,updateUser,deleteUser,
        getUserWxpayInfo,editUserWxpayInfo,offlineUser,deleteUserData,initUserData} from "@/api/auth/user";
import {saveUserRole} from "@/api/auth/role";

export default {
  name: "User",
  data() {
    return {
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
      userList:[],
      secAuthTypeOptions:[],
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
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单参数
      form: {},
      //角色授权
      authTitle:'',
      authOpen:false,
      authForm:{},
      userRoleOptions:[],
      //监控授权
      monitorTitle:'',
      monitorOpen:false,
      monitorForm:{},
      userMonitorOptions:[],
      //微信绑定
      wxTitle:'',
      wxOpen:false,
      wxForm:{
        id:undefined,
        userId:undefined,
        openId:undefined
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        secAuthType: [
          { required: true, message: "二次认证不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        birthday: [
          { required: true, message: "生日不能为空", trigger: "blur" }
        ],
        expireTime: [
          { required: true, message: "过期日期不能为空", trigger: "blur" }
        ],
        openId: [
          { required: true, message: "OpenId不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEnumTree('AuthType','FIELD',false).then(response => {
      this.secAuthTypeOptions = response;
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    //强制离线
    handleOffline(){
      const id = this.ids.join(",")
      this.$confirm('确认要强制离线编号为"' + id + '"的用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return offlineUser(id);
        }).then(() => {
          this.msgSuccess("操作成功");
        }).catch(function() {
        });
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.username + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "ENABLE" ? "DISABLE" : "ENABLE";
        });
    },
    // 角色授权按钮
    handleAuth(row){
      this.authTitle="["+row.username+"]角色授权";
      this.authOpen = true;
      this.authForm.userId = row.id;
      this.authForm.roleIds=undefined;
      if (this.$refs.userRoleTree != undefined) {
        this.$refs.userRoleTree.setCheckedKeys([]);
      }
      getUserRoleTree(row.id,true,true).then(
        response => {
          this.userRoleOptions = response.treeData;
          //设置已经勾选
          //默认选中的树的数据
          let that = this;
          setTimeout(function() {
            response.checkedKeys.forEach(value => {
              that.$refs.userRoleTree.setChecked(value, true, false);
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
      let checkedKeys = this.$refs.userRoleTree.getHalfCheckedKeys();
      // 选中的节点
      let halfCheckedKeys = this.$refs.userRoleTree.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      if(checkedKeys.length>1){
        this.msgError('目前只支持选择一个角色');
        return;
      }
      this.authForm.roleIds = checkedKeys.join(',');
      saveUserRole(this.authForm).then(
        response => {
          this.authOpen = false;
          this.msgSuccess("修改成功");
        }
      );
    },
    // 监控授权按钮
    handleMonitorAuth(row){
      this.monitorTitle="["+row.username+"]监控授权";
      this.monitorOpen = true;
      this.monitorForm.userId = row.id;
      this.monitorForm.bussTypes=undefined;
      if (this.$refs.userMonitorTree != undefined) {
        this.$refs.userMonitorTree.setCheckedKeys([]);
      }
      getSystemMonitorTree(row.id,true,true).then(
        response => {
          this.userMonitorOptions = response.treeData;
          //设置已经勾选
          //默认选中的树的数据
          let that = this;
          setTimeout(function() {
            response.checkedKeys.forEach(value => {
              that.$refs.userMonitorTree.setChecked(value, true, false);
            });
          }, 500);
          //setCheckedKeys有父子节点的级联显示勾选问题
          //this.$refs.roleFuncTree.setCheckedKeys(response.checkedKeys,true);
        }
      );
    },
    //保存权限
    submitMonitorForm(){
      // 目前半选中的节点
      let checkedKeys = this.$refs.userMonitorTree.getHalfCheckedKeys();
      // 选中的节点
      let halfCheckedKeys = this.$refs.userMonitorTree.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      this.monitorForm.bussTypes = checkedKeys.join(',');
      saveSystemMonitor(this.monitorForm).then(
        response => {
          this.monitorOpen = false;
          this.msgSuccess("修改成功");
        }
      );
    },
    // 微信绑定按钮
    handleWxBand(row){
      this.wxTitle="["+row.username+"]微信绑定";
      this.wxOpen = true;
      getUserWxpayInfo(row.id).then(
        response => {
          this.resetForm("wxForm");
          this.wxForm.userId = row.id;
          this.wxForm.openId = response.openId;
          this.wxForm.id = response.id;
          this.$forceUpdate();
        }
      );
    },
    //保存权限
    submitWxBandForm(){
      editUserWxpayInfo(this.wxForm).then(
        response => {
          this.wxOpen = false;
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
        username: undefined,
        secAuthType: 'PASSWORD',
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
      getUser(id).then(response => {
        this.form = response;
        this.form.password = undefined;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            createUser(this.form).then(response => {
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
      this.$confirm('是否确认删除编号为"' + ids + '"的用户?删除用户前请确保已经格式化该用户数据', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteUser(ids);
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
          return exportUser(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
