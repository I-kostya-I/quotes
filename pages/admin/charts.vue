<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeTab">

          <el-tab-pane label="Обычный график" name="chart">
            <el-row :gutter="20">
              <el-col :span="15">
                <chart v-if="settingsChart.alias" :settings="settingsChart" :key="chartUniqueKey"/>
                <el-skeleton v-else :rows="11" animated />

                <el-input 
                  class="result-chart-link"
                  type="textarea"
                  :rows="6"
                  placeholder="Ссылка для вставки графика"
                  v-model="chartResult">
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

          <el-tab-pane label="График с фильтрами" name="chart-filters">
            <el-row :gutter="20">
              <el-col :span="15">
                <chartFilters v-if="settingsChartFilters.alias" :settings="settingsChartFilters" :key="chartFiltersUniqueKey"/>
                <el-skeleton v-else :rows="11" animated />

                <el-input 
                  class="result-chart-link"
                  type="textarea"
                  :rows="6"
                  placeholder="Ссылка для вставки графика"
                  v-model="chartFiltersResult">
                </el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <p class="settings-title"><span>Настройки</span></p>
                 
                <el-form label-position="top" ref="chartfilters" :model="settingsChartFilters">

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
                    <el-select placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsChartFilters.alias">
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
                    <el-select placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsChartFilters.period">
                      <el-option
                        v-for="element in 60"
                        :key="element"
                        :label="element"
                        :value="element">
                      </el-option>
                    </el-select>
                  </el-form-item> 

                  <el-form-item label="+ Рандомное значение (диапазон)" >
                    <el-input-number :step="0.1" class="form-iteam-full-width" v-model="settingsChartFilters.random"></el-input-number>
                  </el-form-item>

                  <el-form-item>
                    <el-button class="update-and-gen-url-btn" type="primary" @click="updateGraphic('chartfilters')">Обновить график и сгенерировать ссылку</el-button> 
                  </el-form-item> 
                  
                </el-form>
              </el-col>
            </el-row> 
          </el-tab-pane>
          

          <el-tab-pane label="График с таблицей" name="chart-list">
            <el-row :gutter="20">
              <el-col :span="15">
                
                <chartList  v-if="settingsChartList.aliases.length > 0"  :settings="settingsChartList" :key="chartListUniqueKey"/>
                <el-skeleton v-else :rows="11" animated />

                <el-input 
                  class="result-chart-link"
                  type="textarea"
                  :rows="6"
                  placeholder="Ссылка для вставки графика"
                  v-model="chartListResult">
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

          <el-tab-pane label="Таблица" name="list">
            <el-row :gutter="20">
              <el-col :span="15">
                
                <list  v-if="settingsList.aliases.length > 0"  :settings="settingsList" :key="listUniqueKey"/>
                <el-skeleton v-else :rows="11" animated />

                <el-input 
                  class="result-chart-link"
                  type="textarea"
                  :rows="6"
                  placeholder="Ссылка для вставки графика"
                  v-model="listResult">
                </el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <p class="settings-title"><span>Настройки</span></p>

                <el-form label-position="top" ref="list" :model="settingsList">

                  <el-form-item label="Тип" >
                    <el-input disabled v-model="settingsList.type"></el-input>
                  </el-form-item>
                  
                  <el-form-item 
                    label="Алиасы"
                    prop="aliases"
                    :rules="[ 
                      { required: true, message: 'Поле обязательное для заполнения', trigger: ['blur', 'change'] }
                    ]"
                  >
                    <el-select multiple  placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsList.aliases">
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
                    <el-select placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsList.period">
                      <el-option
                        v-for="element in 60"
                        :key="element"
                        :label="element"
                        :value="element">
                      </el-option>
                    </el-select>
                  </el-form-item> 

                  <el-form-item label="+ Рандомное значение (диапазон)" >
                    <el-input-number :step="0.1" class="form-iteam-full-width" v-model="settingsList.random"></el-input-number>
                  </el-form-item>

                  <el-form-item>
                    <el-button class="update-and-gen-url-btn" type="primary" @click="updateGraphic('list')">Обновить график и сгенерировать ссылку</el-button> 
                  </el-form-item> 
                  
                </el-form>

              </el-col>
            </el-row> 
          </el-tab-pane>

          <el-tab-pane label="Бегущая строка" name="marquee">
            <el-row :gutter="20">
              <el-col :span="15">
                
                <marquee  v-if="settingsMarquee.aliases.length > 0"  :settings="settingsMarquee" :key="marqueeUniqueKey"/>
                <el-skeleton v-else :rows="11" animated />

                <el-input 
                  class="result-chart-link"
                  type="textarea"
                  :rows="6"
                  placeholder="Ссылка для вставки строки"
                  v-model="marqueeResult">
                </el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <p class="settings-title"><span>Настройки</span></p>

                <el-form label-position="top" ref="marquee" :model="settingsMarquee">

                  <el-form-item label="Тип" >
                    <el-input disabled v-model="settingsMarquee.type"></el-input>
                  </el-form-item>
                  
                  
                  <el-form-item 
                    label="Алиасы"
                    prop="aliases"
                    :rules="[ 
                      { required: true, message: 'Поле обязательное для заполнения', trigger: ['blur', 'change'] }
                    ]"
                  >
                    <el-select multiple  placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsMarquee.aliases">
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
                    <el-select placeholder="Выберите значение из списка" class="form-iteam-full-width" v-model="settingsMarquee.period">
                      <el-option
                        v-for="element in 60"
                        :key="element"
                        :label="element"
                        :value="element">
                      </el-option>
                    </el-select>
                  </el-form-item> 

                  <el-form-item label="+ Рандомное значение (диапазон)" >
                    <el-input-number :step="0.1" class="form-iteam-full-width" v-model="settingsMarquee.random"></el-input-number>
                  </el-form-item>

                  <el-form-item>
                    <el-button class="update-and-gen-url-btn" type="primary" @click="updateGraphic('marquee')">Обновить график и сгенерировать ссылку</el-button> 
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
import chartFilters from "~/components/ChartFilters.vue";
import chartList from "~/components/ChartList.vue";
import list from "~/components/List.vue";
import marquee from "~/components/Marquee.vue";

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
      chartResult : '',
      settingsChart: { 
        type : 'chart',
        alias : null,
        random : 5,
        period : 1
      },

      chartFiltersUniqueKey : '2TO4IZEX52JG6',
      chartFiltersResult : '',
      settingsChartFilters: { 
        type : 'chart',
        alias : null,
        random : 5,
        period : 1
      },

      chartListUniqueKey :  'KTO56ZEM42J21',
      chartListResult : '',
      settingsChartList:{
        type : 'chart-list', 
        aliases : [],
        random : 5,
        period : 1
      },

      listUniqueKey :  'LT456ZEM32J21',
      listResult : '',
      settingsList:{
        type : 'list', 
        aliases : [],
        random : 5,
        period : 1
      },

      marqueeUniqueKey :  'L545652E332J21',
      marqueeResult : '',
      settingsMarquee:{
        type : 'marquee', 
        aliases : [],
        random : 5,
        period : 1
      }


    };
  }, 
  methods: {
    updateGraphic(refForm){
      
      this.$refs[refForm].validate((valid) => {
        if (valid) { 
       
          let baseResultUrl = this.$store.getters['config/baseUrl'] + '/graphics/'

          switch (refForm) {
            case 'chart':
              this.chartUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
              this.chartResult = baseResultUrl + `chart?type=${this.settingsChart.type}&alias=${this.settingsChart.alias}&period=${this.settingsChart.period}&random=${this.settingsChart.random}`
              break; 
            case 'chartfilters':
              this.chartFiltersUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
              this.chartFiltersResult = baseResultUrl + `chart-filters?type=${this.settingsChartFilters.type}&alias=${this.settingsChartFilters.alias}&period=${this.settingsChartFilters.period}&random=${this.settingsChartFilters.random}`
              break;               
            case 'chartlist':
              this.chartListUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
              this.chartListResult = baseResultUrl + `chart-list?type=${this.settingsChartList.type}&aliases=${this.settingsChartList.aliases.toString()}&period=${this.settingsChartList.period}&random=${this.settingsChartList.random}`
              break; 
            case 'list':
              this.listUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
              this.listResult = baseResultUrl + `list?type=${this.settingsList.type}&aliases=${this.settingsList.aliases.toString()}&period=${this.settingsList.period}&random=${this.settingsList.random}`
              break; 
            case 'marquee':
              this.marqueeUniqueKey = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
              this.marqueeResult = baseResultUrl + `marquee?type=${this.settingsMarquee.type}&aliases=${this.settingsMarquee.aliases.toString()}&period=${this.settingsMarquee.period}&random=${this.settingsMarquee.random}`
              break;  
          }
        }
      }) 

    }
  }, 
    
  components: {
    chart,
    chartFilters,
    chartList,
    list,
    marquee
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