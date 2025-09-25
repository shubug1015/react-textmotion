import './styles.scss';

import React from 'react';

import { NodeMotion, TextMotion } from '../../src';

const GlowCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="component-wrapper" ref={cardRef} onMouseMove={handleMouseMove}>
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>react-textmotion</h1>

      <GlowCard>
        <h2>TextMotion Component</h2>
        <TextMotion
          text={"Hello World! It's react-textmotion"}
          as="p"
          split="character"
          trigger="scroll"
          repeat={true}
          initialDelay={0.5}
          animationOrder="first-to-last"
          motion={{
            fade: {
              variant: 'in',
              duration: 0.25,
              delay: 0.025,
            },
            slide: {
              variant: 'up',
              duration: 0.25,
              delay: 0.025,
            },
          }}
        />
      </GlowCard>

      <GlowCard>
        <h2>NodeMotion Component</h2>
        <NodeMotion
          as="p"
          split="character"
          trigger="scroll"
          repeat={true}
          initialDelay={0.5}
          animationOrder="last-to-first"
          motion={{
            fade: {
              variant: 'in',
              duration: 0.25,
              delay: 0.025,
            },
            slide: {
              variant: 'up',
              duration: 0.25,
              delay: 0.025,
            },
          }}
        >
          Hello <strong>World!</strong> {"It's"} <em>react-textmotion</em>
        </NodeMotion>
      </GlowCard>
    </div>
  );
};

export default App;
