<template>
  <el-container class='fill-contain'>
    <side-nav></side-nav>
    <el-container>
      <el-header>
        <head-top></head-top>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import headTop from '@/components/hzztHeadTop';
  import sideNav from '@/components/hzztSideNav';
  import {manageRoute} from "./manage.route";
  import StompService from '@/service/stomp.service';

  export default {
    beforeDestroy() {
      window.onresize = null;
    },
    components: {
      headTop,
      sideNav,
    },
    async created() {
      this.userInfo();
      this.$store.commit('setMenus', manageRoute[0].children);
      this.connect();
    },
    mixins: [StompService],
    data() {
      return {};
    },
    methods: {
      userInfo() {
        try {
          const user = JSON.parse(window.sessionStorage.getItem('user'));
          if (!user?.id) {
            this.$router.replace('/login');
            return;
          }
          this.$store.commit('setUser', user);
        } catch (e) {
          this.$router.replace('/login');
        }
      }
    },
    mounted() {
      window.onresize = () => {
        this.$root.$emit('size-change');
      }
    },
  };
</script>

<style lang='scss' src="./manage.scss"></style>
