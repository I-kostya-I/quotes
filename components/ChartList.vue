<template>
  <div class="wraper-chart-list">
    <client-only placeholder="Сборка компонентов..."> 

      <chart :settings="settingsChart" :key="chartUniqueKey"/> 

      <el-row class="chart-list" v-for="quote in dataLoad" :key="quote.id"  @click.native="opemNewChart(quote.alias)" :gutter="20">
        <el-col class="chart-list-item" :offset="1" :span="5">{{quote.name}}</el-col>
        <el-col class="chart-list-item" :offset="1" :span="5">{{quote.price}}</el-col> 
        <el-col :class="[{ 'positive-number' : quote.change > 0, 'negative-number' :  quote.change < 0} , 'chart-list-item']" :offset="1" :span="5">{{quote.change}}</el-col> 
        <el-col :class="[{ 'positive-number' : quote.change > 0, 'negative-number' :  quote.change < 0} , 'chart-list-item']" :offset="1" :span="5">{{quote.change_p}}%</el-col> 
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
      timer : null,
      queryData : {},
      settingsChart: {
          type: "chart",
          alias: "FB", 
          manualMod : true,
          period: 1,
          random: 5
        }
    };
  },  
 
  beforeUpdate: function(){ 
    clearInterval(this.timer);
  },
  updated: function(){
    this.startTimer()
  }, 
  methods: {
    opemNewChart(alias){ 
      this.settingsChart.alias = alias
      this.chartUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
    }, 

    startTimer(){
      var ctx = this 
      
      this.timer = setInterval(async function () { 
        let quotesUpdate = await ctx.$store.dispatch("graphics/getQuotesData", ctx.queryData);

        ctx.dataLoad = quotesUpdate.data   
        
        const point = ctx.dataLoad.find(element => element.alias === ctx.settingsChart.alias)
        ctx.addPoint(point.date * 1000 + Math.floor(Math.random() * 3000), point.price + ctx.getRandomInt(-ctx.queryData.random, ctx.queryData.random)) 
      }, 60000 * ctx.queryData.period)
    },

    addPoint(x, y) {  
      this.$emit('addChartPoint', x, y);
    },

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

  },
  async mounted() { 
    
    this.settings
      ? (this.queryData = this.settings)
      : (this.queryData = this.$route.query);
     
    if(typeof this.queryData.aliases == 'string'){
      this.queryData.aliases = this.queryData.aliases.split(",");
    } 
    
    this.settingsChart.period =  this.queryData.period
    this.settingsChart.random =  this.queryData.random

    let quotes = await this.$store.dispatch("graphics/getQuotesData", this.queryData);

    this.dataLoad = quotes.data 

    this.dataLoad.forEach((element,index) => {
      let randomValue = this.getRandomInt(-this.queryData.random, this.queryData.random)

      this.dataLoad[index].price = this.dataLoad[index].price + randomValue

      this.dataLoad[index].change = parseFloat(this.dataLoad[index].change) 
      this.dataLoad[index].change_p = parseFloat(this.dataLoad[index].change_p) 
    }); 
    
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

.positive-number{
  color: green;
}

.negative-number{
  color: red;
}
</style>
