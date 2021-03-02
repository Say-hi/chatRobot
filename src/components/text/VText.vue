<!-- 文本输入框 -->
<template>
  <div class="text"
       v-loading="loading">
    <div v-loading="disable"
         :element-loading-text="disableInfo"
         element-loading-spinner="el-icon-warning"
         element-loading-background="rgba(0, 0, 0, 0.7)">
      <!-- <div class="emoji"> -->
        <!-- 表情选择器 -->
        <!-- <div style='display: flex; align-items: center;'>
          <p style='margin-right: 10px; cursor: pointer;'>折叠答案</p>
          <p style='margin-right: 10px; cursor: pointer;'>清空记录</p>
          <p style='margin-right: 10px; cursor: pointer;'>导出问答记录</p>
        </div> -->
      <!-- </div> -->
      <div style='position: relative;'>
        <transition name='fade'>
          <div v-if='showUserCanChooseQuestion' class='userCanChooseQuestion'>
            <div @click='send(showUserCanChooseQuestionText)' v-for='item in 5' :key='item'>{{ showUserCanChooseQuestionText }}</div>
          </div>
        </transition> 
        <textarea ref="text"
                v-model="content"
                @keyup="onKeyup"
                maxlength="1024"
                v-if="reachable"
                placeholder="您好，请用一句话描述您的问题。如：‘如何开通网银’"
                @click="showEmoji=false"></textarea>
        <textarea ref="text"
                  v-if="!reachable"
                  disabled></textarea>
      </div>
      <div class="send"
           v-loading="sending"
           @click="send">
        <span class="pointer">发送</span>
      </div>
      <transition name="appear">
        <div class="warn"
             v-show="warn">
          <div class="description">不能发送空白信息</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import { emojis, toOriginEmoji } from "@/utils/emoji-util";
import ChatApi from "@/api/chat-api";
const ImagePreview = () => import("../common/ImagePreview");
export default {
  name: "VText",
  components: {
    ImagePreview
  },
  data() {
    return {
      loading: false,
      sending: false,
      reply: "未找到",
      frequency: 0,
      warn: false,
      showEmoji: false,
      preview: false,
      previewImg: "",
      showUserCanChooseQuestion: false,
      showUserCanChooseQuestionText: null
    };
  },
  methods: {
    ...mapMutations(["setInputContent", "addNewMsg"]),
    chooseImg() {
      let file = document.getElementById("img-file");
      // 清空已选，否则重复选中同一张图片会出问题
      file.value = "";
      file.click();
    },
    cancel() {
      this.preview = false;
      this.loading = false;
    },
    // 图片处理
    localPreview() {
      if (!(FileReader && File && FileList && Blob)) {
        this.$alert("您的浏览器不支持预览，请使用谷歌或火狐浏览器");
        return false;
      }
      let reader = new FileReader();
      // onload是异步操作
      reader.onload = e => {
        this.previewImg = e.target.result;
        this.preview = true;
      };
      let file = document.getElementById("img-file");
      reader.readAsDataURL(file.files[0]);
    },
    addFace(item) {
      if (this.content) {
        this.content += `[${item.title}(${item.code})]`;
      } else {
        this.content = `[${item.title}(${item.code})]`;
      }
    },
    // 按 CTRL + 回车发送信息
    onKeyup(e) {
      var keyCode = e.keyCode || e.which;
      if (e.ctrlKey && keyCode === 13) {
        console.debug(this.content);
        this.send();
      }
    },
    sendImg() {
      if (!this.previewImg) {
        this.alert("请选择图片");
        return;
      }
      let file = document.getElementById("img-file");
      this.loading = true;
      // 先上传，获取mediaId
      let chat = this.selectedChat;
      ChatApi.sendImage(chat.appType, chat.appId, chat.openId, file.files[0])
        .then(mediaId => {
          this.preview = false;
        })
        .catch(e => this.$alert(e))
        .finally(() => (this.loading = false));
    },
    // 点击发送按钮发送信息
    send(question) {
      if (this.sending) {
        return;
      }
      let temp = ''
      if (question && question.length) {
        temp = question
        this.warn = false
      } else if (this.content.length <= 0) {
        this.warn = true;
        this.content = "";
        let vue = this;
        setTimeout(() => {
          vue.warn = false;
        }, 1000);
        return
      } else {
        temp = this.content
      }
      this.showUserCanChooseQuestion = !this.showUserCanChooseQuestion
      this.sending = true;
      let msg = {
        appId: '11',
        content: temp,
        openId: '12',
        sendType: "SEND",
        msgType: "text",
        createTime: new Date()
      };
      this.addNewMsg(msg)
      ChatApi.send(msg)
        .then(() => {
          this.content = "";
        })
        .catch(e => this.$alert(e || "发送失败，请稍候重试"))
        .finally(() => (this.sending = false));
    }
  },
  computed: {
    ...mapState(["selectId", "reachable", "online", "inputContent"]),
    ...mapGetters(["selectedChat"]),
    content: {
      get() {
        return this.inputContent;
      },
      set(v) {
        this.setInputContent(v);
      }
    },
    emojisConf() {
      return emojis;
    },
    disable() {
      return !this.reachable || !this.online;
    },
    disableInfo() {
      if (!this.reachable) {
        return "该用户已不可达";
      } else if (!this.online) {
        return "当前离线不能发消息";
      } else {
        return "";
      }
    }
  },
  // 在进入的时候 聚焦输入框
  mounted() {
    this.$refs.text.focus();
  },
  watch: {
    // 在选择其它对话的时候 聚焦输入框
    selectId() {
      setTimeout(() => {
        this.$refs.text.focus();
      }, 0);
    },
    // 当输入框中的值为空时 弹出提示  并在一秒后消失
    inputContent(v) {
      this.timer && clearTimeout(this.timer)
      v && (this.timer = setTimeout(() => {
        this.showUserCanChooseQuestion = true
        this.showUserCanChooseQuestionText = v
      }, 500))
      // if (this.inputContent === "") {
      //   if (this.frequency === 0) {
      //     this.warn = true;
      //     this.frequency++;
      //     setTimeout(() => {
      //       this.warn = false;
      //     }, 1000);
      //   }
      // }
    }
  }
};
</script>

