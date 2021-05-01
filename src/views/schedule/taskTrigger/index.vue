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
      <el-form-item label="调度类型" prop="triggerType">
        <el-select
          v-model="queryParams.triggerType"
          placeholder="调度类型"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in triggerTypeOptions"
            :key="dict.id"
            :label="dict.text"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调度状态" prop="status">
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
        <el-button type="query" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['schedule:taskTrigger:query']">搜索</el-button>
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
          v-hasPermi="['schedule:taskTrigger:create']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['schedule:taskTrigger:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['schedule:taskTrigger:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['schedule:taskTrigger:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-tools"
          size="mini"
          @click="handleManualNew"
          v-hasPermi="['schedule:taskTrigger:manualNew']"
        >手动执行</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-tools"
          size="mini"
          @click="handleRefreshSchedule"
          v-hasPermi="['schedule:taskTrigger:refreshSchedule']"
        >刷新调度</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-info"
          size="mini"
          @click="handleScheduleInfo"
          v-hasPermi="['schedule:taskTrigger:getScheduleInfo']"
        >调度信息</el-button>
      </el-col>
    </el-row>

    <!--列表数据-->
    <el-table v-loading="loading" :data="taskTriggerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id"  fixed="left" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" fixed="left"  min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
         <span v-if="row.executing==true" class="link-type"  @click="handleUpdate(row)" style="color:red ;">
          {{ formatName(row)+'[执行中]' }}
         </span>
         <span v-else class="link-type"  @click="handleUpdate(row)">
           {{ formatName(row) }}
         </span>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" width="80">
        <template slot-scope="{row}">
          <span class="link-type" @click="showScheduleDetail(row)">
            <i class="el-icon-info" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="部署点" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.deployId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度周期" align="center"  width="160">
        <template slot-scope="{row}">
          <span v-if="row.triggerIntervel==1">
            {{ '每'+row.triggerTypeName+"一次" }}
           </span>
           <span v-else>
             每
             <el-tag type="danger">{{ row.triggerInterval+row.triggerTypeName }}</el-tag>
             一次
           </span>
        </template>
      </el-table-column>
      <el-table-column label="首次执行时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.firstExecuteTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下一次执行时间" align="center"  width="180">
        <template slot-scope="{row}">
          <span>{{ row.nextExecuteTime==null ? row.firstExecuteTime : row.nextExecuteTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="距离下一次执行还有" align="center"  min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
           <span v-if="row.tillNextExecuteTime<=60" style="color:red ;">
            {{ row.tns }}
           </span>
           <span v-else-if="row.tillNextExecuteTime<=3600" style="color:#9acd32 ;">
            {{ row.tns }}
           </span>
           <span v-else-if="row.tillNextExecuteTime<=3600*24" style="color:purple ;">
            {{ row.tns }}
           </span>
           <span v-else>
             {{ row.tns }}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="最后一次执行结果" align="center"  min-width="160px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
           <span v-if="row.lastExecuteResult==null || row.lastExecuteResult==''">
            --
           </span>
           <span v-else-if="row.lastExecuteResult=='SUCCESS'">
            <span class="link-type" @click="showLastTaskLog(row)" style="color:green ;">
              <i class="el-icon-success" />
            </span>
           </span>
           <span v-else-if="row.lastExecuteResult=='FAIL'">
            <span class="link-type" @click="showLastTaskLog(row)"  style="color:red ;">
              <i class="el-icon-error" />
            </span>
           </span>
           <span v-else>
             <span class="link-type" @click="showLastTaskLog(row)">
               {{ row.lastExecuteResultName }}
             </span>
           </span>
        </template>
      </el-table-column>
      <el-table-column label="最后一次执行时间" align="center"  min-width="200px">
        <template slot-scope="{row}">
           <span v-if="row.lastExecuteTime==null">
            --
           </span>
           <span v-else>
             {{ row.lastExecuteTime }}
             <span class="link-type" @click="HandleExeCostTimeStat(row)">
               <i class="el-icon-s-data" />
             </span>
           </span>
        </template>
      </el-table-column>
      <el-table-column label="调度状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.triggerStatus" active-value="ENABLE" inactive-value="DISABLE" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="日期偏移量" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.offsetDays }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总执行次数" align="center"  width="100">
        <template slot-scope="{row}">
          <span class="link-type"  @click="resetTotalCount(row)">
            {{ row.totalCount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="总失败次数" align="center"  width="100">
        <template slot-scope="{row}">
          <span class="link-type"  @click="resetFailCount(row)">
            {{ row.failCount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="组名" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center"  min-width="180px">
        <template slot-scope="{row}">
           <span v-if="row.userId==0">
            用户调度
           </span>
           <span v-else>
             系统调度
           </span>
        </template>
      </el-table-column>
      <el-table-column label="支持分布式" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.distriable" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="重做类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.redoTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="允许重做次数" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.allowedRedoTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超时时间(秒)" align="center" width="100" >
        <template slot-scope="{row}">
          <span>{{ row.timeout }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需要检查唯一" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.checkUnique" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="唯一性类型" align="center" width="100" >
        <template slot-scope="{row}">
          <span>{{ row.uniqueTypeName==null ? '--' : row.uniqueTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录日志" align="center" >
        <template slot-scope="{row}">
          <el-switch v-model="row.loggable" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="需要提醒" align="center" >
        <template slot-scope="{row}">
          <el-switch v-model="row.notifiable" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center"  min-width="200px" :show-overflow-tooltip="true" >
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['schedule:taskTrigger:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['schedule:taskTrigger:delete']"
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
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body  customClass="customDialogCss">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="调度名称" prop="name">
             <el-input v-model="form.name" placeholder="请输入调度名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="调度类名" prop="taskClass">
             <el-input v-model="form.taskClass" placeholder="请输入调度类" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="调度分组" prop="groupName">
              <el-select
                v-model="form.groupName"
                filterable
                allow-create
                default-first-option
                size="medium"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in groupNameOptions"
                  :key="dict.id"
                  :label="dict.text"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超时时间" prop="timeout">
              <el-input-number v-model="form.timeout" placeholder="" controls-position="right" :min="0" :controls="false" :precision="0" />
              秒
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署点" prop="deployId">
              <el-select
                v-model="form.deployId"
                filterable
                allow-create
                default-first-option
                size="medium"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in deployIdOptions"
                  :key="dict.id"
                  :label="dict.text"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支持分布式" prop="distriable">
              <el-switch v-model="form.distriable"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重做类型" prop="redoType">
              <el-select
                v-model="form.redoType"
                placeholder="状态"
                clearable
                allow-create
                collapse-tags
                size="medium"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in redoTypeOptions"
                  :key="dict.id"
                  :label="dict.text"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大重做次数" prop="allowedRedoTimes">
              <el-input-number v-model="form.allowedRedoTimes" placeholder="" controls-position="right" :min="0" :controls="false" :precision="0" />
              次
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="调度周期" prop="redoType">
              每
              <el-input-number v-model="form.triggerInterval" style="width: 60px;" placeholder="" controls-position="right" :min="1" :controls="false" :precision="0" />
              <el-select
                v-model="form.triggerType"
                placeholder="周期"
                clearable
                allow-create
                collapse-tags
                size="medium"
                style="width: 120px"
              >
                <el-option
                  v-for="dict in triggerTypeOptions"
                  :key="dict.id"
                  :label="dict.text"
                  :value="dict.id"
                />
              </el-select>
              /次
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CRON表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="调度参数" prop="triggerParas">
             <el-input v-model="form.triggerParas" style="width: 495px;" disabled placeholder="" />
             <el-button type="query" icon="el-icon-search" size="mini" @click="handleParasEdit" v-hasPermi="['schedule:taskTrigger:query']">编辑</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="执行时间段" prop="execTimePeriods">
             <el-input v-model="form.execTimePeriods" style="width: 495px;" disabled placeholder="" />
             <el-button type="query" icon="el-icon-search" size="mini" @click="handleExecTimeEdit" v-hasPermi="['schedule:taskTrigger:query']">编辑</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="调度状态" prop="triggerStatus">
              <el-select
                v-model="form.triggerStatus"
                placeholder="状态"
                clearable
                allow-create
                collapse-tags
                size="medium"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in triggerStatusOptions"
                  :key="dict.id"
                  :label="dict.text"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间偏移量" prop="offsetDays">
              <el-input-number v-model="form.offsetDays" placeholder="" controls-position="right" :min="0" :controls="false" :precision="0" />
              天
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首次执行时间" prop="firstExecuteTime">
              <el-date-picker type="datetime" v-model="form.firstExecuteTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                        :style="{width: '200px'}" placeholder="请选择时间" clearable >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下一次执行时间" prop="nextExecuteTime">
              <el-date-picker type="datetime" v-model="form.nextExecuteTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                        :style="{width: '200px'}" placeholder="请选择时间" clearable >
              </el-date-picker>
              <span class="link-type" @click="msgAlert('提示','默认等于首次执行时间')"><i class="el-icon-question" /></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查唯一性" prop="checkUnique">
              <el-switch v-model="form.checkUnique"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="唯一性类型" prop="uniqueType">
              <el-select
                v-model="form.uniqueType"
                placeholder="唯一性类型"
                clearable
                allow-create
                collapse-tags
                size="medium"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in uniqueTypeOptions"
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
            <el-form-item label="记录日志" prop="loggable">
              <el-switch v-model="form.loggable"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消息提醒" prop="notifiable">
              <el-switch v-model="form.notifiable"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="调度子任务编号" prop="subTaskCodes">
             <el-input v-model="form.subTaskCodes" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="调度子任务名称" prop="subTaskNames">
             <el-input v-model="form.subTaskNames" placeholder="" />
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

    <!-- 调度详情 -->
    <el-dialog :title="sdTitle" width="800px" :visible.sync="sdOpen" append-to-body  customClass="customDialogCss">
      <schedule-detail :triggerData="triggerData" />
    </el-dialog>

    <!-- 最后一次执行详情 -->
    <el-dialog :title="leiTitle" width="600px" :visible.sync="leiOpen" append-to-body>
      <last-exe-info :triggerData="triggerData" @closeMe="closeLastExeInfo"/>
    </el-dialog>

    <!-- 调度详情 -->
    <el-dialog :title="siTitle" width="600px" :visible.sync="siOpen" append-to-body>
      <schedule-info />
    </el-dialog>

    <!-- 参数编辑对话框 -->
    <el-dialog :title="parasEditTitle" :visible.sync="parasEditOpen" width="600px" append-to-body>
      <form-create v-model="peApi" :option="peOption"  :rule="peRule"></form-create>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitParasEdit">确 定</el-button>
        <el-button @click="cancelParasEdit">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 执行时间段编辑对话框 -->
    <el-dialog :title="teEditTitle" :visible.sync="teEditOpen" width="600px" append-to-body>
      <el-form ref="teForm" :model="teForm" label-width="120px">
        <el-form-item label="执行的时间段" prop="times">
          <el-input v-model="teForm.times" placeholder="请输入时间段" />
          <span style="color: red;">格式:08:00-13:00,14:00-16:00(空为总是要执行)</span>
        </el-form-item>
        <el-form-item label="执行的星期" prop="weeks">
          <el-checkbox-group v-model="teForm.weeks" @change="handleWeeksChange">
              <el-checkbox label="1">星期一</el-checkbox>
              <el-checkbox label="2">星期二</el-checkbox>
              <el-checkbox label="3">星期三</el-checkbox>
              <el-checkbox label="4">星期四</el-checkbox>
              <el-checkbox label="5">星期五</el-checkbox>
              <el-checkbox label="6">星期六</el-checkbox>
              <el-checkbox label="7">星期日</el-checkbox>
           </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitExecTimeEdit">确 定</el-button>
        <el-button @click="cancelExecTimeEdit">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 手动执行对话框 -->
    <el-dialog :title="manualNewTitle" :visible.sync="manualNewOpen" width="600px" append-to-body>
      <el-form ref="manualNewForm" :model="manualNewForm" :rules="manualNewRules"  label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择调度器" prop="taskTriggerId">
              <treeselect
               v-model="manualNewForm.taskTriggerId"
               style="width: 400px"
               :options="taskTriggerOptions"
               :disable-branch-nodes="true"
               :show-count="true"
               :searchable="true"
               placeholder="请选择调度器"
               />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务日期" prop="bussDate">
              <el-date-picker type="date" v-model="manualNewForm.bussDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        :style="{width: '200px'}" placeholder="请选择日期" clearable >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="同步执行" prop="sync">
              <el-switch v-model="manualNewForm.sync"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitManualNew">确 定</el-button>
        <el-button @click="cancelManualNew">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 刷新调度对话框 -->
    <el-dialog :title="refreshScheduleTitle" :visible.sync="refreshScheduleOpen" width="600px" append-to-body>
      <el-form ref="refreshScheduleForm" :model="refreshScheduleForm" :rules="refreshScheduleRules"  label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择调度器" prop="taskTriggerId">
              <treeselect
               v-model="refreshScheduleForm.taskTriggerId"
               style="width: 400px"
               :options="taskTriggerOptions"
               :disable-branch-nodes="true"
               :show-count="true"
               :searchable="true"
               placeholder="请选择调度器"
               />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="强制刷新" prop="force">
              <el-switch v-model="refreshScheduleForm.force"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRefreshSchedule">确 定</el-button>
        <el-button @click="cancelRefreshSchedule">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchList,getTaskTrigger,getTaskTriggerCategoryTree,createTaskTrigger,updateTaskTrigger,deleteTaskTrigger,
  resetTaskTriggerTotalCount,resetTaskTriggerFailCount,getParaDefine,
  getTaskTriggerTree,manualNew,refreshSchedule} from "@/api/schedule/taskTrigger";
  import {getTaskServerTree} from "@/api/schedule/taskServer";
  import {tillNowSeconds,tillNowString} from "@/utils/datetime";
  import {encodeJsonString} from "@/utils/mulanbay";
  import formCreate, { maker } from '@form-create/element-ui'
  import {generateTriggerParasRules,setTriggerParasBindValues,getBindValues,setBindValues} from "@/utils/formCreateUtils";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import ScheduleDetail from './scheduleDetail'
  import LastExeInfo from './lastExecuteInfo'
  import ScheduleInfo from './scheduleInfo'

export default {
  name: "TaskTrigger",
  components: {
    Treeselect,
    formCreate:formCreate.$form(),
    'schedule-detail': ScheduleDetail,
    'last-exe-info': LastExeInfo,
    'schedule-info': ScheduleInfo
  },
  data() {
    return {
      //手动执行
      manualNewTitle:'',
      manualNewOpen:false,
      manualNewForm:{},
      taskTriggerOptions:[],
      manualNewRules:{
        taskTriggerId: [
          { required: true, message: "调度器不能为空", trigger: "blur" }
        ],
        bussDate: [
          { required: true, message: "业务日期不能为空", trigger: "blur" }
        ],
        sync: [
          { required: true, message: "同步执行不能为空", trigger: "blur" }
        ]
      },
      //刷新调度
      refreshScheduleTitle:'',
      refreshScheduleOpen:false,
      refreshScheduleForm:{
        force:false,
      },
      refreshScheduleRules:{
        taskTriggerId: [
          { required: true, message: "调度器不能为空", trigger: "blur" }
        ],
        force: [
          { required: true, message: "强制刷新不能为空", trigger: "blur" }
        ]
      },
      //调度详情
      siTitle:'',
      siOpen:false,
      //调度详情
      sdTitle:'',
      sdOpen:false,
      triggerData:{
        id:undefined
      },
      //最后一次执行详情
      leiTitle:'',
      leiOpen:false,
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
      taskTriggerList:[],
      triggerTypeOptions:[],
      groupNameOptions:[],
      deployIdOptions:[],
      redoTypeOptions:[],
      uniqueTypeOptions:[],
      // 参数编辑formCreate属性start
      parasEditTitle:'',
      parasEditOpen:false,
      peRule:[],
      peOption:{
        submitBtn:false,
        form:{
          labelPosition: 'left',
          labelWidth:'300px',
          size:undefined,
          inline: true,
          hideRequiredAsterisk:false
        },
        row:{
          type:'',
          align:'',
          gutter:5
        }
      },
      //表单对象
      peApi:{},
      // formCreate属性end
      //可执行时间段
      teEditTitle:'',
      teEditOpen:false,
      teForm:{},
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      triggerStatusOptions:[],
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
        taskClass: [
          { required: true, message: "调度类名不能为空", trigger: "blur" }
        ],
        groupName: [
          { required: true, message: "分组名不能为空", trigger: "blur" }
        ],
        timeout: [
          { required: true, message: "超时时间不能为空", trigger: "blur" }
        ],
        deployId: [
          { required: true, message: "部署点不能为空", trigger: "blur" }
        ],
        distriable: [
          { required: true, message: "支持分布式不能为空", trigger: "blur" }
        ],
        redoType: [
          { required: true, message: "重做类型不能为空", trigger: "blur" }
        ],
        triggerInterval: [
          { required: true, message: "调度周期不能为空", trigger: "blur" }
        ],
        triggerType: [
          { required: true, message: "调度周期类型不能为空", trigger: "blur" }
        ],
        offsetDays: [
          { required: true, message: "时间偏移量不能为空", trigger: "blur" }
        ],
        triggerStatus: [
          { required: true, message: "调度状态不能为空", trigger: "blur" }
        ],
        firstExecuteTime: [
          { required: true, message: "首次执行时间不能为空", trigger: "blur" }
        ],
        triggerInterval: [
          { required: true, message: "调度周期不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEnumTree('cn.mulanbay.schedule.enums.TriggerType','FIELD',false).then(response => {
      this.triggerTypeOptions = response;
    });
  },
  methods: {
    formatName(row){
      const ss=tillNowString(row.tillNextExecuteTime);
      row.tns = ss;
      return row.name;
    },
    /** 初始化下拉框 */
    initOptions(){
      getTaskServerTree(false).then(response => {
        this.deployIdOptions = response;
      });
      getTaskTriggerCategoryTree('groupName',false).then(response => {
        this.groupNameOptions = response;
      });
      this.getEnumTree('cn.mulanbay.schedule.enums.RedoType','FIELD',false).then(response => {
        this.redoTypeOptions = response;
      });
      this.getEnumTree('cn.mulanbay.schedule.enums.TriggerStatus','FIELD',false).then(response => {
        this.triggerStatusOptions = response;
      });
      this.getEnumTree('cn.mulanbay.schedule.enums.TaskUniqueType','FIELD',false).then(response => {
        this.uniqueTypeOptions = response;
      });
    },
    /** 手动执行 */
    handleManualNew(){
      this.manualNewTitle='手动执行调度';
      this.manualNewOpen=true;
      getTaskTriggerTree(false).then(response => {
        this.taskTriggerOptions = response;
      });
    },
    submitManualNew(){
      this.$refs["manualNewForm"].validate(valid => {
        if (valid) {
          manualNew(this.manualNewForm).then(response => {
            this.msgSuccess("调度成功");
            this.manualNewOpen = false;
          });
        }
      });
    },
    cancelManualNew(){
      this.manualNewOpen=false;
    },
    /** 刷新调度 */
    handleRefreshSchedule(){
      this.refreshScheduleTitle='刷新调度(只有单机部署情况下有效)';
      this.refreshScheduleOpen=true;
      getTaskTriggerTree(false).then(response => {
        this.taskTriggerOptions = response;
      });
    },
    submitRefreshSchedule(){
      this.$refs["refreshScheduleForm"].validate(valid => {
        if (valid) {
          refreshSchedule(this.refreshScheduleForm).then(response => {
            this.msgSuccess("刷新成功");
            this.refreshScheduleOpen = false;
          });
        }
      });
    },
    cancelRefreshSchedule(){
      this.refreshScheduleOpen=false;
    },
    /** 编辑参数 */
    handleParasEdit(){
      const taskClass = this.form.taskClass;
      if(this.isObjectEmpty(taskClass)){
        this.msgError('请先设置调度类');
        return;
      }
      this.parasEditTitle='参数编辑';
      this.parasEditOpen = true;
      //先清空
      this.peRule=[];
      getParaDefine(taskClass).then(
        response => {
          const newRule = generateTriggerParasRules(response.paraDefine);
          //需要重载规则，否则编辑时无法设定值
          this.peApi.reload(newRule);
          let tp = {};
          if(this.form.triggerParas!=null){
            tp =this.form.triggerParas;
          }else{
            //使用默认
            tp = response.defaultConfig;
          }
          setTriggerParasBindValues(tp,this.peApi);
        }
      );
    },
    /** 获取编辑好的参数 */
    submitParasEdit(){
      const pp = this.peApi.formData();
      this.form.triggerParas = JSON.stringify(pp);
      this.parasEditOpen = false;
    },
    cancelParasEdit(){
      this.parasEditOpen = false;
    },
    /** 可执行的时间段 */
    handleExecTimeEdit(){
      this.teEditTitle='可执行时间段编辑';
      this.teEditOpen=true;
      this.teForm ={
        times:undefined,
        weeks:[]
      }
      const etc = this.form.execTimePeriods;
      if(this.isObjectEmpty(etc)||etc=='{}'){
        return;
      }
      let pp = JSON.parse(etc);;
      if(pp==undefined){
        return;
      }
      if(!this.isObjectEmpty(pp.times)){
        this.teForm.times = pp.times;
      }
      if(pp.weeks!=undefined){
        this.teForm.weeks = pp.weeks.split(',');
      }
    },
    /** 获取编辑好的时间段 */
    submitExecTimeEdit(){
      let pp ={times:undefined,weeks:undefined};
      pp.times = this.teForm.times;
      if(this.teForm.weeks!=null&&this.teForm.weeks.length>0){
        pp.weeks=this.teForm.weeks.join(',');
      }
      this.form.execTimePeriods = JSON.stringify(pp);
      this.teEditOpen = false;
    },
    /** 不刷新显示有问题 */
    handleWeeksChange(){
      this.$forceUpdate();
    },
    cancelExecTimeEdit(){
      this.teEditOpen=false;
    },
    /** 调度详情 */
    showScheduleDetail(row){
      this.sdOpen=true;
      this.sdTitle='['+row.name+']调度详情';
      this.triggerData = Object.assign({}, this.triggerData, {
        id: row.id,
      });
    },
    showLastTaskLog(row){
      this.leiOpen=true;
      this.leiTitle='['+row.name+']最后一次执行详情';
      this.triggerData = Object.assign({}, this.triggerData, {
        id: row.id,
      });
    },
    closeLastExeInfo(){
      this.leiOpen=false;
    },
    /** 调度器信息 */
    handleScheduleInfo(){
      this.siTitle='调度详情';
      this.siOpen=true;
    },
    /** 调度执行时间分析 */
    HandleExeCostTimeStat(row){
      //路由定向
      this.$router.push({name:'TaskLog/costTimeStat',query: {taskTriggerId:row.id}})
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(
        response => {
          this.taskTriggerList = response.rows;
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
        timeout: 60,
        distriable: true,
        redoType: 'MUNUAL_REDO',
        allowedRedoTimes: 5,
        triggerInterval: 1,
        triggerType: 'HOUR',
        offsetDays: 0,
        triggerStatus: 'ENABLE',
        checkUnique: true,
        uniqueType:'IDENTITY',
        loggable: true,
        notifiable:false
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
      this.initOptions();
      this.open = true;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.initOptions();
      const id = row.id || this.ids.join(",")
      getTaskTrigger(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //需要编码
          this.form.triggerParas = encodeJsonString(this.form.triggerParas);
          this.form.execTimePeriods = encodeJsonString(this.form.execTimePeriods);
          if (this.form.id != undefined) {
            updateTaskTrigger(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            createTaskTrigger(this.form).then(response => {
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
          return deleteTaskTrigger(ids);
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
          return exportTaskTrigger(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 重置总次数操作 */
    resetTotalCount(row) {
      this.$confirm('是否确认要重置"' + row.name + '"的的总次数?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return resetTaskTriggerTotalCount(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("重置成功");
        }).catch(function() {});
    },
    /** 重置总次数操作 */
    resetFailCount(row) {
      this.$confirm('是否确认要重置"' + row.name + '"的的总次数?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return resetTaskTriggerFailCount(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("重置成功");
        }).catch(function() {});
    }
  }
};
</script>
