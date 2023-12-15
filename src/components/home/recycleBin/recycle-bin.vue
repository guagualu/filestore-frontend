<template>
    <div class="page">
    <p>回收站组件</p>
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
        prop="deletedTime"
        label="删除时间"
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
    name: 'MyRecycleBin',
    data : function(){
      return {
        fileTableData : []
      }
    },
    components : {}
  }


</script>


<style>

</style>