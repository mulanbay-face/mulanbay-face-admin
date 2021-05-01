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
      <el-form-item>
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate" v-hasPermi="['auth:systemFunction:create']">新增</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="handleRefreshSystemConfig" v-hasPermi="['auth:systemFunction:refreshSystemConfig']">刷新缓存</el-button>

      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table
      v-loading="loading"
      :data="systemFunctionList"
      row-key="id"
      ref="functionTable"
      lazy
      :load="loadChildren"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" min-width="200px" fixed="left" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span v-if="'M' ==row.functionDataType">
           <svg-icon icon-class="tree" />
          </span>
          <span v-else-if="'C' ==row.functionDataType">
           <svg-icon icon-class="international" />
          </span>
          <span v-else-if="'F' ==row.functionDataType">
           <svg-icon icon-class="icon" />
          </span>
          <span v-else>
           <svg-icon icon-class="tree-table" />
          </span>
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" width="80">
        <template slot-scope="{row}">
          <span v-if="null !=row.imageName">
           <svg-icon :icon-class="row.imageName" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="安全" width="80">
        <template slot-scope="{row}">
          <span v-if="true ==row.loginAuth">
           <svg-icon icon-class="lock"/>
          </span>
          <span v-if="true ==row.permissionAuth">
           <svg-icon icon-class="password"/>
          </span>
          <span v-if="true ==row.secAuth">
           <svg-icon icon-class="2"/>
          </span>
          <span v-if="true ==row.alwaysShow">
           <svg-icon icon-class="show"/>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orderIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路由地址" align=""min-width="200px"  :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件路径" min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路由" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.router" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="菜单可见" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.visible" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="请求地址" min-width="180px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.urlAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.supportMethods }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" disabled active-value="ENABLE" inactive-value="DISABLE" @change="handleStatusChange(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="210" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['auth:systemFunction:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleCreate(scope.row)"
            v-hasPermi="['auth:systemFunction:create']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['auth:systemFunction:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改功能点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body customClass="customDialogCss">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上层菜单" prop="parentId">
             <treeselect v-model="form.parentId" style="width: 515px" :options="parentSystemFunctionOptions" :disable-branch-nodes="false" :show-count="true" placeholder="请选择上级分类" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="功能名称" prop="name">
             <el-input v-model="form.name" style="width: 515px" placeholder="请输入功能名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="请求URL" prop="urlAddress">
             <el-input v-model="form.urlAddress" style="width: 515px" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="请求方式" prop="supportMethods">
             <el-select
               v-model="form.supportMethods"
               placeholder="请求方式"
               clearable
               collapse-tags
               size="small"
             >
               <el-option
                 v-for="dict in supportMethodsOptions"
                 :key="dict.id"
                 :label="dict.text"
                 :value="dict.id"
               />
             </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联类名" prop="beanName">
             <el-select
               v-model="form.beanName"
               placeholder="关联类名"
               clearable
               collapse-tags
               size="small"
             >
               <el-option
                 v-for="dict in beanNameOptions"
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
            <el-form-item label="菜单类型" prop="functionDataType">
              <el-radio-group v-model="form.functionDataType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
                <el-radio label="D">条件</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="form.functionDataType == 'M'||form.functionDataType == 'C'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.imageName" style="width: 515px" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.imageName"
                    slot="prefix"
                    :icon-class="form.imageName"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="form.functionDataType == 'M'||form.functionDataType == 'C'" label="路由地址" prop="path">
              <el-input v-model="form.path" style="width: 515px" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-if="form.functionDataType == 'M'||form.functionDataType == 'C'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" style="width: 515px" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="form.functionDataType == 'F'||form.functionDataType == 'C'" label="权限标识">
              <el-input v-model="form.perms" style="width: 515px" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item v-if="form.functionDataType == 'M'||form.functionDataType == 'C'" label="是否路由">
              <el-switch v-model="form.router"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="form.functionDataType == 'M'||form.functionDataType == 'C'" label="菜单可见">
              <el-switch v-model="form.visible"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="form.functionDataType == 'M'||form.functionDataType == 'C'" label="是否外链">
              <el-switch v-model="form.frame"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主键列名" prop="idField">
             <el-input v-model="form.idField" style="width: 200px" placeholder="" />
             <span class="link-type" @click="msgAlert('提示','操作日志通过该字段获取操作对象的主键值，日志分析使用')"><i class="el-icon-question" /></span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主键类型" prop="idFieldType">
             <el-select
               v-model="form.idFieldType"
               placeholder="主键类型"
               clearable
               collapse-tags
               size="small"
             >
               <el-option
                 v-for="dict in idFieldTypeOptions"
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
            <el-form-item label="排序编号" prop="orderIndex">
              <el-input-number v-model="form.orderIndex" controls-position="right" :min="0" :controls="true" :precision="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功能类型" prop="functionType">
             <el-select
               v-model="form.functionType"
               placeholder="功能类型"
               clearable
               collapse-tags
               size="small"
             >
               <el-option
                 v-for="dict in functionTypeOptions"
                 :key="dict.id"
                 :label="dict.text"
                 :value="dict.id"
               />
             </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="登陆认证" prop="loginAuth">
              <el-switch v-model="form.loginAuth"></el-switch>
              <svg-icon icon-class="lock"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二次认证" prop="secAuth">
              <el-switch v-model="form.secAuth"></el-switch>
              <span class="link-type" @click="msgAlert('提示','有些敏感的功能点需要在session过期后重新登录')"><i class="el-icon-question" /></span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="权限认证" prop="permissionAuth">
              <el-switch v-model="form.permissionAuth"></el-switch>
              <svg-icon icon-class="password"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="始终显示" v-if="true == form.permissionAuth" prop="alwaysShow">
              <el-switch v-model="form.alwaysShow"></el-switch>
              <span class="link-type" @click="msgAlert('提示','如果是目录类型，有可能下面的子节点有些不需要权限认证，这里设置为true，那么菜单能正常显示')"><i class="el-icon-question" /></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="错误代码" prop="errorCode">
              <el-input-number v-model="form.errorCode" controls-position="right" :min="0" :controls="true" :precision="0"/>
              <span class="link-type" @click="msgAlert('提示','如果设置非0值，则该功能类型操作将通过错误代码表判断是否需要消息通知')"><i class="el-icon-question" /></span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="积分奖励" prop="rewardPoint">
              <el-input-number v-model="form.rewardPoint" controls-position="right" :min="0" :controls="true" :precision="0"/>
              <span class="link-type" @click="msgAlert('提示','如果设置非0值，则每操作一次该功能都会有相应的积分积累')"><i class="el-icon-question" /></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="功能状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in commonStatusOptions"
                  :key="dict.id"
                  :label="dict.id"
                >{{dict.text}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="树形统计" prop="treeStat">
              <el-switch v-model="form.treeStat"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否缓存" prop="cache" v-if="form.functionDataType == 'C'">
              <el-switch v-model="form.cache"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="更多设置">
              <el-switch v-model="moreSetting"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="URL类型" v-if="true == moreSetting">
              <el-radio-group v-model="form.urlType">
                <el-radio label="NORMAL">普通</el-radio>
                <el-radio label="REST_FULL">RestFull</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="记录返回数据" v-if="true == moreSetting" prop="recordReturnData">
              <el-switch v-model="form.recordReturnData"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="记录日志" v-if="true == moreSetting" prop="doLog">
              <el-switch v-model="form.doLog"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户触发" v-if="true == moreSetting" prop="triggerStat">
              <el-switch v-model="form.triggerStat"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据区分用户" v-if="true == moreSetting" prop="diffUser">
              <el-switch v-model="form.diffUser"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="IP认证" v-if="true == moreSetting" prop="ipAuth">
              <el-switch v-model="form.ipAuth"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="请求限制" v-if="true == moreSetting" prop="requestLimit">
              <el-switch v-model="form.requestLimit"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item v-if="form.requestLimit == true&&true == moreSetting" label="请求频率">
              每
              <el-input-number v-model="form.requestLimitPeriod" style="width: 100px;" controls-position="right" :min="0" :controls="true" :precision="0"/>
              秒
              <el-input-number v-model="form.dayLimit" style="width: 100px;"  controls-position="right" :min="0" :controls="true" :precision="0"/>
              次
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
             <el-input v-model="form.remark" style="width: 515px" placeholder="请输入功能名称" />
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
  import {fetchList,refreshSystemConfig,getSystemFunction,getSystemFunctionMenuTree,getDomainClassNamesTree,createSystemFunction,updateSystemFunction,deleteSystemFunction} from "@/api/auth/systemFunction";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";

export default {
  name: "SystemFunction",
  components: { Treeselect, IconSelect },
  data() {
    return {
      moreSetting:false,
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
      // 查询列表数据
      systemFunctionList:[],
      // 上层分类数据
      parentSystemFunctionOptions: [],
      supportMethodsOptions:[],
      beanNameOptions:[],
      idFieldTypeOptions:[],
      functionTypeOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      commonStatusOptions:this.commonStatusOptions,
      // 查询参数
      queryParams: {
        page: 0,
        pageSize: 10,
        name: undefined,
        pid:0
      },
      //旧的父id
      oldPid:undefined,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "上级分类不能为空", trigger: "blur" }
        ],
        orderIndex: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        statable: [
          { required: true, message: "加入统计不能为空", trigger: "blur" }
        ],
        urlAddress: [
          { required: true, message: "请求地址不能为空", trigger: "blur" }
        ],
        supportMethods: [
          { required: true, message: "请求方式不能为空", trigger: "blur" }
        ],
        beanName: [
          { required: true, message: "关联类名不能为空", trigger: "blur" }
        ],
        functionDataType: [
          { required: true, message: "菜单类型不能为空", trigger: "blur" }
        ],
        functionType: [
          { required: true, message: "功能类型不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    //请求方式
    this.getDictItemTree('URL_SUPPORT_METHODS',false).then(response => {
      this.supportMethodsOptions = response;
    });
    //主键列类型
    this.getEnumTree('IdFieldType','FIELD',false).then(response => {
      this.idFieldTypeOptions = response;
    });
    //功能类型
    this.getEnumTree('FunctionType','FIELD',false).then(response => {
      this.functionTypeOptions = response;
    });
    this.getDomainClassNamesTreeselect();
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.imageName = name;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      if(this.queryParams.name!=null){
        //如果采用关键字查询则不取第一级
        this.queryParams.pid=undefined;
      }
      this.systemFunctionList =[];
      fetchList(this.queryParams).then(
        response => {
          this.systemFunctionList = response;
          this.loading = false;
        }
      );
    },
    //加载子节点
    loadChildren(tree, treeNode, resolve){
      //this.loading = true;
      const para = {
        pid:tree.id
      }
      fetchList(para).then(
        response => {
          resolve(response);
          //this.loading = false;
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
          return changeSystemFunctionStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "ENABLE" ? "DISABLE" : "ENABLE";
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
        id:undefined,
        name:undefined,
        urlType: 'NORMAL',
        functionType: 'CREATE',
        functionDataType: 'F',
        loginAuth: true,
        permissionAuth: false,
        ipAuth: false,
        alwaysShow: false,
        requestLimit: false,
        requestLimitPeriod :5,
        doLog: true,
        triggerStat: false,
        diffUser:true,
        idField:'id',
        idFieldType:'LONG',
        status:'ENABLE',
        orderIndex :0,
        rewardPoint:0,
        groupId:1,
        dayLimit:0,
        treeStat:true,
        recordReturnData:false,
        errorCode:0,
        secAuth:false,
        visible:false,
        router:false,
        frame:false,
        cache:true,
        imageName:'icon'
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.systemFunctionList=[];
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.systemFunctionList=[];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleCreate(row) {
      this.getParentSystemFunctionTreeselect();
      this.reset();
      this.open = true;
      this.title = "添加";
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getParentSystemFunctionTreeselect();
      this.reset();
      const id = row.id || this.ids.join(",")
      getSystemFunction(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改";
        //设置oldPid
        this.oldPid = this.form.parentId;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSystemFunction(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.refreshRow(this.form.parentId);
            });
          } else {
            createSystemFunction(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.refreshRow(this.form.parentId);
            });
          }
        }
      });
    },
    /** 刷新节点 */
    refreshRow(pid){
      if(pid==0){
        //第一级菜单，刷新整个列表
        this.getList();
        return;
      }
      if(pid!==this.oldPid){
        //先刷新原来的节点,否则会导致重复key，因为该节点在新老父节点里都存在
        this.refreshRowData(this.oldPid);
      }
      this.refreshRowData(pid);
    },
    /** 刷新节点 */
    refreshRowData(pid){
      const para = {
        pid:pid
      }
      fetchList(para).then(
        response => {
          this.$set(this.$refs.functionTable.store.states.lazyTreeNodeMap, pid, response);
        }
      );
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteSystemFunction(row.id);
        }).then(() => {
          this.msgSuccess("删除成功");
          this.refreshRow(row.parentId);
        }).catch(function() {});
    },
    /** 查询上级分类下拉树结构 */
    getParentSystemFunctionTreeselect() {
      getSystemFunctionMenuTree().then(response => {
        this.parentSystemFunctionOptions = response;
      });
    },
    /** 查询管理类名下拉树结构 */
    getDomainClassNamesTreeselect() {
      getDomainClassNamesTree().then(response => {
        this.beanNameOptions = response;
      });
    },
    /** 刷新系统缓存 */
    handleRefreshSystemConfig(){
      refreshSystemConfig().then(response => {
        this.msgSuccess("刷新成功");
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有商品类型数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSystemFunction(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
