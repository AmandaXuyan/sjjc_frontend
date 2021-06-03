<style scoped>
  .tools {
    display: inline-block;
    height: 45px;
    width: 45px;
    vertical-align: middle;
  }

  .center-center {
    height: 100%;
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
  }
</style>

<template>
  <div style="position: absolute; height: 100%; width: 100%; z-index: 0;">
    <div id="cytoscape_id" style="height: 100%; width: 100%; z-index: 1;"></div>
    <div id="cytoolbar_id"
         style="position: absolute; left: 5pt; top: 5pt; z-index: 2; background-color: rgba(249, 249, 249, 0.9);">
      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="放大" type="ios-add-circle-outline"
                @click="magnifying()"/>
        </div>
      </div>
      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="缩小" type="ios-remove-circle-outline"
                @click="contractible()"/>
        </div>
      </div>

      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="撤销操作" type="ios-arrow-back" @click="cancel()"/>
        </div>
      </div>

      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="合适大小" type="ios-resize" @click="resize()"/>
        </div>
      </div>

      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="高亮邻居" type="ios-color-wand-outline"
                @click="highlight()"/>
        </div>
      </div>

      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="刷新布局" type="ios-sync"
                @click="refresh({name: 'cola'})"/>
        </div>
      </div>

      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="网格布局" type="ios-apps-outline"
                @click="refresh({name: 'grid'})"/>
        </div>
      </div>
      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="环形布局" type="ios-globe-outline"
                @click="refresh({name: 'circle'})"/>
        </div>
      </div>
      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="全图导出" type="ios-reverse-camera-outline"
                @click="exportPng()"/>
        </div>
      </div>
      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="文本导出" type="ios-crop-outline" @click="exportFile()"/>
        </div>
      </div>

      <div class="tools">
        <div class="center-center">
          <Icon style="font-size: 32px; cursor: pointer;" title="搜索功能" class="el-icon-search"
                @click="searchVisible=true"/>
        </div>
      </div>

      <div>
        <!-- 搜索框   -->
        <el-select
          v-model="selectedValue"
          v-show="searchVisible"
          filterable
          remote
          placeholder="请输入要搜索的公司名"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-button type="success" icon="el-icon-check"
                   size="mini"
                   @click="findRelatedCompanies"
                   circle style=" cursor: pointer;"
                   v-show="searchVisible"
        ></el-button>
        <el-button type="error" icon="el-icon-close"
                   size="mini"
                   circle style=" cursor: pointer;"
                   @click="searchVisible=false"
                   v-show="searchVisible"
        ></el-button>
      </div>
    </div>

    <div id="detail" style="position: absolute; right: 35pt; top: 20pt;z-index: 3" v-show="detailVisible">
      <el-card shadow="always">
        <div slot="header" class="clearfix">
          <span>详细信息</span>
          <Icon style="float: right; padding: 3px 0" title="关闭" class="el-icon-close" @click="closeDetail"/>
        </div>
        <el-collapse v-model="activeNames" @change="handleChange" >
          <el-collapse-item name="1">
            <template slot="title">
              一致性 Consistency<i class="header-icon el-icon-info"></i>
            </template>
            <div>与现实生活一致：与现实生活的流程保持一致；</div>
            <div>在界面中一致：所有的元素和结构需保持一致。</div>
          </el-collapse-item>
          <el-collapse-item title="反馈 Feedback" name="2">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item title="效率 Efficiency" name="3">
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
          <el-collapse-item title="可控 Controllability" name="4">
            <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>

  </div>
</template>

