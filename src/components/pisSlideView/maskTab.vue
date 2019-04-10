<template>
  <div class="mask-select">
    <el-button v-for="(cate, index) in cateList" :key="index" :type="cateIndex===index?'primary':'default'"
               size="small" @click="changeMaskIndex(index)">
      {{cate.label}}({{cate.num}})
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "maskTab",
    data() {
      return {}
    },
    props: {
      cateIndex: {
        type: Number,
        default: 0,
      },
      cateList: {
        type: Array,
        default: () => [],
      }
    },
    methods: {
      changeMaskIndex(index) {
        this.$emit('change', index);
      },
    }
  }
</script>

<style scoped lang="scss">
  .mask-select {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }
</style>
