<template>
    <div class="chat-container">
    会话组件
    <div class="sidebar">
      <div v-for="conversation in conversations" :key="conversation.id" class="conversation-item" @click="changeSession(conversation.session_uuid,conversation.chat_user.Uuid)">
        <div class="conversation-name" >{{ conversation.chat_user.NickName }}</div>
        --------------------------
      </div>
    </div>
    <div class="singleChat">
    <div class="chat-list">
      <div v-for="message in showMessages" :key="message.id" class="chat-message">
        <div class="message-sender">{{ message.send_user.NickName }}</div>
        <div class="message-content" v-if="message.message_type == 0">{{ message.message_content }}</div>
        <div class="message-file"
        v-if="message.message_type== 1" 
        > 
        {{ message.message_content}}
        <el-button class = "uploadFiles" type="primary" round v-if="message.message_content.file_sender === '41e32018-8fd1-41f3-8b6a-d5ec340362ab'">上传的文件</el-button>
        <el-button class = "acceptFiles" @click="saveFile(message)" type="primary" round v-else-if="message.message_content.file_sender !== '41e32018-8fd1-41f3-8b6a-d5ec340362ab'">接受文件</el-button>
      </div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="nowSessionSend.message" placeholder="Type your message..." />
      <button ref="sendMsg" @click="sendTxt">Send</button>
      <button @click="selectFile">SelectFile</button>
      <el-dialog
  title="选择文件"
  :visible.sync="dialogVisible"
  width="30%"
  :append-to-body="true" 
  >
  <el-table
      :data="myFilesData"
      tooltip-effect="dark"
      size="mini" 
      max-height="500px">
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
        prop="file_name"
        label="文件名称"
        width="800">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="上传时间"
        width="250">
      </el-table-column>
      <el-table-column
        prop="file_size"
        label="文件大小">
      </el-table-column>
      <el-table-column
      fixed = "right"
      label="操作"
      width="48">
      <template slot-scope="scope">
        <el-button @click="nowSessionSend.selectFileHash=scope.row.file_hash;nowSessionSend.selectFileName=scope.row.file_name" type="text" size="small">选择</el-button>
      </template>
    </el-table-column>
    </el-table>
    <div class="block">
       <el-pagination
          layout="prev, pager, next"
          :total="filesTotal"
          :page-size="10"
          @current-change = "handleCurrentChange"
          >
        </el-pagination>
    </div>
</el-dialog>
      <button @click="sendFile">SendFile</button>
    </div>
    </div>
    </div>
</template>


