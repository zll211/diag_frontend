<template>
  <div class="main-analysis">
    <div style="padding:30px 34px">
      <common-tab-header></common-tab-header>
    </div>
    <div v-if="fileName" class="flex-1">
      <pis-slide-view ref="analyzingKfbView" :file-name="fileName" :readonly="true"></pis-slide-view>
    </div>
    <div v-else class="no-analyzing">
      <div class="show">
        <div class="analyzing-content">
          <img src="../../../../assets/img/noanalyzing.png" alt="" width="305" height="241">
          <p class="content-first">当前没有正在分析的数据</p>
          <p class="content-second">请先到待分析表格中选择要分析的数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, createNamespacedHelpers} from 'vuex';
  import CommonTabHeader from "../commonTabHeader";
  import PisSlideView from "@/components/pisSlideView/pisSlideView";

  const moduleMapState = createNamespacedHelpers('stomp').mapState;

  export default {
    name: "analyzing",
    components: {PisSlideView, CommonTabHeader},
    data() {
      return {
        page: 1,
      }
    },
    created() {

    },
    computed: {
      ...mapState(['user']),
      ...moduleMapState([
        'isConnected',
        'analysisPath',
        'analysisAnnotation',
        'analysisProgress',
      ]),
      fileName() {
        return this.analysisPath;
      },
    },
    watch: {
      analysisPath() {
        this.page = 1;
      },
      analysisProgress(progress) {
        if (this.$refs?.analyzingKfbView) {
          if (progress) {
            const cateList = this.$refs?.analyzingKfbView.cateList;
            cateList.forEach((cate, index) => {
              if (index === 0) {
                cate.num = progress['1_num'] + progress['2_num'] + progress['3_num'] + progress['4_num'] + progress['5_num'] + progress['6_num'];
              }
              if (progress[index + '_num']) {
                cate.num = progress[index + '_num'];
              }
            });
          }
        }
      },
      analysisAnnotation(info) {
        if (this.$refs?.analyzingKfbView) {
          if (info) {
            const cateList = this.$refs.analyzingKfbView.cateList;
            cateList.forEach((cate, index) => {
              if (info?.imageData) {
                info.imageData = {
                  data: new Uint8ClampedArray(info.imageData.data),
                  width: info.imageData.width,
                  height: info.imageData.height,
                };
              }
              if (index === 0) {
                if (!cate.list.find((item) => item.id === info.id)) {
                  cate.list.push(info);
                }
              }
              if (info.category === cate.value) {
                if (!cate.list.find((item) => item.id === info.id)) {
                  cate.list.push(info);
                }
              }
            });
            const index = this.$refs.analyzingKfbView.maskIndex;
            if (index === 0 || info.category === cateList[index].value) {
              this.$refs.analyzingKfbView.setLabelImageList(cateList[index].list);
              this.$refs.analyzingKfbView.switchPicture(info.id, false);
            }
          }
        }
      },
    },
    mounted() {

    },
    methods: {},
    beforeDestroy() {

    }
  }
</script>

<style scoped lang="scss">

  .main-analysis {
    display: flex;
    flex-direction: column;
    height: 100%;
    .no-analyzing {
      flex: 1;
      .show {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .analyzing-content {
          text-align: center;
          margin-top: -150px;
          .content-first {
            margin-top: 25px;
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(137, 147, 168, 1);
            line-height: 22px;
          }
          .content-second {
            margin-top: 5px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(137, 147, 168, 1);
            line-height: 20px;
          }
        }
      }
    }
    @media screen and (max-height: 800px) {
      .no-analyzing {
        .show {
          .content {
            margin-top: -50px;
          }
        }
      }
    }

  }

</style>
