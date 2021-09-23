<template>
  <div class="wraper-chart">
    <client-only placeholder="Сборка компонентов...">
      <highcharts :constructor-type="'chart'" :updateArgs="updateArgs" ref="chart" :options="options" ></highcharts>
    </client-only>
  </div>
</template>

<script> 

export default {
  props : ['settings'],
  data() {
    return { 
      dataLoad :  [
        []
      ], 
      timer : null,
      updateArgs: [true, true]
    };
  },

  computed : {
    options() {
      return { 
        chart: {
          type: "area",
          shadow: false,
          zoomType: "x"
        },
        credits: {
          enabled: false,
          text: "Google",
          href: "https://www.google.com",
        },
        title: {
          text: "",
          floating: true,
          align: "center",
          y: 25,
        },
        yAxis: {
          minorTickInterval: "auto",
          opposite: true,
          crosshair: {
            zIndex: 10,
            label: {
              enabled: true,
            },
          },
          title: {
            enabled: false,
          },
          plotLines: [
            {
              color: "black",
              width: 0.5,
              value: this.dataLoad[this.dataLoad.length - 1][1],
              zIndex: 5,
              label: {
                style: {
                  fontSize: 11,
                  color: "red",
                },
                align: "right",
                x: -10,
              },
            },
          ],
        },
        xAxis: {
          tickPixelInterval: 100,
          minorTickInterval: "auto",
          crosshair: {
            zIndex: 10,
            label: {
              enabled: false,
            },
          },
          type: "datetime",
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        navigation: {
          buttonOptions: {
            enabled: false,
          },
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1.3,
              },
              stops: [
                [0, "#7cb5ec"],
                [1, "#e0eefb"],
              ],
            },
            marker: {
              radius: 0.5,
            },
            lineWidth: 1.5,
            states: {
              hover: {
                lineWidth: 1.5,
              },
            },
            threshold: null,
          },
        },

        series: [{
          data : this.dataLoad
        }],
      }
    } 
  },
  
  methods: { 

    addPoint(x, y) { 

      this.$refs.chart.chart.yAxis[0].plotLinesAndBands[0].options.value = y

      this.$refs.chart.chart.series[0].addPoint(
        [x, y], 
        true, 
        this.$refs.chart.chart.series[0].data.length > 50
      ); 
      
    },

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;  
    } 
    
  }, 
  destroyed: function(){
    clearInterval(this.timer);
    this.$parent.$off('addChartPoint')
  }, 
  async mounted(){ 
    let queryData

    this.settings ? queryData = this.settings : queryData = this.$route.query 
     
    let quotes = await this.$store.dispatch('graphics/getQuotesData', queryData)
     
    this.dataLoad = quotes.data.map(el => [ (el.date *1000) , el.price + this.getRandomInt(-queryData.random, queryData.random)])  
    this.options.title.text = quotes.q_config.name
    
    var ctx = this
    
    if(queryData.manualMod){
      this.$parent.$on('addChartPoint', (x, y) => {
        ctx.addPoint(x, y)
      });
      
    } else {
      this.timer = setInterval(async function () {  
        let data = await ctx.$store.dispatch('graphics/loadNewPoint', { type : "loadPoint", alias : queryData.alias } ) 
        
        ctx.addPoint(data.point.date * 1000 + Math.floor(Math.random() * 3000), data.point.price + ctx.getRandomInt(-queryData.random, queryData.random) )
      }, 60000 * queryData.period) 
    }
    
    
  }
};
</script>

<style> 

.wraper-chart{
  margin: 0 30px;
}
</style>
