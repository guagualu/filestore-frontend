<template>
  <div class="page" >
    <div class="login" v-show = "$route.path =='/'">
    <div class="login-header">
        <img class="header-logo" src="../assets/logo.png"  alt="呱云盘logo" />
        <div class="header-navigation">
          <a href="">呱网盘</a>
          <a href="">问题反馈</a> 
        </div>
    </div>
    <div class="login-body">
      <div class="login-input">
        <el-input v-model.number="loginPhone" placeholder="请输入手机号"></el-input>
        <el-input v-model="loginPsd" placeholder="请输入密码"></el-input>
        <el-button class="login-submit" @click="login" type="primary" round>主要按钮</el-button>
      </div>
      <carouselChart/>
    </div>
  </div>
  <div  v-show = "$route.path =='/home'">
    <router-view></router-view>
  </div>
  </div>
  </template>
  
  <script>
  import { RouterView } from 'vue-router'
import carouselChart from './carouselChart.vue'
  export default {
    name: 'MyLogin',
    data : function(){
      return {
        inLogin : true,
        loginPhone : null,
        loginPsd : ""
      }
    },
    methods : {
       login(){
        console.log(this)
        this.inLogin = false
        console.log(this)
        if (this.$route.path !== '/home') {
          this.$router.push({
          name : "home",
          
        })
      }

}
        
       
    },
    props: {
      msg: String
    },
    components:{ carouselChart, RouterView }
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
  .login-body{
    position: relative;
    top: 300px;
  }
  .login-input{
    position: absolute;
    right: 200px;
  }
  .login-input .login-submit{
    margin: 50px;
  }
  </style>
  