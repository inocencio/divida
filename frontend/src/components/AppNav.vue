<template>
  <div id="nav" class="text-white p-3 bg-gray-800 max-w-full top-0">
    <div class="flex items-center justify-between">
      <span class="text-left">
        <router-link to="/" class="align-middle font-medium rounded-md px-2 py-1 ml-2 transition duration-100 ease-in hover:text-green-500 hover:bg-gray-700 focus:outline-none">Home</router-link>
        <router-link to="/debt" class="align-middle font-medium rounded-md px-2 py-1 ml-2 transition duration-100 ease-in hover:text-green-500 hover:bg-gray-700 focus:outline-none">Cadastrar Nova Dívida</router-link>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppNav",
  data: () => ({}),
  created () {
    //allow us to render this component manually outside this scope.
    this.$root.$refs.AppNav = this
  },
}
</script>

<style scoped>
</style>