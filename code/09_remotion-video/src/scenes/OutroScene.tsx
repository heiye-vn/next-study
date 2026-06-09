import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 入场动画进度
  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const scale = interpolate(entryProgress, [0, 1], [0.85, 1]);
  const opacity = entryProgress;

  // 炫彩背景环持续旋转与呼吸
  const logoRotate = frame * 0.5;
  const pulseScale = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.98, 1.02]);

  return (
    <div className="video-canvas">
      <div className="grid-bg" />
      <div className="glowing-orb orb-primary" style={{ top: "20%", left: "20%" }} />
      <div className="glowing-orb orb-secondary" style={{ bottom: "20%", right: "20%" }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          opacity,
          transform: `scale(${scale * pulseScale})`,
          textAlign: "center",
        }}
      >
        {/* 缩小的几何勋章，居于上方 */}
        <div
          style={{
            transform: `rotate(${logoRotate}deg)`,
            width: "160px",
            height: "160px",
            marginBottom: "30px",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="var(--color-secondary)" strokeWidth="1" strokeDasharray="3 3" />
            <polygon points="50,20 76,70 24,70" stroke="var(--color-primary)" strokeWidth="1" />
            <circle cx="50" cy="50" r="8" fill="var(--color-secondary)" filter="drop-shadow(0px 0px 8px var(--color-secondary))" />
          </svg>
        </div>

        {/* 品牌大标题 */}
        <h1
          className="gradient-text"
          style={{
            fontSize: "80px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
            textShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
          }}
        >
          Antigravity 2.0
        </h1>

        {/* 核心口号 Slogan */}
        <p
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "26px",
            color: "var(--color-text-main)",
            fontWeight: 600,
            marginBottom: "8px",
            letterSpacing: "0.02em",
          }}
        >
          赋能全球代码库，升华软件工程
        </p>

        {/* 副标口号 */}
        <p
          style={{
            fontSize: "18px",
            color: "var(--color-text-muted)",
            fontWeight: 400,
            maxWidth: "600px",
            lineHeight: "1.6",
            letterSpacing: "0.05em",
          }}
        >
          EMPOWER YOUR CODEBASE • ELEVATE YOUR ENGINEERING
        </p>

        {/* 团队标识 */}
        <div
          style={{
            marginTop: "60px",
            padding: "8px 24px",
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(255, 255, 255, 0.02)",
            fontSize: "14px",
            color: "var(--color-text-muted)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-mono)",
          }}
        >
          DESIGNED BY GOOGLE DEEPMIND TEAM
        </div>
      </div>
    </div>
  );
};
