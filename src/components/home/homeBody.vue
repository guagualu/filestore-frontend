<template>
    <div class="homeBody">
      <RouterView name = "inBody"></RouterView>
    </div>

</template>


<script>
import { RouterView } from 'vue-router';

 export default {
   name: 'MyHomeBody',
   data : function(){
     return {
     }
   },
   components : {
}
 }

</script>


<style scoped>
  .homeBody{
    position: relative;
    float: right;
    /* top:200px; */
    margin-top: 100px;
    right: 50px;
    width: 65%;
    height: 800px;
    background-color: rgb(0, 17, 255);
  }

</style>