<template>
    <div class="chat-container">
    会话组件
    <div class="sidebar">
      <div v-for="conversation in conversations" :key="conversation.id" class="conversation-item" @click="changeSession(conversation.id)">
        <div class="conversation-name">{{ conversation.name }}</div>
        <div class="conversation-last-message">{{ conversation.lastMessage }}</div>
        --------------------------
      </div>
    </div>
    <div class="singleChat">
    <div class="chat-list">
      <div v-for="message in showMessages" :key="message.id" class="chat-message">
        <div class="message-sender">{{ message.sender }}</div>
        <div class="message-content">{{ message.content }}</div>
        <div class="message-file"
        v-if="message.sendFile" 
        > 
        {{ message.sendFile }}
        <el-button class = "uploadFiles" type="primary" round v-if="message.sendFile&&message.sendFile.fileSender === message.sender">上传的文件</el-button>
        <el-button class = "acceptFiles" type="primary" round v-else-if="message.sendFile&&message.sendFile.fileSender !== message.sender">接受文件</el-button>
      </div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" placeholder="Type your message..." />
      <button @click="sendMessage">Send</button>
      <button @click="sendFile">SendFile</button>
    </div>
    </div>
    </div>
</template>


<script>
  export default {
    name: 'session',
    data : function(){
      return {
        messages: [
       {
        sessionId :1,
        itsMessage :[{
        id: 1,
        sender: "John",
        content: "Hello, how are you?"
      },
      {
        id: 2,
        sender: "Jane",
        content: "I'm good, thanks for asking!"
      },
      {
        id: 3,
        sender: "John",
        content: "Do you have any plans for the weekend?"
      }]
       },
       {
        sessionId :2,
        itsMessage :[
          {
        id: 1,
        sender: "John2",
        content: "Hello, how are you?"
      },
      {
        id: 2,
        sender: "Jane2",
        content: "I'm good, thanks for asking!"
      },
      {
        id: 3,
        sender: "John2",
        content: "Do you have any plans for the weekend?"
      }]
       }
        
    
    ],
      showMessages:[{
        id: 1,
        sender: "John",
        content: "Hello, how are you?",
        sendFile  : {
            fileSender : "John",
            fileName :  "test",
            fileHash : "123asd",
            fileSize : 123,
        }
      },
      {
        id: 2,
        sender: "Jane",
        content: "I'm good, thanks for asking!"
      },
      {
        id: 3,
        sender: "John",
        content: "Do you have any plans for the weekend?"
      }],
      newMessage: "",
      conversations: [
        {
          id: 1,
          name: "John",
          lastMessage: "Hello, how are you?"
        },
        {
          id: 2,
          name: "Bob",
          lastMessage: "Do you have any plans for the weekend?"
        }
      ],
      }
    },
    components : {},
    methods : {
      sendMessage() {
      if (this.newMessage.trim() !== "") {
        const message = {
          id: Date.now(),
          sender: "Me",
          content: this.newMessage
        };
        this.messages.push(message);
        this.newMessage = "";
      }
    },
    changeSession(sessionId){
      //找到当前sessionId在messages的位置
      let mes =this.messages
      var index;
      for (let i=0;i<mes.length;i++){
         if (mes[i].sessionId===sessionId){
          index = i;
          break;
         }
      }
     this.showMessages=mes[index].itsMessage
},
    sendFile(){
      alert(1)
    }
    }
  }


</script>
                                                                                       

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-message {
  margin-bottom: 10px;
}

.message-sender {
  font-weight: bold;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
}

input {
  flex: 1;
  margin-right: 10px;
}

button {
  padding: 5px 10px;
}
.sidebar {
  position: absolute;
  top: 5%;
  left: 5%;
  background-color: #f0f0f0;
  padding: 10px;
  overflow-y: auto;
}
.chat-container{
  position: relative;
}
.singleChat{
  position: absolute;
  top: 5%;
  right: 5%;
  background-color: #f0f0f0;
  padding: 10px;
  overflow-y: auto;
}

</style>