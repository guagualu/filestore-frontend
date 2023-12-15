<template>
    <div class="page">
    <p>文件组件</p>
    <el-button type="primary" round>主要按钮</el-button>
    <template>
    <el-table
      :data="fileTableData"
      style="width: 100%"
      @row-click="test1"
      >
      <el-table-column
        prop="fileName"
        label="文件名称"
        width="800">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="上传时间"
        width="250">
      </el-table-column>
      <el-table-column
        prop="fileSize"
        label="文件大小">
      </el-table-column>
    </el-table>
  </template>
    </div>
</template>


<script>

  export default {
    name: 'MyHomeFiles',
    data : function(){
      return {
        fileTableData : [
          {
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
          }
        ]
      }
    },
    components : {},
    methods : {
      test1(){
        alert(1)
      }
    }
  }


</script>


<style scoped>
  .el-button {
  position:relative;
  left: -40%;


 }
 .el-table{
  margin-top: 5%;
 }

</style>