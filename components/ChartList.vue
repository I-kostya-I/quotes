<template>
  <div class="wraper-chart-list">
    <client-only placeholder="Сборка компонентов..."> 

      <chart :settings="settingsChart" :key="chartUniqueKey"/> 

      <el-row class="chart-list" v-for="quote in dataLoad" :key="quote.id"  @click.native="opemNewChart(quote.alias)" :gutter="20">
        <el-col class="chart-list-item" :offset="1" :span="10">{{quote.name}}</el-col>
        <el-col class="chart-list-item" :offset="1" :span="10">{{quote.price}}</el-col> 
      </el-row>

    </client-only>
  </div>
</template>

<script>
import chart from "~/components/Chart.vue";

export default {
  props: ["settings"],
  data() {
    return {
      dataLoad: [],
      chartUniqueKey : 'KTO5DZEMD2JY1',
      settingsChart: {
          type: "chart",
          alias: "FB", 
          period: 1,
          random: 5
        }
    };
  }, 

  methods: {
    opemNewChart(alias){
      this.settingsChart.alias = alias
      this.chartUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
    }, 

    // addPoint(x, y) {
    //   this.$refs.chart.chart.yAxis[0].plotLinesAndBands[0].options.value = y
    //   this.$refs.chart.chart.series[0].addPoint(
    //     [x, y],
    //     true,
    //     this.$refs.chart.chart.series[0].data.length > 50
    //   );
    // },

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

  },
  async mounted() {
    let queryData;

    this.settings
      ? (queryData = this.settings)
      : (queryData = this.$route.query);

    queryData.aliases = queryData.aliases.split(",");

    let quotes = await this.$store.dispatch("graphics/getQuotesData", queryData);

    this.dataLoad = quotes.data 

    this.dataLoad.forEach((element,index) => {
      this.dataLoad[index].price = this.dataLoad[index].price + this.getRandomInt(-queryData.random, queryData.random)
    }); 

    var ctx = this
    setInterval(async function () {
      let quotesUpdate = await ctx.$store.dispatch("graphics/getQuotesData", queryData);

      ctx.dataLoad = quotesUpdate.data  

      // ctx.addPoint(data.point.date * 1000 + Math.floor(Math.random() * 3000), data.point.price + ctx.getRandomInt(-queryData.random, queryData.random) )
    }, 60000 * queryData.period)
  },
  components: {
    chart
  }
};
</script>

<style>
.chart-list{
  border-bottom: 1px solid #e0dfdf;
  padding: 3px;
}

.chart-list:hover{
  cursor: pointer;
  background: #f1f0ff;
}

.wraper-chart-list{
  margin: 0 30px;
}
</style>
