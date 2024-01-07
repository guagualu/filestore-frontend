<template>
    <div class="page">
    <p>文件组件</p>
    <!-- <input class = "uploadFiles" type="file" @change= "handleFileChange" > -->
    <!-- <el-button class = "multiDelete"   type="primary" @click="uploadFile" round>文件上传</el-button> -->
    <el-upload
    drag
    multiple
    :auto-upload="true"
    :http-request="checkedFile"
    :limit="10"
    :on-progress="handleFileUploadProgress"
    :on-success="handleFileSuccess"
    :on-error="handleFileError"
    action="/tools/upload_test/"
    >
  
  <!-- :before-remove="removeFile" -->
  <!-- action="/tools/upload_test/" -->
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      将文件拖到此处，或
      <em>点击上传</em>
    </div>
  </el-upload>
  <el-button class = "multiDelete" @click="retrySplitUpload"  type="primary" v-if="ifRetry" round>重试</el-button>
  <el-progress type="circle" :percentage="progress" class="progress" v-if="showProgress"></el-progress>

    <el-button @click="multiDelete" class = "multiDelete"   type="primary" round>批量删除</el-button>
    <template>
    <el-table
      :data="fileTableData"
      ref="multipleTable"
      tooltip-effect="dark"
      size="mini" 
      :row-style="rowStyle"
      max-height="500px"
      @selection-change="handleSelectionChange">
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
        <el-button @click="downloadFile(scope.$index,scope.row)" type="text" size="small">下载</el-button>
        <el-button @click="deleteFile(scope.$index,scope.row)" type="text" size="small">删除</el-button>
        <el-button type="text"  @click="dialogVisible = true;editingFile = scope.row" size="small" >编辑
        </el-button>
        <el-dialog
  title="编辑"
  :visible.sync="dialogVisible"
  width="30%"
  :append-to-body="true" 
  >
  <!-- 嵌套的对话框要加这个append-to-body -->
  <el-form ref="editForm" :model="editForm" label-width="80px">
  <el-form-item label="文件名字">
    <el-input v-model="editForm.file_name"></el-input>
    <el-button type="primary" @click="renameFile">立即提交</el-button>
  </el-form-item>
</el-form>
</el-dialog>
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
  </template>
    </div>
</template>


<script>
  import axios from 'axios';
  // import sha1 from 'sha1'
import { v4 as uuidv4 } from 'uuid'
  export default {
    name: 'MyHomeFiles',
    data : function(){
      return {
        dialogVisible : false, // 编辑对话框是否可见
        editingFile : {},
        file : {},
        editForm : {
           file_name  : ""
        },
        fileTableData : [
          {
            file_name : 'test1',
            created_at : '2021-5-18',
            file_size : '421312',

          },
        ],
        multipleSelection: [],
        fileList: [],
        maxSize: 5 * 1024 * 1024 * 1024, // 上传最大文件限制  最小单位是b
      multiUploadSize: 10 * 1024 * 1024, // 大于这个大小的文件使用分块上传(后端可以支持断点续传)  10mb
      eachSize: 10 * 1024 * 1024, // 每块文件大小   10mb
       //上传进度
      progress: 0,
      showProgress: false,
      // 每上传一块的进度
      eachProgress: 0,
      // 总共有多少块。断点续传使用
      chunksKeep:0,
      // 切割后的文件数组
      fileChunksKeep:[],
      ifRetry : false,
      retry : {
        fileHash: {},
        fileSize : {},
        uploadId : {},
        chunkCount: {},
        onProgress:{},
        onSuccess : {},
        fileName : {},
        file : {},
      },
      rowStyle : {
        'background-color': 'aqua',
      },
      filesTotal :50,
      }
    },
    components : {},
    methods : {
    async getFileSha1 (file) {
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file); // 获取文件的ArrarBuffer
        fileReader.onload = e => {
            // console.log(e.target.result)) // 查看返回结果
            const SHA = this.getSha1(e.target.result);
            resolve(SHA);
        };
    });
},
 
