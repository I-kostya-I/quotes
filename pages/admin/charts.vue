<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeTab">

          <el-tab-pane label="Обычный график" name="chart">
            <el-row :gutter="20">
              <el-col :span="15">
                <chart v-if="settingsChart.alias" :settings="settingsChart" :key="chartUniqueKey"/>

                <el-input 
                  class="result-chart-link"
                  type="textarea"
                  :rows="6"
                  placeholder="Ссылка для вставки графика"
                  v-model="result">
                </el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <p class="settings-title"><span>Настройки</span></p>
                 
                <el-form label-position="top" ref="chart" :model="settingsChart">

                  <el-form-item label="Тип" >
                    <el-input disabled v-model="settingsChart.type"></el-input>
                  </el-form-item>
 
                  <el-form-item 
                    label="Алиас"
                    prop="alias"
                    :rules="[ 
                      { required: true, message: 'Поле обязательное для заполнения', trigger: ['blur', 'change'] }
                    ]"
                  >
                    <el-select placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsChart.alias">
                      <el-option
                        v-for="element in this.quotesList"
                        :key="element.alias"
                        :label="element.name"
                        :value="element.alias">
                      </el-option>
                    </el-select>
                     
                  </el-form-item>

                  <el-form-item 
                    label="Период"
                    prop="period"
                    :rules="[ 
                      { required: true, message: 'Поле обязательное для заполнения', trigger: ['blur', 'change'] }
                    ]"
                  > 
                    <el-select placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsChart.period">
                      <el-option
                        v-for="element in 60"
                        :key="element"
                        :label="element"
                        :value="element">
                      </el-option>
                    </el-select>
                  </el-form-item> 

                  <el-form-item label="+ Рандомное значение (диапазон)" >
                    <el-input-number :step="0.1" class="form-iteam-full-width" v-model="settingsChart.random"></el-input-number>
                  </el-form-item>

                  <el-form-item>
                    <el-button class="update-and-gen-url-btn" type="primary" @click="updateGraphic('chart')">Обновить график и сгенерировать ссылку</el-button> 
                  </el-form-item> 
                  
                </el-form>
              </el-col>
            </el-row> 
          </el-tab-pane>

          <el-tab-pane label="График с таблицей" name="chart-list">
            <el-row :gutter="20">
              <el-col :span="15">
                
                <chartList  v-if="settingsChartList.aliases.length > 0"  :settings="settingsChartList" :key="chartListUniqueKey"/>

                <el-input 
                  class="result-chart-link"
                  type="textarea"
                  :rows="6"
                  placeholder="Ссылка для вставки графика"
                  v-model="result">
                </el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <p class="settings-title"><span>Настройки</span></p>

                <el-form label-position="top" ref="chartlist" :model="settingsChartList">

                  <el-form-item label="Тип" >
                    <el-input disabled v-model="settingsChartList.type"></el-input>
                  </el-form-item>
                  
                  <el-form-item 
                    label="Алиасы"
                    prop="aliases"
                    :rules="[ 
                      { required: true, message: 'Поле обязательное для заполнения', trigger: ['blur', 'change'] }
                    ]"
                  >
                    <el-select multiple  placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsChartList.aliases">
                      <el-option
                        v-for="element in this.quotesList"
                        :key="element.alias"
                        :label="element.name"
                        :value="element.alias">
                      </el-option>
                    </el-select>
                     
                  </el-form-item>

                  <el-form-item 
                    label="Период"
                    prop="period"
                    :rules="[ 
                      { required: true, message: 'Поле обязательное для заполнения', trigger: ['blur', 'change'] }
                    ]"
                  > 
                    <el-select placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsChartList.period">
                      <el-option
                        v-for="element in 60"
                        :key="element"
                        :label="element"
                        :value="element">
                      </el-option>
                    </el-select>
                  </el-form-item> 

                  <el-form-item label="+ Рандомное значение (диапазон)" >
                    <el-input-number :step="0.1" class="form-iteam-full-width" v-model="settingsChartList.random"></el-input-number>
                  </el-form-item>

                  <el-form-item>
                    <el-button class="update-and-gen-url-btn" type="primary" @click="updateGraphic('chartlist')">Обновить график и сгенерировать ссылку</el-button> 
                  </el-form-item> 
                  
                </el-form>
              </el-col>
            </el-row> 
          </el-tab-pane>

        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import chart from "~/components/Chart.vue";
import chartList from "~/components/ChartList.vue";

export default {
  layout: "admin", 
  name: "Charts",
  middleware: ["adminAuth"],
  async asyncData({ store }) {
    const quotesList = await store.dispatch("config/getQuotes")
    return {quotesList}
  },
  data() {
    return {
      result : '',
      activeTab: "chart",
      chartUniqueKey : 'KTO5DZEMD2JY6',
      settingsChart: { 
        type : 'chart',
        alias : null,
        period : 1,
        random : 0
      },

      chartListUniqueKey :  'KTO56ZEM42J21',
      settingsChartList:{
        type : 'chart-list', 
        aliases : [],
        random : 1,
        period : 1
      }
    };
  }, 
  methods: {
    updateGraphic(refForm){
      
      this.$refs[refForm].validate((valid) => {
        if (valid) {
          
          this.chartUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
       
          this.result = this.$store.getters['config/baseUrl'] + '/graphics/'

          switch (refForm) {
            case 'chart':
              this.chartUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
              this.result += `chart?type=${this.settingsChart.type}&alias=${this.settingsChart.alias}&period=${this.settingsChart.period}&random=${this.settingsChart.random}`
              break; 
            case 'chartlist':
              this.chartListUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
              this.result += `chart-list?type=${this.settingsChartList.type}&aliases=${this.settingsChartList.aliases.toString()}&period=${this.settingsChartList.period}&random=${this.settingsChartList.random}`
              break; 
          }
        }
      }) 

    }
  }, 
    
  components: {
    chart,
    chartList
  },
};
</script>
 
<style>

.update-and-gen-url-btn{
  width: 90%;
  margin-left: 5%;
  margin-top: 25px; 
  white-space: initial;
  font-size: 1.1em;
}

.settings-title{
  font-size: 1.4em;
  text-align: center;
  color: #777777;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed silver;
}

.result-chart-link{
  margin-top: 50px;

  -webkit-box-shadow: 1px 1px 10px -3px rgba(34, 60, 80, 0.18); 
  -moz-box-shadow: 1px 1px 10px -3px rgba(34, 60, 80, 0.18); 
  box-shadow: 1px 1px 10px -3px rgba(34, 60, 80, 0.18);
}
</style>