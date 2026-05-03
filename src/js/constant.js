export const MESSAGE_TYPE_TEXT = 1; // 文字
export const MESSAGE_TYPE_FILE = 2; // 普通文件
export const MESSAGE_TYPE_IMAGE = 3; // 图片
export const MESSAGE_TYPE_AUDIO = 4; // 音频
export const MESSAGE_TYPE_VIDEO = 5; // 视频
export const MESSAGE_TYPE_AUDIO_ONLINE = 6; // 语音聊天
export const MESSAGE_TYPE_VIDEO_ONLINE = 7; // 视频聊天

export const MESSAGE_TYPE_SYSTEM_TIP = 8; // 系统消息/说明性消息/说明性推送
export const MESSAGE_TYPE_SYSTEM_PIC = 9; // 系统图片/说明性图片

export const MESSAGE_TYPE_DIAL_MEDIA_START = 10; // 拨打媒体开始占位符
export const MESSAGE_TYPE_DIAL_AUDIO_ONLINE = 11; // 语音聊天拨号
export const MESSAGE_TYPE_ACCEPT_AUDIO_ONLINE = 12; // 语音聊天接听
export const MESSAGE_TYPE_CANCELL_AUDIO_ONLINE = 13; // 语音聊天取消
export const MESSAGE_TYPE_REJECT_AUDIO_ONLINE = 14; // 语音聊天拒接

export const MESSAGE_TYPE_DIAL_VIDEO_ONLINE = 15; // 视频聊天拨号
export const MESSAGE_TYPE_ACCEPT_VIDEO_ONLINE = 16; // 视频聊天接听
export const MESSAGE_TYPE_CANCELL_VIDEO_ONLINE = 17; // 视频聊天取消
export const MESSAGE_TYPE_REJECT_VIDEO_ONLINE = 18; // 视频聊天拒接

export const MESSAGE_TYPE_DIAL_MEDIA_END = 20; // 拨打媒体结束占位符


export const MESSAGE_TYPE_ORDER = 21; // 订单信息
export const MESSAGE_TYPE_ORDER_STATUS = 22; // 订单信息状态
export const MESSAGE_TYPE_RECIPE_INFO = 23; // 处方信息
export const MESSAGE_TYPE_VIDEO_CARD = 24; // 视频卡片
export const MESSAGE_TYPE_VIDEO_INFO = 25; // 视频信息
export const MESSAGE_TYPE_VIDEO_TIP = 26; // 视频信息
export const MESSAGE_TYPE_STATUS_TIP = 28; // 状态提示


export default {
    messgaeTypeInfo :{
        'image': MESSAGE_TYPE_IMAGE,    
        'order': MESSAGE_TYPE_ORDER,
        'recipeInfo' : MESSAGE_TYPE_RECIPE_INFO,
        'system': MESSAGE_TYPE_SYSTEM_TIP,
        'text': MESSAGE_TYPE_TEXT,
        'tip': MESSAGE_TYPE_SYSTEM_TIP,
        'videoCard': MESSAGE_TYPE_VIDEO_CARD,
        'videoInfo': MESSAGE_TYPE_VIDEO_INFO
    }

}


export const MESSAGE_TRANS_TYPE = "webrtc"; // 消息传输类型：如果是心跳消息，该内容为heatbeat,在线视频或者音频为webrtc
export const MESSAGE_ACK_TYPE = "ack"; 
export const MESSAGE_READ_TYPE = "read";
export const MESSAGE_HISTORY_TYPE = "history";
export const MESSAGE_PING_TYPE = "ping";
export const MESSAGE_PONG_TYPE = "pong";
export const MESSAGE_HEATBEAT_TYPE = "heatbeat";
export const MESSAGE_RELOAD = "reload";
export const MESSAGE_ACCEPT = "accept";

export const MESSAGE_CULL_TYPE = "cull";
export const MESSAGE_END_TYPE = "end";
export const MESSAGE_REFUND_TYPE = "refund";
export const MESSAGE_CALL_TYPE = "call";
export const MESSAGE_LIST_TYPE = "list";
export const MESSAGE_RECIPE_TYPE = "recipe";

