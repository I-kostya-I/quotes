<template>
  <div>
    <client-only placeholder="Сборка компонентов...">
      <highcharts :constructor-type="'chart'" :updateArgs="[true, true, true]" :options="options" ></highcharts>
    </client-only>
  </div>
</template>

<script> 

export default {
  data() {
    return { 
      dataLoad :  [],
      options: { 
        chart: {
          type: "area",
          shadow: true,
          zoomType: "x",
          // width : 300,
          // height : 250
          events: {
            load: function () {
              
              var series = this.series[0]
              var plotValue = this.yAxis[0].options.plotLines[0]   
               
              setInterval(function () {
                var x = new Date().getTime(), y = Math.floor(Math.random() * 3000); 
                
                plotValue.value = y;
                
                series.addPoint([x, y], true, series.data.length > 4);
              }, 2000) 
            },
          },
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
              value: null,
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
          data : []
        }],
      },
    };
  },
  methods: {
    updateSeries() {
      this.options.series[0].data = this.dataLoad;
      this.options.yAxis.plotLines[0].value = this.dataLoad[this.dataLoad.length - 1][1] 
    }
  }, 
  async mounted(){ 
    
    let quotes = await this.$store.dispatch('graphics/getQuotesData', this.$route.query)
    this.dataLoad = quotes.data.map(el => [ el.date *1000, el.price + Math.floor(Math.random() * 20)]) 
    this.updateSeries()
    // this.options.series[0].data = quotes
    // this.options.yAxis.plotLines[0].value = quotes[quotes.length - 1][1] 
  }
};
</script>

<style> 
</style>
