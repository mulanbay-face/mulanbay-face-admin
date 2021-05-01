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
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:backup:query']">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

      </el-form-item>
    </el-form>

    <!--列表数据-->
    <el-table v-loading="loading" :data="backupList" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" fixed="left" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ formatRowId(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名"  min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span v-if="row.days<=1">
           <el-tag>new</el-tag>
          </span>
          <span v-if="row.directory==true" style="color:green ;">
           <i class="el-icon-star-off" />
           {{ row.fileName }}
          </span>
          <span v-else style="color:black ;">
            {{ row.fileName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.directory==true" style="color:purple ;">
            <i class="el-icon-folder" />
           </span>
           <span v-else style="color:black ;">
             <i class="el-icon-files" />
           </span>
        </template>
      </el-table-column>
      <el-table-column label="大小" align="center" >
        <template slot-scope="{row}">
          <span>{{ formatSize(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" align="center"  min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件夹" align="center" width="80">
        <template slot-scope="{row}">
           <span v-if="row.directory==true" style="color:green ;">
            <i class="el-icon-success" />
           </span>
           <span v-else style="color:red ;">
             <i class="el-icon-error" />
           </span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastModifyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-hasPermi="['system:backup:download']"
          >下载</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:backup:delete']"
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

  </div>
</template>

<script>
import {fetchList,deleteFile} from "@/api/system/backup";
import {dateDiff} from "@/utils/datetime";

export default {
  name: "Backup",
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
      backupList:[],
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    /** 文件大小 */
    formatRowId(row) {
      let ss = row.lastModifyTime;
      let days = dateDiff(row.lastModifyTime,new Date());
      row.days = days;
      return row.index+1;
    },
    /** 文件大小 */
    formatSize(row) {
      let bytes = row.size;
      let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    /** 下载 */
    handleDownload(row){
      //todo 设置header的jwt信息
      const baseURL = process.env.VUE_APP_BASE_API;
      window.location.href = baseURL+"/backup/download?fileName=" + encodeURI(row.fileName);
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.backupList = response.rows;
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const fileName = row.fileName;
      this.$confirm('是否确认删除文件"' + fileName + '"?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteFile(fileName);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  }
};
</script>
