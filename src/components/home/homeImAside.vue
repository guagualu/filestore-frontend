<template>
    <div class="homeAsideAside">
        <div class="sessionLink" @click="toSession">
            会话
        </div>

        <div class="friendListLink" @click="toFriendList">
            通讯录
        </div>


    </div>

</template>


<script>
import { RouterLink } from 'vue-router';

 export default {
    name: "MyHomeImAside",
    data: function () {
        return {};
    },
    methods : {
        toSession(){
        // this.$emit("hoemAsideToFile")
        if (this.$route.path !== '/home/im/session') {
          this.$router.push({
          name : "session",
        })
        }

        
    },
    toFriendList(){
      if (this.$route.path !== '/home/im/addrBook') {
          this.$router.push({
          name : "addrBook",
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
    width: 45%;
    height: 780px;
    background-color: rgb(109, 48, 73);
  }

</style>