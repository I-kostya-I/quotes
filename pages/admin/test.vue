<template>
  <div class="container"> 
    <el-row>
      <el-col :span="24">

         <h1> TEST</h1>

      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  name: 'Test', 
  middleware: ['adminAuth'],
  async asyncData({store}){ 
    // await store.dispatch('organizations/get')  
  }, 
  data(){
    return {  

    }
  },
  methods: { 

  }
}
</script>
 