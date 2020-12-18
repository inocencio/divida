<template>
  <div id="app">
    <AppNav/>
    <router-view/>
  </div>
</template>

<script>
import AppNav from "@/components/AppNav";

export default {
  name: 'App',
  components: {
    AppNav
  },
  data: () => ({}),
  watch: {
    $route(to, from) {
      if (from.fullPath === '/login' && to.fullPath === '/') {
        //we need this to reload the whole page to propagate cookie user session around
        location.reload()
      }
    }
  }
}
</script>

<style src="./assets/styles/tailwind.css"></style>
