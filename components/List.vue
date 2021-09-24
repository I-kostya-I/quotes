<template>
  <div class="wraper-list">
    <client-only placeholder="Сборка компонентов..."> 

      <el-table
        :data="dataLoad"
        style="width: 100%">

        <el-table-column
          prop="name"
          label="Название"
        >
        </el-table-column>

        <el-table-column
          prop="price"
          label="Текущая"
        >
        </el-table-column>

        <el-table-column
          prop="change"
          label="Изм.%"
          width="120"
         >
          <template slot-scope="scope">
            <span :class="[{ 'positive-number' : scope.row.change_p > 0, 'negative-number' :  scope.row.change_p < 0}]">{{ scope.row.change_p }}%</span>
          </template>
        </el-table-column>

        <el-table-column
          label="" 
         >
          <template slot-scope="scope">
            <el-progress :show-text="false"  :color="getProgressColor(scope.row)" :stroke-width="15" :percentage="getPercent(scope.row)"></el-progress>
          </template>
        </el-table-column>

      </el-table>

    </client-only>
  </div>
</template>

<script>
export default {
  props: ["settings"],
  data() {
    return {
      dataLoad: [],
      timer : null,
      queryData : {},
    };
  },

  beforeUpdate: function(){
    clearInterval(this.timer);
  },
  updated: function(){
    this.startTimer()
  }, 
  methods: {
    getPercent(element){
      if(Math.abs(element.change_p) < 10){
       return Math.abs(element.change_p) * 6
      } else if (Math.abs(element.change_p) > 10 && Math.abs(element.change_p) < 40){
        return Math.abs(element.change_p) * 2
      } else if(Math.abs(element.change_p) > 40 && Math.abs(element.change_p) < 100) {
        return Math.abs(element.change_p)
      } else {
        return 0
      }
    },

    getProgressColor(element){
      if(element.change > 0){
        return '#1cba41'
      } else {
        return '#F56C6C'
      } 
    },

    startTimer(){
      var ctx = this
      
      this.timer = setInterval(async function () {
        let quotesUpdate = await ctx.$store.dispatch("graphics/getQuotesData", ctx.queryData);
        ctx.dataLoad = quotesUpdate.data 

        ctx.dataLoad.forEach((element,index) => {
          let randomValue = ctx.getRandomInt(-ctx.queryData.random, ctx.queryData.random)

          ctx.dataLoad[index].price = ctx.dataLoad[index].price + randomValue

          ctx.dataLoad[index].change = parseFloat(ctx.dataLoad[index].change) 
          ctx.dataLoad[index].change_p = parseFloat(ctx.dataLoad[index].change_p) 
        });

      }, 60000 * ctx.queryData.period)
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

    let quotes = await this.$store.dispatch("graphics/getQuotesData", this.queryData);

    this.dataLoad = quotes.data 

    this.dataLoad.forEach((element,index) => {
      let randomValue = this.getRandomInt(-this.queryData.random, this.queryData.random)

      this.dataLoad[index].price = this.dataLoad[index].price + randomValue

      this.dataLoad[index].change = parseFloat(this.dataLoad[index].change) 
      this.dataLoad[index].change_p = parseFloat(this.dataLoad[index].change_p) 
    }); 

  }
};
</script>

<style>
.wraper-list {
  margin: 0 30px;
}

.positive-number{
  color: #1cba41;
}

.negative-number{
  color: #F56C6C;
}
</style>
