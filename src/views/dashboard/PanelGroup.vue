<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleDispatch('UserRewardPointRecord')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="points" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" align="right">
          <div class="card-panel-text">
            今日积分
          </div>
          +
          <count-to :start-val="0" :end-val="100" :duration="2600" class="card-panel-num" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            累计积分
          </div>
          <count-to :start-val="0" :end-val="20000" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleDispatch('UserMessage')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            消息
          </div>
          <count-to :start-val="0" :end-val="newMsgCount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleDispatch('Budget')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" align="right">
          <div class="card-panel-text">
            已经花费
          </div>
          <span style="font-weight:bold;font-size: 18px;">￥</span>
          <count-to :start-val="0" :end-val="3000" :duration="2600" class="card-panel-num" />
          <br>35%
        </div>
        <div class="card-panel-description" align="right">
          <div class="card-panel-text">
            本月预算
          </div>
          <span style="font-weight:bold;font-size: 18px;">￥4000</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleDispatch('UserScore')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="score" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" align="right">
          <div class="card-panel-text">
            用户评分
          </div>
          <count-to :start-val="0" :end-val="80" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

import CountTo from 'vue-count-to'

export default {
  name: "PanelGroup",
  components: {
    CountTo
  },
  data() {
    return {
      newMsgCount:0
    };
  },
  created() {
  },
  methods: {
    //跳转
    handleDispatch(pathName){
      //路由定向
      this.$router.push({name:pathName,query: {}})
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
