// furniture.jsx — top-down architectural furniture icons
// All shapes drawn in meters. Stroke is meant to be 0.04m at 1m=50px scale.
// They expose `position` props (x, y in meters, rotation, scale).

const STROKE = "rgba(31,26,20,0.55)";
const STROKE_LIGHT = "rgba(31,26,20,0.32)";
const FILL = "#FFFFFF";
const SOFT = "#F0E6D2";
const TEAK = "#B68A5C";
const FOLIAGE = "#7D9658";
const WATER = "#8FB8C9";

function At({ x = 0, y = 0, r = 0, s = 1, children, opacity = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={opacity}>
      {children}
    </g>
  );
}

/* ──────── BEDS ──────── */
// origin: top-left corner of bed
function BedKing({ w = 2.0, h = 2.1 }) {
  // king bed with two pillows, blanket fold
  const pad = 0.06;
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.08} fill={FILL}
            stroke={STROKE} strokeWidth={0.03} />
      {/* mattress */}
      <rect x={pad} y={pad} width={w - pad * 2} height={h - pad * 2} rx={0.06}
            fill={SOFT} stroke={STROKE_LIGHT} strokeWidth={0.02} />
      {/* pillows */}
      <rect x={pad + 0.05} y={pad + 0.05} width={(w - pad * 2 - 0.15) / 2} height={0.45}
            rx={0.08} fill={FILL} stroke={STROKE_LIGHT} strokeWidth={0.02} />
      <rect x={pad + 0.10 + (w - pad * 2 - 0.15) / 2} y={pad + 0.05}
            width={(w - pad * 2 - 0.15) / 2} height={0.45}
            rx={0.08} fill={FILL} stroke={STROKE_LIGHT} strokeWidth={0.02} />
      {/* blanket fold */}
      <line x1={pad} y1={h - 0.55} x2={w - pad} y2={h - 0.55}
            stroke={STROKE_LIGHT} strokeWidth={0.02} />
      <rect x={pad} y={h - 0.55} width={w - pad * 2} height={0.45} rx={0.04}
            fill="rgba(180,140,90,.18)" />
    </g>
  );
}

function BedSingle({ w = 1.0, h = 2.0 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.06} fill={FILL}
            stroke={STROKE} strokeWidth={0.03}/>
      <rect x={0.06} y={0.06} width={w - 0.12} height={h - 0.12} rx={0.05}
            fill={SOFT} stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      <rect x={0.12} y={0.10} width={w - 0.24} height={0.40} rx={0.05}
            fill={FILL} stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

function Nightstand({ w = 0.5, h = 0.5 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill={FILL} stroke={STROKE} strokeWidth={0.025}/>
      <circle cx={w/2} cy={h/2} r={0.04} fill={STROKE_LIGHT}/>
    </g>
  );
}

/* ──────── LIVING ──────── */
function SofaL({ w = 3.4, h = 2.4 }) {
  // L-shaped sectional sofa, wide cushions
  const t = 0.45; // arm thickness
  return (
    <g>
      {/* back run (top) */}
      <rect x={0} y={0} width={w} height={t} rx={0.10} fill={SOFT} stroke={STROKE} strokeWidth={0.03}/>
      {/* side run (left) */}
      <rect x={0} y={t} width={t} height={h - t} rx={0.10} fill={SOFT} stroke={STROKE} strokeWidth={0.03}/>
      {/* seat cushions across top */}
      <g stroke={STROKE_LIGHT} strokeWidth={0.02} fill={FILL}>
        {[0, 1, 2].map(i => (
          <rect key={i} x={t + 0.05 + i * ((w - t - 0.20) / 3)} y={t + 0.05}
                width={(w - t - 0.20) / 3 - 0.05} height={0.85} rx={0.06} />
        ))}
      </g>
      {/* seat cushions on left run */}
      <g stroke={STROKE_LIGHT} strokeWidth={0.02} fill={FILL}>
        {[0, 1].map(i => (
          <rect key={i} x={t + 0.05} y={t + 0.95 + i * ((h - t - 1.05) / 2)}
                width={0.85} height={(h - t - 1.05) / 2 - 0.05} rx={0.06}/>
        ))}
      </g>
      {/* throw pillows */}
      <rect x={0.12} y={0.10} width={0.45} height={0.30} rx={0.06}
            fill="rgba(194,104,73,.55)" />
      <rect x={w - 0.55} y={0.10} width={0.45} height={0.30} rx={0.06}
            fill="rgba(110,122,78,.55)" />
    </g>
  );
}

function Sofa({ w = 2.6, h = 0.95 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.10} fill={SOFT} stroke={STROKE} strokeWidth={0.03}/>
      {[0,1,2].map(i => (
        <rect key={i} x={0.08 + i*(w-0.16)/3} y={0.30} width={(w-0.16)/3 - 0.06} height={0.55}
              rx={0.06} fill={FILL} stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      ))}
    </g>
  );
}

