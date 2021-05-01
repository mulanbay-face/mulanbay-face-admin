<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import * as echarts from 'echarts';
  import {createDoublePieChart} from "@/utils/echarts";
  import resize from '../dashboard/mixins/resize.js'

export default {
  mixins: [resize],
  props: {
    className: {
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
      height:'350px'
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
        this.chart = echarts.init(this.$el);
      }
      createDoublePieChart(this.chartData,this.chart);
    }
  }
}
</script>
