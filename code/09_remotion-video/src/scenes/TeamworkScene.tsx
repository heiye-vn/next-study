import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlowingCard } from "../components/GlowingCard";

export const TeamworkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 场景标题渐显
  const titleReveal = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // 主 Agent 入场 (frame 15)
  const mainAgentProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
  });

  // 线条绘制进度 (frame 35 - 55)
  const lineProgress = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 子 Agent 入场 (staggered)
  const sub1Progress = spring({ frame: Math.max(0, frame - 45), fps });
  const sub2Progress = spring({ frame: Math.max(0, frame - 55), fps });
  const sub3Progress = spring({ frame: Math.max(0, frame - 65), fps });

  // 状态闪烁点动画
  const dotOpacity = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.3, 1]);

  return (
    <div className="video-canvas">
      <div className="grid-bg" />
      <div className="glowing-orb orb-primary" style={{ top: "10%", left: "30%" }} />

      {/* 头部标题区 */}
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
          <span className="gradient-text-purple">多智能体 </span>
          <span className="gradient-text-cyan">并行协同</span>
        </h2>
        <p className="scene-subtitle">
          定义并唤醒专属子智能体，分工执行调研、编码与审计任务，成倍提升研发效率。
        </p>
      </div>

      {/* 智能体关系拓扑图区域 */}
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "550px",
          marginTop: "160px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* SVG 连接线网络 */}
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {/* 主节点到 Research Agent 的连线 (Left) */}
          {lineProgress > 0 && (
            <>
              <path
                d="M 600,160 C 600,240 250,220 250,320"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeDasharray="400"
                strokeDashoffset={400 * (1 - lineProgress)}
                opacity="0.4"
              />
              {lineProgress === 1 && (
                <path
                  d="M 600,160 C 600,240 250,220 250,320"
                  fill="none"
                  stroke="var(--color-secondary)"
                  strokeWidth="3.5"
                  className="svg-flow-path"
                  filter="drop-shadow(0px 0px 5px var(--color-secondary))"
                />
              )}
            </>
          )}

          {/* 主节点到 Coding Agent 的连线 (Center) */}
          {lineProgress > 0 && (
            <>
              <path
                d="M 600,160 L 600,320"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeDasharray="160"
                strokeDashoffset={160 * (1 - lineProgress)}
                opacity="0.4"
              />
              {lineProgress === 1 && (
                <path
                  d="M 600,160 L 600,320"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3.5"
                  className="svg-flow-path"
                  filter="drop-shadow(0px 0px 5px var(--color-primary))"
                />
              )}
            </>
          )}

          {/* 主节点到 Security Agent 的连线 (Right) */}
          {lineProgress > 0 && (
            <>
              <path
                d="M 600,160 C 600,240 950,220 950,320"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeDasharray="400"
                strokeDashoffset={400 * (1 - lineProgress)}
                opacity="0.4"
              />
              {lineProgress === 1 && (
                <path
                  d="M 600,160 C 600,240 950,220 950,320"
                  fill="none"
                  stroke="var(--color-secondary)"
                  strokeWidth="3.5"
                  className="svg-flow-path"
                  filter="drop-shadow(0px 0px 5px var(--color-secondary))"
                />
              )}
            </>
          )}
        </svg>

        {/* 节点元素 */}
        {/* 1. 主智能体 Parent Node (Top Center) */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            width: "320px",
            height: "100px",
            zIndex: 10,
            transform: `scale(${interpolate(mainAgentProgress, [0, 1], [0.8, 1])})`,
            opacity: mainAgentProgress,
          }}
        >
          <GlowingCard startFrame={15}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(139, 92, 246, 0.2)",
                  border: "2px solid var(--color-primary)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 0 15px rgba(139, 92, 246, 0.6)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-title)" }}>Antigravity 2.0</h4>
                <p style={{ fontSize: "13px", color: "var(--color-secondary)" }}>主智能体 / Orchestrator</p>
              </div>
            </div>
          </GlowingCard>
        </div>

        {/* 2. 子智能体 1: Research Agent (Bottom Left) */}
        <div
          style={{
            position: "absolute",
            top: "320px",
            left: "80px",
            width: "280px",
            height: "140px",
            zIndex: 10,
            transform: `translateY(${(1 - sub1Progress) * 20}px)`,
            opacity: sub1Progress,
          }}
        >
          <GlowingCard startFrame={45}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(6, 182, 212, 0.2)", border: "1px solid var(--color-secondary)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div>
                  <h5 style={{ fontSize: "16px", fontWeight: "600" }}>Research Agent</h5>
                  <p style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>学术级调研与检索</p>
                </div>
              </div>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-success)", opacity: dotOpacity }} />
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  {frame > 90 ? "DONE: 检索完毕 (12篇文献)" : "TASK: 扫描依赖库文档..."}
                </span>
              </div>
            </div>
          </GlowingCard>
        </div>

        {/* 3. 子智能体 2: Coding Agent (Bottom Center) */}
        <div
          style={{
            position: "absolute",
            top: "320px",
            left: "460px",
            width: "280px",
            height: "140px",
            zIndex: 10,
            transform: `translateY(${(1 - sub2Progress) * 20}px)`,
            opacity: sub2Progress,
          }}
        >
          <GlowingCard startFrame={55}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(139, 92, 246, 0.2)", border: "1px solid var(--color-primary)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <h5 style={{ fontSize: "16px", fontWeight: "600" }}>Coding Agent</h5>
                  <p style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>业务与算法代码编写</p>
                </div>
              </div>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: frame > 160 ? "var(--color-success)" : "var(--color-warning)", opacity: dotOpacity }} />
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  {frame > 160 ? "DONE: 核心逻辑已重构" : "TASK: 编织单元测试..."}
                </span>
              </div>
            </div>
          </GlowingCard>
        </div>

        {/* 4. 子智能体 3: Security Agent (Bottom Right) */}
        <div
          style={{
            position: "absolute",
            top: "320px",
            left: "840px",
            width: "280px",
            height: "140px",
            zIndex: 10,
            transform: `translateY(${(1 - sub3Progress) * 20}px)`,
            opacity: sub3Progress,
          }}
        >
          <GlowingCard startFrame={65}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(236, 72, 153, 0.2)", border: "1px solid #ec4899", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h5 style={{ fontSize: "16px", fontWeight: "600" }}>Security Agent</h5>
                  <p style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>静态安全扫描与验证</p>
                </div>
              </div>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: frame > 210 ? "var(--color-success)" : "var(--color-warning)", opacity: dotOpacity }} />
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  {frame > 210 ? "DONE: 静态扫描通过" : "TASK: 校验 XSS 注入风险..."}
                </span>
              </div>
            </div>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
};