function Armchair({ w = 0.95, h = 0.95 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.10} fill={SOFT} stroke={STROKE} strokeWidth={0.03}/>
      <rect x={0.10} y={0.30} width={w-0.20} height={h-0.40} rx={0.06} fill={FILL} stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

function CoffeeTable({ w = 1.2, h = 0.6 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.06}
            fill="rgba(140,100,56,.35)" stroke={STROKE} strokeWidth={0.03}/>
    </g>
  );
}

function RoundTable({ r = 0.65 }) {
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill={FILL} stroke={STROKE} strokeWidth={0.03}/>
      <circle cx={0} cy={0} r={r-0.06} fill="none" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

function Chair({ s = 0.5 }) {
  return (
    <g>
      <rect x={-s/2} y={-s/2} width={s} height={s} rx={0.06}
            fill={FILL} stroke={STROKE} strokeWidth={0.025}/>
    </g>
  );
}

function DiningTable({ w = 2.4, h = 1.0 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.06}
            fill="rgba(140,100,56,.30)" stroke={STROKE} strokeWidth={0.03}/>
    </g>
  );
}

/* ──────── KITCHEN ──────── */
function CounterRun({ w = 3, h = 0.6, sink = false, stove = false }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill={FILL} stroke={STROKE} strokeWidth={0.03}/>
      {/* tile lines */}
      {Array.from({length: Math.floor(w/0.6)}).map((_,i) => (
        <line key={i} x1={(i+1)*0.6} y1={0} x2={(i+1)*0.6} y2={h}
              stroke={STROKE_LIGHT} strokeWidth={0.015}/>
      ))}
      {sink && (
        <g transform={`translate(${w*0.55} ${h/2})`}>
          <rect x={-0.35} y={-0.20} width={0.70} height={0.40} rx={0.04}
                fill="rgba(80,90,110,.18)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
          <circle cx={0.30} cy={-0.10} r={0.03} fill={STROKE_LIGHT}/>
        </g>
      )}
      {stove && (
        <g transform={`translate(${w*0.18} ${h/2})`}>
          <rect x={-0.30} y={-0.22} width={0.60} height={0.45} rx={0.04}
                fill="rgba(40,40,40,.22)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
          {[[-0.15,-0.10],[0.15,-0.10],[-0.15,0.10],[0.15,0.10]].map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r={0.06} fill="none" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
          ))}
        </g>
      )}
    </g>
  );
}

function Island({ w = 2.4, h = 1.0 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.04}
            fill="rgba(255,255,255,.85)" stroke={STROKE} strokeWidth={0.03}/>
      <rect x={0.04} y={0.04} width={w-0.08} height={h-0.08} rx={0.03}
            fill="none" stroke={STROKE_LIGHT} strokeWidth={0.015}/>
    </g>
  );
}

function Fridge({ w = 0.7, h = 0.7 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.04}
            fill="rgba(220,220,220,.7)" stroke={STROKE} strokeWidth={0.03}/>
      <line x1={0} y1={h*.35} x2={w} y2={h*.35} stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

/* ──────── BATH ──────── */
function Toilet({ w = 0.4, h = 0.6 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h*.32} rx={0.05}
            fill={FILL} stroke={STROKE} strokeWidth={0.025}/>
      <ellipse cx={w/2} cy={h*.32 + (h*.68)/2} rx={w/2*.92} ry={h*.34}
               fill={FILL} stroke={STROKE} strokeWidth={0.025}/>
    </g>
  );
}

