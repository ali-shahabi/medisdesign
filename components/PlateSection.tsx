/* The hall section used to be a cropped JPEG — the drawing ran off all four
   edges of the bitmap, so the plate showed a fragment of a room. It is drawn
   here instead: shell, stage, screen, raked seating with seat backs, and the
   reflection paths between the screen and the ceiling. Vector, so it stays
   crisp at any size and nothing is cut. */

/* reflection paths: from the top and the bottom of the screen up to the ceiling */
const RAYS: [number, number][] = [
  [168, 44],
  [300, 44],
  [432, 44],
  [228, 44],
  [360, 44],
  [456, 44],
];

/* seat backs, standing on the treads */
const SEATS: [number, number, number][] = [
  [162, 250, 238],
  [218, 236, 224],
  [274, 222, 210],
  [330, 208, 196],
  [386, 194, 182],
];

export function PlateSection() {
  return (
    <svg
      viewBox="0 0 480 320"
      role="img"
      aria-labelledby="plate-section-title"
      preserveAspectRatio="xMidYMid meet"
      className="plate-art"
    >
      <title id="plate-section-title">مقطع سالن: پرده، سکو و شیب نشیمن با مسیرهای بازتاب صدا</title>
      <g fill="none" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter">
        {/* shell */}
        <path d="M24 44 H456" strokeWidth="3" />
        <path d="M24 44 V268 M456 44 V268 M24 268 H456" strokeWidth="0.9" opacity="0.55" />

        {/* stage */}
        <path d="M24 236 H136 V268" strokeWidth="1.5" />

        {/* reflection paths */}
        <g strokeWidth="0.7" opacity="0.42">
          {RAYS.slice(0, 3).map(([x]) => (
            <path key={`t${x}`} d={`M44 96 L${x} 44`} />
          ))}
          {RAYS.slice(3).map(([x]) => (
            <path key={`b${x}`} d={`M44 196 L${x} 44`} />
          ))}
        </g>

        {/* screen */}
        <path d="M44 96 V196" strokeWidth="1.8" />

        {/* raked seating */}
        <path
          d="M140 250 H196 V236 H252 V222 H308 V208 H364 V194 H420 V180 H444"
          strokeWidth="2.2"
        />

        {/* seat backs */}
        <g strokeWidth="1.2" opacity="0.7">
          {SEATS.map(([x, from, to]) => (
            <path key={`s${x}`} d={`M${x} ${from} V${to}`} />
          ))}
        </g>
      </g>
    </svg>
  );
}