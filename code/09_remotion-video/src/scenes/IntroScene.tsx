import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, random } from "remotion";
import { TextReveal } from "../components/TextReveal";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 反重力浮动粒子数据
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      x: random(`particle-x-${i}`) * width,
      yStart: random(`particle-ystart-${i}`) * height + height, // 从屏幕下方开始
      size: random(`particle-size-${i}`) * 6 + 2,
      speed: random(`particle-speed-${i}`) * 3 + 1,
      opacity: random(`particle-opacity-${i}`) * 0.5 + 0.2,
      delay: random(`particle-delay-${i}`) * 60,
    }));
  }, [width, height]);

  // 徽章入场动画
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const logoScale = interpolate(logoProgress, [0, 1], [0.5, 1]);
  const logoOpacity = logoProgress;
  const logoRotate = frame * 0.4; // 持续旋转

  return (
    <div className="video-canvas">
      {/* 霓虹网格背景 */}
      <div className="grid-bg" />
      <div className="glowing-orb orb-primary" />
      <div className="glowing-orb orb-secondary" />

      {/* 反重力粒子 */}
      {particles.map((p, i) => {
        const activeFrame = Math.max(0, frame - p.delay);
        const y = p.yStart - activeFrame * p.speed * 2;
        // 如果飘出屏幕顶部，循环回底部
        const yAdjusted = y < -50 ? height + (y % (height + 50)) : y;
        
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: yAdjusted,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: i % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)",
              opacity: p.opacity,
              boxShadow: `0 0 10px ${i % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)"}`,
            }}
          />
        );
      })}

      {/* 中心几何动力徽章 */}
      <div
        style={{
          position: "absolute",
          opacity: logoOpacity,
          transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
          width: "350px",
          height: "350px",
          zIndex: 1,
        }}
      >
        <svg width="350" height="350" viewBox="0 0 100 100" fill="none">
          {/* 外环 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#ringGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* 内三角结构 */}
          <polygon
            points="50,15 80,75 20,75"
            stroke="var(--color-secondary)"
            strokeWidth="1"
            strokeDasharray="1 1"
          />
          {/* 中心核心发光圆 */}
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="url(#coreGrad)"
            filter="drop-shadow(0px 0px 10px var(--color-primary))"
          />
          
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
            <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="50%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 文本内容 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        {/* 主标题 */}
        <h1
          className="gradient-text"
          style={{
            fontSize: "96px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          <TextReveal text="Antigravity 2.0" startFrame={20} stagger={3} />
        </h1>

        {/* 副标题 */}
        <p
          style={{
            fontSize: "28px",
            color: "var(--color-text-muted)",
            fontWeight: 400,
            marginTop: "10px",
            letterSpacing: "0.05em",
          }}
        >
          <TextReveal text="THE NEXT GENERATION AGENTIC AI CODING ASSISTANT" startFrame={60} stagger={1.5} />
        </p>
      </div>
    </div>
  );
};