function Sink({ w = 0.6, h = 0.45 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.05}
            fill={FILL} stroke={STROKE} strokeWidth={0.025}/>
      <ellipse cx={w/2} cy={h*.55} rx={w*.34} ry={h*.28}
               fill="rgba(80,90,110,.14)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      <circle cx={w/2} cy={h*.18} r={0.04} fill={STROKE_LIGHT}/>
    </g>
  );
}

function Shower({ w = 1.0, h = 1.2 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.04}
            fill="rgba(140,180,200,.12)" stroke={STROKE} strokeWidth={0.025}/>
      <line x1={0} y1={0} x2={w} y2={h} stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      <line x1={w} y1={0} x2={0} y2={h} stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      <circle cx={w*.18} cy={h*.18} r={0.07} fill="none" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

function Bathtub({ w = 1.7, h = 0.75 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.10}
            fill={FILL} stroke={STROKE} strokeWidth={0.03}/>
      <rect x={0.08} y={0.08} width={w-0.16} height={h-0.16} rx={0.10}
            fill="rgba(140,180,200,.18)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      <circle cx={w-0.18} cy={h/2} r={0.04} fill={STROKE_LIGHT}/>
    </g>
  );
}

/* ──────── OUTDOOR ──────── */
function Palm({ s = 1, variant = 0 }) {
  // top-down palm canopy
  const fronds = 9;
  const leaves = [];
  for (let i = 0; i < fronds; i++){
    const a = (i / fronds) * Math.PI * 2 + variant * 0.3;
    const r1 = 0.9 * s, r2 = 1.6 * s;
    const x1 = Math.cos(a) * 0.18 * s, y1 = Math.sin(a) * 0.18 * s;
    const xc = Math.cos(a) * r1, yc = Math.sin(a) * r1;
    const x2 = Math.cos(a) * r2, y2 = Math.sin(a) * r2;
    leaves.push(
      <path key={i}
        d={`M ${x1} ${y1} Q ${xc + Math.cos(a + 1) * 0.2} ${yc + Math.sin(a + 1) * 0.2} ${x2} ${y2}
           Q ${xc + Math.cos(a - 1) * 0.2} ${yc + Math.sin(a - 1) * 0.2} ${x1} ${y1} Z`}
        fill={FOLIAGE} opacity={0.78}/>
    );
  }
  return (
    <g>
      <ellipse cx={0.05} cy={0.15} rx={1.5*s} ry={1.4*s} fill="rgba(40,30,15,.10)"/>
      {leaves}
      <circle cx={0} cy={0} r={0.18*s} fill="#5C7A47"/>
      <circle cx={0} cy={0} r={0.10*s} fill="#3D5A30"/>
    </g>
  );
}

function Bush({ s = 1 }) {
  return (
    <g>
      <ellipse cx={0.04} cy={0.10} rx={0.55*s} ry={0.40*s} fill="rgba(40,30,15,.10)"/>
      <circle cx={-0.18*s} cy={0} r={0.30*s} fill="#7D9658"/>
      <circle cx={0.18*s} cy={0.05*s} r={0.34*s} fill="#8AA561"/>
      <circle cx={0} cy={-0.15*s} r={0.26*s} fill="#9CB57A"/>
    </g>
  );
}

function Lounger({ w = 0.7, h = 1.95 }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.08} fill={FILL} stroke={STROKE} strokeWidth={0.025}/>
      <rect x={0.06} y={0.10} width={w-0.12} height={0.45} rx={0.06}
            fill="rgba(180,140,90,.40)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      <rect x={0.06} y={0.60} width={w-0.12} height={h-0.70} rx={0.06}
            fill="rgba(220,200,170,.50)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

function Parasol({ s = 1 }) {
  return (
    <g>
      <circle cx={0} cy={0} r={1.1*s} fill="rgba(240,230,200,.55)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      {Array.from({length:8}).map((_,i)=>{
        const a = i * Math.PI/4;
        return <line key={i} x1={0} y1={0}
                     x2={Math.cos(a)*1.1*s} y2={Math.sin(a)*1.1*s}
                     stroke={STROKE_LIGHT} strokeWidth={0.02}/>;
      })}
      <circle cx={0} cy={0} r={0.06*s} fill={STROKE}/>
    </g>
  );
}

