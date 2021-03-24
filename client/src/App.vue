<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <h4>Bootstrap test <i class="bi-alarm"></i></h4>
  <div class="d-grid gap-2">
    <button type="button" class="btn btn-primary btn-sm px-4 me-sm-3">Primary</button>
    <button type="button" class="btn btn-outline-secondary btn-sm px-4">Default</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app { 
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; 
  margin-top: 60px; 
}
</style>
