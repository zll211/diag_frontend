<template>
  <aside class="el-aside" :class="{'close-side': collapse}">
    <div class="side-top">
      <img class="circle" src="../assets/img/icon.png"/>
      <span v-show="!collapse">肾脏病理辅助诊断平台</span>
    </div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical"
      :unique-opened="true"
      background-color="#0E1935"
      text-color="#dadada"
      active-text-color="#ffffff"
      :collapse="collapse"
      :router="true">
      <div class="side-menu">
        <div v-for="(menu, index) in menuList" :key="index">
          <el-menu-item :class="{'is-active': !!~$route.path.indexOf(menu.path)}"
            v-if="menu.children&&menu.children.length ===0"
            :index="menu.path" class="single-nav">
            <!-- <i class="el-icon-menu"></i>-->
            <i><img :src="menu.icon" alt="" width="16"></i>
            <span style="margin-left: 20px" slot="title">{{menu.name}}</span>
          </el-menu-item>
          <el-submenu
            v-if="menu.children&&menu.children.length >0"
            :index="index+''">
            <template slot="title">
              <!--<i class="el-icon-caret-right"></i>-->
              <i><img :src="menu.icon" alt="" width="16"></i>
              <span style="margin-left: 20px" slot="title">{{menu.name}}</span>
            </template>
            <el-menu-item
              :class="{'is-active': !!~$route.path.indexOf(menu.path)}"
              :index="menu.path+'/'+child.path"
              v-for="(child, index1) in menu.children" :key="index1">
              <i><img :src="child.icon" alt="" width="14"></i>
              <span style="margin-left: 20px">{{child.name}}</span>
            </el-menu-item>
          </el-submenu>
        </div>
      </div>
    </el-menu>
  </aside>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data() {
      return {}
    },
    created() {
    },
    computed: {
      ...mapState([
        'menus',
        'collapse',
        'user'
      ]),
      menuList() {
        return this.filterShowItem(this.menus);
      },
    },
    methods: {
      filterShowItem(list) {
        return list.filter((item) => {
          if (item.show === false) return false;
          else {
            if (item.children?.length > 0) {
              item.children = this.filterShowItem(item.children);
            }
            return true;
          }
        })
      }
    },
  }
</script>

<style lang="scss">
  @import "../style/variables";

  .el-aside {
    display: flex;
    flex-direction: column;
    background: #0E1935;
    &.close-side {
      .side-top {
        width: 50px;
        transition: width linear .3s;
      }
    }
    .side-top {
      height: 68px;
      width: 210px;
      background: $_pm-base-color;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #FFFFFF;
      line-height: 1;
      margin-bottom: 30px;
      transition: width linear .3s;
      .circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        & + span {
          margin-left: 9px;
        }
      }
    }
    .side-menu {
      font-size: 16px;
    }
    .el-menu {
      border-right: none;
      .single-nav {
        .el-tooltip {
          display: flex !important;;
          align-items: center;
          justify-content: center;
          &:hover {
            background-color: $_pm-base-color !important;
          }
        }
        [class^="el-icon-"] {
          margin-right: 0;
        }
      }
    }
    .el-submenu__title {
      height: 43px;
      line-height: 43px;
      font-size: 16px;
      display: flex;
      align-items: center;
    }
    .el-menu-vertical:not(.el-menu--collapse) {
      width: 210px;
      /*min-height: 800px;*/
      flex: 1;
    }
    .el-menu--collapse {
      width: 50px;
      height: 100%;
      .el-submenu {
        & > .el-submenu__title {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
          span {
            display: none;
          }
          &:hover {
            & > .el-submenu__title {
              background-color: $_pm-base-color !important;
            }
            i {
              color: #fff !important;
            }
            background-color: $_pm-base-color !important;
          }
        }
        &.is-active {
          & > .el-submenu__title {
            background-color: $_pm-base-color !important;
          }
          i {
            color: #fff !important;
          }
        }
      }
    }
    .el-submenu {
      .el-menu-item {
        height: 43px;
        line-height: 43px;
        min-width: 210px;
        font-size: 14px;
        padding: 0 30px !important;
        &.is-active {
          background-color: $_pm-base-color !important;
        }
        &:hover {
          background-color: $_pm-base-color !important;
        }
      }
    }
  }

  .el-menu-item {
    height: 43px;
    line-height: 43px;
    font-size: 16px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: $_pm-base-color !important;
    }
    &.is-active {
      background-color: $_pm-base-color !important;
      i {
        color: #fff !important;
      }
    }
  }
</style>
