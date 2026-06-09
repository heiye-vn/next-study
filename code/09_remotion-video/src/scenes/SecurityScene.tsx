import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlowingCard } from "../components/GlowingCard";

export const SecurityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 场景标题入场
  const titleReveal = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // 盾牌入场动画 (frame 15)
  const shieldProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const shieldScale = interpolate(shieldProgress, [0, 1], [0.8, 1]);
  const shieldRotate = interpolate(shieldProgress, [0, 1], [-15, 0]);

  // 终端入场动画 (frame 30)
  const consoleProgress = spring({
    frame: Math.max(0, frame - 30),
    fps,
  });

  // 盾牌的持续呼吸脉冲效果
  const pulseScale = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.05]);

  // 控制台打字机效果模拟
  const logLines = [
    { text: "❯ [SYSTEM] 初始化安全审计扫描引擎...", frame: 45 },
    { text: "❯ [SCAN] 启动依赖安全校验 (scan_dependencies)...", frame: 75 },
    { text: "❯ [INFO] 扫描到 140 个包依赖，未发现已知 CVE 隐患。", frame: 105 },
    { text: "❯ [SCAN] 验证输入参数，开始全面威胁建模评估...", frame: 135 },
    { text: "❯ [OK] 安全验证已通过，审计报告生成完毕！ (walkthrough.md)", frame: 175 },
  ];

  return (
    <div className="video-canvas">
      <div className="grid-bg" />
      <div className="glowing-orb orb-secondary" style={{ bottom: "20%", right: "10%" }} />

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
          <span className="gradient-text-cyan">安全至上 </span>
          <span className="gradient-text-purple">防线坚实</span>
        </h2>
        <p className="scene-subtitle">
          内置依赖校验、实时源码静态审计与动态 PoC 验证，筑造不可逾越的安全红线。
        </p>
      </div>

      {/* 主展示区 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "1100px",
          height: "450px",
          marginTop: "160px",
          gap: "60px",
          zIndex: 5,
        }}
      >
        {/* 左侧：安全盾牌 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: shieldProgress,
            transform: `scale(${shieldScale * pulseScale}) rotate(${shieldRotate}deg)`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "300px",
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* 背后脉冲环 */}
            <div
              style={{
                position: "absolute",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                border: "2px solid var(--color-secondary)",
                opacity: interpolate(Math.sin(frame * 0.08), [-1, 1], [0.1, 0.4]),
                transform: `scale(${interpolate(Math.sin(frame * 0.08), [-1, 1], [0.9, 1.2])})`,
                filter: "blur(4px)",
              }}
            />
            {/* 盾牌 SVG */}
            <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="url(#shieldGrad)" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(6, 182, 212, 0.05)" />
              {/* 盾牌中心的锁 */}
              <rect x="9" y="11" width="6" height="5" rx="1" fill="var(--color-secondary)" opacity="0.3" stroke="var(--color-secondary)" strokeWidth="1"/>
              <path d="M10 11V9a2 2 0 0 1 4 0v2" stroke="var(--color-secondary)" strokeWidth="1"/>
              
              <defs>
                <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-secondary)" />
                  <stop offset="50%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* 安全检查通过的绿勾 */}
            {frame > 185 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "30px",
                  right: "30px",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-success)",
                  border: "4px solid var(--bg-dark)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
                  transform: `scale(${spring({ frame: frame - 185, fps, config: { damping: 10 } })})`,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：模拟终端 */}
        <div
          style={{
            flex: 1.5,
            height: "360px",
            opacity: consoleProgress,
            transform: `translateY(${(1 - consoleProgress) * 20}px)`,
          }}
        >
          <GlowingCard startFrame={30} style={{ height: "100%" }}>
            {/* 终端头部 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }} />
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
              </div>
              <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                security_scan.log
              </span>
            </div>
            {/* 终端日志内容 */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                lineHeight: "1.8",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flex: 1,
                overflow: "hidden",
              }}
            >
              {logLines.map((line, idx) => {
                if (frame < line.frame) return null;
                
                // 计算该行字符的打印进度 (用 15 帧打完)
                const charCount = Math.floor(
                  interpolate(frame - line.frame, [0, 15], [0, line.text.length], {
                    extrapolateRight: "clamp",
                  })
                );
                const printedText = line.text.substring(0, charCount);
                const isCurrent = frame >= line.frame && frame < line.frame + 18;
                
                // 判断颜色前缀
                let color = "var(--color-text-main)";
                if (line.text.includes("[OK]")) color = "var(--color-success)";
                if (line.text.includes("[SCAN]")) color = "var(--color-secondary)";
                if (line.text.includes("[SYSTEM]")) color = "var(--color-primary)";

                return (
                  <div key={idx} style={{ color, whiteSpace: "nowrap" }}>
                    {printedText}
                    {isCurrent && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "15px",
                          backgroundColor: color,
                          marginLeft: "3px",
                          verticalAlign: "middle",
                          animation: "blink 1s step-end infinite",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
};
