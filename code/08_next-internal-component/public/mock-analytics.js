// 模拟第三方埋点分析脚本
console.log("🚀 [Mock Analytics] 脚本已下载并成功运行！");
window.mockAnalytics = {
  trackEvent: function (name, data) {
    console.log(`📊 [Analytics Event] ${name}:`, data);
  }
};
