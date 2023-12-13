<template>
    <div class="homeBody">
      <homeAsideAside/>
      <RouterView></RouterView>
    </div>

</template>


<script>
import { RouterView } from 'vue-router';
import fileHome from './files/fileHome.vue';

import homeAsideAside from './homeAsideAside.vue';
 export default {
   name: 'MyHomeBody',
   data : function(){
     return {
     }
   },
   components : {
    fileHome,
    homeAsideAside
}
 }

</script>


<style scoped>
  .homeBody{
    position: absolute;
    top:200px;
    right: 50px;
    width: 1600px;
    height: 800px;
    background-color: aqua;
  }

</style>