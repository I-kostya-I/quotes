<template>
  <div>
    <client-only placeholder="Сборка компонентов...">
      <highcharts :constructor-type="'chart'" :updateArgs="updateArgs" ref="chart" :options="options" ></highcharts>
    </client-only>
  </div>
</template>

<script> 

export default {
  data() {
    return { 
      dataLoad :  [
        []
      ], 
      updateArgs: [true, true]
    };
  },

  computed : {
    options() {
      return { 
        chart: {
          type: "area",
          shadow: true,
          zoomType: "x"
        },
        credits: {
          enabled: false,
          text: "Google",
          href: "https://www.google.com",
        },
        title: {
          text: "Тестовый график",
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
              radius: 2,
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
      // var x = new Date().getTime(), y = Math.floor(Math.random() * 3000); 

      this.$refs.chart.chart.yAxis[0].plotLinesAndBands[0].options.value = y

      this.$refs.chart.chart.series[0].addPoint(
        [x, y], 
        true, 
        this.$refs.chart.chart.series[0].data.length > 50
      );

      
    } 
    
  }, 
  async mounted(){ 
    
    let quotes = await this.$store.dispatch('graphics/getQuotesData', this.$route.query)
    this.dataLoad = quotes.data.map(el => [ (el.date *1000) , el.price + Math.floor(Math.random() * 20)])  

    
    var ctx = this
    setInterval(async function () {  
      let data = await ctx.$store.dispatch('graphics/loadNewPoint', { type : "loadPoint", alias : ctx.$route.query.alias } ) 
       
      ctx.addPoint(data.point.date * 1000 + Math.floor(Math.random() * 3000), data.point.price + Math.floor(Math.random() * 20) )
    }, 2000) 
  }
};
</script>

<style> 
</style>
