<!-- 消息框 -->
<template>
  <div class="message">
    <header class="header">
      <el-row type='flex' :gutter="0" justify='center'>
        <el-col :span="21">
          <el-button size='small' type='text' class="friendname">{{selectedChat && selectedChat.displayName || "智能客服"}}</el-button>
        </el-col>
        <el-col :span='3'>
          <el-button @click='loginOut' size='small' type='info'>退出系统</el-button>
        </el-col>
        <!-- <el-col :span="6"
                style="text-align: right">
          <el-row :gutter="0">
            <el-col :span="1"
                    :offset="2">
              <breathing-lamp :color="online?'green':'gray'"></breathing-lamp>
            </el-col>
            <el-col :span="16"
                    :offset="5">
              <div class="friendname"
                   style="text-align:left">{{onlineState}}</div>
            </el-col>
          </el-row>
        </el-col> -->
      </el-row>

    </header>
    <div class="message-wrapper"
         ref="list">
      <ul class="message-ul"
          v-if="selectedChat">
        <div style='text-align: center; padding: 5px; color:rgb(146 137 137); font-size: 12px;'>
          <span @click='getHistory' class='pointer'>-- 更多记录 --</span>
        </div>
        <li v-for="item in selectedMsgs"
            :key="item.msgId"
            class="message-item">
          <div class="time"><span>{{item | time}}</span></div>
          <div class="main"
               v-if="!item.isEvent"
               :class="{ self: isSelf(item.sendType) }">
            <img class="avatar"
                 width="36"
                 height="36"
                 :class="{gray: !allReachable[item.openId] && !isSelf(item.sendType)}"
                 :src="isSelf(item.sendType) ? 'static/images/UserAvatar.jpg' : 'static/images/defaultAvatar.jpeg'" />
            <div class="content">
              <div class="text"
                   v-if="item.msgType === 'text'"
                   v-html="item.content"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import { replaceEmoji } from "../../utils/emoji-util.js";
