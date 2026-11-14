// 看视频活动 / 课程试卷 · WatchVideoResult 返回的 status 枚举（后端共用一套枚举）
// 与后端 pkg/common/response/get_activity_info.go 的 WatchVideoStatus* 保持一致
export const WatchVideoStatus = {
  Continue: 1, // 可继续：未达标可重答 / 本轮已领取可继续下一轮（需结合 is_award 区分）
  Result: 2,   // 答题结算，跳转结果页（TopicInfo 返回）
  Error: 3,    // 异常，需先看视频/答题
  Award: 4,    // 达标待领取，展示领取入口
  Awarded: 5,  // 已领取终态（单次活动或已达发奖上限）
  Limit: 6,    // 已达参与次数上限
} as const;

// 看视频活动 / 课程试卷 · is_award 状态枚举
// 与后端 internal/model/watch_video_user.go、internal/model/course/course_question_user.go 保持一致
export const WatchVideoIsAward = {
  Win: 1,              // 达标待领取
  None: 2,             // 未达标 / 初始可参与
  Received: 3,         // 已领取（终态，达 award_times 上限）
  Continue: 4,         // 已达标发奖未领取可继续（保留位，本次未使用）
  ReceivedContinue: 5, // 本轮已领取，可继续下一轮
} as const;
