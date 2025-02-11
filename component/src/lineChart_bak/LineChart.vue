<template>
  <div class="com-line-chart">
    <Echarts :option="option" @dblclick="dblclickHandle"></Echarts>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, PropType, watch, computed} from 'vue'
import {IChartDefinition, Util, ChartData, IFieldInfo} from '@datahu/core'
import Echarts from '../components/Echarts.vue'
import {ChartUtil, ITooltip} from '../base'
export default defineComponent({
  name: 'LineChart',
  props: {
    chart: Object as PropType<IChartDefinition>,
    pkg: Object,
    data: Object as PropType<ChartData>
  },
  components: {Echarts},
  setup(props) {
    let option = computed(() => {
      let option = ChartUtil.getChartOption(props.chart!)
      let chartData: ChartData = props.data!
      if (
        !chartData.isReady() ||
        !option ||
        !option.series ||
        option.series.length == 0
      ) {
        return null
      }
      let dataset = chartData.getDataset()
      let series: Array<any> = []
      let tooltips: Array<ITooltip> = []

      let index = 0
      for (let dataIndex of dataset.map['series']) {
        let seriesOpt = option.series[option.series.length - 1]
        if (option.series.length > index) {
          seriesOpt = option.series[index]
        }
        series.push(seriesOpt)
        index++
      }
      for (let tooltipField of dataset.map['tooltip']) {
        if (
          tooltipField != 0 &&
          dataset.map['series'].indexOf(tooltipField) < 0
        ) {
          tooltips.push({
            name: dataset.data[0][tooltipField],
            field: tooltipField
          })
        }
      }

      let opt = {
        title: {
          text: ''
        },
        dataset: {
          source: dataset.data
        },
        tooltip: {
          show: option.tooltip.show,
          trigger: 'axis',
          appendToBody: true,
          padding: 0,
          borderWidth: 0,
          axisPointer: {
            type: 'cross'
          },
          confine: true,
          formatter(params: any) {
            return ChartUtil.getTooltipFormatter(
              params,
              tooltips,
              option.tooltip,
              dataset.data,
              chartData
            )
          }
        },
        grid: option.grid,
        legend: option.legend,
        polar: option.polar,
        radiusAxis: option.radiusAxis,
        angleAxis: option.angleAxis,
        xAxis: option.xAxis,
        yAxis: option.yAxis,
        series: series,
        visualMap: option.visualMap
      }
      console.log('opt', opt)
      return opt
    })

    let dblclickHandle = (params: any) => {
      if (params.componentType === 'series') {
        if (params.seriesIndex != undefined) {
          ;(props.data as ChartData).drillDown(params.name)
        }
      }
    }
    return {option, dblclickHandle}
  }
})
</script>

<style>
.com-line-chart {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
