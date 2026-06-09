import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlowingCard } from "../components/GlowingCard";

export const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题渐显
  const titleReveal = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // 三阶段卡片入场 (staggered)
  const step1Progress = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12 } });
  const step2Progress = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 12 } });
  const step3Progress = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 12 } });

  // 进度线条宽度动画 (frame 15 - 90)
  const progressLineWidth = interpolate(frame, [15, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="video-canvas">
      <div className="grid-bg" />
      <div className="glowing-orb orb-primary" style={{ top: "30%", left: "10%" }} />

      {/* 标题 */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: titleReveal,
          transform: `translateY(${(1 - titleReveal) * 20}px)`,
        }}
      >
        <h2 className="scene-title">
          <span className="gradient-text-purple">三阶段 </span>
          <span className="gradient-text-cyan">规范化工作流</span>
        </h2>
        <p className="scene-subtitle">
          规划、执行与验证阶段环环相扣，杜绝低效盲目编码，实现开发全流程的确定性。
        </p>
      </div>

      {/* 三阶段水平排布容器 */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "1100px",
          height: "360px",
          marginTop: "180px",
          zIndex: 5,
        }}
      >
        {/* 背景连接进度线 */}
        <div
          style={{
            position: "absolute",
            top: "70px", // 与卡片头部图标（48px高）的中心对齐
            left: "5%",
            width: "90%",
            height: "4px",
            backgroundColor: "rgba(255,255,255,0.06)",
            zIndex: 1,
          }}
        >
          {/* 活动流光进度线 */}
          <div
            style={{
              width: `${progressLineWidth}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
              boxShadow: "0 0 10px var(--color-secondary)",
            }}
          />
        </div>

        {/* 阶段 1: PLANNING */}
        <div
          style={{
            width: "320px",
            height: "100%",
            zIndex: 10,
            transform: `translateY(${(1 - step1Progress) * 25}px)`,
            opacity: step1Progress,
          }}
        >
          <GlowingCard startFrame={15} style={{ height: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* 卡片头部 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: frame > 25 ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.02)",
                    border: `1.5px solid ${frame > 25 ? "var(--color-primary)" : "rgba(255,255,255,0.1)"}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "var(--font-title)",
                    fontWeight: "800",
                    fontSize: "20px",
                    color: frame > 25 ? "var(--color-primary)" : "var(--color-text-muted)",
                  }}
                >
                  01
                </div>
                {frame > 35 && (
                  <div style={{ color: "var(--color-success)", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>已规划</span>
                  </div>
                )}
              </div>

              {/* 卡片标题 */}
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", fontFamily: "var(--font-title)" }}>
                PLANNING (规划)
              </h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", flex: 1 }}>
                研究现有代码库和架构依赖，编写详尽的中文实施计划，收集设计决策和开放性问题，提请用户审核。
              </p>
            </div>
          </GlowingCard>
        </div>

        {/* 阶段 2: EXECUTION */}
        <div
          style={{
            width: "320px",
            height: "100%",
            zIndex: 10,
            transform: `translateY(${(1 - step2Progress) * 25}px)`,
            opacity: step2Progress,
          }}
        >
          <GlowingCard startFrame={45} style={{ height: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* 卡片头部 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: frame > 55 ? "rgba(6, 182, 212, 0.2)" : "rgba(255,255,255,0.02)",
                    border: `1.5px solid ${frame > 55 ? "var(--color-secondary)" : "rgba(255,255,255,0.1)"}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "var(--font-title)",
                    fontWeight: "800",
                    fontSize: "20px",
                    color: frame > 55 ? "var(--color-secondary)" : "var(--color-text-muted)",
                  }}
                >
                  02
                </div>
                {frame > 65 && (
                  <div style={{ color: "var(--color-success)", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>已执行</span>
                  </div>
                )}
              </div>

              {/* 卡片标题 */}
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", fontFamily: "var(--font-title)" }}>
                EXECUTION (执行)
              </h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", flex: 1 }}>
                根据获批的实施计划逐步编写代码。结合 `task.md` 实时可视化任务列表，若遇方案偏差立刻回退重画。
              </p>
            </div>
          </GlowingCard>
        </div>

        {/* 阶段 3: VERIFICATION */}
        <div
          style={{
            width: "320px",
            height: "100%",
            zIndex: 10,
            transform: `translateY(${(1 - step3Progress) * 25}px)`,
            opacity: step3Progress,
          }}
        >
          <GlowingCard startFrame={75} style={{ height: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* 卡片头部 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: frame > 85 ? "rgba(236, 72, 153, 0.2)" : "rgba(255,255,255,0.02)",
                    border: `1.5px solid ${frame > 85 ? "#ec4899" : "rgba(255,255,255,0.1)"}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "var(--font-title)",
                    fontWeight: "800",
                    fontSize: "20px",
                    color: frame > 85 ? "#ec4899" : "var(--color-text-muted)",
                  }}
                >
                  03
                </div>
                {frame > 95 && (
                  <div style={{ color: "var(--color-success)", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>已验证</span>
                  </div>
                )}
              </div>

              {/* 卡片标题 */}
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", fontFamily: "var(--font-title)" }}>
                VERIFICATION (验证)
              </h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", flex: 1 }}>
                自动运行测试套件、构建并抓取系统日志，生成全面的修改文档（walkthrough.md），确立工程质量闭环。
              </p>
            </div>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
};