<script>
  import cytoscape from 'cytoscape';
  import FileSaver from 'file-saver';
  import cxtmenu from 'cytoscape-cxtmenu';
  import cola from 'cytoscape-cola';
  import avsdf from 'cytoscape-avsdf';
  import coseBilkent from 'cytoscape-cose-bilkent';
  import {getNameListAPI,findRelatedCompaniesAPI,findUpCompaniesAPI,findRiskChartAPI,findDetailAPI} from "../../api/chart";
  //

  export default {
    name: "CJS",
    beforeCreate() {
      this.$cy && this.$cy.destroyed() && this.$cy.destroy();
      delete this.$cy;
    },
    beforeDestroy() {
      this.$cy && this.$cy.destroyed() && this.$cy.destroy();
      delete this.$cy;
    },
    mounted() {
      // Cxtmenu圆形菜单主要依赖组件
      if (!cytoscape().cxtmenu) {
        cytoscape.use(cxtmenu);
        cytoscape.use(cola);
        cytoscape.use(avsdf);
        cytoscape.use(coseBilkent);
        // cytoscape.use(popup);
      }

      this.$cy = cytoscape({
        // initial viewport state:
        zoom: 1, // 图表的初始缩放级别.可以设置options.minZoom和options.maxZoom设置缩放级别的限制.
        pan: {x: 0, y: 0}, // 图表的初始平移位置.
        // interaction options:
        minZoom: 1e-50, // 图表缩放级别的最小界限.视口的缩放比例不能小于此缩放级别.
        maxZoom: 1e50, // 图表缩放级别的最大界限.视口的缩放比例不能大于此缩放级别.
        zoomingEnabled: true, // 是否通过用户事件和编程方式启用缩放图形.
        userZoomingEnabled: true, // 是否允许用户事件(例如鼠标滚轮,捏合缩放)缩放图形.对此缩放的编程更改不受此选项的影响.
        panningEnabled: true, // 是否通过用户事件和编程方式启用平移图形.
        userPanningEnabled: true, // 是否允许用户事件(例如拖动图形背景)平移图形.平移的程序化更改不受此选项的影响.
        boxSelectionEnabled: true, // 是否启用了框选择(即拖动框叠加,并将其释放为选择).如果启用,则用户必须点击以平移图表.
        selectionType: 'single', // 一个字符串，指示用户输入的选择行为.对于'additive',用户进行的新选择将添加到当前所选元素的集合中.对于'single',用户做出的新选择成为当前所选元素的整个集合.
        touchTapThreshold: 8, // 非负整数,分别表示用户在轻击手势期间可以在触摸设备和桌面设备上移动的最大允许距离.这使得用户更容易点击.
                              // 这些值具有合理的默认值,因此建议不要更改这些选项,除非您有充分的理由这样做.大值几乎肯定会产生不良后果.
        desktopTapThreshold: 4, // 非负整数,分别表示用户在轻击手势期间可以在触摸设备和桌面设备上移动的最大允许距离.这使得用户更容易点击.
                                // 这些值具有合理的默认值,因此建议不要更改这些选项,除非您有充分的理由这样做.大值几乎肯定会产生不良后果.
        autolock: false, // 默认情况下是否应锁定节点(根本不可拖动,如果true覆盖单个节点状态).
        autoungrabify: false, // 默认情况下节点是否不允许被拾取(用户不可抓取,如果true覆盖单个节点状态).
        autounselectify: false, // 默认情况下节点是否允许被选择(不可变选择状态,如果true覆盖单个元素状态).
        // rendering options:
        headless: false, // true:空运行,不显示不需要容器容纳.false:显示需要容器容纳.
        styleEnabled: true, // 一个布尔值,指示是否应用样式.
        hideEdgesOnViewport: true, // 渲染提示,设置为true在渲染窗口时,不渲染边.例如,移动某个顶点时或缩放时,边信息会被临时隐藏,移动结束后,边信息会被执行一次渲染.由于性能增强,此选项现在基本上没有实际意义.
        hideLabelsOnViewport: true, // 渲染提示,当设置为true使渲染器在平移和缩放期间使用纹理而不是绘制元素时,使大图更具响应性.由于性能增强,此选项现在基本上没有实际意义.
        textureOnViewport: true, // 渲染提示,当设置为true使渲染器在平移和缩放期间使用纹理而不是绘制元素时,使大图更具响应性.由于性能增强,此选项现在基本上没有实际意义.
        motionBlur: true, // 渲染提示,设置为true使渲染器使用运动模糊效果使帧之间的过渡看起来更平滑.这可以增加大图的感知性能.由于性能增强,此选项现在基本上没有实际意义.
        motionBlurOpacity: 0.2, // 当motionBlur:true,此值控制运动模糊帧的不透明度.值越高,运动模糊效果越明显.由于性能增强,此选项现在基本上没有实际意义.
        wheelSensitivity: 0.3, // 缩放时更改滚轮灵敏度.这是一个乘法修饰符.因此,0到1之间的值会降低灵敏度(变焦较慢),而大于1的值会增加灵敏度(变焦更快).
        pixelRatio: 'auto', // 使用手动设置值覆盖屏幕像素比率(1.0建议,如果已设置).这可以通过减少需要渲染的有效区域来提高高密度显示器的性能,
                            // 尽管在最近的浏览器版本中这是不太必要的.如果要使用硬件的实际像素比,可以设置pixelRatio: 'auto'(默认).
        // DOM容器,决定内容展示的位置,方式一(原生):document.getElementById('xx'),方式二(jQuery):$('#xx')
        container: document.getElementById('cytoscape_id'),
        // 一个指定布局选项的普通对象.
        layout: {name: 'random'},
      });
      // Cxtmenu圆形菜单--开始
      this.$cy.cxtmenu({
        menuRadius: 80, // the radius of the circular menu in pixels
        selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
        commands: () => {
          return [
            {
              fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
              content: '<span class="fa fa-flash fa-2x">查看详细信息</span>', // html/text content to be displayed in the menu
              contentStyle: {}, // css key:value pairs to set the command's css in js if you want
              select: (ele) => this.findDetail(ele.data().name),
              enabled: true, // whether the command is selectable
            },
            {
              fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
              content: '<span class="fa fa-flash fa-2x">向上查询</span>', // html/text content to be displayed in the menu
              contentStyle: {}, // css key:value pairs to set the command's css in js if you want
              select: (ele) => // a function to execute when the command is selected
                this.findUpCompany(ele.data().name), // `ele` holds the reference to the active element,
              enabled: true, // whether the command is selectable
            },
            {
              // fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
              content: '高亮邻居', // html/text content to be displayed in the menu
              // contentStyle: {}, // css key:value pairs to set the command's css in js if you want
              select: (ele) => this.lightOn([ele.id()]),  // a function to execute when the command is selected
              enabled: true, // whether the command is selectable
            },
            {
              // fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
              content: '删除', // html/text content to be displayed in the menu
              // contentStyle: {}, // css key:value pairs to set the command's css in js if you want
              select: (ele) => this.delEle([ele.id()]),  // a function to execute when the command is selected
              enabled: true, // whether the command is selectable
            }
          ]
        },
        fillColor: 'rgba(0, 0, 0, 0.75)', // 指令默认颜色(the background colour of the menu)
        activeFillColor: 'rgba(1, 105, 217, 0.75)', // 所选指令的颜色(the colour used to indicate the selected command)
        activePadding: 10, // additional size in pixels for the active command
        indicatorSize: 14, // the size in pixels of the pointer to the active command
        separatorWidth: 4, //连续命令之间的空白间隔(以像素为单位)
        spotlightPadding: 10, //元素和聚光灯之间的额外间距(以像素为单位)
        minSpotlightRadius: 10, // the minimum radius in pixels of the spotlight
        maxSpotlightRadius: 14, // the maximum radius in pixels of the spotlight
        openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
        itemColor: 'white', // 各指令元素内字体颜色
        itemTextShadowColor: 'red', // 各指令元素内字体阴影颜色
        zIndex: 9999, // the z-index of the ui div
        atMouse: true, // draw menu at mouse position
      });
      //Cxtmenu圆形菜单--结束

      //边-Cxtmenu圆形菜单--开始
      this.$cy.cxtmenu({
        menuRadius: 40, // the radius of the circular menu in pixels
        selector: 'edge', // elements matching this Cytoscape.js selector will trigger cxtmenus
        commands: () => {
          return [
            {
              fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
              content: '<span class="fa fa-flash fa-2x">暂定</span>', // html/text content to be displayed in the menu
              contentStyle: {}, // css key:value pairs to set the command's css in js if you want
              select: (ele) => this.something([ele.id()]),
              enabled: true, // whether the command is selectable
            },
            {
              // fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
              content: '删除', // html/text content to be displayed in the menu
              // contentStyle: {}, // css key:value pairs to set the command's css in js if you want
              select: (ele) => this.delEle([ele.id()]),  // a function to execute when the command is selected
              enabled: true, // whether the command is selectable
            }
          ]
        },
        fillColor: 'rgba(0, 0, 0, 0.75)', // 指令默认颜色(the background colour of the menu)
        activeFillColor: 'rgba(1, 105, 217, 0.75)', // 所选指令的颜色(the colour used to indicate the selected command)
        activePadding: 10, // additional size in pixels for the active command
        indicatorSize: 14, // the size in pixels of the pointer to the active command
        separatorWidth: 4, //连续命令之间的空白间隔(以像素为单位)
        spotlightPadding: 10, //元素和聚光灯之间的额外间距(以像素为单位)
        minSpotlightRadius: 10, // the minimum radius in pixels of the spotlight
        maxSpotlightRadius: 14, // the maximum radius in pixels of the spotlight
        openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
        itemColor: 'white', // 各指令元素内字体颜色
        itemTextShadowColor: 'red', // 各指令元素内字体阴影颜色
        zIndex: 9999, // the z-index of the ui div
        atMouse: true, // draw menu at mouse position
      });
      //边-Cxtmenu圆形菜单--结束
      // 节点的样式
      this.$cy
        .style()
        .selector('.classes-A')
        .css({'background-color': '#6FB1FC', 'content': 'data(name)', 'border-color': '#6FB1FC', 'border-width': "5px"})
        // .style({'background-color': '#FF0000', 'border-color': '#FF0000', 'border-width': "1px",})
        .selector('.classes-B')
        .css({'background-color': '#F5A45D', 'content': 'data(name)', 'border-color': '#F5A45D', 'border-width': "5px"})
        // // .style({'background-color': '#00FF00', 'border-color': '#00FF00', 'border-width': "1px",})
        // .selector('.classes-C')
        // // .style({'background-color': '#0000FF', 'border-color': '#0000FF', 'border-width': "1px",})
        // .css({'background-color': '#b88cea', 'content': 'data(name)','border-color':'#b88cea','border-width':"5px"})
        // .selector('.classes-D')
        // .css({'background-color': '#83fd84', 'content': 'data(name)','border-color':'#83fd84','border-width':"5px"})
        .selector('.relationA')
        .css({
          'target-arrow-color': '#999999', /*箭头颜色*/
          'curve-style': 'bezier', /*线条样式曲线*/
          'line-color': '#999999', /*线条颜色*/
          'width': '1px', /*线条宽度*/
          'font-size': '10px', /*标签字体大小*/
          'color': '#000000', /*标签字体大小*/
          'text-outline-color': 'white', /*文本轮廓颜色*/
          'text-outline-width': '1px', /*文本轮廓宽度*/
          'text-rotation': 'autorotate', /*标签方向*/
        })
        .selector('.relationB')
        .css({
          'line-style': 'dotted',
          'target-arrow-color': '#999999', /*箭头颜色*/
          'curve-style': 'bezier', /*线条样式曲线*/
          'line-color': '#999999', /*线条颜色*/
          'line-dash-offset': '1',
          'width': '1px', /*线条宽度*/
          'font-size': '10px', /*标签字体大小*/
          'color': '#000000', /*标签字体大小*/
          'text-outline-color': 'white', /*文本轮廓颜色*/
          'text-outline-width': '1px', /*文本轮廓宽度*/
          'text-rotation': 'autorotate', /*标签方向*/
        })
      ;
      // 通用的样式
      this.$cy.style()
        /*未选择节点样式*/
        .selector('node')
        .style({'label': 'data(name)', 'font-size': '10pt', 'width': '8pt', 'height': '8pt'})
        /*已选择节点样式*/
        .selector('node:selected')
        .style({'border-color': '#c84e40', 'border-width': "1px",})
        /*未选择边样式*/
        .selector('edge')
        .style({
          'label': 'data(name)',
          'target-arrow-shape': 'triangle-backcurve', /*箭头样式*/
          'target-arrow-size': '1px', /*箭头大小*/
        })
        /*已选择边样式*/
        .selector('edge:selected')
        .style({
          'color': '#3165fc', /*标签字体大小*/
          'target-arrow-color': '#61bffc', /*箭头颜色*/
          'line-color': '#61bffc', /*线条颜色*/
        })
        /*高亮样式*/
        .selector('.light-off')
        .style({'opacity': '0.1',})
      ;
    },
    data() {
      return {
        dialogVisible: false,
        searchVisible: false,
        detailVisible:false,
        form: {
          id: '',
          name: '',
          class: ''
        },
        //用于搜索模糊查询
        options: [],
        selectedValue: '',
        loading: false,
        activeNames: ['1'],//折叠面板

        // deleted_array:this.$cy.collection(),
      };
    },
    methods: {

      closeDetail(){
        this.detailVisible=false;
      },

      handleChange(val) {
        console.log(val);
      },
      /**
       * 搜索后，刷新布局展示知识图谱
       * TODO:测试findRelatedCompaniesAPI
       **/
      findRelatedCompanies() {
        console.log("----selectedValue-----")
        console.log(this.selectedValue)
        if (this.selectedValue != "") {
          this.searchVisible = false;
          const res = findRelatedCompaniesAPI(this.selectedValue);
          console.log("findRelatedCompaniesAPI:res----"+res)
          this.$cy.startBatch();
          this.$cy.batch(() => {
            this.$cy.elements().map(function (ele) {
              ele.remove();
            });
          });
          this.$cy.endBatch();
          this.addEles(res);
        } else {
          this.$message({

            showClose: true,
            message: '请输入正确的公司名称',
            type: 'error'
          });
        }

      },
      /**
       * TODO:搜索模糊查询，接口没测
       **/
      remoteMethod(query) {
        // 如果用户输入内容了，就发请求拿数据，远程搜索模糊查询
        if (query !== "") {
          this.loading = true; // 开始拿数据喽
          // 这里模拟发请求，res就当成发请求返回来的数据吧。
          const res = getNameListAPI(query);
          console.log(res)
          // let res = [
          //   {
          //     id: 1,
          //     name: "孙悟空",
          //   },
          //   {
          //     id: 2,
          //     name: "孙尚香",
          //   },
          //   {
          //     id: 3,
          //     name: "沙和尚",
          //   },
          //   {
          //     id: 4,
          //     name: "沙师弟",
          //   },
          // ];
          this.loading = false // 拿到数据
          this.options = res.filter((item) => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        } else {
          this.options = [];
        }
      },

      //增加节点或边
      addEles(eles) {
        if (eles) {
          this.$cy.startBatch();
          this.$cy.batch(() => {
            let elements = ((Array.isArray ? Array.isArray(eles) : null != eles && eles instanceof Array) ? eles : [eles]);
            let filterElements = elements.filter(__ => !this.$cy.getElementById(__.data.id).length)
            this.$cy.add(filterElements);
          });
          this.$cy.endBatch();
        }
      },

      /**
       * 边-圆形菜单
       * 暂定不知道要干什么
       * @param ele_id 某元素ID
       **/
      something() {

      },

      /**
       * 圆形菜单-向上找寻最终控制人
       * TODO:findUpCompaniesAPI接口没测
       * @param eleName 某元素name
       **/
      findUpCompany(eleName) {
        console.log("---selectEle---")
        console.log(eleName)
        const res = findUpCompaniesAPI(eleName);
        this.$cy.startBatch();
        this.$cy.batch(() => {
          //TODO:根据返回的数据决定要不要将原画布中元素删除
          this.$cy.elements().map(function (ele) {
            ele.remove();
          });
          this.addEles(res);
        });
        this.$cy.endBatch();
      },

      /**
       * TODO：显示某公司详细信息!!!findDetailAPI
       * @param ele 某元素name
       **/
      findDetail(eleName) {
        const res_detail = findDetailAPI(eleName);
        const res_chart=findRiskChartAPI(eleName);
        console.log("---selectEle---")
        console.log(eleName)
        this.$cy.startBatch();
        this.$cy.batch(() => {
          this.$cy.elements().map(function (ele) {
            ele.remove();
          });
        });
        this.$cy.endBatch();
        this.addEles(res_chart);
        //TODO：详细信息的展示
        this.refresh({name: 'breadthfirst'})
        // this.refresh({name: 'cola'})
        this.detailVisible=true;
        console.log(res_detail)


      },
      modify() {
        let element = this.$cy.getElementById(this.form.id);
        element.data.name = this.form.name;
        element.classes = this.form.class;
      },
      closepop() {
        this.dialogVisible = false;
      },

      //TODO:撤销上一次删除内容，还要可以连续撤销
      cancel() {
        this.$cy.startBatch();
        const that = this;
        this.$cy.batch(() => {
          let element = that.deleted_array;
          this.$cy.add(element);
        });
        this.$cy.endBatch();

      },

      /**
       * 删除选择的内容(可能是顶点, 也可能是关系)
       */
      delEles() {
        this.$cy.startBatch();
        const that = this;
        this.$cy.batch(() => {
          let selectedEles = this.$cy.elements(':selected');
          that.deleted_array = this.find_relations(selectedEles.id());
          // 未选择不进行操作
          if (!selectedEles || 1 > selectedEles.length) {
            return false;
          }
          selectedEles.remove();
        });
        this.$cy.endBatch();
      },
      /**
       * 圆形菜单——删除
       * @param ele 某元素ID
       **/

      delEle(ele) {
        this.$cy.startBatch();
        const that = this;
        this.$cy.batch(() => {
          let elements = this.$cy.getElementById(ele);
          that.deleted_array = this.find_relations(ele);
          elements.remove();
        });
        this.$cy.endBatch();
      },

      /**
       * 根据节点找关系
       * @param ele 某元素ID
       **/
      find_relations(ele) {
        var collection = this.$cy.collection();
        var element = this.$cy.getElementById(ele);
        collection = collection.add(element);
        if (element.group() == 'nodes') {
          var id = element.id();
          this.$cy.elements().map(function (ele) {
            if (ele.data()["source"] == id || ele.data()["target"] == id) {
              collection.merge(ele);
            }
          });
        }
        return collection;
      },

      /***************************工具栏************************/
      /**
       * 导出全局图片.
       */
      exportPng() {
        let blob = this.$cy.png({output: 'blob', bg: 'white', full: true, scale: 4, quality: 1});
        let [aLink, evt] = [document.createElement('a'), document.createEvent("HTMLEvents")];
        evt.initEvent("click", true, true);
        [aLink.download, aLink.href] = [`${new Date().getTime()}.png`, URL.createObjectURL(blob)];
        aLink.dispatchEvent(evt);
        aLink.click();
      },
      /**
       * 缩放大小.
       * @param zoom 增减幅度.
       */
      zoom(zoom) {
        /** 获取已选择内容 */
        let selectedEles = this.$cy.elements('node:selected');
        /** 获取已选择内容中得第一个, 没有选择为null */
        let selectedEle = selectedEles && selectedEles.length ? selectedEles[0] : null;
        /** 获取画布偏移位置 */
        let pan = this.$cy.pan();
        /** 计算原点坐标 */
        let [x, y] = selectedEle ? [selectedEle.position('x'), selectedEle.position('y')] : [pan.x, pan.y];
        let level = this.$cy.zoom() + zoom;
        (level > this.$cy.maxZoom) && (level = this.$cy.maxZoom);
        (level < this.$cy.minZoom) && (level = this.$cy.minZoom);
        this.$cy.zoom({level: level, renderedPosition: {x: x, y: y}});
      },
      /** 放大 */
      magnifying() {
        this.zoom(0.3);
      },
      /** 缩小 */
      contractible() {
        this.zoom(-0.3);
      },
      /** 合适大小 */
      resize() {
        this.$cy.fit();
      },
      /**
       * 高亮.
       * @param ele 某元素ID
       */
      lightOn(ele) {
        this.$cy.startBatch();
        this.$cy.batch(() => {
          this.$cy.elements().addClass("light-off"); //*添加样式*/
          let elements = ((Array.isArray ? Array.isArray(ele) : null != ele && ele instanceof Array) ? ele : [ele]);
          elements.forEach(__ => {
            this.$cy.getElementById(__).removeClass("light-off");
            this.$cy.getElementById(__).neighborhood().removeClass("light-off");
          });
        });
        this.$cy.once('click', () => this.lightOff());
        this.$cy.endBatch();
      },
      /**
       * 取消高亮
       */
      lightOff() {
        this.$cy.startBatch();
        this.$cy.batch(() => this.$cy.elements().removeClass("light-off") /*移除样式*/);
        this.$cy.endBatch();
      },
      /** 高亮邻居 */
      highlight() {
        /** 获取已选择内容 */
        let selectedEles = this.$cy.elements('node:selected');
        /** 获取已选择内容中得第一个, 没有选择为null */
        let selectedEle = selectedEles && selectedEles.length ? selectedEles[0] : null;
        (selectedEle) && (this.lightOn(selectedEle.id()));
      },
      /**
       * 刷新布局.
       * name取值范围:
       * ['grid', 'circle', 'cola', 'avsdf', 'cose-bilkent', ]
       * @param {name = 'cola......', randomize = true | false, animate = true | false}
       */
      refresh({name = 'cola', randomize = false, animate = true} = {}) {
        this.$cy.layout({name: name, randomize: randomize, animate: animate,}).run();
      },
      exportFile() {
        const data = JSON.stringify(this.$cy.json(), null, "\t");
        const blob = new Blob([data], {type: 'json'})
        FileSaver.saveAs(blob, 'hahaha.json')
      }
      /***************************工具栏************************/
    },
  }
</script>
<style type="text/css">
  .detail{
    position: relative;
    right: 10%;

  }
</style>