function OutdoorTable({ r = 0.7 }) {
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="rgba(140,100,56,.35)" stroke={STROKE} strokeWidth={0.03}/>
      <circle cx={0} cy={0} r={r-0.05} fill="none" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

function Pool({ w = 6, h = 3, ripples = true }){
  return (
    <g>
      {/* coping */}
      <rect x={-0.30} y={-0.30} width={w+0.6} height={h+0.6} rx={0.4}
            fill="#E3D9C2" stroke={STROKE_LIGHT} strokeWidth={0.04}/>
      {/* water */}
      <rect x={0} y={0} width={w} height={h} rx={0.20}
            fill="url(#poolGrad)" stroke="rgba(60,90,110,.4)" strokeWidth={0.03}/>
      {ripples && Array.from({length: 5}).map((_,i)=>(
        <path key={i}
              d={`M ${0.5 + i*1.1} ${h*0.30 + (i%2)*0.1}
                  q 0.25 -0.10 0.50 0
                  q 0.25  0.10 0.50 0`}
              fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={0.02}/>
      ))}
      {/* ladder */}
      <rect x={w*0.85} y={-0.05} width={0.30} height={0.12} fill={FILL} stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

function Plant({ s = 0.6 }){
  return (
    <g>
      <circle cx={0} cy={0} r={0.45*s} fill="#C9B891" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      <g>
        {Array.from({length:6}).map((_,i)=>{
          const a = i * Math.PI/3;
          const x = Math.cos(a)*0.35*s, y = Math.sin(a)*0.35*s;
          return <ellipse key={i} cx={x} cy={y} rx={0.26*s} ry={0.16*s}
                          fill="#7D9658" transform={`rotate(${a*180/Math.PI} ${x} ${y})`}
                          opacity={0.85}/>;
        })}
      </g>
    </g>
  );
}

function Car({ w = 1.85, h = 4.4 }){
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.40}
            fill="rgba(40,40,40,.18)" stroke={STROKE_LIGHT} strokeWidth={0.025}/>
      <rect x={0.12} y={0.6} width={w-0.24} height={1.4} rx={0.12}
            fill="rgba(140,180,200,.30)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      <rect x={0.12} y={h-2.0} width={w-0.24} height={1.4} rx={0.12}
            fill="rgba(140,180,200,.30)" stroke={STROKE_LIGHT} strokeWidth={0.02}/>
    </g>
  );
}

function Wardrobe({ w = 2, h = 0.6 }){
  return (
    <g>
      <rect x={0} y={0} width={w} height={h}
            fill="rgba(180,138,92,.18)" stroke={STROKE} strokeWidth={0.03}/>
      {Array.from({length: Math.max(2, Math.round(w/0.5))}).map((_,i,arr)=>(
        <line key={i} x1={(i+1)*w/arr.length} y1={0} x2={(i+1)*w/arr.length} y2={h}
              stroke={STROKE_LIGHT} strokeWidth={0.02}/>
      ))}
    </g>
  );
}

function TVConsole({ w = 1.8, h = 0.4 }){
  return (
    <g>
      <rect x={0} y={0} width={w} height={h}
            fill="rgba(40,40,40,.30)" stroke={STROKE_LIGHT} strokeWidth={0.025}/>
      <line x1={0} y1={h/2} x2={w} y2={h/2} stroke={STROKE_LIGHT} strokeWidth={0.015}/>
    </g>
  );
}

function Rug({ w = 3, h = 2, color = "rgba(194,104,73,.18)" }){
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={0.04}
            fill={color} stroke="rgba(194,104,73,.35)" strokeWidth={0.02} strokeDasharray="0.10 0.10"/>
    </g>
  );
}

Object.assign(window, {
  At, BedKing, BedSingle, Nightstand,
  SofaL, Sofa, Armchair, CoffeeTable, RoundTable, Chair, DiningTable,
  CounterRun, Island, Fridge,
  Toilet, Sink, Shower, Bathtub,
  Palm, Bush, Lounger, Parasol, OutdoorTable, Pool, Plant, Car,
  Wardrobe, TVConsole, Rug
});
