<template>
  <div class="page">
    <CJS ref="ref_CJS" style="z-index: 5"></CJS>
  </div>

</template>

<script>
  import CJS from './components/cjs';

  export default {
    name: "Test",
    components: {CJS,},
    watch: {},
    mounted() {
      this.addAll();
      // this.addEles();
      this.resize();
      this.delEles();
    },
    data() {
      return {
      };
    },
    methods: {
      //TODO:在此模拟获取所有实体与关系的逻辑
      addAll() {

        this.$refs['ref_CJS'].addEles([
          {group: 'nodes', data: {'id': '1', 'name': '欢迎使用风险查询系统',}, classes: 'one'},
          {group: 'nodes', data: {'id': '2', 'name': '第八组',}, classes: 'Company', },
          {group: 'nodes', data: {'id': '4', 'name': '张许妍',}, classes: 'DGJ',},
          {group: 'nodes', data: {'id': '5', 'name': '冯泊涓',}, classes: 'DGJ',},
          {group: 'nodes', data: {'id': '6', 'name': '金宇航',}, classes: 'DGJ',},
          {group: 'nodes', data: {'id': '7', 'name': '吴昊宇',}, classes: 'DGJ',},
          {group: 'nodes', data: {'id': '8', 'name': '周瑾瑜',}, classes: 'DGJ',},
          {group: 'edges', data: {id: '3', name: '开发', source: '2', target: '1'}, classes: 'HoldingRelation'},
          {group: 'edges', data: {id: '9', name: '前端', source: '4', target: '2'}, classes: 'HoldingRelation'},
          {group: 'edges', data: {id: '10', name: '后端', source: '5', target: '2'}, classes: 'HoldingRelation'},
          {group: 'edges', data: {id: '11', name: '爬虫', source: '6', target: '2'}, classes: 'HoldingRelation'},
          {group: 'edges', data: {id: '12', name: '清洗', source: '7', target: '2'}, classes: 'HoldingRelation'},
          {group: 'edges', data: {id: '13', name: '爬虫', source: '8', target: '2'}, classes: 'HoldingRelation'},

        ]);
        this.$refs['ref_CJS'].refresh({name: 'cola'})
      },
      //调整页面大小
      resize() {
        this.$refs['ref_CJS'].resize();
      },
      //删除节点
      delEles() {
        this.$refs['ref_CJS'].delEles();
      },

    },
  }
</script>

<style scoped>
  .page {
    height: 100%;
    width: 100%;
    border: 1px solid #7373dc
  }

</style>
