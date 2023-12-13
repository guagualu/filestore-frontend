<template>
    <div class="homeAside">
       <homeAsideAside @hoemAsideToFile="hoemAsideToFile"/> 

    </div>

</template>


<script>
import homeAsideAside from './homeAsideAside.vue';
 export default {
   name: 'MyHomeAside',
   data : function(){
     return {
     }
   },
   components : {
    homeAsideAside,
   },
   methods: {
    hoemAsideToFile(){
      alert(1)
      this.$emit("toFileEvent")
    }
   }
 }

</script>


<style scoped>
  .homeAside{
    position: absolute;
    top:200px;
    left: 25px;
    width: 400px;
    height: 800px;
    background-color: aqua;
  }

</style>