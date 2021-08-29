<template>
  <div>
    <nuxt />
  </div>
</template>
 

<script>
export default {
  computed : {
    error(){
      return this.$store.getters.error
    }
  },
  watch : {
    error(value){
      console.error(value.response)
      
      this.$message.error(value.response.data.message);
 
    }  
  } 
}
</script>
