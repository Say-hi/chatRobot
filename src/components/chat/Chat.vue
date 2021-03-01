<template>
  <div class="content"
       style='border-radius: 9px;'
       key="chat">
    <el-row :gutter="0">
      <!-- <el-col :span="8">
        <div class="msglist">
          <search></search>
          <chatlist></chatlist>
        </div>
      </el-col> -->
      <el-col :span="24">
        <div class="chatbox">
          <message></message>
          <v-text></v-text>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const Message = () => import("@/components/message/Message");
const VText = () => import("@/components/text/VText");
import { mapActions } from "vuex";
/**
 * 聊天界面
 * @prop reachable 筛选用户是否可达
 */
export default {
  name: "Chat",
  props: { reachable: { type: Boolean, required: false, default: true } },
  components: {
    Message,
    VText
  },
  mounted() {
    this.$notify({
      title: '成功',
      message: '智能机器人连接成功',
      type: 'success'
    });
    this.setReachable(this.reachable);
  },
  methods: {
    ...mapActions(["setReachable"])
  },
  watch: {
    reachable(v) {
      this.setReachable(v);
    }
  }
};
</script>

<style lang="stylus" scoped>
.content {
  width: 100%;
  height: 90vh;
  .msglist {
    background: rgb(230, 230, 230);
  }
}
</style>
