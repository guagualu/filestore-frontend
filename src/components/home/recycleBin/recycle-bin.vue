<template>
    <div class="page">
    <p>回收站组件</p>
    <el-button class = "uploadFiles" type="primary" round>上传文件</el-button>
    <el-button class = "multiDelete"   type="primary" round>批量删除</el-button>
    <el-button class = "multiRestore"   type="primary" round>批量恢复</el-button>
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
        prop="fileName"
        label="文件名称"
        width="800">
      </el-table-column>
      <el-table-column
        prop="deletedTime"
        label="删除时间"
        width="250">
      </el-table-column>
      <el-table-column
        prop="fileSize"
        label="文件大小"
        width = "100">
      </el-table-column>
      <el-table-column
      fixed = "right"
      label="操作"
      width="100">
        <el-button @click="" type="text" size="small">恢复</el-button>
        <el-button type="text" size="small">彻底删除</el-button>
    </el-table-column>
    </el-table>
  </template>
    </div>
</template>


<script>
  export default {
    name: 'MyRecycleBin',
    data : function(){
      return {
        fileTableData : [{
            fileName : 'test1',
            updateTime : '2021-5-18',
            fileSize : '421312'

          },
          {
            fileName : 'test2',
            updateTime : '2021-5-18',
            fileSize : '421312'
          },
          {
            fileName : 'test3',
            updateTime : '2021-5-18',
            fileSize : '421312'
          }],
        multipleSelection: []
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
  }
    }
   
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