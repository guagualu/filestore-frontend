<template>
    <div>
    <homeTop></homeTop>
    <homeAside @toFileEvent= "tofile"> </homeAside>
    <!-- <router-view></router-view> -->
    <homeBody></homeBody>
    </div>
</template>


<script>
import homeTop from './homeTop.vue';
import homeAside from './homeAside.vue';
import homeBody from './homeBody.vue';
  export default {
    name: 'MyHome',
    data : function(){
      return {
      }
    },
    methods :{
      tofile(){
        alert(2)
        if (this.$route.path !== '/home/files') {
          this.$router.push({
          name : "myFiles",
        })
        

      }
    }
    },
    components : { homeTop, homeAside,homeBody}
  }


</script>


<style>
  .homeBody{
    position: absolute;
    top:200px;
    right: 50px;
    width: 1600px;
    height: 800px;
    background-color: aqua;
  }
</style>