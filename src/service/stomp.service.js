import Stomp from 'stompjs';
import {STOMP_HEADERS, STOMP_SERVICE} from "../config/utils";
import {mapState} from "vuex";

export default {
  name: 'stomp',
  data() {
    return {
      // client: Stomp.over(new SockJS(STOMP_SERVICE)),
      client: null,
      subscriptions: [],
      clearTimeId: null,
      count: 0, // 记录重连次数
    }
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    this.$store.commit('stomp/setScanSliceProgress', null);
    this.$store.commit('stomp/setParseJsonProgress', null);
  },
  methods: {
    onConnected(frame) {
      this.$notify.success({
        title: '成功',
        message: 'stomp连接成功',
      });
      this.count = 0;
      this.$store.commit('stomp/setConnected', true);
      const parseQueue = `/topic/mask_${this.user.username}_parse_json`;
      const scanQueue = `/topic/mask_${this.user.username}_scan_slice`;
      this.subscribeProgress(parseQueue, 'parse_json');
      this.subscribeProgress(scanQueue, 'scan_slice');
      this.subscribeProgress('/topic/kidney_diag_analyze', 'kidney_diag_analyze');

    },
    onFailed(frame) {
      this.$store.commit('stomp/setConnected', false);
      this.delayedTrigger(() => this.reconnection(), 5000);
    },
    disconnect(msg) {
      this.client.disconnect(() => {
        if (msg) {
          this.$message.error(msg);
        }
      })
    },
    connect() {
      const headers = {
        login: 'hzzt',
        passcode: 'hzztrbq@2018',
      };
      this.client = Stomp.client(STOMP_SERVICE);
      this.client.debug = false;
      this.client.connect(STOMP_HEADERS, this.onConnected, this.onFailed);
      this.$store.commit('stomp/setClient', this.client);
    },
    reconnection() {
      if (this.count === 0) {
        this.$notify.info({
          title: '消息',
          message: 'stomp连接失败，正在尝试重连中...',
        });
        this.connect();
        this.count++;
      } else if (this.count < 5) {
        this.$notify.info({
          title: '消息',
          message: `重连stomp失败，正在进行第${this.count + 1}次重连`,
        });
        this.connect();
        this.count++;
      } else if (this.count >= 5) {
        this.$notify.error({
          title: '失败',
          message: `stomp连接失败，无法进行通讯`,
        });
      }
    },
    subscribeProgress(url, type) {
      this.subscriptions.push(this.client.subscribe(url, (msg) => {
        // console.log(msg.body);
        const body = JSON.parse(msg.body);
        if (type === 'parse_json') {
          this.$store.commit('stomp/setParseJsonProgress', body);
          this.delayedTrigger(() => this.$root.$emit('refresh-list'));
        }
        if (type === 'scan_slice') {
          this.$store.commit('stomp/setScanSliceProgress', body);
          this.delayedTrigger(() => this.$root.$emit('refresh-list'));
        }
        if (type === 'kidney_diag_analyze') {
          if (body.type === 'progress') {
            this.$store.commit('stomp/setAnalysisProgress', JSON.parse(body.progress));
            this.$store.commit('stomp/setAnalysisPath', body.path);
          } else if (body.type === 'annotation') {
            this.$store.commit('stomp/setAnalysisAnnotation', JSON.parse(body.annotation));
            this.$store.commit('stomp/setAnalysisPath', body.path);
          } else if (body.type === 'mean') {
            this.$store.commit('stomp/setAnalysisProgress', null);
            this.$store.commit('stomp/setAnalysisAnnotation', null);
            this.$store.commit('stomp/setAnalysisPath', '');
          }

        }
      }))
    },
    delayedTrigger(callback, time = 1000) {
      if (this.clearTimeId) {
        clearTimeout(this.clearTimeId);
        this.clearTimeId = null;
      } else if (!this.clearTimeId) {
        callback();
      }
      this.clearTimeId = setTimeout(callback, time);
    }
  },
  beforeDestroy() {
    while (this.subscriptions.length > 0) {
      const sub = this.subscriptions.shift();
      sub.unsubscribe();
    }
    this.$store.commit('stomp/setParseJsonProgress', null);
    this.$store.commit('stomp/setScanSliceProgress', null);
    this.disconnect();
  }
}
