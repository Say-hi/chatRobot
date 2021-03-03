let chat_server = 'http://106.52.213.134:8400/api/scs/';
// let chat_server = 'http://127.0.0.1:8400/api/scs/';
let apiPaths = {
  websocket: {
    endpoint: chat_server + "/ws",
    path: {
      subMsg: "/user/topic/subNewMsg",
      reachableChange: "/user/topic/reachableChange"
    }
  },
  chat: {
    getChatList: chat_server + "/chat/getChatList",
    getChatItemByOpenId: chat_server + "/chat/getChatItemByOpenId",
    getRecordsByOpenId: chat_server + "/chat/getRecordsByOpenId",
    setRead: chat_server + '/chat/setRead',
    send: chat_server + "answer",
    // 发送图片消息
    sendImage: chat_server + "/chat/sendImage",
  },
  hule: {
    login: chat_server + 'login',
    logout: chat_server + 'logout',
    getInitInfo: chat_server + 'getInfo',
    questionList: chat_server + 'questionList',
    chatRecord: chat_server + 'chatRecord',
  }
}
export default apiPaths