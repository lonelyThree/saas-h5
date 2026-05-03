export const activityInfoStatus = {
  ActivityInfoStatusNormal: 1,       // 继续
  ActivityInfoStatusEnd: 2,          // 当天回答结束
  ActivityInfoStatusNoStart: 3,      // 未开始
  ActivityInfoStatusMobile: 4,       // 需绑定手机号
  ActivityInfoStatusLimit: 5,        // 活动限额
  ActivityInfoStatusDayLimit: 6,     // 每日限额
  ActivityInfoStatusLimitChain: 7,   // 指定连锁
  ActivityInfoStatusAuth: 8,         // 需要认证
  ActivityInfoStatusLimitAuth: 9,    // 渠道隐藏未认证
  ActivityInfoStatusDayEnd: 10        // 活动结束
} as const;
