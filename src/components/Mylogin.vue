<template>
  <div class="login">
    <div class="login-header">
        <img class="header-logo" src="../assets/logo.png"  alt="呱云盘logo" />
        <div class="header-navigation">
          <a href="">呱网盘</a>
          <a href="">问题反馈</a> 
        </div>
    </div>
    <carouselChart/>
  </div>
  </template>
  
  <script>
  import carouselChart from './carouselChart.vue'
  export default {
    name: 'MyLogin',
    props: {
      msg: String
    },
    components:{carouselChart}
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
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
  .login-header{
    overflow: hidden;
  }
  </style>
  