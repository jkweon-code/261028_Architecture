// 사진이 없을 때 대신 보여 주는 건축 도면풍 그림 (평면·단면·입면)
// 같은 seed(예: 연구 id)에는 항상 같은 그림이 나옵니다.

interface Props {
  seed: string;
  className?: string;
  variant?: 'plan' | 'section' | 'elevation';
}

// 문자열 → 숫자 (같은 글자면 같은 값)
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

// seed 로 시작하는 간단한 난수 생성기
function random(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const W = 400;
const H = 260;

export default function ArchPattern({ seed, className = '', variant }: Props) {
  const h = hash(seed);
  const rnd = random(h);
  const kind = variant ?? (['plan', 'section', 'elevation'] as const)[h % 3];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={`block bg-neutral-50 ${className}`}
      aria-hidden="true"
    >
      {/* 모눈 */}
      <g stroke="currentColor" className="text-neutral-200" strokeWidth="0.5">
        {Array.from({ length: W / 20 + 1 }, (_, i) => (
          <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={H} />
        ))}
        {Array.from({ length: H / 20 + 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 20} x2={W} y2={i * 20} />
        ))}
      </g>
      <g fill="none" stroke="var(--accent)" strokeLinecap="square">
        {kind === 'plan' && <Plan rnd={rnd} />}
        {kind === 'section' && <Section rnd={rnd} />}
        {kind === 'elevation' && <Elevation rnd={rnd} />}
      </g>
    </svg>
  );
}

/** 평면도: 외벽 + 방 나누기 + 문 열림 호 */
function Plan({ rnd }: { rnd: () => number }) {
  const x0 = 80, y0 = 50, w = 240, h = 160;
  const cx = x0 + 60 + Math.round(rnd() * 5) * 20;
  const cy = y0 + 60 + Math.round(rnd() * 2) * 20;
  const cx2 = cx + 40 + Math.round(rnd() * 2) * 20;
  return (
    <>
      <rect x={x0} y={y0} width={w} height={h} strokeWidth="4" />
      <line x1={cx} y1={y0} x2={cx} y2={y0 + h} strokeWidth="2" />
      <line x1={x0} y1={cy} x2={cx} y2={cy} strokeWidth="2" />
      <line x1={cx2} y1={cy} x2={x0 + w} y2={cy} strokeWidth="2" />
      {/* 문 열림 */}
      <path d={`M ${cx} ${cy + 30} A 30 30 0 0 1 ${cx - 30} ${cy}`} strokeWidth="1" strokeDasharray="3 3" />
      <path d={`M ${cx2} ${cy} A 30 30 0 0 0 ${cx2 + 30} ${cy + 30}`} strokeWidth="1" strokeDasharray="3 3" />
      {/* 기둥 */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x0 + 40 + i * 60 - 3} y={y0 + h - 30 - 3} width="6" height="6" fill="var(--accent)" stroke="none" opacity="0.6" />
      ))}
      {/* 치수선 */}
      <line x1={x0} y1={y0 + h + 22} x2={x0 + w} y2={y0 + h + 22} strokeWidth="0.75" opacity="0.6" />
      <line x1={x0} y1={y0 + h + 16} x2={x0} y2={y0 + h + 28} strokeWidth="0.75" opacity="0.6" />
      <line x1={x0 + w} y1={y0 + h + 16} x2={x0 + w} y2={y0 + h + 28} strokeWidth="0.75" opacity="0.6" />
    </>
  );
}

/** 단면도: 층 슬래브 + 기둥 + 지붕 */
function Section({ rnd }: { rnd: () => number }) {
  const floors = 3 + Math.floor(rnd() * 3);
  const ground = 220;
  const fh = 36;
  const x0 = 60, x1 = 340;
  const top = ground - floors * fh;
  const roofRise = rnd() > 0.5 ? 30 : 0;
  const bays = 4 + Math.floor(rnd() * 2);
  return (
    <>
      <line x1={20} y1={ground} x2={380} y2={ground} strokeWidth="3" />
      <path d={`M 20 ${ground + 6} L 380 ${ground + 6}`} strokeWidth="0.75" strokeDasharray="2 4" opacity="0.6" />
      {Array.from({ length: floors + 1 }, (_, i) => (
        <line key={i} x1={x0} y1={ground - i * fh} x2={x1} y2={ground - i * fh} strokeWidth={i === floors ? 3 : 2} />
      ))}
      {Array.from({ length: bays + 1 }, (_, i) => {
        const x = x0 + ((x1 - x0) / bays) * i;
        return <line key={i} x1={x} y1={ground} x2={x} y2={top} strokeWidth={i === 0 || i === bays ? 2.5 : 1} />;
      })}
      {roofRise > 0 && <path d={`M ${x0 - 10} ${top} L ${(x0 + x1) / 2} ${top - roofRise} L ${x1 + 10} ${top}`} strokeWidth="2" />}
      {/* 사람 크기 표시 */}
      <circle cx={x0 + 28} cy={ground - 24} r="3" strokeWidth="1" />
      <line x1={x0 + 28} y1={ground - 21} x2={x0 + 28} y2={ground - 8} strokeWidth="1" />
    </>
  );
}

/** 입면도: 창 그리드 */
function Elevation({ rnd }: { rnd: () => number }) {
  const cols = 5 + Math.floor(rnd() * 3);
  const rows = 3 + Math.floor(rnd() * 2);
  const x0 = 70, y0 = 40, w = 260, h = 180;
  const cw = w / cols, rh = h / rows;
  const filled = Math.floor(rnd() * cols * rows);
  return (
    <>
      <rect x={x0} y={y0} width={w} height={h} strokeWidth="3" />
      {Array.from({ length: rows * cols }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const pad = 6;
        return (
          <rect
            key={i}
            x={x0 + c * cw + pad}
            y={y0 + r * rh + pad}
            width={cw - pad * 2}
            height={rh - pad * 2}
            strokeWidth="1"
            fill={i === filled ? 'var(--accent)' : 'none'}
            fillOpacity={0.25}
          />
        );
      })}
      <line x1={30} y1={y0 + h} x2={370} y2={y0 + h} strokeWidth="2" />
    </>
  );
}