/**
 * 获取文件SHA-1的值
 * @params data  读取文件的数据，ArrarBuffer格式
 */
 async getSha1(data) {
    // 读取文件时，直接将文件读取为Arryabuffer的形式。顾不需要进行 encode as (utf-8) Uint8Array
    // 读取字符串时则需要
    // const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
},
      async checkedFile(options) {
        //补偿 retry
        this.ifRetry =false;
        this.retry = {};
      console.log(options);
      const {
        maxSize,
        multiUploadSize,
        getSize,
        splitUpload,
        singleUpload
      } = this; // 解构赋值
      const { file, onProgress, onSuccess, onError } = options; // 解构赋值
      if (file.size > maxSize) {
        return this.$message({
          message: `您选择的文件大于${getSize(maxSize)}`,
          type: "error"
        });
      }
      this.file = file
      //获取sha1值
      let fileHash = null
      await this.getFileSha1(file).then(function (result) {fileHash = result  })
      let fileName = file.name
      console.log(fileHash)
      //尝试快传
      let fastRes = null;
      fastRes =await this.fastUpload(fileHash,fileName)
      if(fastRes){
        console.log(fastRes)
        return;
      }
      //单传
        if(file.size <= this.multiUploadSize) {
          console.log("single")
          let uploadRes =await this.uploadFile(file, onProgress);
        if(uploadRes){
          this.$message({
          message: "上传成功",
          type: "success"
        });
        this.showProgress = false;
        this.progress = 0;
        }else{
        this.$message({
          message: e.message,
          type: "error"
        });
        this.showProgress = false;
        this.progress = 0;
        onError
        }
      }else {  //分块
        console.log("multi",this)
        let uploadRes = await this.uploadMpFile(file,fileHash,file.size,onProgress,onSuccess);
        if(uploadRes){
          this.$message({
          message: "上传成功",
          type: "success"
        });
        this.showProgress = false; 
        this.progress = 0;
        }else{
        this.$message({
          message: e.message,
          type: "error"
        });
        this.showProgress = false;
        this.progress = 0;
        onError
        }
      }
        
    },
    // 格式化文件大小显示文字
    getSize(size) {
      return size > 1024
        ? size / 1024 > 1024
          ? size / (1024 * 1024) > 1024
            ? (size / (1024 * 1024 * 1024)).toFixed(2) + "GB"
            : (size / (1024 * 1024)).toFixed(2) + "MB"
          : (size / 1024).toFixed(2) + "KB"
        : size.toFixed(2) + "B";
    },
    async retrySplitUpload() {
      let fileHash =this.retry.fileHash;
      let fileSize = this.retry.fileSize;
      let uploadId = this.retry.uploadId;
      let chunkCount = this.retry.chunkCount;
      let onProgress =this.retry.onProgress;
      let onSuccess = this.retry.onSuccess;
      let fileName = this.retry.fileName;
      let file = this.retry.file;
      //init 获取失败的chunkIndex
      const vc =this;
      const initformData = new FormData();
      initformData.append("upload_id",uploadId);
      initformData.append('chunk_count',chunkCount);
      let retryfileChunks;
      await axios.post('/file/upload/retry/init', initformData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
          //重新走
          retryfileChunks = response.data.data.chunk_index_array
        }).catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
          //这里异步请求completed
       var timer = null;
       timer=setInterval(function(){
        let formData = new FormData();
       formData.append("file_hash",fileHash);
        formData.append("upload_id",uploadId);
        formData.append("file_size",fileSize);
        formData.append("chunk_count",chunkCount);
        formData.append("file_name",fileName)
        formData.append('user_uuid',"41e32018-8fd1-41f3-8b6a-d5ec340362ab");
       axios.post('/file/upload/completed', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
          //如果完成了
          if(response.data.data.completed){
             vc.showProgress = false
             clearInterval(timer)
          }else{
            vc.progress= response.data.data.progress
          }
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
          clearInterval(timer)
        });
       }, 1000)
       //进行文件切割
       const fileChunks=this.splitFile(file,this.eachSize,Math.ceil(fileSize/this.multiUploadSize))
       let mpUploadRes = true
       for(let i =0;i<retryfileChunks.length;i++){
       let formData = new FormData();
       formData.append("file",fileChunks[retryfileChunks[i]-1]);
       console.log(fileChunks,retryfileChunks,fileChunks[retryfileChunks[i]])
       await axios.post('/file/upload/mp', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
          "upload_id": uploadId,
          "chunk_index" :  retryfileChunks[i],
          "content-Type" : "multipart/form-data"
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
          mpUploadRes = false
        });
       }
       
       if(mpUploadRes){
        this.ifRetry = false
        this.retry ={
        }
       }else{
        clearInterval(timer)
       }
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile(file, eachSize, chunks) {
            const fileChunk = [];
            for (let chunk = 0; chunks > 0; chunks--) {
              fileChunk.push(file.slice(chunk, chunk + eachSize));
              chunk += eachSize;
            }
            return fileChunk
    },
    removeFile(file) {
      this.requestCancelQueue[file.uid]();
      delete this.requestCancelQueue[file.uid];
      return true;
    },
    async uploadFile(file,onProgress){

      const formData = new FormData();
       formData.append("file",file);
       formData.append('user_uuid',"41e32018-8fd1-41f3-8b6a-d5ec340362ab");
       this.showProgress = true
       let res =false
       await axios.post('/file/upload', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
          "content-Type" : "multipart/form-data"
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
          res = true
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
        return res
    },
      async uploadMpFile(file,fileHash,fileSize,onProgress,onSuccess){
        //调用mpinit
        //获得uploadId
        let uploadId = uuidv4()
        let chunkCount =Math.ceil(fileSize/this.multiUploadSize)
        const vc =this ;
        await axios.get('/file/upload/mp/init', {
        params :{
          "file_hash" : fileHash,
          "upload_id" : uploadId,
          "file_size" : fileSize,
          "chunk_size" :this.multiUploadSize,
          "chunk_count" : chunkCount
        },
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
      }
       )
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
       //进行文件切割
       const fileChunks=this.splitFile(file,this.eachSize,Math.ceil(fileSize/this.multiUploadSize))
       //循环请求
       let mpUploadRes = true
       //这里异步请求completed
       var timer = null;
       timer=setInterval(function(){
        let formData = new FormData();
       formData.append("file_hash",fileHash);
        formData.append("upload_id",uploadId);
        formData.append("file_size",fileSize);
        formData.append("chunk_count",chunkCount);
        formData.append('user_uuid',"41e32018-8fd1-41f3-8b6a-d5ec340362ab");
        formData.append('file_name',file.name);
        axios.post('/file/upload/completed', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
          //如果完成了
          if(response.data.data.completed){
             clearInterval(timer)
          }else{
            vc.progress= response.data.data.progress
          }
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
          clearInterval(timer)
        });
       }, 1000)
       vc.showProgress = true
       for(let i =0;i<fileChunks.length;i++){
       let formData = new FormData();
       formData.append("file",fileChunks[i]);
       await axios.post('/file/upload/mp', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
          "upload_id": uploadId,
          "chunk_index" :  i+1,
          "content-Type" : "multipart/form-data"
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
          mpUploadRes = false
        });
       }
       //结束后必须调用一次 completed 防止定时器还没调用就已经结束了
       let formData = new FormData();
       formData.append("file_hash",fileHash);
        formData.append("upload_id",uploadId);
        formData.append("file_size",fileSize);
        formData.append("chunk_count",chunkCount);
        formData.append('user_uuid',"41e32018-8fd1-41f3-8b6a-d5ec340362ab");
        formData.append('file_name',file.name);
        await axios.post('/file/upload/completed', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
          //如果完成了
          if(response.data.Completed){
          }else{
            this.progress= response.data.Progress
          }
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
          
        });
       if (!mpUploadRes){
        clearInterval(timer)        
        //设置需要重试
        this.ifRetry = true;
        this.retry = {
        fileHash: fileHash,
        fileSize : fileSize,
        uploadId : uploadId,
        chunkCount: chunkCount,
        onProgress: onProgress,
        fileName : file.name ,
        onSuccess : onSuccess,
        file : file
      }
        return false
       }else{
        return true
       }
    },
    async fastUpload(fileHash,fileName){
      const formData = new FormData();
       formData.append("file_hash",fileHash);
       formData.append("file_name",fileName);
       formData.append('user_uuid',"41e32018-8fd1-41f3-8b6a-d5ec340362ab");
       let reqRes = false
       await axios.post('/file/fast/upload', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          console.log(response.data);
          // 处理上传成功的逻辑
          reqRes = true
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
        console.log(reqRes);
        return reqRes
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      //val是一个数组 里面是所有的被选择的对应的数组下标数据
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },

      downloadFile(index,row){
        let formData = {
    "file_name": row.file_name,
    "file_hash" : row.file_hash,
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab"
}
        axios.post('/file/download', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          //成功处理 
          //如果是oss
          if(response.data.data && response.data.data.store_type == "oss"){
            window.location.href = response.data.data.url
          }else{ //是本地
            axios({
       method: "post",
       url: "/file/download",
       responseType: "blob", //收到的数据为blob,
       data : formData,
       headers :{
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
     }).then(response => {
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");//创建一个a标签
            a.href = url;// 设置超链接的地址
        /*
后端设置的响应头，指定文件名和后缀名
后端这里已经指定文件类型，也可前端设置
         */
//通过后端设置的响应头，获取文件名：
            let fileName= response.headers["content-disposition"].split(";")[1].split("=")[1];
//前端也可以设置下载文件的文件名：
            fileName=fileName.substr(0, fileName.length - 1);
            fileName=fileName.substr(1, fileName.length );
//前端也可以设置下载文件的文件名：
            a.download = fileName;
            a.click()
          }).catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });          
        }})
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });

      },
      deleteFile(index,row){
        let formData = {
          "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
          "file_ids" : [this.fileTableData[index].file_id]
                       }  
        axios.post('/uf/delete', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          //成功处理 请求阿里云的地址
          console.log(response);
         
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        //查询用户文件
      let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "page" : val,
    "page_size":10
}     
       let vc = this;
			axios.post('/uf/list', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
            vc.fileTableData = response.data.data.file_list;

        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
      },
      multiDelete(){
        console.log(this.$refs.multipleTable.selection);
        let fileIds = []
        for(let i = 0;i<this.$refs.multipleTable.selection.length;i++){
           fileIds.push(this.$refs.multipleTable.selection[i].file_id)
        }
        let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "file_ids" : fileIds
}     
       let vc = this;
			axios.post('/uf/delete', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          console.log(response);

        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
      },
      renameFile(){
        let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "file_hash" : this.editingFile.file_hash,
    "file_old_name" : this.editingFile.file_name,
    "file_name" : this.editForm.file_name,
}     
       let vc = this;
			axios.post('/uf/rename', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          console.log(response);
          vc.dialogVisible =false;
          alert("改名成功")

        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
          vc.dialogVisible =false;
          alert("改名失败")
        });
      },
      handleFileUploadProgress(){
        console.log("onprogress");
      },
      handleFileSuccess(){
        console.log("onsuccess");
      },
      handleFileError(){
        console.log("onerror");
      }
   
      },
      //通过路由规则，进入该组件时被调用
		beforeRouteEnter (to, from, next) {
      //查询用户文件
      let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "page" : 1,
    "page_size":10
}
			axios.post('/uf/list', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          // 写入fileTableData
          next(vm => {
            // 在这里可以访问组件实例 vm
            console.log(vm);
            vm.fileTableData = response.data.data.file_list;
            vm.filesTotal = response.data.data.count;
               });
        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
		},
    }


</script>


<style scoped>
 
  .uploadFiles {
  float: left;
  margin-left: 10px;
 }
 .multiDelete {
  float: right;
  margin-right: 10px;
 }
 el-table{
  margin-top: 5%;
  background-color: aqua;
 }
 

</style>