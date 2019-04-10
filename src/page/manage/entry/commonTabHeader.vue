<template>
  <div class="common-table" style="padding: 5px 25px;margin-top: 0">
    <div class="common-table-header flex justify-content-between align-items-center"
         style="width: 100%;">
      <el-tabs v-model="activeTabName" @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label"
                     :name="tab.name">
        </el-tab-pane>
      </el-tabs>
      <div>
        <el-button type="primary" v-if="activeTabName==='/entry/unanalyzed'" size="small" @click="autoScan">自动扫描
        </el-button>
        <el-button type="primary" v-if="activeTabName!=='/entry/analyzing'" size="small" @click="batchParseJson()">
          批量解析JSON数据
        </el-button>
        <el-button type="primary" v-if="activeTabName!=='/entry/analyzing'" size="small" @click="autoParseJson">
          自动解析JSON数据
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "commonTabHeader",
    data() {
      return {
        activeTabName: this.$route.path,
        tabList: [{
          label: '已分析',
          name: '/entry/analyzed',
        }, {
          label: '分析中',
          name: '/entry/analyzing',
        }, {
          label: '未分析',
          name: '/entry/unanalyzed',
        }],
      }
    },
    methods: {
      handleClick(tab) {
        this.$router.push(tab.name);
      },
      autoScan() {
        this.$emit('auto-scan');
      },
      batchParseJson(row) {
        this.$emit('batch-parse-json');
      },
      autoParseJson() {
        this.$emit('auto-parse-json');
      },
    }
  }
</script>

<style lang="scss">

</style>
