import React from "react";
import { Series } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { TeamworkScene } from "./scenes/TeamworkScene";
import { SecurityScene } from "./scenes/SecurityScene";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { OutroScene } from "./scenes/OutroScene";

export const MyComposition: React.FC = () => {
  return (
    <Series>
      {/* 0s - 6s: 开场 */}
      <Series.Sequence durationInFrames={180} layout="none">
        <IntroScene />
      </Series.Sequence>

      {/* 6s - 14s: 多智能体协同 */}
      <Series.Sequence durationInFrames={240} layout="none">
        <TeamworkScene />
      </Series.Sequence>

      {/* 14s - 22s: 安全守护 */}
      <Series.Sequence durationInFrames={240} layout="none">
        <SecurityScene />
      </Series.Sequence>

      {/* 22s - 30s: 三阶段工作流 */}
      <Series.Sequence durationInFrames={240} layout="none">
        <WorkflowScene />
      </Series.Sequence>

      {/* 30s - 36s: 结尾总结与 Slogan */}
      <Series.Sequence durationInFrames={180} layout="none">
        <OutroScene />
      </Series.Sequence>
    </Series>
  );
};
