<template>
     <div class="home-header">
        <img class="header-logo" src="../../assets/logo.png"  alt="呱云盘logo" />
        <div class="header-navigation">
          <a href="">呱网盘</a>
          <a href="">问题反馈</a> 
          <a href="/#/home">
            <img class="header-userPhoto" src="../../assets/logo.png"  alt="呱云盘logo" />
          </a>
          
        </div>
    </div>

</template>


<script>
  export default {
    name: 'MyHomeTop',
    data : function(){
      return {
      }
    },
  }

</script>


<style scoped>

.home-header{
    overflow: hidden;
  }

  .header-logo {
    margin: 0px 20px;
    width: 100px;
    height: 100px;
    float: left;
    background-color: blue;
  }
  .header-navigation{
    float: right;
    border-style: solid;
    margin: 20;
    width: 1000px;
    height: 30px;
    background-color:red;
  }
  .header-navigation a{
    float: left;
    margin: 2px 20px;
    width: 100px;
    height: 25px;
    background-color:royalblue;

  }

  a img{
    margin: 0px 20px;
    width: 20px;
    height: 20px;
  }
</style>