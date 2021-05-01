<template>
  <div class="dashboard-editor-container">

    <panel-group />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <carousel-stat />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <uic1-stat :chartConfig="uic1Config"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <uic2-stat :chartConfig="uic2Config"/>
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import UicChart from './dashboard/BarChart'
import CarouselStat from './dashboard/carouselStat'

export default {
  name: 'Index',
  components: {
    PanelGroup,
    'line-chart':LineChart,
    'carousel-stat':CarouselStat,
    'uic1-stat':UicChart,
    'uic2-stat':UicChart
  },
  data() {
    return {
      uic1Config:{
        index:1
      },
      uic2Config:{
        index:2
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 8px 32px 8px 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 8px 8px 0;
    margin-bottom: 16px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
