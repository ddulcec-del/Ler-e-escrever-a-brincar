import React, { useState } from 'react';

/**
 * Hand-drawn building blocks shared by the shell and the landing page:
 * the wobble filter, pencil underlines, small doodles and the hero drawing.
 * Everything is inline SVG that uses the theme colours, so it follows the
 * light and dark modes.
 */

/** Filter that bends straight borders like a line drawn by hand. Render once. */
export const SketchDefs: React.FC = () => (
  <>
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="sk-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" />
        </filter>
      </defs>
    </svg>
    {/* Inline so the #fragment always resolves against this document. */}
    <style>{`.sketch::before,.sk-wobble{filter:url(#sk-wobble)}`}</style>
  </>
);

/** A pencil stroke under a word. Stretches to the width of its parent. */
export const Scribble: React.FC<{
  className?: string;
  color?: string;
  delay?: number;
}> = ({ className = '', color = 'var(--color-mark)', delay = 0.5 }) => (
  <svg
    viewBox="0 0 300 18"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={`pointer-events-none absolute left-0 w-full overflow-visible ${className}`}
    fill="none"
  >
    <path
      d="M3 11C40 3 70 15 108 8s60-6 96 0 60 5 93-3"
      pathLength={1}
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      className="draw"
      style={
        {
          '--draw-time': '0.9s',
          '--draw-delay': `${delay}s`,
        } as React.CSSProperties
      }
    />
  </svg>
);

/** Yellow pencil used as the brand mark. */
export const PencilMark: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className={className} fill="none">
    <g
      transform="rotate(-45 20 20)"
      stroke="var(--color-ink)"
      strokeWidth={1.6}
      strokeLinejoin="round"
    >
      <path d="M2 20l8-4.5v9z" fill="#ecd2ad" />
      <path d="M2 20l3.2-1.8v3.6z" fill="var(--color-ink)" />
      <rect x="10" y="15.5" width="20" height="9" fill="var(--color-pencil)" />
      <rect x="30" y="15.5" width="3.5" height="9" fill="#cfc8b8" />
      <path d="M33.5 15.5h3a2 2 0 012 2v5a2 2 0 01-2 2h-3z" fill="var(--color-eraser)" />
    </g>
  </svg>
);

type DoodleName =
  | 'star'
  | 'arrow'
  | 'spiral'
  | 'dice'
  | 'book'
  | 'folder'
  | 'medal'
  | 'tick'
  | 'home'
  | 'route'
  | 'apple'
  | 'spark';

const DOODLES: Record<DoodleName, React.ReactNode> = {
  star: (
    <path d="M24 5.5l5.2 11.6 12.3 1.5-9.2 8.4 2.6 12.4L24 33l-11.1 6.6 2.9-12.5-9.3-8.3 12.5-1.4z" />
  ),
  arrow: (
    <>
      <path d="M5 30c9-14 22-19 37-15" />
      <path d="M33.5 8.5l8.8 6.4-8 6.6" />
    </>
  ),
  spiral: (
    <path d="M24.5 24c1.6-2.2 5-1 5 2 0 4-5 6-8.800 3.600-4.700-3-4-10.500 1.300-13 7-3.300 15 1.700 15 9.800 0 9-9 14.600-17.500 12.100" />
  ),
  dice: (
    <>
      <path d="M8.500 12.500l24-4 7 22.500-23.500 8.500z" />
      <path d="M16.500 18.200h.1M29 14.800h.1M24.500 23.500h.1M20.500 31h.1M33 27.500h.1" strokeWidth={4} />
    </>
  ),
  book: (
    <>
      <path d="M24 13c-4.500-3.600-10.500-4.200-17-2.500v25c6.500-1.700 12.500-1.100 17 2.500 4.500-3.600 10.500-4.200 17-2.500v-25c-6.500-1.700-12.500-1.100-17 2.500z" />
      <path d="M24 13.500v24" />
      <path d="M12 18c2.800-.5 5.300-.2 7.500.8M12 24c2.800-.5 5.300-.2 7.500.8M29 18.800c2.200-1 4.700-1.300 7.500-.8" />
    </>
  ),
  folder: (
    <>
      <path d="M6 37.500V11.500l12.500-.5 4 5 19.500-.3-.5 21.800z" />
      <path d="M13 24.500h21M13 30h14" />
    </>
  ),
  medal: (
    <>
      <path d="M16 5l5 13M32 5l-5 13" />
      <path d="M24 17.500c7.200 0 12.500 5.200 12.500 12.200S31 42 24 42s-12.500-5-12.500-12.200S16.800 17.500 24 17.500z" />
      <path d="M24 23.500l2 4.300 4.600.5-3.400 3.100 1 4.600-4.200-2.400-4.200 2.400 1-4.600-3.400-3.100 4.600-.5z" />
    </>
  ),
  home: (
    <>
      <path d="M5.5 24L24 7.500 42.500 23.500" />
      <path d="M11 20v20.500l26-.5V19.500" />
      <path d="M20.500 40V29.500h7.500V40" />
    </>
  ),
  route: (
    <>
      <path d="M8 41c0-11 15-7 15-16.500 0-8 11-5.500 15-3.500" />
      <path d="M38 21V6l-10 4.500 10 4" />
      <path d="M5 38l6 6M11 38l-6 6" />
    </>
  ),
  apple: (
    <>
      <path d="M24 15.500c-6-5-15.500-1-15.500 9 0 9 6 17 11 17 2 0 3-1 4.500-1s2.500 1 4.500 1c5 0 11-8 11-17 0-10-9.500-14-15.500-9z" />
      <path d="M24 15.500c0-4 2-7.500 5.500-9.500" />
    </>
  ),
  tick: <path d="M7 26.500c3.500 3 6 6.500 8 10.500C21 24 29 14 41 7" />,
  spark: (
    <path d="M24 5v11M24 32v11M5 24h11M32 24h11M11 11l7 7M30 30l7 7M37 11l-7 7M18 30l-7 7" />
  ),
};

