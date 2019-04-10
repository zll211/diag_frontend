<template>
  <div class="header-main">
    <div class="header-start" @click="modifyCollapse">
      <img src="../assets/img/navCloseIcon.png">
    </div>
    <div class="header-center">
      <div class="entry-progress" style="margin-right: 20px" v-if="isShowScanProgress&&!isShowAnalysisProgress">
        <div class="flex align-self-end align-items-center" style="width: 250px">
          <el-button type="text">扫描进度：</el-button>
          <el-progress :text-inside="true" :stroke-width="18" class="flex-1"
                       :percentage="progressScanValue"></el-progress>
        </div>
      </div>
      <div class="entry-progress flex column align-items-start" v-if="isShowParseProgress&&!isShowAnalysisProgress">
        <el-button class="parse-progress-text" type="text">
          （{{totalSliceCount}}/{{currentSliceCount}}）当前解析文件：{{kfbName}}
        </el-button>
        <div class="flex align-self-end align-items-center" style="width: 320px">
          <el-progress :text-inside="true" :stroke-width="18" class="flex-1"
                       :percentage="progressParseValue"></el-progress>
        </div>
      </div>
      <div class="entry-progress flex column align-items-start" v-if="isShowAnalysisProgress">
        <div class="flex align-self-end align-items-center" style="width: 250px">
          <el-button type="text">总共有{{progressOrganizeSum}}块组织;</el-button>
          <el-button type="text">当前正在分析第{{progressOrganizeNum}}块组织</el-button>
        </div>
      </div>
    </div>
    <div class="header-end">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="dropdown-button">
          <!--<img class="user-avatar" src="assets/img/default-avator.png"/>-->
          <span class="real-name">{{user?user.nickname:''}}</span>
          <i class="el-icon-caret-bottom drop-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import {mapState, createNamespacedHelpers} from 'vuex'
  import {loginService} from '../page/base/login/login.service';

  const moduleMapState = createNamespacedHelpers('stomp').mapState;

  export default {
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'user',
        'collapse',
      ]),
      ...moduleMapState([
        'parseJsonProgress',
        'scanSliceProgress',
        'analysisProgress',
      ]),
      isShowScanProgress() {
        return !!this.scanSliceProgress;
      },
      isShowParseProgress() {
        return !!this.parseJsonProgress;
      },
      isShowAnalysisProgress() {
        return !!this.analysisProgress;
      },
      kfbName() {
        if (this.parseJsonProgress) {
          return this.parseJsonProgress.slice;
        } else {
          return '';
        }
      },
      totalSliceCount() {
        if (this.parseJsonProgress) {
          return this.parseJsonProgress.count_slice;
        } else {
          return 0;
        }
      },
      currentSliceCount() {
        if (this.parseJsonProgress) {
          return this.parseJsonProgress.current_slice;
        } else {
          return 0;
        }
      },
      progressParseValue() {
        if (this.parseJsonProgress) {
          if (this.parseJsonProgress.current_slice === this.parseJsonProgress.count_slice && this.parseJsonProgress.completed === this.parseJsonProgress.count) {
            this.$store.commit('stomp/setParseJsonProgress', null);
            return 0;
          }
          return (this.parseJsonProgress.completed / this.parseJsonProgress.count * 100).toFixed(2) / 1;
        } else {
          return 0;
        }
      },
      progressScanValue() {
        if (this.scanSliceProgress) {
          if (this.scanSliceProgress.completed === this.scanSliceProgress.count) {
            this.$store.commit('stomp/setScanSliceProgress', null);
            return 0;
          }
          return (this.scanSliceProgress.completed / this.scanSliceProgress.count * 100).toFixed(2) / 1;
        } else {
          return 0;
        }
      },
      progressOrganizeNum() {
        if (this.analysisProgress) {
          return this.analysisProgress.organize_num;
        } else {
          return 0;
        }
      },
      progressOrganizeSum() {
        if (this.analysisProgress) {
          return this.analysisProgress.organize_sum;
        } else {
          return 0;
        }
      },
    },
    mounted() {

    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          loginService.logout()
            .then(({body}) => {
              if (body?.ret_code === 0) {
                window.sessionStorage.removeItem('accessToken');
                window.sessionStorage.removeItem('userId');
                this.$store.commit('isLogin', false);
                this.$router.replace('/login');
              } else {
                this.$message.error(body?.ret_msg || '退出失败');
              }
            }).catch(() => {
            this.$message.error('退出失败');
          });
        }
      },
      modifyCollapse() {
        this.$store.commit('setCollapse', !this.collapse);
        setTimeout(() => {
          this.$root.$emit('size-change');
        }, 300);
      },
    },

  };
</script>

<style scoped lang="scss">
  @import "../style/variables";

  .header-main {
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .header-start {
    align-items: center;
    display: flex;
    cursor: pointer;
  }

  .header-center {
    align-items: center;
    display: flex;
  }

  .header-end {
    align-items: center;
    display: flex;
    height: 68px;
  }

  .dropdown-button {
    cursor: pointer;
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 68px;
    .user-avatar {
      margin-right: 8px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .real-name {
      margin-right: 28px;
      color: $_pm-default-color;
      font-size: 14px;
    }
    .drop-bottom {
      margin-right: 8px;
      &::before {
        width: 9px;
        height: 9px;
        color: $_pm-base-color;
      }
    }
    &:hover {
      background: $_pm-default-background;
    }
  }

  .el-dropdown-menu {
    padding: 4px 0;
    .popper__arrow {
      border-width: 0 !important;
      &:after {
        border-width: 0 !important;
      }
    }
  }

  .el-popper[x-placement^="bottom"] {
    margin-top: 0;
  }

  .el-dropdown-menu__item {
    color: $_pm-default-dark-color;
    height: 42px;
    line-height: 42px;
    margin-top: 0;
    padding: 0 30px;
    &:before {
      height: 0;
    }
    &:focus {
      background-color: $_pm-base-color;
      color: #fff;
      a {
        color: #fff;
      }
    }
    &:not(.is-disabled):hover {
      background-color: $_pm-base-color;
      color: #fff;
      a {
        color: #fff;
      }
    }
    a {
      color: $_pm-default-dark-color;
    }
  }

  .entry-progress {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    .parse-progress-text {
      padding: 0;
      margin-bottom: 5px;
    }
  }
</style>
