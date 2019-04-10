<template>
  <div class="pis-slide-view">
    <mask-tab :cate-index="maskIndex" :cate-list="cateList" @change="changeMaskIndex"></mask-tab>
    <label-info :info-list="infoList"></label-info>
    <el-dialog width="500px" :title="title" :visible.sync="labelChangeView"
               :before-close="closeLabelDialog"
               append-to-body>
      <el-form :model="labelForm" ref="labelForm" label-position="left">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" label-width="40px" prop="name">
              <el-select v-if="labelType === 'edit'" size="small"
                         v-model="labelForm.name"
                         placeholder="请选择名称" style="width: 100%"
                         @change="selectLabelChange">
                <el-option
                  v-for="(name,index) in labelNameList"
                  :key="index"
                  :label="name"
                  :value="name">
                </el-option>
              </el-select>
              <!--<el-button type="text" size="small" v-if="labelType === 'edit'">{{labelForm.name}}</el-button>-->
              <el-input v-if="labelType === 'add'" size="small"
                        v-model="labelForm.name"></el-input>
            </el-form-item>
          </el-col>
          <!--<el-col :span="24" v-if="labelType === 'edit'">
            <el-form-item label="操作" label-width="40px" prop="name">
              <div class="flex align-items-center" style="height: 40px">
                <hzzt-icon
                  :icon-src="deleteImg"
                  @icon-click="deleteLabel(labelForm.id)"
                  icon-text='删除'></hzzt-icon>
                <hzzt-icon
                  :icon-src="hideImg"
                  @icon-click="hideLabel(labelForm.id, !labelForm.show)">
                  <span
                    slot="iconText">{{labelForm.show===false?'显示': '隐藏'}}</span>
                </hzzt-icon>
                <hzzt-icon
                  :icon-src="hideAllImg"
                  @icon-click="hideAllLabel(!showAllLabel)">
                  <span slot="iconText">{{!showAllLabel?'全部显示': '全部隐藏'}}</span>
                </hzzt-icon>
              </div>
            </el-form-item>
          </el-col>-->
          <el-col :span="10" v-if="labelForm.type!=='Mask'">
            <el-form-item label="线宽" label-width="40px">
              <el-select style="width: 150px" size="small"
                         v-model="labelForm.width"
                         placeholder="请选择线宽"
                         filterable
                         allow-create
                         default-first-option>
                <el-option
                  v-for="(lineWidth,index) in lineWidthList"
                  :key="index"
                  :label="lineWidth"
                  :value="lineWidth">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :push="4" v-if="labelForm.type!=='Mask'">
            <el-form-item label="颜色" label-width="40px">
              <div class="flex align-items-center">
                <span style="margin-right: 10px">{{labelForm.color}}</span>
                <el-color-picker v-model="labelForm.color"
                                 size="small"></el-color-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-if="labelForm.type === 'Rectangle'">
            <el-form-item label="长度" label-width="40px">
              <el-input size="small" v-model="labelForm.rectWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :push="4" v-if="labelForm.type === 'Rectangle'">
            <el-form-item label="宽度" label-width="40px">
              <el-input size="small" v-model="labelForm.rectHeight"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="labelForm.type!=='Mask'">
            <el-form-item label="描述" label-width="40px">
              <el-input size="small" type="textarea" v-model="labelForm.description"
                        :autosize="{ minRows: 3, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
             <el-form-item label="定位图标" label-width="80px">
               <el-radio-group
                 class="flex align-items-center justify-content-between"
                 v-model="labelForm.pin">
                 &lt;!&ndash;<el-radio label="1" class="flex align-items-center">
                   <img class="pin-img" src="kfb-view/src/assets/img/pin_1.png">
                 </el-radio>
                 <el-radio label="2" class="flex align-items-center">
                   <img class="pin-img" src="./kfbView/assets/img/pin_2.png">
                 </el-radio>
                 <el-radio label="3" class="flex align-items-center">
                   <img class="pin-img" src="./kfbView/assets/img/pin_3.png">
                 </el-radio>
                 <el-radio label="4" class="flex align-items-center">
                   <img class="pin-img" src="./kfbView/assets/img/pin_4.png">
                 </el-radio>&ndash;&gt;
               </el-radio-group>
             </el-form-item>
           </el-col>-->
          <el-col :span="24" v-if="labelType==='edit'&&labelForm.type!=='Mask'">
            <el-form-item label="测量信息" label-width="80px">
              <div v-for="(info,index) in infoList" :key="index" class="text item">
                <span>{{info}}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeLabelDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="saveLabelChange()" size="small">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog class="image-info" width="600px" title="图像信息"
               :visible.sync="imageInfoView"
               append-to-body>
      <el-form label-position="left" label-width="100px">
        <el-form-item label="文件名">
          <span class="flex-1">{{imageInfo.fileName}}</span>
        </el-form-item>
        <el-form-item label="图像像素">
          <span class="flex-1">{{imageInfo.width}}Pixel - {{imageInfo.height}}Pixel</span>
        </el-form-item>
        <el-form-item label="扫描倍率">
          <span class="flex-1">{{imageInfo.scanScale|| '无'}}</span>
        </el-form-item>
        <el-form-item label="扫描时刻">
          <span class="flex-1">{{imageInfo.scanTime}}</span>
        </el-form-item>
        <el-form-item label="扫描时间">
          <span class="flex-1">{{imageInfo.scanDuration||0}}ms</span>
        </el-form-item>
        <el-form-item label="预览图" label-position="top">
        </el-form-item>
        <el-form-item class="flex" label-width="0px">
          <img class="preview-img flex-1" style="width: 180px" alt="预览图图片"
               :src="imageInfo.labelImg">
          <img class="preview-img flex-1" alt="预览图图片"
               :src="imageInfo.previewImg">
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--<div class="file-change flex column" v-if="fileNameList.length>1">
      <el-button type="primary" size="small" class="last-btn" :disabled="fileIndex===0" @click="lastFile">上一例
      </el-button>
      <el-button type="primary" size="small" class="next-btn" :disabled="fileIndex===fileNameList.length-1"
                 @click="nextFile">下一例
      </el-button>
    </div>-->
    <image-label-list ref="imageLabelList" :image-list="labelImage" @switch-picture="switchPicture"></image-label-list>
  </div>
