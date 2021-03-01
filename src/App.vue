<template>
  <div id="app">
    <el-row :gutter="0">
      <el-col :span="23"
              style="width: 94%;">
        <div class="main">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("initData");
  }
};
</script>

<style lang="stylus" scoped>
#app {
  border-radius: 50px;
  margin: 0px;
  padding: 3% 15%;
  height: 600px;

  .sidebar {
    height: 600px;
    background: #2b2c2f;
  }

  .main {
    height: 600px;
    background: #f2f2f2;
  }
}
</style>
