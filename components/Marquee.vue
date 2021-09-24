<template>
  <div class="wraper-marquee-main">
    <client-only placeholder="Сборка компонентов...">
      
      <marquee-text @mouseover.stop="marqueeConfig.paused = true" @mouseleave.stop="marqueeConfig.paused = false"
        :paused="marqueeConfig.paused"
        :duration="marqueeConfig.duration"
        :repeat="marqueeConfig.repeat"
      >
        <span v-for="quote in dataLoad" :key="quote.id">

          <span class="mr-title-name" >{{quote.name}} </span>

          <el-button class='badge-price-mr'  size="mini"  :type="quote.change > 0 ? 'success' : 'danger'" >{{quote.price}} / {{quote.change_p}}%</el-button> 
        </span>

      
      </marquee-text>
    </client-only>
  </div>
</template>

<script>
export default {
  props: ["settings"],
  data() {
    return {
      dataLoad : [],
      timer: null,
      queryData: {},
      marqueeConfig: {
        paused: false,
        duration : 10,
        repeat : 10
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
    startTimer(){
      var ctx = this
      this.timer = setInterval(async function () {
        let quotesUpdate = await ctx.$store.dispatch("graphics/getQuotesData", ctx.queryData);
        ctx.dataLoad = quotesUpdate.data

        ctx.dataLoadToText()

      }, 60000 * ctx.queryData.period)
    },

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },

    dataLoadToText(){

      this.dataLoad.forEach((element,index) => {
        let randomValue = this.getRandomInt(-this.queryData.random, this.queryData.random)

        this.dataLoad[index].price = this.dataLoad[index].price + randomValue
        this.dataLoad[index].change_p = parseFloat(this.dataLoad[index].change_p)
      });

    }
  },
  async mounted() {
    this.settings
      ? (this.queryData = this.settings)
      : (this.queryData = this.$route.query);
      
    if(typeof this.queryData.aliases == 'string'){
      this.queryData.aliases = this.queryData.aliases.split(",");
    }

    let quotes = await this.$store.dispatch("graphics/getQuotesData", this.queryData);
    
    this.dataLoad = quotes.data
    this.dataLoadToText() 
    
  }
};
</script>

<style>

.wraper-marquee-main{
  background: #5a5858;
  color: white;
  padding: 10px;
}

.badge-price-mr{
  padding: 2px !important;
} 

.mr-title-name{
  margin: 10px;
  font-size: 16px;
} 

.text-wraper-mar{
  font-size: 1.3em;
  padding: 5px;
}
</style>