</template>

<script>
  import {pisSlideViewService} from './pisSlideView.service';
  import imageLabelList from './imageLabelList';
  import {baseUrl, slideViewUrl} from '@/config/utils';
  import {mapState} from 'vuex';
  import {formatDateTime, encodeQueryData} from '../../config/utils';
  import hzztIcon from '../hzztIcon';
  import KfbView from 'kfb-view';

  /*import deleteImg from 'kfb-view/src/assets/img/dialog/delete.png';
  import hideImg from 'kfb-view/src/assets/img/dialog/hide.png';
  import hideAllImg from 'kfb-view/src/assets/img/dialog/allhide.png';*/
  import MaskTab from "./maskTab";
  import LabelInfo from "./labelInfo";

  export default {
    name: 'pisSlideView',
    components: {LabelInfo, MaskTab, hzztIcon, imageLabelList},
    data() {
      return {
        kfbView: {},
        labelChangeView: false,
        labelImage: [],
        innerLabelImage: [],
        imageInfoView: false,
        title: '',
        labelForm: {
          width: 2, color: '#0000FF',
          pin: '1', description: '',
          name: '', type: '',
          rectWidth: 0, rectHeight: 0,
        },
        labelNameList: [],
        lineWidthList: [1, 2, 5, 8, 10],
        labelType: 'add',
        imageInfo: {},
        /*deleteImg: deleteImg,
        hideImg: hideImg,
        hideAllImg: hideAllImg,*/
        showAllLabel: true,
        maskIndex: 1,
        page: 1,
        cateList: [{
          value: -1,
          label: '全部',
          color: '#0000ff',
          num: 0,
          list: [],
          page: 1,
        }, {
          value: 1,
          label: '毛细血管袢',
          color: '#0000ff7d',
          num: 0,
          list: [],
          page: 1,
        }, {
          value: 2,
          label: '肾小球',
          color: '#00ff007d',
          num: 0,
          list: [],
          page: 1,
        }, {
          value: 3,
          label: '近曲小管',
          color: '#ff00007d',
          num: 0,
          list: [],
          page: 1,
        }, {
          value: 4,
          label: '远曲小管',
          color: '#ffff007d',
          num: 0,
          list: [],
          page: 1,
        }, {
          value: 5,
          label: '小动脉',
          color: '#ff00ff7d',
          num: 0,
          list: [],
          page: 1,
        }, {
          value: 6,
          label: '新月体',
          color: '#00ffff7d',
          num: 0,
          list: [],
          page: 1,
        }, {
          value: 0,
          label: '其他',
          color: '#0000ff',
          num: 0,
          list: [],
          page: 1,
        }],
        infoList: [],
        infoListObj: {},
        imageCapRes: 1,
      };
    },
    props: {
      fileName: '',
      readonly: false,
    },
    computed: {
      ...mapState([
        'collapse',
      ]),
      maskValue() {
        return this.cateList[this.maskIndex].value;
      },
    },
    watch: {
      fileName(val) {
        if (val) {
          this.viewDestroy();
          setTimeout(() => {
            this.init();
          }, 100);
        }
      }
    },
    created() {
    },
    async mounted() {
      this.init();
    },
    methods: {
      async init() {
        if (!this.fileName) {
          this.$message.error('暂无kfb图像');
          return;
        }
        try {
          await this.initSlideView();
          this.cateList.forEach((item) => {
            item.list = [];
            item.num = 0;
          });
          await this.labelCount();
          await this.getOtherLabel();
          this.drawLabelList({
            path: this.fileName,
            cate: this.maskValue === -1 ? undefined : this.maskValue,
            page: this.cateList[this.maskIndex].page,
            page_size: 40,
          });
          // this.changeMaskIndex(this.maskIndex);
          this.drawPointList();
          this.onPointListChange();
          this.onLabelChange();
          this.onSelectLabel();
          this.onMeasureChange();
          // this.onScreenShotImageChange();
          this.onShowImageInfo();
          this.labelAverageInfo();
          this.$root.$on('size-change', this.resize);
        } catch (e) {
          console.error(e);
          this.$message.error('读取图像信息失败');
        }
      },
      viewDestroy() {
        this.$root.$off('size-change', this.resize);
        if (this.kfbView?.destroy) {
          this.kfbView.destroy();
        }
        this.kfbView = null;
      },
      resize() {
        if (this.kfbView?.resizeViewContainer) {
          this.kfbView.resizeViewContainer({
            width: this.$el.getBoundingClientRect().width,
            height: this.$el.getBoundingClientRect().height,
          });
        }
      },
      async initSlideView() {
        const {body} = await pisSlideViewService.getImageInfo(this.fileName);
        this.imageInfo = body;
        this.imageCapRes = body.imageCapRes || 1;
        this.imageInfo.scanTime = body.scanTime && formatDateTime(new Date(body.scanTime*1000));
        this.imageInfo.fileName = this.fileName;
        this.imageInfo.previewImg = `${baseUrl}/slice/get_image?file=${this.fileName}&type=preview`;
        this.imageInfo.labelImg = `${baseUrl}/slice/get_image?file=${this.fileName}&type=label`;
        let params = {};
        params.file = this.fileName;
        this.kfbView = new KfbView({
          el: this.$el,
          fileName: this.fileName,
          thumbnail: `${baseUrl}/slice/get_image?file=${this.fileName}&type=thumbnail`,
          // width: window.innerWidth - 181,
          height: this.$el.getBoundingClientRect().height,
          scale: body.scanScale,
          control: {
            style: 'bottom: 90px; right: 20px',
          },
          toolbox: {
            show: !this.readonly,
            style: 'top: 0;left: 0',
          },
          viewerScale: {
            show: true,
            imageCapRes: body.imageCapRes,
            style: 'bottom: 10px; left: 250px',
          },
          showBoard: !this.readonly,
          showMenu: !this.readonly,
          openSeadragonOptions: {
            maxZoomLevel: body.scanScale * 2,
            tileSources: {
              height: body.height,
              width: body.width,
              tileSize: 256,
              minLevel: 10,
              getTileUrl(level, x, y) {
                params.x = x;
                params.y = y;
                if (body.fileNum == level) {
                  level = body.scanScale;
                  params.scale = level.toFixed(6);
                } else {
                  level = body.scanScale / Math.pow(2, body.fileNum - level);
                  params.scale = level.toFixed(6);
                  level = body.ratiomap[level.toFixed(6)];
                  if (level === undefined) {
                    level = 0;
                  }
                }
                params.level = level;
                // return 'http://192.168.1.29:8011/api/slide/view?'+ encodeQueryData(params) ;
                return `/image.php?${encodeQueryData(params)}`;
                //${slideViewUrl}
              },
            },
          },
        });
        if (this.kfbView?.board) {
          this.kfbView.board.setMaskParams(20, this.cateList[this.maskIndex].color);
          this.kfbView.board.clearCanvas();
        }
      },
      labelCount() {
        return pisSlideViewService.labelCount(this.fileName)
          .then(({body}) => {
            if (Array.isArray(body)) {
              this.cateList.forEach((cate) => {
                cate.num = body.find((item) => item.cate / 1 === cate.value)?.count / 1 || 0;
              })
            }
          });
      },
      getOtherLabel() {
        return pisSlideViewService.labelList({
          path: this.fileName,
          cate: 0,
          page: 1,
          page_size: 100,
        }).then(({body}) => {
          this.cateList[this.cateList.length - 1].list = body.list.map((item) => JSON.parse(item.annotation));
        });
      },
      drawPointList() {
        return pisSlideViewService.navigatorPointList(this.fileName)
          .then((res) => {
            this.kfbView.navigator.drawPointList(res.data.data);
          });
      },
      drawLabelList(params) {
        return pisSlideViewService.labelList(params).then(({body}) => {
          if (params.cate !== this.maskValue && this.maskValue !== -1 ||
            (this.maskValue === -1 && params.cate !== undefined)) return;
          if (body.meta.has_more_pages && this.kfbView) {
            this.drawLabelList({
              path: this.fileName,
              cate: this.maskValue === -1 ? undefined : this.maskValue,
              page: ++this.cateList[this.maskIndex].page,
              page_size: 40,
            });
          }
          this.initLabelList([...this.cateList[this.maskIndex]?.list || [], ...body.list.map((item) => JSON.parse(item.annotation))]);
          if (!body.meta.has_more_pages) {
            this.$message.success(`${this.cateList[this.maskIndex].label}标注已加载完成`);
            if (this.maskIndex === 0) {
              this.cateList.forEach((cate, index) => {
                if (index === 0) return;
                this.cateList[index].list = this.cateList[0].list.filter((item) => item.category == cate.value);
              })
            }
          }
        });
      },
      labelAverageInfo() {
        pisSlideViewService.labelAverageInfo(this.fileName)
          .then(({body}) => {
            this.infoListObj = body;
            const item = this.infoListObj[`${this.maskValue}`];
            if (!item) {
              this.infoList = [];
            } else {
              this.setCateInfo(this.maskValue, item, 'mean');
            }
          }).catch(() => {
          this.infoList = [];
        });
      },
      changeMaskIndex(index = 0) {
        if (this.maskIndex === index) return;
        this.maskIndex = index;
        if (this.kfbView?.board) {
          this.kfbView.board.setMaskParams(20, this.cateList[this.maskIndex].color);
          this.kfbView.board.clearCanvas();
        }
        if (this.kfbView?.paint) {
          this.kfbView.paint.resetInit();
        }
        this.$refs.imageLabelList.resetIndexData(0);
        if (this.cateList[index].num === this.cateList[index].list.length && this.cateList[index].num !== 0) {
          this.setLabelImageList(this.cateList[index].list);
          return;
        }
        this.setLabelImageList([]);
        this.drawLabelList({
          path: this.fileName,
          cate: index === 0 ? undefined : this.cateList[index].value,
          page: this.cateList[index].page,
          page_size: 40,
        });
      },
      onPointListChange() {
        this.kfbView.$on('point-list-change', (e) => {
          pisSlideViewService.navigatorPoint(this.kfbView.navigator.pointList, this.fileName)
            .then((res) => {
              this.kfbView.navigator.drawPointList(res.data.data);
            });
        });
      },
      onLabelChange() {
        this.kfbView.$on('label-change', (e) => {
          this.labelType = e.detail.type;
          switch (e.detail.type) {
            case 'edit':
              const label = e.detail.label || this.kfbView.labelList[0];
              if (!label) {
                this.$message.warning('没有可编辑的标注');
                return;
              }
              this.title = '编辑注释';
              this.labelChangeView = true;
              if (this.$refs.labelForm) this.$refs.labelForm.resetFields();
              this.labelForm = {
                ...label,
                name: label.name || label.id,
                rectWidth: (label.region.width * this.imageCapRes).toFixed(2) / 1,
                rectHeight: (label.region.height * this.imageCapRes).toFixed(2) / 1,
              };
              this.setMeasureInfo(this.labelForm);
              break;
            case 'delete': {
              if (!e.detail.label) {
                this.$message.warning('请选择删除的标签');
                return;
              }
              this.deleteLabel(e.detail.label.id);
            }
              break;
            case 'add': {
              const label = e.detail.label;
              this.title = '添加注释';
              this.labelChangeView = true;
              if (this.$refs.labelForm) this.$refs.labelForm.resetFields();
              this.labelForm = {
                ...label,
                name: '图型' + this.kfbView.labelList.length,
                rectWidth: (label.region.width * this.imageCapRes).toFixed(2) / 1,
                rectHeight: (label.region.height * this.imageCapRes).toFixed(2) / 1,
              };
              this.setMeasureInfo(this.labelForm);
            }
              break;
            case 'move': {
              const label = e.detail.label;
              pisSlideViewService.saveLabel(this.getShapeParams(label), this.fileName)
                .then(({body}) => {
                });
            }
              break;
            case 'maskEdit': {
              const label = e.detail.label;
              if (!label) {
                return;
              }
              pisSlideViewService.saveLabel(this.getShapeParams(label), this.fileName)
                .then(({body}) => {
                  this.$message.success('修改成功');
                  this.kfbView.change();
                }).catch(() => {
                this.$message.error('修改失败');
              });
            }
              break;
            case 'maskAdd': {
              const label = e.detail.label;
              pisSlideViewService.saveLabel(this.getShapeParams(label), this.fileName)
                .then(({body}) => {
                  if (body.annotation) {
                    let annotation = JSON.parse(body.annotation);
                    if (!annotation) return;
                    annotation.imageData = annotation.imageData && {
                      data: new Uint8ClampedArray(annotation.imageData.data),
                      width: annotation.imageData.width,
                      height: annotation.imageData.height,
                    };
                    this.cateList[0].num++;
                    this.cateList[0].list.push(annotation);
                    if (annotation.category) {
                      this.cateList[annotation.category].num++;
                      this.cateList[annotation.category].list.push(annotation);
                      this.setLabelImageList(this.cateList[annotation.category].list);
                    } else if (this.maskValue === -1) {
                      this.setLabelImageList(this.cateList[0].list);
                    } else if (this.maskValue === 0) {
                      this.cateList[this.cateList.length - 1].num++;
                      this.cateList[this.cateList.length - 1].list.push(annotation);
                      this.setLabelImageList(this.cateList[this.cateList.length - 1].list);
                    }
                    this.$message.success('新增成功');
                    if (this.kfbView.board) this.kfbView.board.canDraw = false;
                  } else {
                    this.$message.error('新增失败');
                  }
                }).catch((e) => {
                console.log(e);
                this.$message.error('新增失败');
              });
            }
              break;
          }
        });
      },
      onSelectLabel() {
        this.kfbView.$on('select-label', (e) => {
          const label = e.detail;
          console.log(label);
          if (!label) {
            this.labelImage.forEach((item) => item.select = false);
            const item = this.infoListObj[`${this.maskValue}`];
            if (!item) {
              this.infoList = [];
            } else {
              this.setCateInfo(this.maskValue, item, 'mean');
            }
          } else {
            const index = this.kfbView.labelList.findIndex((item) => item === label);
            if (!!~index) {
              this.labelImage.forEach((item) => item.select = false);
              this.labelImage[index] ? this.labelImage[index].select = true : undefined;
              this.$refs.imageLabelList.resetIndexData(index);
            }
            if (label.type === 'Mask' && label.select) {
              const cate = label.category;
              const extra = label.extra;
              if (!extra) {
                this.infoList = [];
                return;
              }
              this.setCateInfo(cate, extra);
            } else if (label.type !== 'Mask' && label.select) {
              this.setMeasureInfo(label);
            }
          }
        })
      },
      onMeasureChange() {
        this.kfbView.$on('measure-range', (e) => {
          const result = e.detail;
          if (!result) {
            this.infoList = [];
          } else {
            result.type = 'Measure';
            const item = this.kfbView.convertNoteForm(result, this.imageCapRes);
            this.infoList = [`长度: ${item.perimeter.toFixed(2)}微米`];
          }
        })
      },
      onScreenShotImageChange() {
        this.kfbView.$on('screen-image-change', (e) => {
          if (e.detail.type === 'done') {
            console.log(e.detail.dataUrl);
            this.$emit('screen-shot', e.detail.dataUrl);
          }
        });
      },
      onShowImageInfo() {
        this.kfbView.$on('image-info', (e) => {
          this.imageInfoView = true;
        });
      },
      setLabelImageList(list) {
        if (!this.kfbView?.setLabelList) return;
        if (this.maskIndex !== 0) {
          list = [...list, ...this.cateList[this.cateList.length - 1].list];
        }
        let _list = [];
        list.forEach((item) => {
          if (_list.find((_item) => _item.id === item.id)) {
          } else {
            _list.push(item);
          }
        });
        this.labelNameList = [...new Set((_list || []).filter((item) => item.id).map((item) => item.name || item.id))];
        this.kfbView.setLabelList(_list);
        this.labelImage = _list.filter((item) => item.imageData).map((item) => {
          const imageData = new ImageData(Object.prototype.toString.call(
            item.imageData.data) === '[object Uint8ClampedArray]' ? item.imageData.data :
            new Uint8ClampedArray(item.imageData.data), Math.round(item.imageData.width), Math.round(item.imageData.height));
          const canvas = document.createElement('canvas');
          canvas.width = item.imageData.width;
          canvas.height = item.imageData.height;
          const content = canvas.getContext('2d');
          content.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL();
          return {
            id: item.id,
            select: false,
            imageUrl: dataURL,
          }
        });
      },
      switchPicture(id) {
        if (!this.kfbView?.labelList) return;
        this.labelImage.forEach((item) => {
          item.select = item.id === id;
        });
        this.kfbView.labelList.forEach((item) => item.select = false);
        const label = this.kfbView.labelList.find((item) => item.id === id);
        if (!label) return;
        label.select = true;
        this.kfbView.area.moveCenterPoint(label);
        this.kfbView.change();
      },
      setCateInfo(cate, extra, type) {
        if (cate === 1) {
          this.infoList = [`${this.cateList[cate].label}${type === 'mean' ? '平均' : ''}信息`, `细胞核数量：${extra.core_num || extra.mean_core_num || 0}`, `面积：${extra.area || extra.mean_area || 0}平方微米`, `周长：${extra.cir || extra.mean_cir || 0}微米`, `圆率：${extra.round_rate || extra.mean_round_rate || 0}`];
        }
        if (cate === 2) {
          this.infoList = [`${this.cateList[cate].label}${type === 'mean' ? '平均' : ''}信息`, `细胞核数量：${extra.core_num || extra.mean_core_num || 0}`, `包氏囊细胞核数量：${extra.baoshi_core_num || extra.mean_baoshi_core_num || 0}`, `面积：${extra.area || extra.mean_area || 0}平方微米`,
            `周长：${extra.cir || extra.mean_cir}微米`, `空腔占比：${extra.empty_rate || extra.mean_empty_rate || 0}`, `圆率：${extra.round_rate || extra.mean_round_rate || 0}`, `${(extra.xinyue || extra.mean_xinyue) === 1 ? '有新月体' : '无新月体'}`];
        }
        if (cate === 3 || cate === 4 || cate === 5) {
          this.infoList = [`${this.cateList[cate].label}${type === 'mean' ? '平均' : ''}信息`, `细胞核数量：${extra.core_num || extra.mean_core_num || 0}`, `外面积：${extra.out_area || extra.mean_out_area || 0}平方微米`, `内面积：${extra.in_area || extra.mean_in_area || 0}平方微米`,
            `外周长：${extra.out_length || extra.mean_out_length || 0}微米`, `内周长：${extra.in_length || extra.mean_in_length || 0}微米`, `圆率：${extra.round_rate || extra.mean_round_rate || 0}`];
        }
      },
      selectLabelChange(name) {
        if (this.$refs.labelForm) this.$refs.labelForm.resetFields();
        const label = this.kfbView.labelList.find((item) => item.name === name||item.id === name);
        label.select = true;
        this.labelForm = {
          ...label,
          name: label.name || label.id,
          rectWidth: (label.region.width * this.imageCapRes).toFixed(2) / 1,
          rectHeight: (label.region.height * this.imageCapRes).toFixed(2) / 1,
        };
        this.$refs.imageLabelList.resetIndexData(this.labelImage.findIndex((item) => item.id === label.id));
        this.switchPicture(this.labelForm.id);
      },
      saveLabelChange() {
        if (this.labelForm.type === 'Mask') {
          this.closeLabelDialog();
          return;
        }
        if (this.labelType === 'add') {
          if (!this.labelForm.name) {
            this.$message.warning('请输入标签名称');
            return;
          }
          if (this.kfbView.labelList.find((label) => label.name === this.labelForm.name)) {
            this.$message.warning('标签名称重复');
            return;
          }
          if (this.labelForm.type === 'Rectangle') {
            const region = this.labelForm.region;
            this.labelForm.region = {
              x: region.x,
              y: region.y,
              width: this.labelForm.rectWidth / this.imageCapRes,
              height: this.labelForm.rectHeight / this.imageCapRes,
            }
          }
          this.kfbView.$emit('select-label', this.labelForm);
          pisSlideViewService.saveLabel(this.getShapeParams(this.labelForm), this.fileName)
            .then(({body}) => {
              if (body.annotation) {
                this.cateList[this.cateList.length - 1].list.push(JSON.parse(body.annotation));
                this.cateList[this.cateList.length - 1].num++;
                this.cateList[0].list.push(JSON.parse(body.annotation));
                this.cateList[0].num++;
                this.setLabelImageList(this.cateList[this.maskIndex].list);
                this.$message.success('新增成功');
                this.closeLabelDialog();
              } else {
                this.$message.error('新增失败');
              }
            }).catch(() => {
            this.$message.error('新增失败');
          });
        } else {
          if (this.labelForm.type === 'Rectangle') {
            const region = this.labelForm.region;
            this.labelForm.region = {
              x: region.x,
              y: region.y,
              width: this.labelForm.rectWidth / this.imageCapRes,
              height: this.labelForm.rectHeight / this.imageCapRes,
            }
          }
          this.kfbView.$emit('select-label', this.labelForm);
          this.kfbView.labelList.forEach((item) => {
            if (item.id == this.labelForm.id) {
              item = Object.assign(item, this.getShapeParams(this.labelForm));
              item.select = true;
            }
          });
          pisSlideViewService.saveLabel(this.getShapeParams(this.labelForm), this.fileName)
            .then(({body}) => {
              this.$message.success('修改成功');
              this.labelChangeView = false;
              this.kfbView.change();
            }).catch(() => {
            this.$message.error('修改失败');
          });
        }
      },
      deleteLabel(id) {
        pisSlideViewService.deleteLabel(id, this.fileName)
          .then(({body}) => {
            if (body.ret_code === 0) {
              let index = this.cateList[this.maskIndex].list.findIndex((item) => item.id == id);
              let label = this.cateList[this.maskIndex].list[index];
              if (!~index) {
                index = this.cateList[this.cateList.length - 1].list.findIndex((item) => item.id == id);
                label = this.cateList[this.cateList.length - 1].list[index];
              }
              const index_0 = this.cateList[0].list.findIndex((item) => item.id == id);
              if (~index_0) {
                this.cateList[0].list.splice(index_0, 1);
              }
              this.cateList[0].num--;
              if (!label) return;
              if (label.category) {
                const index = this.cateList[label.category].list.findIndex((item) => item.id == id);
                if (~index) {
                  this.cateList[label.category].list.splice(index, 1);
                }
                this.cateList[label.category].num--;
              } else {
                const index = this.cateList[this.cateList.length - 1].list.findIndex((item) => item.id == id);
                if (~index) {
                  this.cateList[this.cateList.length - 1].list.splice(index, 1);
                }
                this.cateList[this.cateList.length - 1].num--;
              }
              this.setLabelImageList(this.cateList[this.maskIndex].list);
              this.$refs.imageLabelList.resetIndexData();
              this.labelChangeView = false;
              this.$message.success('删除成功');
            } else {
              this.$message.error('删除失败');
            }
          }).catch((e) => {
          console.log(e);
          this.$message.error('删除失败');
        });
      },
      hideLabel(id, state) {
        this.kfbView.labelList.forEach((item) => {
          if (item.id === id) {
            this.labelForm.show = state;
            item.show = state;
          }
        });
        this.kfbView.change();
      },
      hideAllLabel(state) {
        this.showAllLabel = state;
        this.kfbView.labelList.forEach((item) => item.show = state);
        this.kfbView.change();
      },
      setMeasureInfo(draw) {
        draw = this.kfbView.convertNoteForm(draw, this.imageCapRes);
        if (draw.type === 'Line' || draw.type === 'Arrow') {
          this.infoList = [`长度: ${draw.perimeter.toFixed(2)}微米`];
        }
        if (draw.type === 'Measure') {
          this.infoList = [`长度: ${draw.perimeter.toFixed(2)}微米`];
        } else if (draw.type === 'Rectangle' || draw.type === 'Ellipse') {
          this.infoList = [`宽: ${Math.abs(draw.width).toFixed(2)}微米`, `高: ${Math.abs(draw.height).toFixed(2)}微米`, `面积: ${draw.acreage.toFixed(2)}平方微米`, `周长: ${draw.perimeter.toFixed(2)}微米`];
        } else if (draw.type === 'Position' || draw.type === 'Curve') {
          this.infoList = [];
        }
      },
      getShapeParams(params) {
        return {
          id: params.id,
          width: params.width,
          description: params.description,
          name: params.name || params.id,
          startPoint: params.startPoint,
          endPoint: params.endPoint,
          color: KfbView.convertColorToInt(params.color),
          type: params.type,
          pin: params.pin,
          points: params.points,
          scale: params.scale,
          region: params.region,
          imageData: params.imageData || undefined,
          category: params.type === 'Mask' ? params.category == null ? this.maskValue === -1 ? 0 : this.maskValue : params.category : 0,
          extra: params.extra,
        };
      },
      closeLabelDialog() {
        if (this.labelType === 'add') {
          const board = this.kfbView.board;
          if (board.canDraw) {
            board[board.type].clearCanvas();
            board.canDraw = false;
          }
        }
        this.labelChangeView = false;
        this.kfbView.$emit('select-label');
      },
      initLabelList(data) {
        let list = [];
        data.forEach((item) => {
          if (list.find((_item) => _item.id === item.id)) {
          } else {
            list.push(item);
          }
        });
        this.cateList[this.maskIndex].list = (list || []).filter((item) => item.id).map((item) => ({
          ...item,
          imageData: item.imageData && {
            data: new Uint8ClampedArray(item.imageData.data),
            width: item.imageData.width,
            height: item.imageData.height,
          }
        }));
        this.setLabelImageList(this.cateList[this.maskIndex].list);
      },
    },
    beforeDestroy() {
      this.viewDestroy();
    },
    destroyed() {
    },
  };


</script>

<style scoped lang="scss">
  .pis-slide-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    .file-change {
      position: absolute;
      right: 20px;
      top: 220px;
      z-index: 999;
      .next-btn {
        margin-left: 0;
        margin-top: 10px;
      }
    }
    .pin-img {
      height: 37px;
      width: 31px;
    }
    .hzzt-icon {
      margin-right: 20px;
    }


  }

  .image-info {
    .preview-img {
      height: 180px;
      max-width: 360px;
      img {
        height: 100%;
      }
    }
    .el-form-item {
      word-break: break-all;
      &.el-form-item {
        margin-bottom: 0;
      }
    }
  }
</style>
