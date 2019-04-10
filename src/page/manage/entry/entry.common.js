import CommonTabHeader from "./commonTabHeader";
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import {entryService} from "./entry.service";
import {mapState, createNamespacedHelpers} from 'vuex';

const moduleMapState = createNamespacedHelpers('stomp').mapState;
export default {
  components: {CommonTabHeader, pisSlideView},
  computed: {
    ...mapState(['user']),
    ...moduleMapState([
      'isConnected',
      'analysisPath',
    ]),
  },
  data() {
    return {
      data: [],
      multipleSelection: [],
      pagination: {count: 0, current_page: 1, per_page: 15},
      tableHeight: '100%',
      tableLoading: false,
      fileName: '',
      showFile: false,
    };
  },
  mounted() {
    this.getSliceList();
    this.$root.$on('refresh-list', () => this.getSliceList({
      page: this.pagination.current_page,
      size: this.pagination.per_page
    }));
  },
  beforeDestroy() {
    this.$off('refreshList');
  },
  methods: {
    handleSelectionChange(list) {
      this.multipleSelection = list.concat();
    },
    handleCurrentChange(page) {
      this.getSliceList({page});
    },
    readSlide(row) {
      this.fileName = row.path;
      this.showFile = true;
    },
    batchParseJson(row) {
      if (!this.isConnected) {
        this.$notify.warning({
          title: '警告',
          message: 'stomp未连接，无法进行通讯',
        });
        return;
      }
      if (!row && this.multipleSelection.length === 0) {
        this.$message.warning('请选择需解析的数据');
        return;
      }
      const queue = `mask_${this.user.username}_parse_json`;
      const params = {
        slice_ids: row ? [row.id] : this.multipleSelection.map((item) => item.id),
        queue: queue,
      };
      entryService.batchParseJson(params)
        .then(({body}) => {
          if (body?.ret_code === 0) {
            if (body.data.count === 0) {
              this.$message.success('暂无可解析的json文件');
            } else {
              this.$message.success(body?.ret_msg || 'json解析成功');
            }
          } else {
            this.$message.error(body?.ret_msg || '切片解析失败');
          }
        }).catch((e) => {
        this.$message.error('切片解析失败');
      })
    },
    autoParseJson() {
      if (!this.isConnected) {
        this.$notify.warning({
          title: '警告',
          message: 'stomp未连接，无法进行通讯',
        });
        return;
      }
      const queue = `mask_${this.user.username}_parse_json`;
      entryService.autoParseJson({queue, status: this.activeTabName})
        .then(({body}) => {
          if (body?.ret_code === 0) {
            if (body.data.count === 0) {
              this.$message.success('暂无可解析的json文件');
            } else {
              this.$message.success(body?.ret_msg || 'json解析成功');
            }
          } else {
            this.$message.error(body?.ret_msg || '切片解析失败');
          }
        }).catch((e) => {
        this.$message.error('切片解析失败');
      })
    },
    analyzeSlide(row) {
      if (!row && this.multipleSelection.length === 0) {
        this.$message.warning('请选择需分析的数据');
        return;
      }
      const params = {
        slice_ids: row ? [row.id] : this.multipleSelection.map((item) => item.id),
      };
      entryService.analyzeSlide(params)
        .then(({body}) => {
          if (body?.ret_code === 0) {
            if (!this.analysisPath) {
              this.$store.commit('stomp/setAnalysisPath', row.path);
            }
            this.$router.push(('/entry/analyzing'));
          } else {
            this.$message.error('分析失败');
          }
        }).catch(() => {
        this.$message.error('分析失败');
      })
    },
    loadPicture(row) {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', row.path || row.filepath);
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', (row.name || row.filename));
      anchor.click();
    },
    loadSingleJSON(row) {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', (row.path).replace('.kfb', '.json'));
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', (row.name).replace('.kfb', '.json'));
      anchor.click();
    },
    uploadJSON({file, data}) {
      const formData = new FormData();
      formData.append('slice_id', data.id);
      // console.log(file);
      formData.append('annotation', file);
      entryService.uploadJson(formData)
        .then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success(body?.ret_msg || '上传json成功');
          } else {
            this.$message.error(body?.ret_msg || '上传json失败');
          }
        })
    },
    loadJSON() {
      let params = {
        slice_ids: this.multipleSelection.length > 0 ? this.multipleSelection.map((item) => item.id) : undefined,
      };
      entryService.downloadJSON(params)
        .then(({body}) => {
          if (body?.ret_code === 0) {
            let anchor = document.createElement('a');
            anchor.setAttribute('href', body.path);
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('download', new Date().getTime() + '.json.zip');
            anchor.click();
          } else {
            this.$message.error(body?.ret_msg || '下载失败');
          }
        }).catch(() => {
        this.$message.error('下载失败');
      })
    },
  }
}
