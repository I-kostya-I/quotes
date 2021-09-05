<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeTab">

          <el-tab-pane label="Обычный график" name="chart">
            <el-row :gutter="20">
              <el-col :span="15">
                <chart />

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
                
              </el-col>
            </el-row> 
          </el-tab-pane>

          <el-tab-pane label="График с выбором периода" name="chart-periods">
            <el-row :gutter="20">
              <el-col :span="15">
                <chart />

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

export default {
  layout: "admin",
  name: "Charts",
  middleware: ["adminAuth"],
  async asyncData({ store }) {
    // await store.dispatch('organizations/get')
  },
  data() {
    return {
      result : 'http://localhost:3000/graphics/chart?...',
      activeTab: "chart",
      settings: {

      }
    };
  },
  methods: {},
  components: {
    chart,
  },
};
</script>
 
<style>
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