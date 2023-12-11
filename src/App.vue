<template>
  <div id="app">
    <Mylogin msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Mylogin from './components/Mylogin.vue'


export default {
  name: 'App',
  components: {
    Mylogin
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #02070c;
  margin-top: 20px;
  background-color: aqua;
}
</style>
