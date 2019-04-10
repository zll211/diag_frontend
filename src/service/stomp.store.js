export const stompModule = {
  namespaced: true,
  state: {
    client: null,
    isConnected: false,
    parseJsonProgress: null,
    scanSliceProgress: null,
    analysisAnnotation: null,
    analysisProgress: null,
    analysisPath: '',
  },
  mutations: {
    setClient(state, client) {
      state.client = client;
    },
    setConnected(state, status) {
      state.isConnected = status;
    },
    setParseJsonProgress(state, info) {
      state.parseJsonProgress = info;
    },
    setScanSliceProgress(state, info) {
      state.scanSliceProgress = info;
    },
    setAnalysisAnnotation(state, info) {
      state.analysisAnnotation = info;
    },
    setAnalysisProgress(state, info) {
      state.analysisProgress = info;
    },
    setAnalysisPath(state, path) {
      state.analysisPath = path;
    }
  },

  getters: {}
};
