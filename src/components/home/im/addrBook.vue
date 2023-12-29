<template>
    <div>
    通讯录组件
    
    <div class="add-friend">
      <button @click="showAddFriendModal">添加好友</button>
      <div v-if="showModal" class="modal">
        <input type="text" v-model="searchKeyword" placeholder="输入好友姓名">
        <button @click="searchFriend">搜索</button>
        <div v-if="searchResult.length > 0">
          <ul>
            <li v-for="result in searchResult" :key="result.id">
              {{ result.name }}
              <button v-if="isNotFriend(result.id)" @click="addFriend(result.id)">添加</button>
            </li>
          </ul>
        </div>
        <div v-else>
          暂无搜索结果
        </div>
      </div>
    </div>
    <div class="friend-list">
    <div class="friend-item" v-for="friend in friends" :key="friend.id">
      <div class="friend-avatar">
        <img :src="friend.avatar" alt="avatar">
      </div>
      <div class="friend-info">
        <div class="friend-name">{{ friend.name }}</div>
        <div class="friend-status">{{ friend.status }}</div>
      </div>
      <div class="friend-action">
        <button @click="sendMessage(friend.id)">发送消息</button>
      </div>

      <div class="friend-action">
        <button @click="deleteFriend(friend.id)">删除好友</button>
      </div>
    </div>
  </div>
    </div>
</template>


<script>
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
      showModal: false,
      searchKeyword: '',
      searchResult: []
      }
    },
    components : {},
    methods: {
    sendMessage(friendId) {
      // 发送消息给指定好友
      console.log('发送消息给好友：', friendId)

      //api查询是否有session 如果没有会话，那么后端需要新增会话

      //此时前端获取的session会多一个（如果之前没有）
      if( this.$route.path != '/home/im/session'){
        this.$router.push(
          {
            name :'session',
          }
        )
      }
      
    },
    showAddFriendModal() {
      this.showModal = true;
    },
    searchFriend() {
      // 根据关键字搜索好友
      // 模拟搜索结果
      this.searchResult = this.allUsers.filter(user => user.name.includes(this.searchKeyword));
    },
    isNotFriend(id){
      let tmp = this.friends.filter(friend => friend.id===id);
      return tmp.length < 1
    },
    deleteFriend(id){
      // 删除指定好友
      console.log('删除好友：', friendId)
    }
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