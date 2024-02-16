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
        <el-input v-model="loginPhone" placeholder="请输入手机号"></el-input>
        <el-input v-model="loginPsd" placeholder="请输入密码"></el-input>
        <el-button class="login-submit" @click="login" type="primary" round>登录</el-button>
        <RouterLink  class="toSignUp" active-class="active" to="/signUp">点此注册</RouterLink>
      </div>
      <carouselChart/>
    </div>
  </div>
  <div  v-show = "$route.path.includes('home')||$route.path.includes('signUp')">
    <router-view></router-view>
  </div>
  </div>
  </template>
  
  <script>
  import { RouterLink, RouterView } from 'vue-router'
  import JwtService from '../pkg/jwt.js'
  import axios from 'axios';
import carouselChart from './carouselChart.vue'
  export default {
    name: 'MyLogin',
    data : function(){
      return {
        loginPhone : null,
        loginPsd : ""
      }
    },
    methods : {
       login(){
        let formData = {
         "mobile" : this.loginPhone,
         "user_password" : this.loginPsd,
}
        console.log(formData)
        axios.post('/user/signIn', formData)
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
          //保存token
          JwtService.saveToken(response.data.data.token)
          //保存用户uuid
          localStorage.setItem('user_uuid', response.data.data.user_uuid);
          if (this.$route.path !== '/home/index') {
          this.$router.push({
          name : "index",
          
        })
      }
        })
        .catch(error => {
          console.error(error);
          return;
          // 处理上传失败的逻辑
        });

}
        
       
    },
    props: {
      msg: String
    },
    components:{ carouselChart, RouterView, RouterLink }
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
  