/** Small line drawings in pencil. Decorative unless given a label. */
export const Doodle: React.FC<{
  name: DoodleName;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({ name, className = '', strokeWidth = 2.2, style }) => (
  <svg
    viewBox="0 0 48 48"
    aria-hidden="true"
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {DOODLES[name]}
  </svg>
);

/** Row of joined handwriting loops, as in a first penmanship exercise. */
function loopsPath(x0: number, baseline: number, count: number): string {
  const advance = 5.4; // forward travel per radian
  const radius = 11; // loop size
  const steps = 22; // segments per loop
  const pts: string[] = [];
  for (let i = 0; i <= count * steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = x0 + advance * t - radius * Math.sin(t);
    const y = baseline - radius + radius * Math.cos(t);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join('');
}

function wavePath(x0: number, baseline: number, count: number): string {
  let d = `M${x0} ${baseline}`;
  for (let i = 0; i < count; i++) {
    d += `q9 -24 18 0t18 0`;
  }
  return d;
}

const ROWS = [118, 196, 274, 352, 430];
const LOOPS_STATIC = loopsPath(86, ROWS[2], 8);
const LOOPS_LIVE = loopsPath(86, ROWS[3], 8);
const WAVES = wavePath(86, ROWS[1], 8);

/**
 * Hero drawing: a sheet of handwriting paper where a pencil draws a row of
 * loops. It plays once (so it does not keep pulling attention away from the
 * text) and again whenever the sheet is clicked.
 */
export const PencilSheet: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [run, setRun] = useState(0);
  const drawTime = '5.2s';

  return (
    <button
      type="button"
      onClick={() => setRun((n) => n + 1)}
      aria-label="Ver o lápis a escrever outra vez"
      className={`group block w-full cursor-pointer text-ink ${className}`}
    >
      <svg viewBox="0 0 480 540" className="w-full h-auto overflow-visible" fill="none">
        {/* hatched pencil shadow + the sheet */}
        <g transform="rotate(2.5 240 270)">
          <pattern id="hero-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="var(--color-ink)" strokeWidth="1.3" opacity="0.5" />
          </pattern>
          <rect x="52" y="50" width="388" height="460" fill="url(#hero-hatch)" />
          <rect
            x="40"
            y="36"
            width="388"
            height="460"
            fill="var(--color-sheet)"
            stroke="var(--color-ink)"
            strokeWidth="1.8"
            className="sk-wobble"
          />

          {/* punch holes and margin */}
          <circle cx="58" cy="120" r="6" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.4" />
          <circle cx="58" cy="266" r="6" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.4" />
          <circle cx="58" cy="412" r="6" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.4" />
          <line x1="76" y1="38" x2="76" y2="494" stroke="var(--color-mark)" strokeWidth="1.2" opacity="0.7" />

          {/* handwriting ruling: a guide line above each baseline */}
          {ROWS.map((y) => (
            <g key={y}>
              <line x1="78" y1={y - 22} x2="426" y2={y - 22} stroke="var(--color-rule)" strokeWidth="1" />
              <line x1="78" y1={y} x2="426" y2={y} stroke="var(--color-rule)" strokeWidth="1.6" />
            </g>
          ))}

          {/* row 1 — letters */}
          <text
            x="88"
            y={ROWS[0] - 2}
            className="hand"
            fontSize="40"
            fontWeight="700"
            fill="var(--color-ink)"
          >
            Aa Bb Cc Dd Ee
          </text>

          {/* rows 2 and 3 — already practised */}
          <path d={WAVES} stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
          <path d={LOOPS_STATIC} stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

          {/* teacher's note in red pen */}
          <g transform="rotate(-9 356 78)" stroke="var(--color-mark)" fill="var(--color-mark)">
            <text x="300" y="80" className="hand" fontSize="30" fontWeight="700" stroke="none">
              Muito bem!
            </text>
            <path d="M298 90c26-5 60-6 104-1" fill="none" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* row 4 — being drawn now */}
          <g key={run}>
            <path
              d={LOOPS_LIVE}
              pathLength={1}
              stroke="var(--color-pen)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="draw"
              style={
                {
                  '--draw-time': drawTime,
                  '--draw-ease': 'linear',
                  '--draw-delay': '0.5s',
                } as React.CSSProperties
              }
            />
            <g
              className="pencil-runner"
              style={{
                offsetPath: `path("${LOOPS_LIVE}")`,
                offsetRotate: '0deg',
                offsetDistance: '0%',
                animation: `pencil-travel ${drawTime} linear 0.5s forwards`,
              }}
            >
              <g
                style={{
                  animation: `pencil-rest 0.5s ease-out calc(${drawTime} + 0.6s) forwards`,
                }}
              >
                <g
                  transform="rotate(-58)"
                  stroke="var(--color-ink)"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                >
                  <path d="M0 0l26-11v22z" fill="#ecd2ad" />
                  <path d="M0 0l9-3.800v7.600z" fill="var(--color-ink)" />
                  <rect x="26" y="-11" width="124" height="22" fill="var(--color-pencil)" />
                  <path d="M26 -3.500h124M26 3.500h124" strokeWidth="1" opacity="0.45" />
                  <rect x="150" y="-11" width="15" height="22" fill="#cfc8b8" />
                  <path d="M155 -11v22M160 -11v22" strokeWidth="1" />
                  <path d="M165-11h14a5 5 0 015 5v12a5 5 0 01-5 5h-14z" fill="var(--color-eraser)" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </button>
  );
};
