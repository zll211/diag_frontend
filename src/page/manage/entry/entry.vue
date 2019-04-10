<template>
  <div class="main-container entry-main">
    <router-view></router-view>
  </div>
</template>

<script>

  import {baseUrl} from '@/config/utils';

  export default {
    data() {
      return {

      }
    },
    mounted() {

    },
  }
</script>

<style scoped lang="scss">
  .upload-file {
    position: absolute;
    left: 0;
    right: 0;
    height: 28px;
    width: 88px;
    visibility: hidden;
  }
  .entry-main{
    padding: 0;
  }

</style>
