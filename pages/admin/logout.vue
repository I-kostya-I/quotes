<template>
</template>

<script>
export default { 
  layout: 'empty',
  beforeCreate() {
    this.$store.dispatch('auth/logout')
    this.$router.push('/login')
  }
}
</script>
