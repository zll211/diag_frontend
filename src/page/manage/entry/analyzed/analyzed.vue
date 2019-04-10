<template>
  <div class="main-analysis">
    <common-tab-header @auto-parse-json="autoParseJson" @batch-parse-json="batchParseJson()"></common-tab-header>
    <div class="slice-body flex">
      <div class="slice-table common-table">
        <el-table
          ref="pTable"
          v-loading="tableLoading"
          :data="data"
          border
          :height="tableHeight"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column fixed="left" type="selection" align="center">
          </el-table-column>
          <el-table-column v-for="(data, index) in headers"
                           :key="index"
                           :fixed="data.fixed"
                           :prop="data.prop"
                           :label="data.label"
                           :min-width="data['min-width']"
                           :align="data.align">
            <template slot-scope="scope">
              <img style="width: 80px" v-if="data.prop === 'label_img'" :src="scope.row[data.prop]">
              <span v-if="data.prop !== 'label_img'">{{scope.row[data.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right"
                           :width="400">
            <template slot-scope="scope">
              <el-button type="primary"  size="mini"
                         @click="analyzeSlide(scope.row)">重新分析
              </el-button>
              <el-button type="primary" size="mini" @click="batchParseJson(scope.row)">解析JSON
              </el-button>
              <el-button type="primary" size="mini" @click="readSlide(scope.row)">查看</el-button>
              <el-button type="primary"  size="mini"
                         @click="loadSingleJSON(scope.row)">下载JSON
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 0; width:100%;
        display: flex;justify-content:center ;height: 40px;align-items:flex-start">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.current_page"
            :page-size="pagination.per_page"
            layout="prev, pager, next, jumper"
            :total="pagination.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog class="slide-view-dialog" :fullscreen="true" :visible.sync="showFile" title="阅片"
               :close-on-press-escape="false" :show-close="false">
      <div slot="title" class="slide-dialog-header flex align-items-center justify-content-between">
        <span>阅片</span>
        <div class="close-btn" @click="showFile = false;fileName = ''">
          <img src="assets/img/close.png">
        </div>
      </div>
      <pis-slide-view :file-name="fileName"></pis-slide-view>
    </el-dialog>
  </div>
</template>

<script>
  import {entryService} from "../entry.service";
  import common from '../entry.common';

  export default {
    name: "analyzed",
    mixins: [common],
    data() {
      return {
        headers: [{
          'prop': 'name',
          'label': '切片名称',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'path',
          'label': '切片路径',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'label_img',
          'label': '切片标签图',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'label_count',
          'label': '标注数量',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'scan_time',
          'label': '扫描时间',
          'min-width': 120,
          'align': 'center',
        }],
      }
    },
    methods: {
      getSliceList({page = 1, size = 15} = {page: 1, size: 15}) {
        this.tableLoading = true;
        this.data = [];
        entryService.sliceList({status: '1', page, size}).then(({body}) => {
          if (body?.ret_code === 0) {
            this.data = body.data.list.map((item) => ({
              ...item,
              label_img: `/api/slice/get_image?file=${item.path}&type=label`,
            }));
            this.pagination = body.data.meta;
          } else {
            this.pagination = {count: 0, current_page: 1, per_page: 15};
          }
        }).finally(() => {
          this.tableLoading = false;
        })
      },
    },
  }
</script>

<style scoped>

  .main-analysis{
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 30px 34px;
  }

</style>
