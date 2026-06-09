import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

interface TextRevealProps {
  text: string;
  startFrame: number;
  stagger?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  startFrame,
  stagger = 2,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const characters = Array.from(text);

  return (
    <span style={{ display: "inline-block", whiteSpace: "pre-wrap", ...style }} className={className}>
      {characters.map((char, index) => {
        // 计算每个字符的起动帧率
        const delay = index * stagger;
        const charFrame = frame - startFrame - delay;
        
        // 使用 spring 动效让字符弹跳显现
        const progress = spring({
          frame: Math.max(0, charFrame),
          fps,
          config: {
            damping: 14,
            mass: 0.5,
            stiffness: 100,
          },
        });

        // 插值计算样式
        const opacity = progress;
        const translateY = (1 - progress) * 25; // 从下往上 25px
        const blur = (1 - progress) * 8; // 从模糊到清晰

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${translateY}px)`,
              filter: `blur(${blur}px)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};
