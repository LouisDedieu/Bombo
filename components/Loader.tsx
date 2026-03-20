import { useEffect, useState } from 'react';
import Svg, { Rect, G, Path } from 'react-native-svg';
import { colors } from '@/constants/colors';

const TOTAL_DOTS = 13;
const TRAIL = 4;

interface LoaderProps {
  size?: number;
  color?: string;
  speed?: number;
}

interface Point {
  x: number;
  y: number;
}

interface DotPoint extends Point {
  angle: number;
}

export default function Loader({
  size = 72,
  color = colors.textPrimary,
  speed = 110,
}: LoaderProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => s + 1), speed);
    return () => clearInterval(interval);
  }, [speed]);

  const getPoint = (progress: number): Point => {
    const angle = progress * Math.PI * 2;
    const denom = 1 + Math.sin(angle) ** 2;
    const a = size * 0.36;
    return {
      x: (a * Math.cos(angle)) / denom,
      y: (a * Math.sin(angle) * Math.cos(angle)) / denom,
    };
  };

  const getTangentAngle = (progress: number): number => {
    const eps = 0.001;
    const p1 = getPoint((progress - eps + 1) % 1);
    const p2 = getPoint((progress + eps) % 1);
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  };

  const dots: DotPoint[] = Array.from({ length: TOTAL_DOTS }, (_, i) => ({
    ...getPoint(i / TOTAL_DOTS),
    angle: getTangentAngle(i / TOTAL_DOTS),
  }));

  const pin = dots[step % TOTAL_DOTS];
  const dotSize = size * 0.072;
  const cx = size * 0.5;
  const cy = size * 0.5;

  const trailIndices = Array.from({ length: TRAIL }, (_, i) => ({
    idx: (((step - 1 - i) % TOTAL_DOTS) + TOTAL_DOTS) % TOTAL_DOTS,
    opacity: 1 - (i / TRAIL) * 0.75,
    scale: 1 - (i / TRAIL) * 0.35,
  }));

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`${-cx} ${-cy} ${size} ${size}`}
    >
      {trailIndices.map(({ idx, opacity, scale }) => {
        const dot = dots[idx];
        const s = dotSize * scale;
        return (
          <Rect
            key={idx}
            x={-s / 2}
            y={-s / 2}
            width={s}
            height={s}
            fill={color}
            opacity={opacity}
            transform={`translate(${dot.x}, ${dot.y}) rotate(${dot.angle})`}
          />
        );
      })}

      <G transform={`translate(${pin.x}, ${pin.y})`}>
        <G transform={`scale(${size * 0.00115}) translate(-70.5, -140)`}>
          <Path
            d="M120.023 119.54L70.3083 169.056L20.5929 119.54C-6.86428 92.1936 -6.86428 47.8563 20.5929 20.5097C48.0499 -6.83681 92.5667 -6.83681 120.023 20.5097C147.481 47.8563 147.481 92.1936 120.023 119.54ZM70.3083 136.046L103.452 103.035C121.756 84.8041 121.756 55.2458 103.452 37.0147C85.1469 18.7838 55.4697 18.7838 37.1646 37.0147C18.86 55.2458 18.86 84.8041 37.1646 103.035L70.3083 136.046Z"
            fill={color}
          />
        </G>
      </G>
    </Svg>
  );
}