<script>
  import axios from 'axios';
  import { v4 as uuidv4 } from 'uuid';
  export default {
    name: 'session',
    data : function(){
      return {
        ws: null,
        nowSessionSend:{
          session_uuid : "",
          send_user_uuid : "",
          to_user_uuid: "",
          message : "",
          selectFileHash :"",
          selectFileName :""
        },
        dialogVisible:false,
        myFilesData : [
        ],
        filesTotal : 0 ,
      showMessages:[
      {
                "id": 0,
                "session_uuid": "默认",
                "send_user": {
                    "Id": 0,
                    "Uuid": "默认",
                    "NickName": "默认",
                    "Email": "默认",
                    "Password": "",
                    "Mobile": "默认"
                },
                "to_user": {
                    "Id": 0,
                    "Uuid": "默认",
                    "NickName": "默认",
                    "Email": "默认",
                    "Password": "",
                    "Mobile": "默认"
                },
                "message_type": 0,
                "message_content": "默认",
                "created_at": "默认",
                "updated_at": "默认"
            },
      ],
      newMessage: "",
      conversations: [
        {
          id: 0,
                session_uuid: "default",
                chat_user: {
                    Id: 0,
                    Uuid: "default",
                    NickName: "default",
                    Email: "default",
                    Password: "default",
                    Mobile: "default"
                },
                created_at: "default",
                updated_at: "default"
        }
      ],
      }
    },
    components : {},
    methods : {
      selectFile(){
        //获取我的文件列表
        //查询用户文件
      let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "page" : 1,
    "page_size":5
}
     const vm = this;
			axios.post('/uf/list', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          // 写入fileTableData
            // 在这里可以访问组件实例 vm
            console.log(vm);
            vm.myFilesData = response.data.data.file_list;
            vm.filesTotal = response.data.data.count;
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
        vm.dialogVisible = true
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        //查询用户文件
      let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "page" : val,
    "page_size":5
}     
       let vc = this;
			axios.post('/uf/list', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
            vc.myFilesData = response.data.data.file_list;

        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
      },
      sendTxt() {
        let _this = this;
        if (_this.nowSessionSend.message.length<=0) {
          return;
        }
        let params = {
          session_uuid: _this.nowSessionSend.session_uuid,
          send_user_uuid: '41e32018-8fd1-41f3-8b6a-d5ec340362ab',
          send_user_nickname : 'gua', //从localstrage里面取 反正都是自己的用户名
          to_user_uuid: _this.nowSessionSend.to_user_uuid,
          message: _this.nowSessionSend.message,
          message_type: 0
        };
        _this.ws.send(JSON.stringify(params)); //调用WebSocket send()发送信息的方法
        console.log(JSON.stringify(params))
        _this.showMessages.push({
          session_uuid :params.session_uuid,
          send_user:{
            NickName:params.send_user_nickname
          },
          id : uuidv4(),  //以一个uuid作为展示的key 但是后面刷新后会变为正常的id
          message_content : params.message,
          message_type : 0
        })
    },
    changeSession(sessionId,chatToUuid){
    const vm = this;
    let params = {
      session_uuid : sessionId
    }
    axios.get('/file/getASessionInfo', {params,
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {          
            for(let i = 0;i<response.data.data.content_list.length;i++){
               if(response.data.data.content_list[i].message_type==1){
                response.data.data.content_list[i].message_content=JSON.parse(response.data.data.content_list[i].message_content);
               }
            }
            vm.showMessages = response.data.data.content_list;
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
    let sendUserUuid = "41e32018-8fd1-41f3-8b6a-d5ec340362ab"
    this.nowSessionSend.session_uuid = sessionId
    this.nowSessionSend.send_user_uuid = sendUserUuid
    this.nowSessionSend.to_user_uuid = chatToUuid
    //去除旧的ws连接
    this.ws.onclose()
    //连接当前session
    var url = 'ws://127.0.0.1:8082/chat?send_user_uuid='+this.nowSessionSend.send_user_uuid+'&to_user_uuid='+this.nowSessionSend.to_user_uuid+'&session_uuid='+this.nowSessionSend.session_uuid
    let ws = new WebSocket(url);
    this.ws = ws;
    ws.onopen = function(e) {
            console.log("服务器连接成功: " + url);
            //发送token验证
            let params = {
              token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg'
            } 
            ws.send(JSON.stringify(params)); //调用WebSocket send()发送信息的方法
    };
    ws.onclose = function(e) {
            console.log("服务器连接关闭: " + url);
          };
    ws.onerror = function() {
            console.log("服务器连接出错: " + url);
            ws.onclose();
          };
    ws.onmessage = function(e) {
            //接收服务器返回的数据
            let data = JSON.parse(e.data);
            console.log("服务器接受消息: ",data)
            data=data.data
            data.send_user= {}
            data.send_user.NickName=data.send_user_nickname
            data.id=data.session_content_id
            data.message_content=data.message
            vm.showMessages.push(data)
    };
    
},
    sendFile(){
      const ws = this.ws
      let params = {
          session_uuid: this.nowSessionSend.session_uuid,
          send_user_uuid: '41e32018-8fd1-41f3-8b6a-d5ec340362ab',
          send_user_nickname : 'gua', //从localstrage里面取 反正都是自己的用户名
          to_user_uuid: this.nowSessionSend.to_user_uuid,
          message: JSON.stringify({
            file_name : this.nowSessionSend.selectFileName,
            file_hash : this.nowSessionSend.selectFileHash,
            file_sender: '41e32018-8fd1-41f3-8b6a-d5ec340362ab',
          }),
          message_type: 1
        };
        console.log(params.message)
        this.ws.send(JSON.stringify(params)); //调用WebSocket send()发送信息的方法
        this.showMessages.push({
          session_uuid :params.session_uuid,
          send_user:{
            NickName:params.send_user_nickname
          },
          id : uuidv4(),  //以一个uuid作为展示的key 但是后面刷新后会变为正常的id
          message_content : {
            file_name : this.nowSessionSend.selectFileName,
            file_hash : this.nowSessionSend.selectFileHash,
            file_sender: '41e32018-8fd1-41f3-8b6a-d5ec340362ab',
          },
          message_type : 1
        })
    },
    saveFile(m){
      let formData = new FormData()
//对话用户再上传到自己的网盘中,也就是保存到userfile中，因为是从已经存在的file中的
      formData.append("user_uuid",'41e32018-8fd1-41f3-8b6a-d5ec340362ab')
      formData.append("file_hash",m.message_content.file_hash)
      formData.append("file_name",m.message_content.file_name)
      axios.post('/uf/create', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });

    },
    // 进入页面创建websocket连接
    initWebSocket() {
        let _this = this;
        // 判断页面有没有存在websocket连接
        if (window.WebSocket) {
          console.log('test');
          // 填写本地IP地址 此处的 :9101端口号 要与后端配置的一致！
          // ?send_user_uuid=41e32018-8fd1-41f3-8b6a-d5ec340362ab&to_user_uuid=80cb2899-f483-42a8-9434-16bc04600d0d&session_uuid=59ec0b9a-1cf6-4bd8-b30a-ba17625cc67a
          var url = 'ws://127.0.0.1:8082/chat?send_user_uuid='+_this.nowSessionSend.send_user_uuid+'&to_user_uuid='+_this.nowSessionSend.to_user_uuid+'&session_uuid='+_this.nowSessionSend.session_uuid
          let ws = new WebSocket(url);
          _this.ws = ws;
          ws.onopen = function(e) {
            console.log("服务器连接成功: " + url);
            //发送token验证
            let params = {
              token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg'
            } 
            ws.send(JSON.stringify(params)); //调用WebSocket send()发送信息的方法
          };
          ws.onclose = function(e) {
            console.log("服务器连接关闭: " + url);
          };
          ws.onerror = function() {
            console.log("服务器连接出错: " + url);
            ws.onclose();
          };
          ws.onmessage = function(e) {
            //接收服务器返回的数据
            let data = JSON.parse(e.data);
            console.log("服务器接受消息: ",data)
            data=data.data
            data.send_user= {}
            data.send_user.NickName=data.send_user_nickname
            data.id=data.session_content_id
            data.message_content=data.message
            if (data.message_type==1){
              let fileInfo = JSON.parse(data.message)
              data.message_content = fileInfo
            }
            _this.showMessages.push(data)
          };
        }
      },
    },
    //通过路由规则，进入该组件时被调用
		async beforeRouteEnter (to, from, next) {
      //查询用户session
      let params = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
}    
      let firstSessionUuid = ''
      let conversations = []
			await axios.get('/file/getUserAllSession', {params,
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          // 写入fileTableData
            // 在这里可以访问组件实例 vm
            conversations = response.data.data.list;
            if(response.data.data.list.length>0){
               firstSessionUuid = response.data.data.list[0].session_uuid
            }
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
      //获取最新session的具体记录 或者是从通信录跳转过来的
      console.log(to.params.session)
    if(to.params.session){
      firstSessionUuid = to.params.session
    }
    params = {
      session_uuid : firstSessionUuid
    }
    console.log(params)
    axios.get('/file/getASessionInfo', {params,
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          // 写入fileTableData
          next(vm => {
            // 在这里可以访问组件实例 vm
            console.log(response.data.data.content_list,response.data.data.content_list.length)
            //对是文件的msg进行反序列化
            for(let i = 0;i<response.data.data.content_list.length;i++){
               if(response.data.data.content_list[i].message_type==1){
                response.data.data.content_list[i].message_content=JSON.parse(response.data.data.content_list[i].message_content);
                console.log(response.data.data.content_list[i].message_content)
               }
            }
            if(conversations.length!=0){
            vm.conversations = conversations;
            vm.showMessages = response.data.data.content_list;
            vm.nowSessionSend.session_uuid = firstSessionUuid
            vm.nowSessionSend.send_user_uuid = '41e32018-8fd1-41f3-8b6a-d5ec340362ab'
            vm.nowSessionSend.to_user_uuid = conversations[0].chat_user.Uuid            
            }
            
               });
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
		},
    mounted() {
      this.initWebSocket();
    },
    destroyed() {
      // 离开页面时关闭websocket连接
      this.ws.onclose(undefined);
    },
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
  width: 20%;
  height: 70%;
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
  width: 60%;
  height: 70%;
}

</style>