<style lang="stylus" scoped>
.text {
  position: relative;
  height: 150px;
  background: #fff;

  .emoji {
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    padding: 0 10px;
    box-sizing: border-box;
    color: #7c7c7c;
    background-color: #fbfbfb;
    border-bottom: 1px solid #eee;
    .icon-look, .el-icon-picture {
      cursor: pointer;
      padding-right: 10px;
      font-size: 16px;

      &:hover {
        color: #1aad19;
      }
    }

    .emojiBox {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
      top: -210px;
      left: -100px;
      width: 300px;
      height: 200px;
      padding: 5px;
      background-color: #fff;
      border: 1px solid #d1d1d1;
      border-radius: 2px;
      box-shadow: 0 1px 2px 1px #d1d1d1;

      &.showbox-enter-active, &.showbox-leave-active {
        transition: all 0.5s;
      }

      &.showbox-enter, &.showbox-leave-active {
        opacity: 0;
      }
    }
  }
  .userCanChooseQuestion {
    position: absolute;
    top: 0;
    left: 50%;
    width: 90%;
    padding: 5px 10px;
    border: 1px solid #eee;
    font-size: 12px;
    color: #0094ff;
    transform: translate(-50%, calc(-100% - 5px));
    background: #fff;
    border-radius: 10px;
    &.showbox-enter-active, &.showbox-leave-active {
      transition: all 0.5s;
    }

    &.showbox-enter, &.showbox-leave-active {
      opacity: 0;
    }
    div {
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
  textarea {
    box-sizing: border-box;
    padding: 10px;
    height: 150px;
    width: 100%;
    border: none;
    outline: none;
    font-family: 'Micrsofot Yahei';
    resize: none;
    background-color: #fafafa;
  }

  .send {
    position: absolute;
    bottom: 10px;
    right: 30px;
    width: 75px;
    height: 28px;
    line-height: 28px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    background: #f5f5f5;
    font-size: 14px;
    color: #7c7c7c;

    &:hover {
      background: rgb(18, 150, 17);
      color: #fff;
    }
  }

  .warn {
    position: absolute;
    bottom: 50px;
    right: 10px;
    width: 110px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    text-align: center;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    box-shadow: 0 1px 5px 1px #bdbdbd;

    &:before {
      content: ' ';
      position: absolute;
      top: 100%;
      right: 20px;
      border: 7px solid transparent;
      border-top-color: #fff;
      filter: drop-shadow(1px 3px 2px #bdbdbd);
    }
  }
}
</style>
