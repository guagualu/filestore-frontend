<template>
    <div>
    通讯录组件
    
    <div class="add-friend">
      <button >添加好友</button>
      <div  class="modal">
        <input type="text" v-model="searchUserMobile" placeholder="输入好友手机号">
        <button @click="addFriend">添加</button>
      </div>
    </div>
    <div class="friend-list">
    <div class="friend-item" v-for="friend in friends" :key="friend.Id">
      <div class="friend-info">
        <div class="friend-name">{{ friend.NickName }}</div>
      </div>
      <div class="friend-action">
        <button @click="sendMessage(friend.Uuid)">发送消息</button>
      </div>
    </div>
  </div>
    </div>
</template>


<script>
import axios from 'axios';
  export default {
    name: 'addrBook',
    data : function(){
      return {
        friends: [
        {
          id: 1,
          name: '张三',
          avatar: 'https://example.com/avatar1.jpg',
          status: '在线'
        },
        {
          id: 2,
          name: '李四',
          avatar: 'https://example.com/avatar2.jpg',
          status: '离线'
        },
        {
          id: 3,
          name: '王五',
          avatar: 'https://example.com/avatar3.jpg',
          status: '在线'
        }
      ],
      allUsers:[
      {
          id: 1,
          name: '张三',
          avatar: 'https://example.com/avatar1.jpg',
          status: '在线'
        },
        {
          id: 2,
          name: '李四',
          avatar: 'https://example.com/avatar2.jpg',
          status: '离线'
        },
        {
          id: 3,
          name: '王五',
          avatar: 'https://example.com/avatar3.jpg',
          status: '在线'
        }
      ],
      searchUserMobile:''
      }
    },
    components : {},
    methods: {
    async sendMessage(friendUuid) {
      //先查找是否有session了
      let params = {
        user_a_uuid : '41e32018-8fd1-41f3-8b6a-d5ec340362ab',
        user_b_uuid : friendUuid
      }
      let isExist = true 
      await axios.get('/file/existSession',{
        params:params,
        headers : {
          "Authorization" : localStorage.getItem('jwt-token'),
        }
       })
        .then(response => {
            console.log(response);
            isExist = response.data.data.is_exist
            if(response.data.data.is_exist){
              //路由到session组件 并且设置当前session
            if( this.$route.path != '/home/im/session'){
                this.$router.push(
                {
                  name :'session',
                  params:{session:response.data.data.session_uuid}
                })
      }
            }
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
      //创建session
      if(isExist){
        return 
      }
      let formData = new FormData()
      formData.append("user_a_uuid",'41e32018-8fd1-41f3-8b6a-d5ec340362ab')//自己UUID
      formData.append("user_b_uuid", friendUuid)
      axios.post('/file/createSession', formData,{
        headers : {
          "Authorization" : localStorage.getItem('jwt-token'),
        }
       })
        .then(response => {
            console.log(response);
            //路由到session组件 并且设置当前session
            if( this.$route.path != '/home/im/session'){
                this.$router.push(
                {
                  name :'session',
                  params:{session:response.data.data.session_uuid}
                })
      }
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
    },
    addFriend() {
      // 根据关键字搜索好友
      // 模拟搜索结果
      let formData = new FormData()
      formData.append("user_a_mobile",'17602357924')//自己的phone
      formData.append("user_b_mobile",this.searchUserMobile)//自己的phone
      axios.post('/user/add/friend', formData,{
        headers : {
          "Authorization" : localStorage.getItem('jwt-token'),
        }
       })
        .then(response => {
          // 写入fileTableData
            // 在这里可以访问组件实例 vm
            console.log(response);
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
    },
  },
    beforeRouteEnter(to, from, next){
      let params = {
        user_mobile : '17602357924'
      }
      axios.get('/user/get/friends', {params,
        headers : {
          "Authorization" : localStorage.getItem('jwt-token'),
        }
       })
        .then(response => {
          // 写入fileTableData
            // 在这里可以访问组件实例 vm
            next(vm=>{
              vm.friends=response.data.data.friends_infos;
            }
            )
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
    }
      
  }


</script>


<style>
.friend-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.friend-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.friend-name {
  font-size: 16px;
  font-weight: bold;
}

.friend-status {
  font-size: 14px;
  color: #666;
}

.friend-action button {
  padding: 5px 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

</style>