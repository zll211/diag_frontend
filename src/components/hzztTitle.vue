<template>
  <div class="hzzt-title flex align-items-center">
    <span class="decorative-line"></span>
    <label class="label-name"> <slot>{{label}}</slot></label>
  </div>
</template>

<script>
  export default {
    props: {
      label: ''
    },
    data() {
      return {};
    },
  }
</script>

<style scoped lang="scss">
  @import "../style/variables";
  .decorative-line {
    background: $_pm-base-color;
    height: 17px;
    margin-right: 8px;
    width: 3px;
  }
  .label-name{
    color: $_pm-default-color;
    font-size: 20px;
  }
</style>
