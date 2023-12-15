<template>
    <div class="homeAside">
      <div class="homeLeftAside">
        <div class="index" @click="toIndex">
            首页
        </div>

        <div class="im" @click="toIm">
            消息
        </div>
        

    </div>
       <RouterView name="inAside"/>

    </div>

</template>


<script>
import { RouterView } from 'vue-router';
import homeAsideAside from './homeIndexAside.vue';
 export default {
   name: 'MyHomeAside',
   data : function(){
     return {
     }
   },
   components : {
    homeAsideAside,
    RouterView
},
   methods: {
    toIndex(){
      if (this.$route.path !== '/home/index') {
          this.$router.push({
          name : "index",
        })
        }
    },
    toIm(){
      if (this.$route.path !== '/home/im') {
          this.$router.push({
          name : "im",
        })
        }
    }
   }
 }

</script>


<style scoped>
  .homeAside{
    position: relative;
    float: left;
    margin-top: 100px;
    left: 25px;
    width: 25%;
    height: 800px;
    background-color: rgb(140, 61, 160);
  }

  .homeLeftAside{
    position: absolute;
    top:20px;
    left: 25px;
    width: 150px;
    height: 780px;
    background-color: rgb(51, 167, 76);
  }


</style>