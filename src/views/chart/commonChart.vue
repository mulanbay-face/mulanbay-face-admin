<template>
  <!--图表数据-->
  <div :id="id" :class="className" :style="{height:height,width:width,margin:0 }" />
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  import {chartProps,createChart,createMixLineBarChart,createPieChart,
  createBarChart,createCalanderHeatMapChart,createGaugeChart,
  createTreeMapChart,createRadarChart,createCalanderChart,createLineChart,
  createScatterChart,createShadowChart,createDoublePieChart,
  createCompareCalanderChart,createCalanderPieChart,
  createPolarBarChart,createTreeChart,createSunburstChart,createStaHorBarChart,
  createStackedAreaChart} from "@/utils/echarts";
  import {deepClone} from "@/utils/index";
  import resize from '../dashboard/mixins/resize.js'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      height:(document.body.clientHeight - 240).toString() + 'px'
    }
  },
  watch: {
    chartData(newVal,oldVal){
      this.handleReceiveData(newVal);
    }
  },
  mounted() {
    this.$nextTick(() => {
      //this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    handleReceiveData(data){
      this.chartData =data;
      if(this.chartData.height!=null){
        this.height = this.chartData.height;
      }
      //解决定义高度后，无法resize问题
      let that=this;
      setTimeout(function()  {
        that.initChart()
      }, 100);
      //this.initChart();
    },
    initChart() {
      if(this.isObjectEmpty(this.chartData)){
        return;
      }
      if(this.chart==null){
        this.chart = echarts.init(document.getElementById(this.id));
      }
      this.chart.resize();
      const chartType = this.chartData.chartType;
      /**
       * 这里需要赋值一次，否则报：
       * you may have an infinite update loop in watcher with expression
       * createCalanderChart里面应该对数组做了一些操作
       * 主要是createCalanderChart
       */
      let newChartData = deepClone(this.chartData);
      switch (chartType) {
        case 'PIE':
          createPieChart(newChartData,this.chart);
          break;
        case 'DOUBLE_PIE':
          createDoublePieChart(newChartData,this.chart);
          break;
        case 'BAR':
          createBarChart(newChartData,this.chart);
          break;
        case 'MIX_LINE_BAR':
          createMixLineBarChart(newChartData,this.chart);
          break;
        case 'TREE_MAP':
          createTreeMapChart(newChartData,this.chart,echarts);
          break;
        case 'CALANDER':
          createCalanderChart(newChartData,this.chart);
          break;
        case 'CALANDER_HEAT_MAP':
          createCalanderHeatMapChart(newChartData,this.chart,echarts);
          break;
        case 'RADAR':
          createRadarChart(newChartData,this.chart);
          break;
        case 'LINE':
          createLineChart(newChartData,this.chart);
          break;
        case 'GAUGE':
          createGaugeChart(newChartData,this.chart);
          break;
        case 'SCATTER':
          createScatterChart(newChartData,this.chart);
          break;
        case 'SHADOW':
          createShadowChart(newChartData,this.chart);
          break;
        case 'COMPARE_CALANDER':
          createCompareCalanderChart(newChartData,this.chart);
          break;
        case 'CALANDER_PIE':
          createCalanderPieChart(newChartData,this.chart,echarts);
          break;
        case 'POLAR_BAR':
          createPolarBarChart(newChartData,this.chart);
          break;
        case 'TREE':
          createTreeChart(newChartData,this.chart,echarts);
          break;
        case 'SUNBURST':
          createSunburstChart(newChartData,this.chart);
          break;
        case 'STA_HOR_BAR':
          createStaHorBarChart(newChartData,this.chart);
          break;
        case 'STACKED_AREA':
          createStackedAreaChart(newChartData,this.chart);
          break;
        default:
          this.msgError('暂不支持的图形类型:'+chartType);
      }
    }
  }
}
</script>
