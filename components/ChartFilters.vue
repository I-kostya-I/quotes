<template>
  <div>
    <client-only placeholder="Сборка компонентов...">
      <el-select  placeholder="Период" class="chart-minutes-period-list" @change="changePeriod" size="mini"  v-model="customePeriod">
        <el-option
          v-for="element in 60"
          :key="element"
          :label="element + 'м'"
          :value="element">
        </el-option>
      </el-select>

      <chart :settings="settingsChart" :key="chartUniqueKey" /> 
    </client-only>
  </div>
</template>

<script>
import chart from "~/components/Chart.vue";

export default {
  props: ["settings"],
  data() {
    return {
      queryData: {},
      chartUniqueKey: "KT355EMD2JY4",
      customePeriod : null,
      settingsChart: {
        type: "chart",
        alias: "FB",
        period: 1,
        random: 5
      }
    };
  },
  methods : {
    changePeriod(){
      this.settingsChart.period = this.customePeriod
      this.chartUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
    }
  },
  updated(){
    this.customePeriod = Number(this.queryData.period)
  },
  async mounted() {
    this.settings
      ? (this.queryData = this.settings)
      : (this.queryData = this.$route.query); 

    
    this.settingsChart = this.queryData;
  },
  components: {
    chart
  }
};
</script>

<style> 

.chart-minutes-period-list{
  margin-left: 28px;
  padding: 10px 0;
  width: 10%;
  min-width: 70px;
}
</style>
