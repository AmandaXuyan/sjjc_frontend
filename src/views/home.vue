<template>
  <div class="page">
    <CJS ref="ref_CJS"></CJS>
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
          {group: 'nodes', data: {'id': '李俊杰', 'name': '李俊杰',}, classes: 'classes-A', position: {x: 200, y: 50}},
          {group: 'nodes', data: {'id': '野猪', 'name': '猪🐖',}, classes: 'classes-A', position: {x: 500, y: 50}},
          {
            group: 'nodes',
            data: {'id': '南京大学', 'name': '南京大学',},
            classes: 'classes-A',
            display: 'hide',
            position: {x: 200, y: 200}
          },
          {group: 'nodes', data: {'id': '肥肉', 'name': '肥肉',}, classes: 'classes-A', position: {x: 500, y: 150}},
          {group: 'nodes', data: {'id': '吃饭', 'name': '吃饭',}, classes: 'classes-B', position: {x: 100, y: 100}},
          {
            group: 'nodes',
            data: {'id': '南大卷王', 'name': '南大卷王',},
            classes: 'classes-A',
            display: 'hide',
            position: {x: 250, y: 100}
          },
          {group: 'nodes', data: {'id': '打呼噜', 'name': '打呼噜',}, classes: 'classes-B', position: {x: 300, y: 200}},
          {group: 'edges', data: {id: 'e0', name: '是', source: '李俊杰', target: '野猪'}, classes: 'relationB'},
          {group: 'edges', data: {id: 'e1', name: '是', source: '李俊杰', target: '南大卷王'}, classes: 'relationB'},
          {group: 'edges', data: {id: 'e2', name: '拥有', source: '野猪', target: '肥肉'}, classes: 'relationA'},
          {group: 'edges', data: {id: 'e3', name: '拥有', source: '李俊杰', target: '肥肉'}, classes: 'relationA'},
          {group: 'edges', data: {id: 'e4', name: '喜欢', source: '野猪', target: '吃饭'}, classes: 'relationA'},
          {group: 'edges', data: {id: 'e5', name: '喜欢', source: '李俊杰', target: '吃饭'}, classes: 'relationA'},
          {group: 'edges', data: {id: 'e6', name: '拥有', source: '南京大学', target: '野猪'}, classes: 'relationA'},
          {group: 'edges', data: {id: 'e7', name: '喜欢', source: '野猪', target: '打呼噜'}, classes: 'relationA'},
          {group: 'edges', data: {id: 'e8', name: '是', source: '野猪', target: '南大卷王'}, classes: 'relationA'},
        ]);
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
