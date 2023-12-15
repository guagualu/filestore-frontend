<template>
    <div>
    <homeTop></homeTop>
    <!-- <homeAside> </homeAside>
    <homeBody></homeBody> -->
    <RouterView name="toAside"></RouterView>
    <RouterView name="toBody"></RouterView>
    </div>
</template>


<script>
import homeTop from './homeTop.vue';
import homeAside from './homeAside.vue';
import homeBody from './homeBody.vue';
import { RouterView } from 'vue-router';
  export default {
    name: 'MyHome',
    data : function(){
      return {
      }
    },
    methods :{
    
        

      
    },
    components : { homeTop, homeAside, homeBody, RouterView }
  }


</script>


<style>

</style>