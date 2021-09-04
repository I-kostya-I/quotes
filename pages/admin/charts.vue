<template>
  <div class="container"> 
    <el-row>
      <el-col :span="24">

        <chart />

      </el-col>
    </el-row>
  </div>
</template>

<script>
import chart from '~/components/Chart.vue'

export default {
  layout: 'admin',
  name: 'Charts', 
  middleware: ['adminAuth'],
  async asyncData({store}){ 
    // await store.dispatch('organizations/get')  
  }, 
  data(){
    return {  

    }
  },
  methods: { 

  },
  components: {
    chart 
  }
}
</script>
 