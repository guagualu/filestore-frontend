<template>
    <div class="page">
    <p>回收站组件</p>
    <el-button class = "multiDelete" @click="multirealDelete"  type="primary" round>批量删除</el-button>
    <el-button class = "multiRecover" @click="multiRecover"   type="primary" round>批量恢复</el-button>
    <template>
    <el-table
      :data="fileTableData"
      style="width: 100%"
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
        prop="deleted_at"
        label="删除时间"
        width="250">
      </el-table-column>
      <el-table-column
        prop="file_size"
        label="文件大小"
        width = "100">
      </el-table-column>
      <el-table-column
      fixed = "right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="recover(scope.$index,scope.row)" type="text" size="small">恢复</el-button>
        <el-button @click="realDelete(scope.$index,scope.row)" type="text" size="small">彻底删除</el-button>
      </template>
    </el-table-column>
    </el-table>
  </template>
  <div class="block">
       <el-pagination
          layout="prev, pager, next"
          :total="filesTotal"
          :page-size="10"
          @current-change = "handleCurrentChange"
          >
        </el-pagination>
</div>
    </div>
</template>


<script>
import axios from 'axios';
  export default {
    name: 'MyRecycleBin',
    data : function(){
      return {
        fileTableData : [{
            file_id : 0,
            file_name : 'test1',
            deleted_at : '2021-5-18',
            file_size : '421312'
          }],
        multipleSelection: [],
        rowStyle : {
        'background-color': 'aqua',
      },
      filesTotal :50,
      }
    },
    components : {},
    methods :{
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            //切换行的选中状态
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
  handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        //查询用户文件
      let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "page" : val,
    "page_size":10
}     
       let vc = this;
			axios.post('/uf/clash/list', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
            vc.fileTableData = response.data.data.file_list;
            vc.filesTotal = response.data.data.count;

        })
        .catch(error => {
          console.error(error);
          // 处理上传失败的逻辑
        });
      },
      recover(index,row){
        let formData = {
          "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
          "file_ids" : [this.fileTableData[index].file_id]
                       }  
       let vc = this;
			axios.post('/uf/clash/recover', formData,{
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
      realDelete(index,row){
        let formData = {
          "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
          "file_ids" : [this.fileTableData[index].file_id]
                       }  
       let vc = this;
			axios.post('/uf/clash/delete', formData,{
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
      multirealDelete(){
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
			axios.post('/uf/clash/delete', formData,{
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
      multiRecover(){
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
			axios.post('/uf/clash/recover', formData,{
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
      
},
     //通过路由规则，进入该组件时被调用
		beforeRouteEnter (to, from, next) {
      //查询用户文件
      let formData = {
    "user_uuid" : "41e32018-8fd1-41f3-8b6a-d5ec340362ab",
    "page" : 1,
    "page_size":10
}
			axios.post('/uf/clash/list', formData,{
        headers : {
          "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyVXVpZCI6IjQxZTMyMDE4LThmZDEtNDFmMy04YjZhLWQ1ZWMzNDAzNjJhYiIsImlzcyI6Imd1YSJ9.kW_8yBnhAiVmoyIquHFPymo4s_wxH8dC9LXZvUsTWsg",
        }
       })
        .then(response => {
          // 写入fileTableData
          next(vm => {
            // 在这里可以访问组件实例 vm
            console.log(response.data.data.file_list);
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
 .multiRestore {
  float: right;
  margin-right: 10px;
 }
</style>