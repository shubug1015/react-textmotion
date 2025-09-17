# react-textmotion · [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![codecov](https://codecov.io/gh/shubug1015/react-textmotion/graph/badge.svg?token=S6CPN2KSCX)](https://codecov.io/gh/shubug1015/react-textmotion) [![npm version](https://img.shields.io/npm/v/react-textmotion.svg)](https://www.npmjs.com/package/react-textmotion) <!-- > [![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-textmotion)](https://bundlephobia.com/package/react-textmotion) -->

> 🚀 Animate text and UI elements effortlessly in React.
> Lightweight, fully tested, and production-ready.

`react-textmotion` is a **lightweight yet powerful React library** to animate text and components with ease.  
From **character-level typing effects** to **complex UI block animations**, it provides intuitive APIs, presets, and full customizability.

## Features

- **Lightweight & Performant** – minimal footprint, no heavy deps
- **Robust & Tested** – 100% test coverage with Jest + React Testing Library
- **Flexible API** – animate by character, word, or line
- **Presets & Motion** – use built-in effects or define your property values
- **Developer-Friendly** – JSDoc, examples, TypeScript support

## Installation

```bash
npm install react-textmotion
# or
yarn add react-textmotion
# or
pnpm add react-textmotion
```

## Quick Start

```tsx
import { TextMotion } from 'react-textmotion';

export default function App() {
  return (
    <TextMotion
      text="Hello World!"
      split="character"
      preset={['fade-in', 'slide-up']}
    />
  );
}
```

Instantly animates `"Hello World!"` with fade + slide.

<!-- ## Demo

- 📺 [Live Demo on CodeSandbox](https://codesandbox.io/s/react-textmotion-demo-xxxxx)
- 📸 Preview:

<p align="center">
  <img src="https://raw.githubusercontent.com/shubug1015/react-textmotion/main/assets/demo-textmotion.gif" width="500" alt="TextMotion demo" />
</p>

--- -->

## Components

### `TextMotion`

Animate **plain text strings** with per-character, word, or line animations.

```tsx
<TextMotion
  as="span"
  text="Hello World!"
  split="character"
  trigger="scroll"
  repeat={false}
  initialDelay={0.5}
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
```

### `NodeMotion`

Animate **any React children** (mixed tags, custom components, blocks).

```tsx
<NodeMotion
  split="character"
  trigger="scroll"
  repeat={false}
  initialDelay={0.5}
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
  <span>Hello</span> <b>World!</b>
</NodeMotion>
```

## API Reference

| Prop           | Type                              | Default       | Description                                    |
| -------------- | --------------------------------- | ------------- | ---------------------------------------------- |
| `as`           | `string`                          | `"span"`      | HTML tag wrapper                               |
| `split`        | `"character" \| "word" \| "line"` | `"character"` | Text split granularity                         |
| `trigger`      | `"on-load" \| "scroll"`           | `"scroll"`    | When animation starts                          |
| `repeat`       | `boolean`                         | `true`        | Repeat entire animation                        |
| `initialDelay` | `number`                          | `0`           | Initial delay before animation starts (in `s`) |
| `motion`       | `MotionConfig`                    | `-`           | Custom animation config                        |
| `preset`       | `AnimationPreset[]`               | `-`           | Predefined animation presets                   |

<!-- > Full details: [API Docs](./docs/API.md) -->

## Presets

`react-textmotion` simplifies animation creation with a set of predefined animation presets. These presets offer common animation patterns that you can use directly via the `preset` prop, or as inspiration for custom animations using the `motion` prop.

Here's a quick overview of the available animation types and their variants:

- **`fade`**: Controls the opacity of the elements.
  - `fade-in`: Elements appear by fading in.
  - `fade-out`: Elements disappear by fading out.
- **`slide`**: Moves elements in a specified direction.
  - `slide-up`: Elements slide upwards.
  - `slide-down`: Elements slide downwards.
  - `slide-left`: Elements slide to the left.
  - `slide-right`: Elements slide to the right.
- **`scale`**: Adjusts the size of the elements.
  - `scale-in`: Elements grow in size.
  - `scale-out`: Elements shrink in size.
- **`rotate`**: Rotates elements around their center.
  - `rotate-clockwise`: Elements rotate in a clockwise direction.
  - `rotate-counterclockwise`: Elements rotate in a counter-clockwise direction.
- **`bounce`**: Creates a bouncing effect.
  - `bounce-in`: Elements bounce into view.
  - `bounce-out`: Elements bounce out of view.
- **`elastic`**: Provides an elastic, spring-like movement.
  - `elastic-in`: Elements move into view with an elastic effect.
  - `elastic-out`: Elements move out of view with an elastic effect.
- **`flip`**: Flips elements along an axis.
  - `flip-in`: Elements flip into view.
  - `flip-out`: Elements flip out of view.

## Testing & Quality

- 100% test coverage with Jest + React Testing Library
- GitHub Actions CI (build, lint, test, coverage)
- TypeScript definitions included

<!-- ## 🤝 Contributing

Contributions are welcome!
See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, coding style, and PR guidelines.

```bash
git clone https://github.com/shubug1015/react-textmotion
cd react-textmotion
npm install
npm test
```

--- -->

## License

MIT © 2025 [Donghyun Lee](https://github.com/shubug1015) . For more details, see [LICENSE](./LICENSE)
