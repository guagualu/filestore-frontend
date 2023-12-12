<template>
    <div>
    <homeTop></homeTop>
    <homeAside></homeAside>
    <homeBody/>
    </div>
</template>


<script>
import homeTop from './homeTop.vue';
import homeAside from './homeAside.vue';
import homeBody from './homeBody.vue'
  export default {
    name: 'MyHomeTop',
    data : function(){
      return {
      }
    },
    components : { homeTop,homeAside,homeBody}
  }


</script>


<style>

</style>