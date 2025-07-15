import './TextMotion.scss';

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
};

export const TextMotion: React.FC<TextMotionProps> = ({ as = 'span', text }) => {
  const Tag = as;

  return (
    <Tag aria-label={text}>
      {text.split('').map((item, index) => (
        <span key={index} style={{ animation: `fade 0.25s ease-out ${index * 0.025}s both` }} aria-hidden="true">
          {item === ' ' ? '\u00A0' : item}
        </span>
      ))}
    </Tag>
  );
};
