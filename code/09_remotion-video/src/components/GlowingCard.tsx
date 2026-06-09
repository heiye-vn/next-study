import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface GlowingCardProps {
  children: React.ReactNode;
  startFrame: number;
  style?: React.CSSProperties;
  className?: string;
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  startFrame,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 入场动画：弹簧缩放和渐显
  const entryProgress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 15,
      mass: 0.8,
      stiffness: 90,
    },
  });

  const scale = interpolate(entryProgress, [0, 1], [0.85, 1]);
  const opacity = entryProgress;

  // 炫彩边框旋转动画
  const rotateAngle = (frame * 2) % 360;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        padding: "1px", // 边框宽度
        borderRadius: "16px",
        background: `linear-gradient(${rotateAngle}deg, #8b5cf6, #06b6d4, #d946ef, #8b5cf6)`,
        opacity,
        transform: `scale(${scale})`,
        boxShadow: `0 10px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(139, 92, 246, ${interpolate(entryProgress, [0, 1], [0, 0.15])})`,
        ...style,
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          height: "100%",
          padding: "24px",
          background: "var(--bg-card)",
          borderRadius: "15px", // 比外层稍小，防止溢出
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
};
