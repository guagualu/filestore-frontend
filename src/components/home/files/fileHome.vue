<template>
    <div class="page">
    <p>文件组件</p>
    <input class = "uploadFiles" type="file" @change= "handleFileChange" >
    <el-button class = "multiDelete"   type="primary" @click="uploadFile" round>文件上传</el-button>
    <el-button class = "multiDelete"   type="primary" round>批量删除</el-button>
    <template>
    <el-table
      :data="fileTableData"
      style="width: 100%"
      ref="multipleTable"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange">
      >
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
        <el-button @click="" type="text" size="small">下载</el-button>
        <el-button type="text" size="small">删除</el-button>
        <el-button type="text" size="small">编辑</el-button>
    </el-table-column>
    </el-table>
  </template>
    </div>
</template>


<script>
  import axios from 'axios';
  export default {
    name: 'MyHomeFiles',
    data : function(){
      return {
        file : {},
        fileTableData : [
          {
            file_name : 'test1',
            created_at : '2021-5-18',
            file_size : '421312'

          },
        ],
        multipleSelection: []
      }
    },
    components : {},
    methods : {
      test1(){
        alert(1)
      },
      handleFileChange(event) {
      this.file = event.target.files[0];
    },
      uploadFile(e){
       const formData = new FormData;
       formData.append("file",this.file);
       axios.post('/file/upload/mp', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
          "upload_id": "1234567",
          "chunk_index" : 2,
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
        });
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
   
      },
      //通过路由规则，进入该组件时被调用
		beforeRouteEnter (to, from, next) {
      //查询用户文件
      let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "page" : 1,
    "page_size":2
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
 .el-table{
  margin-top: 5%;
 }

</style>