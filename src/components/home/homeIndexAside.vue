<template>
    <div class="homeAsideAside">
        <div class="fileLink" @click="toFile">
            我的文件
        </div>

        <div class="recycleBinLink" @click="toRecycleBin">
            回收站
        </div>


    </div>

</template>


<script>
import { RouterLink } from 'vue-router';

 export default {
    name: "MyHomeIndexAside",
    data: function () {
        return {};
    },
    methods : {
        toFile(){
        // this.$emit("hoemAsideToFile")
        if (this.$route.path !== '/home/index/files') {
          this.$router.push({
          name : "myFiles",
        })
        }

        
    },
    toRecycleBin(){
      if (this.$route.path !== '/home/index/recycle') {
          this.$router.push({
          name : "recycleBin",
        })
        }
    }
   }
}


</script>


<style scoped>
  .homeAsideAside{
    position: absolute;
    top:20px;
    right: 25px;
    width: 150px;
    height: 780px;
    background-color: rgb(109, 48, 73);
  }

</style>