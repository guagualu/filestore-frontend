<template>
    <div class="page" >
      <div class="signUp">
      <div class="signUp-header">
          <img class="header-logo" src="../assets/logo.png"  alt="呱云盘logo" />
          <div class="header-navigation">
            <a href="">呱网盘</a>
            <a href="">问题反馈</a> 
          </div>
      </div>
      <div class="signUp-body">
        <div class="signUp-input">
          <el-input v-model="loginPhone" placeholder="请输入手机号"></el-input>
          <el-input v-model="userName" placeholder="请输入用户名"></el-input>
          <el-input v-model="email" placeholder="请输入邮箱号"></el-input>
          <el-input v-model="loginPsd" placeholder="请输入密码"></el-input>
          <el-button class="signUp-submit" @click="signUp" type="primary" round>注册</el-button>
          <RouterLink  class="tologin" active-class="active" to="/">点此登录</RouterLink>
        </div>
        <carouselChart/>
      </div>
    </div>
    </div>
    </template>
    
    <script>
    import { RouterLink, RouterView } from 'vue-router'
    import axios from 'axios';
    import carouselChart from './carouselChart.vue';
    export default {
      name: 'MySignUp',
      data : function(){
        return {
          loginPhone : "",
          loginPsd : "",
          email : "",
          userName : "",
        }
      },
      methods : {
         signUp(){
          let formData = {
           "mobile" : this.loginPhone,
           "user_password" : this.loginPsd,
           "user_name" : this.userName,
           "email" : this.email,
  }
          console.log(formData)
          axios.post('/user/signUp', formData)
          .then(response => {
            console.log(response.data);
            // 处理上传成功的逻辑
            if (this.$route.path !== '') {
            this.$router.push({
            name : "login",
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
    .signUp-header{
      overflow: hidden;
    }
    .signUp-body{
      position: relative;
      top: 300px;
    }
    .signUp-input{
      position: absolute;
      right: 100px;
      width: 400px;
      margin: 50px;
    }
    .signUp-input .signUp-submit{
      margin: 50px;
    }
    </style>
    