const BreathingLamp = () => import("../common/BreathingLamp");
import FormatUtil from "../../utils/format-util.js";
const REACHABLE_SEC = 48 * 60 * 60;
import ChatApi from "@/api/chat-api";
export default {
  name: "Message",
  components: {
    BreathingLamp
  },
  data() {
    return {
      loading: false,
      page: 2
    }
  },
  mounted() {
    this.getInitInfo()
    this.scrollUp();
    // 通过$refs获取dom元素
    let box = this.$refs.list; // 监听这个dom的scroll事件
    box.addEventListener(
      "scroll",
      () => {
        //可滚动容器超出当前窗口显示范围的高度
        if (box.scrollTop < 10) {
          //加载更多操作
          if (!this.loading) {
            // this.loadMore(box);
          }
        }
      },
      false
    );
  },
  methods: {
    ...mapMutations(["setUserInfo", "addNewMsg", "loadMoreNewMsg"]),
    getHistory () {
      let box = this.$refs.list;
      this.loadMore(box);
    },
    loginOut () {
      this.setUserInfo({})
      this.$store.state.selectedMsgs = [{
      sendType: 'kefu',
      msgType: 'text',
      date: 1543090745,
      createTime: new Date,
      openId: '123',
      appId: '11',
      content: '你好呀，我是智能客服，有什么可以帮到您的呢~'
    }]
      this.$router.replace({name: 'Login'})
    },
    getInitInfo () {
      ChatApi.getInitInfo().then(res => {
        if (res.chatRecordList.length) {
          this.$store.state.selectedMsgs = []
        }
        for (let v of res.chatRecordList.reverse()) {
          this.addNewMsg({
            appId: '11',
            content: v.question,
            openId: '12',
            sendType: "SEND",
            msgType: "text",
            createTime: v.questionTime
          })
          this.addNewMsg({
            appId: '11',
            content: v.answer,
            openId: '13',
            sendType: "ANSWER",
            msgType: "text",
            createTime: v.answerTime
          })
        }
      })
    },
    ...mapMutations(["loadMoreNewMsg"]),
    loadMore(box) {
      // let first = this.selectedMsgs[0];
      // let firstCreateTime = first && first.createTime;
      this.loading = true;
      ChatApi.chatRecord({
        page: this.page++,
        size: 5
      }).then(res => {
        if (!res.chatRecordList.length) {
          this.page--
          return this.$alert("没有更多记录啦");
        }
        let temp = []
        res.chatRecordList.reverse()
        for (let v of res.chatRecordList) {
          temp.push({
            appId: '11',
            content: v.question,
            openId: '12',
            sendType: "SEND",
            msgType: "text",
            createTime: v.questionTime
          },{
            appId: '11',
            content: v.answer,
            openId: '13',
            sendType: "ANSWER",
            msgType: "text",
            createTime: v.answerTime
          })
        }
        this.loadMoreNewMsg(temp)
        let scrollHeight = box.scrollHeight;
        // this.loadMoreNewMsg(rs);
        this.$nextTick(() => {
          // 加载完回到之前滚去的位置上
          box.scrollTop = box.scrollHeight - scrollHeight;
        });
      })
        .catch(e => {
          // console.log("加载更多聊天记录失败", e);
          // this.$alert("加载更多聊天记录失败");
        })
        .finally(() => (this.loading = false));
      console.log("loadmore");
    },
    isSelf(sendType) {
      return (
        sendType &&
        (sendType.toUpperCase() === "SEND" ||
          sendType.toUpperCase() === "AUTO_REPLY")
      );
    },
    format(msg) {
      msg.content = msg.content.replace(/\n/g, "<br>");
      msg.content = msg.content.replace(/ /g, "&nbsp;");
      // return replaceEmoji(msg.content);
      return msg.content;
    },
    scrollUp() {
      let vue = this;
      setTimeout(() => {
        vue.$refs.list.scrollTop = vue.$refs.list.scrollHeight;
      }, 50);
    }
  },
  computed: {
    ...mapGetters(["selectedChat", "allReachable"]),
    ...mapState(["user", "selectedMsgs", "online", "onlineState", "selectId"])
  },
  watch: {
    // 发送信息后,让信息滚动到最下面
    selectedMsgs: {
      handler() {
        if (!this.loading) {
          this.scrollUp();
        }
      },
      deep: true
    }
  },
  filters: {
    time(item) {
      if (!item) {
        return "";
      }
      let date;
      if (item.createTime instanceof Date) {
        date = item.createTime;
      } else if (typeof item.createTime === "number") {
        // 微信回调的时间戳是以秒为单位的
        date = new Date(item.createTime * 1000);
      } else if (typeof item.createTime === "string") {
        date = new Date(item.createTime);
      }
      if (!item.isEvent) {
        return FormatUtil.format(date);
      }
      // 如果是事件则显示为 时间+事件名
      return `${FormatUtil.format(date)} ${item.msgName}`;
    }
  }
};
</script>

<style lang="stylus" scoped>
.message {
  height: 450px;

  .header {
    // height: 42px;
    padding: 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
  }

  .message-wrapper {
    height: 410px;
    padding: 0px 15px;
    box-sizing: border-box;
    overflow-y: auto;
    border-bottom: 1px solid #e7e7e7;

    .message-ul {
      margin-bottom: 15px;
    }

    .time {
      width: 100%;
      font-size: 12px;
      margin: 7px auto;
      text-align: center;

      span {
        display: inline-block;
        padding: 4px 6px;
        color: #fff;
        border-radius: 3px;
        background-color: #dcdcdc;
      }
    }

    .main {
      .avatar {
        float: left;
        margin-left: 15px;
        border-radius: 3px;
      }

      .content {
        display: inline-block;
        margin-left: 10px;
        position: relative;
        padding: 6px 10px;
        max-width: 75%;
        min-height: 36px;
        line-height: 24px;
        box-sizing: border-box;
        font-size: 14px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;

        &:before {
          content: ' ';
          position: absolute;
          top: 12px;
          right: 100%;
          border: 6px solid transparent;
          border-right-color: #fafafa;
        }
      }
    }

    .self {
      text-align: right;

      .avatar {
        float: right;
        margin: 0 15px;
      }

      .content {
        background-color: #b2e281;

        &:before {
          right: -12px;
          vertical-align: middle;
          border-right-color: transparent;
          border-left-color: #b2e281;
        }
      }
    }
  }
}
</style>
