// floorplan.jsx — Plan d'implantation 6 pièces, style Ibiza
// 1 SVG unit = 1 meter

const M = 1; // meter

/* ───── geometry ───── */
const PLOT = { x: 0, y: 0, w: 24, h: 20 };
const SETBACK = 3;
const VILLA = { x: 3.5, y: 3.0, w: 17, h: 10 };
const WALL_T = 0.20;
const PART_T = 0.15;

// interior origin
const IX = VILLA.x + WALL_T, IY = VILLA.y + WALL_T;
const IW = VILLA.w - WALL_T * 2, IH = VILLA.h - WALL_T * 2;

/* room rectangles (interior, in absolute meters) */
const ROOMS = {
  cuisine:  { x: IX,        y: IY,        w: 3.8,  h: 3.8,  name: 'Cuisine',           short: 'CUIS',     area: 14.4, color: 'var(--concrete)',  type: 'day' },
  cellier:  { x: IX + 3.8,  y: IY,        w: 4.05, h: 2.3,  name: 'Cellier · Buand.',  short: 'CELLIER',  area:  9.3, color: 'var(--concrete-2)', type: 'utility' },
  hall:     { x: IX + 3.8,  y: IY + 2.3,  w: 4.05, h: 1.5,  name: 'Hall d\u2019entrée', short: 'HALL',    area:  6.1, color: 'var(--concrete-2)', type: 'utility' },
  sam:      { x: IX,        y: IY + 3.8,  w: 3.8,  h: 5.8,  name: 'Salle à manger',    short: 'SAM',      area: 22.0, color: 'var(--concrete)',  type: 'day' },
  sejour:   { x: IX + 3.8,  y: IY + 3.8,  w: 4.05, h: 5.8,  name: 'Séjour',            short: 'SÉJOUR',   area: 23.5, color: 'var(--concrete)',  type: 'day' },

  ch2:      { x: IX + 7.85, y: IY,        w: 3.80, h: 3.8,  name: 'Chambre 2',         short: 'CH 2',     area: 14.4, color: 'var(--concrete-2)', type: 'night' },
  ch3:      { x: IX + 11.65, y: IY,       w: 4.55, h: 3.8,  name: 'Chambre 3',         short: 'CH 3',     area: 17.3, color: 'var(--concrete-2)', type: 'night' },
  couloir:  { x: IX + 7.85, y: IY + 3.8,  w: 8.35, h: 1.2,  name: 'Dégagement',        short: 'DÉG.',     area: 10.0, color: 'var(--concrete-2)', type: 'utility' },
  wc:       { x: IX + 7.85, y: IY + 5.0,  w: 1.8,  h: 1.5,  name: 'WC',                short: 'WC',       area:  2.7, color: 'var(--sand)',      type: 'wet' },
  sdec:     { x: IX + 7.85, y: IY + 6.5,  w: 1.8,  h: 3.1,  name: 'SDE commune',       short: 'SDE',      area:  5.6, color: 'var(--sand)',      type: 'wet' },
  parents:  { x: IX + 9.65, y: IY + 5.0,  w: 4.65, h: 4.6,  name: 'Chambre Parents',   short: 'CH. PARENTS', area: 21.4, color: 'var(--concrete)',  type: 'night' },
  dressing: { x: IX + 14.3, y: IY + 5.0,  w: 1.90, h: 1.8,  name: 'Dressing',          short: 'DRESS.',   area:  3.4, color: 'var(--sand)',      type: 'utility' },
  sdep:     { x: IX + 14.3, y: IY + 6.8,  w: 1.90, h: 2.8,  name: 'SDE parents',       short: 'SDE P.',   area:  5.3, color: 'var(--sand)',      type: 'wet' },
};

/* the 6 "pièces" counted */
const SIX_PIECES = ['sejour','sam','cuisine','parents','ch2','ch3'];

/* ───── helper components ───── */
function RoomRect({ id, room, hovered, onEnter, onLeave, palette }) {
  const isHover = hovered === id;
  const dim = hovered && !isHover;
  return (
    <g
      className="room-hit"
      onMouseEnter={() => onEnter(id)}
      onMouseLeave={onLeave}
    >
      <rect
        className={`room-fill ${dim ? 'dim' : ''} ${isHover ? 'hot' : ''}`}
        x={room.x} y={room.y} width={room.w} height={room.h}
        fill={palette[id] || room.color}
      />
    </g>
  );
}

function DoorArc({ x, y, w = 0.85, dir = 'NE' }) {
  // Door swing arc + door leaf line. dir = corner position of hinge.
  // Hinge at (x,y); swings 90° based on dir.
  // dir codes: NE: hinge at NE corner of opening, swings to W/S
  // We'll keep it simple: pass hinge pt + two endpoints.
  const r = w;
  const map = {
    NE: { sx: x - r, sy: y, ex: x, ey: y + r, leafX: x - r, leafY: y },
    NW: { sx: x + r, sy: y, ex: x, ey: y + r, leafX: x + r, leafY: y },
    SE: { sx: x - r, sy: y, ex: x, ey: y - r, leafX: x - r, leafY: y },
    SW: { sx: x + r, sy: y, ex: x, ey: y - r, leafX: x + r, leafY: y },
    EN: { sx: x, sy: y - r, ex: x + r, ey: y, leafX: x, leafY: y - r },
    ES: { sx: x, sy: y + r, ex: x + r, ey: y, leafX: x, leafY: y + r },
    WN: { sx: x, sy: y - r, ex: x - r, ey: y, leafX: x, leafY: y - r },
    WS: { sx: x, sy: y + r, ex: x - r, ey: y, leafX: x, leafY: y + r },
  };
  const m = map[dir];
  // sweep direction depends; use a generic large-arc=0
  const sweep = (dir.endsWith('E') ? 1 : 0) ^ (dir.startsWith('S') ? 1 : 0);
  return (
    <g stroke="rgba(31,26,20,.45)" strokeWidth={0.025} fill="none">
      <path d={`M ${m.sx} ${m.sy} A ${r} ${r} 0 0 ${sweep} ${m.ex} ${m.ey}`} />
      <line x1={x} y1={y} x2={m.leafX} y2={m.leafY} strokeWidth={0.04} />
    </g>
  );
}

/* ───── walls ───── */
// Wall segments as lines; door gaps applied in geometry.
// We render walls as stroke-paths with stroke-width = WALL_T or PART_T.
function Walls() {
  // exterior: villa rect minus door openings (front door + sliding south)
  const VR = VILLA;
  const outerSegments = [
    // top (north) wall: gap for front entry at x = 11.4..12.4
    [VR.x, VR.y, IX + 7.7, VR.y],
    [IX + 8.7, VR.y, VR.x + VR.w, VR.y],
    // right (east) wall: gap for chambre parents window? no, window not a gap
    [VR.x + VR.w, VR.y, VR.x + VR.w, VR.y + VR.h],
    // bottom (south) wall: large gap for séjour-terrasse (sliding) at x=IX+1..IX+7
    [VR.x, VR.y + VR.h, IX + 1.0, VR.y + VR.h],
    [IX + 7.0, VR.y + VR.h, VR.x + VR.w, VR.y + VR.h],
    // left (west) wall solid
    [VR.x, VR.y + VR.h, VR.x, VR.y],
  ];

  // interior partitions
  // format: [x1, y1, x2, y2]  (door gaps already cut)
  const part = [];
  // Day zone partitions
  // P1 V x=IX+3.8 y=IY..IY+3.8 (cuisine | cellier+hall)  with door at y=IY+2.6..IY+3.4
  part.push([IX + 3.8, IY, IX + 3.8, IY + 2.6]);
  part.push([IX + 3.8, IY + 3.4, IX + 3.8, IY + 3.8]);
  // P2 H y=IY+2.3 x=IX+3.8..IX+7.85 (cellier|hall) door near east end
  part.push([IX + 3.8, IY + 2.3, IX + 6.6, IY + 2.3]);
  part.push([IX + 7.5, IY + 2.3, IX + 7.85, IY + 2.3]);
  // P3 H y=IY+3.8 x=IX..IX+7.85 (top of SAM/Séjour). Big opening at x=IX+4.0..IX+5.0 (cuisine→sam) and arch IX+5.0..IX+7.0 (hall→séjour)
  part.push([IX, IY + 3.8, IX + 0.5, IY + 3.8]);
  part.push([IX + 1.5, IY + 3.8, IX + 5.0, IY + 3.8]);
  part.push([IX + 7.0, IY + 3.8, IX + 7.85, IY + 3.8]);
  // P4 V x=IX+3.8 y=IY+3.8..IY+9.6 (SAM|Séjour): wide opening centered, leave 1m at top + 1m at bottom
  part.push([IX + 3.8, IY + 3.8, IX + 3.8, IY + 4.8]);
  part.push([IX + 3.8, IY + 8.6, IX + 3.8, IY + 9.6]);
  // P5 V x=IX+7.85 y=IY..IY+5.0 (Day|Night top half)
  // doors: hall→couloir at y=IY+4.0..IY+4.8 (in couloir region just below 3.8)
  part.push([IX + 7.85, IY, IX + 7.85, IY + 5.0]);
  // Day|Night south half  V x=IX+7.85 y=IY+5.0..IY+9.6 - solid (séjour vs sde)
  part.push([IX + 7.85, IY + 5.0, IX + 7.85, IY + 9.6]);
  // P6 H y=IY+5.0 x=IX+7.85..IX+16.2 (couloir bottom). Doors to wc, sde, parents
  part.push([IX + 7.85, IY + 5.0, IX + 9.65, IY + 5.0]);   // (couloir-wc divider)
  // door to wc at x=IX+7.85..IX+8.7
  // door from couloir to ch parents at x=IX+10.0..IX+10.9
  part.push([IX + 9.65, IY + 5.0, IX + 10.0, IY + 5.0]);
  part.push([IX + 10.9, IY + 5.0, IX + 16.2, IY + 5.0]);
  // P7 H y=IY+3.8 x=IX+7.85..IX+16.2 (couloir top). Doors to ch2 + ch3
  // ch2 door x=IX+9.0..IX+9.9
  // ch3 door x=IX+13.6..IX+14.5
  part.push([IX + 7.85, IY + 3.8, IX + 9.0, IY + 3.8]);
  part.push([IX + 9.9, IY + 3.8, IX + 13.6, IY + 3.8]);
  part.push([IX + 14.5, IY + 3.8, IX + 16.2, IY + 3.8]);
  // P8 V x=IX+11.65 y=IY..IY+3.8 (ch2|ch3)
  part.push([IX + 11.65, IY, IX + 11.65, IY + 3.8]);
  // P9 H y=IY+6.5 x=IX+7.85..IX+9.65 (wc|sde)
  part.push([IX + 7.85, IY + 6.5, IX + 9.65, IY + 6.5]);
  // P10 V x=IX+9.65 y=IY+5.0..IY+9.6 (wc+sde|parents). door from sde-parents not needed, sde access is from couloir
  part.push([IX + 9.65, IY + 5.0, IX + 9.65, IY + 9.6]);
  // P11 V x=IX+14.3 y=IY+5.0..IY+9.6 (parents|dress+sdep). Door at y=IY+5.6..IY+6.4 (parents→dressing)
  part.push([IX + 14.3, IY + 5.0, IX + 14.3, IY + 5.6]);
  part.push([IX + 14.3, IY + 6.4, IX + 14.3, IY + 9.6]);
  // P12 H y=IY+6.8 x=IX+14.3..IX+16.2 (dressing|sdep)
  part.push([IX + 14.3, IY + 6.8, IX + 16.2, IY + 6.8]);

  return (
    <g>
      {/* Floor of villa as concrete fill */}
      <rect x={IX} y={IY} width={IW} height={IH}
            fill="var(--concrete)" />
      {/* shadow under villa */}
      <rect x={VR.x + 0.10} y={VR.y + 0.20} width={VR.w} height={VR.h}
            fill="rgba(50,30,15,.10)" rx={0.10} />
      {/* exterior walls */}
      <g stroke="var(--wall)" strokeWidth={WALL_T} strokeLinecap="butt">
        {outerSegments.map((s, i) => (
          <line key={i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />
        ))}
      </g>
      {/* exterior wall outline (thin ink) */}
      <g stroke="var(--wall-line)" strokeWidth={0.025} fill="none">
        {outerSegments.map((s, i) => {
          // draw both faces of the wall
          const [x1, y1, x2, y2] = s;
          const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1);
          const ox = dy * (WALL_T / 2), oy = -dx * (WALL_T / 2);
          return (
            <g key={i}>
              <line x1={x1 + ox} y1={y1 + oy} x2={x2 + ox} y2={y2 + oy} />
              <line x1={x1 - ox} y1={y1 - oy} x2={x2 - ox} y2={y2 - oy} />
            </g>
          );
        })}
      </g>
      {/* interior partitions */}
      <g stroke="var(--wall)" strokeWidth={PART_T} strokeLinecap="butt">
        {part.map((s, i) => (
          <line key={i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />
        ))}
      </g>
      {/* partition outline */}
      <g stroke="var(--wall-line)" strokeWidth={0.018} fill="none">
        {part.map((s, i) => {
          const [x1, y1, x2, y2] = s;
          const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1);
          const ox = dy * (PART_T / 2), oy = -dx * (PART_T / 2);
          return (
            <g key={i}>
              <line x1={x1 + ox} y1={y1 + oy} x2={x2 + ox} y2={y2 + oy} />
              <line x1={x1 - ox} y1={y1 - oy} x2={x2 - ox} y2={y2 - oy} />
            </g>
          );
        })}
      </g>
    </g>
  );
}

/* ───── doors (arc swings) ───── */
function Doors() {
  const arcs = [
    // Front door — north entry, hinge east, swing into hall
    { x: IX + 7.7, y: IY, dir: 'SE', w: 1.0 },
    // Cuisine ↔ Cellier
    { x: IX + 3.8, y: IY + 3.4, dir: 'NW', w: 0.8 },
    // Cellier ↔ Hall
    { x: IX + 7.5, y: IY + 2.3, dir: 'WS', w: 0.85 },
    // Cuisine ↔ SAM
    { x: IX + 1.5, y: IY + 3.8, dir: 'NW', w: 1.0 },
    // SAM/Séjour wide opening — no arc, it's archway
    // Hall ↔ Séjour archway (no arc)
    // Hall ↔ Couloir — opening, no arc
    // Couloir ↔ Ch2
    { x: IX + 9.0, y: IY + 3.8, dir: 'SE', w: 0.9 },
    // Couloir ↔ Ch3
    { x: IX + 14.5, y: IY + 3.8, dir: 'SW', w: 0.9 },
    // Couloir ↔ WC
    { x: IX + 8.7, y: IY + 5.0, dir: 'NW', w: 0.85 },
    // Couloir ↔ Ch Parents
    { x: IX + 10.9, y: IY + 5.0, dir: 'NW', w: 0.9 },
    // Parents ↔ Dressing
    { x: IX + 14.3, y: IY + 6.4, dir: 'WS', w: 0.8 },
    // SDE commune entrance from couloir end (we'll add via opening, simpler skip)
    // Sliding door to terrasse (no arc — slider)
  ];
  return (
    <g>
      {arcs.map((a, i) => <DoorArc key={i} {...a} />)}
      {/* sliding door to terrasse, drawn as parallel lines */}
      <g stroke="rgba(31,26,20,.45)" strokeWidth={0.025}>
        <line x1={IX + 1.0} y1={VILLA.y + VILLA.h - 0.01} x2={IX + 4.0} y2={VILLA.y + VILLA.h - 0.01} />
        <line x1={IX + 3.0} y1={VILLA.y + VILLA.h + 0.04} x2={IX + 7.0} y2={VILLA.y + VILLA.h + 0.04} />
      </g>
    </g>
  );
}

/* ───── openings overlay (narrow gaps in wall to make it visually clear) ───── */
function Openings() {
  // Just draw thin floor-color strips at each opening to ensure visual continuity
  return null;
}

/* ───── outdoor: garden, terrasse, pool, palms ───── */
function Site({ showFurniture }) {
  return (
    <g>
      {/* property fill: lawn */}
      <rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h}
            fill="var(--grass)"/>
      {/* lawn texture: subtle dots */}
      <rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h}
            fill="url(#grassTexture)"/>
      {/* property line */}
      <rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h}
            fill="none" stroke="var(--wall-line)" strokeWidth={0.06}/>
      {/* fence indicator (mini hatches) */}
      <g stroke="var(--wall-line)" strokeWidth={0.02}>
        {Array.from({length: Math.floor(PLOT.w / 0.4)}).map((_,i)=>{
          const x = i * 0.4;
          return (
            <g key={i}>
              <line x1={x} y1={0} x2={x + 0.2} y2={-0.2}/>
              <line x1={x} y1={PLOT.h} x2={x + 0.2} y2={PLOT.h + 0.2}/>
            </g>
          );
        })}
        {Array.from({length: Math.floor(PLOT.h / 0.4)}).map((_,i)=>{
          const y = i * 0.4;
          return (
            <g key={i}>
              <line x1={0} y1={y} x2={-0.2} y2={y + 0.2}/>
              <line x1={PLOT.w} y1={y} x2={PLOT.w + 0.2} y2={y + 0.2}/>
            </g>
          );
        })}
      </g>

      {/* paved driveway */}
      <rect x={4} y={0} width={3} height={3.5}
            fill="var(--concrete-2)" stroke="var(--wall-line)" strokeWidth={0.025}/>
      {/* driveway tile lines */}
      <g stroke="var(--wall-line)" strokeWidth={0.012} opacity=".4">
        {[1,2].map(i=>(
          <line key={i} x1={4} y1={i*1.17} x2={7} y2={i*1.17}/>
        ))}
        {[1,2].map(i=>(
          <line key={i} x1={4 + i} y1={0} x2={4 + i} y2={3.5}/>
        ))}
      </g>

      {/* entry walkway */}
      <rect x={IX + 7.7} y={0} width={1.0} height={3}
            fill="var(--sand)" stroke="var(--wall-line)" strokeWidth={0.02}/>
      <g stroke="var(--wall-line)" strokeWidth={0.012} opacity=".5">
        {[1,2,3,4,5].map(i=>(
          <line key={i} x1={IX + 7.7} y1={i*0.5} x2={IX + 8.7} y2={i*0.5}/>
        ))}
      </g>

      {/* terrasse bois south — covered */}
      <g>
        <rect x={3.6} y={VILLA.y + VILLA.h} width={13.0} height={2.5}
              fill="var(--teak)" stroke="var(--wall-line)" strokeWidth={0.04}/>
        {/* deck planks */}
        <g stroke="var(--teak-deep)" strokeWidth={0.02} opacity=".7">
          {Array.from({length: 13}).map((_,i)=>(
            <line key={i} x1={3.6} y1={VILLA.y + VILLA.h + i*0.20} x2={16.6} y2={VILLA.y + VILLA.h + i*0.20}/>
          ))}
        </g>
        {/* covered roof shadow indicator */}
        <line x1={3.6} y1={VILLA.y + VILLA.h + 2.5} x2={16.6} y2={VILLA.y + VILLA.h + 2.5}
              stroke="var(--wall-line)" strokeWidth={0.06} strokeDasharray="0.30 0.20"/>
        {/* columns at terrace edge */}
        {[3.8, 7.0, 10.2, 13.4, 16.4].map((x,i)=>(
          <g key={i}>
            <circle cx={x} cy={VILLA.y + VILLA.h + 2.5 - 0.05} r={0.18}
                    fill="var(--wall)" stroke="var(--wall-line)" strokeWidth={0.025}/>
            <circle cx={x} cy={VILLA.y + VILLA.h + 2.5 - 0.05} r={0.10}
                    fill="rgba(31,26,20,.10)"/>
          </g>
        ))}
      </g>

      {/* pool (south of terrasse, east half) */}
      <g transform={`translate(${10} ${15.6})`}>
        <Pool w={6.5} h={1.4} ripples />
      </g>

      {/* outdoor stones path around pool */}
      <g>
        <rect x={9.5} y={15.4} width={7.5} height={1.9}
              fill="var(--sand)" stroke="var(--wall-line)" strokeWidth={0.025}/>
        <rect x={10} y={15.6} width={6.5} height={1.4}
              fill="none"/>
      </g>

      {/* lawn paths around pool */}
      <g>
        <path d={`M ${17.5} ${15.4} L ${20.5} ${15.4} L ${20.5} ${17.3} L ${17.5} ${17.3} Z`}
              fill="var(--grass-deep)" opacity=".55"/>
      </g>

      {/* lounge area */}
      {showFurniture && (
        <g>
          <At x={4} y={15.7}><Lounger /></At>
          <At x={5.0} y={15.7}><Lounger /></At>
          <At x={6.0} y={15.7}><Parasol s={0.9} /></At>
          <At x={6.0} y={17.3}><OutdoorTable r={0.4}/></At>
          <At x={5.6} y={17.3}><Chair s={0.4}/></At>
          <At x={6.4} y={17.3}><Chair s={0.4}/></At>
          {/* dining outdoor on terrasse */}
          <At x={5} y={13.6}><DiningTable w={2.0} h={0.85}/></At>
          {Array.from({length:3}).map((_,i)=>(
            <g key={i}>
              <At x={5.3 + i*0.6} y={13.4}><Chair s={0.45}/></At>
              <At x={5.3 + i*0.6} y={14.65}><Chair s={0.45}/></At>
            </g>
          ))}
          {/* lounge sofa on covered terrasse */}
          <At x={9.5} y={13.5}><Sofa w={2.4} h={0.85}/></At>
          <At x={12.0} y={13.5}><Armchair w={0.85} h={0.85}/></At>
          <At x={10.5} y={14.6}><CoffeeTable w={1.4} h={0.7}/></At>
          {/* car */}
          <At x={4.5} y={3.8 - 4.4 - 0.4 + 4.4}>
            <Car w={1.85} h={4.4}/>
          </At>
          {/* wait proper car position */}
        </g>
      )}

      {/* car parking - render outside of the showFurniture car above (one car) */}
      {showFurniture && (
        <At x={4.5} y={-0.8}><Car w={2} h={4}/></At>
      )}

      {/* palm trees scattered */}
      <g>
        <At x={1.5} y={1.5}><Palm s={0.85} variant={0}/></At>
        <At x={22.5} y={1.5}><Palm s={0.95} variant={1}/></At>
        <At x={1.7} y={9}><Palm s={0.80} variant={2}/></At>
        <At x={22.3} y={8.5}><Palm s={1.05} variant={3}/></At>
        <At x={1.5} y={18.5}><Palm s={0.95} variant={1}/></At>
        <At x={22.5} y={18.7}><Palm s={1.0} variant={4}/></At>
        <At x={9.0} y={18.8}><Palm s={0.78} variant={5}/></At>
        <At x={18.0} y={18.6}><Palm s={0.85} variant={2}/></At>
        <At x={3.0} y={5.0}><Palm s={0.60} variant={0}/></At>
        <At x={21.0} y={5.0}><Palm s={0.62} variant={3}/></At>
      </g>

      {/* bushes along facade */}
      <g>
        <At x={3.2} y={4}><Bush s={0.7}/></At>
        <At x={3.2} y={6}><Bush s={0.6}/></At>
        <At x={3.2} y={8}><Bush s={0.7}/></At>
        <At x={3.2} y={11}><Bush s={0.65}/></At>
        <At x={20.8} y={4}><Bush s={0.7}/></At>
        <At x={20.8} y={7}><Bush s={0.6}/></At>
        <At x={20.8} y={10}><Bush s={0.65}/></At>
        <At x={20.8} y={12.5}><Bush s={0.7}/></At>
        {/* near entry */}
        <At x={IX + 7.4} y={2.7}><Bush s={0.45}/></At>
        <At x={IX + 8.85} y={2.7}><Bush s={0.45}/></At>
        {/* potted plants on terrasse */}
        <At x={3.9} y={13.3}><Plant s={0.5}/></At>
        <At x={16.3} y={13.3}><Plant s={0.5}/></At>
        <At x={3.9} y={15.2}><Plant s={0.5}/></At>
        <At x={16.3} y={15.2}><Plant s={0.5}/></At>
      </g>

      {/* pebble dots in front yard */}
      <g fill="rgba(31,26,20,.18)">
        {Array.from({length: 30}).map((_,i)=>{
          const x = 7 + (i*0.83)%4.5;
          const y = 0.3 + Math.floor(i/6)*0.5;
          return <circle key={i} cx={x} cy={y} r={0.04}/>;
        })}
      </g>
    </g>
  );
}

/* ───── interior furniture ───── */
function Furniture() {
  return (
    <g>
      {/* CUISINE — counter L + island */}
      <At x={ROOMS.cuisine.x + 0.05} y={ROOMS.cuisine.y + 0.05}>
        <CounterRun w={3.5} h={0.6} sink stove />
      </At>
      <At x={ROOMS.cuisine.x + 0.05} y={ROOMS.cuisine.y + 0.65}>
        <Fridge />
      </At>
      <At x={ROOMS.cuisine.x + 1.2} y={ROOMS.cuisine.y + 1.9}>
        <Island w={2.2} h={0.85}/>
      </At>
      {/* small stools at island */}
      <At x={ROOMS.cuisine.x + 1.5} y={ROOMS.cuisine.y + 2.85}><Chair s={0.35}/></At>
      <At x={ROOMS.cuisine.x + 2.2} y={ROOMS.cuisine.y + 2.85}><Chair s={0.35}/></At>
      <At x={ROOMS.cuisine.x + 2.9} y={ROOMS.cuisine.y + 2.85}><Chair s={0.35}/></At>

      {/* CELLIER — shelves */}
      <At x={ROOMS.cellier.x + 0.05} y={ROOMS.cellier.y + 0.05}>
        <Wardrobe w={3.9} h={0.5}/>
      </At>

      {/* HALL — entry console */}
      <At x={ROOMS.hall.x + 0.5} y={ROOMS.hall.y + 1.0}>
        <rect width={1.5} height={0.4} rx={0.04}
              fill="rgba(140,100,56,.30)" stroke="rgba(31,26,20,.55)" strokeWidth={0.025}/>
      </At>

      {/* SAM — dining table for 6 */}
      <At x={ROOMS.sam.x + 0.95} y={ROOMS.sam.y + 1.5}>
        <DiningTable w={1.9} h={2.6}/>
      </At>
      {/* dining chairs */}
      {[0,1,2].map(i=>(
        <g key={i}>
          <At x={ROOMS.sam.x + 0.55} y={ROOMS.sam.y + 1.85 + i*0.85}><Chair s={0.45}/></At>
          <At x={ROOMS.sam.x + 3.25} y={ROOMS.sam.y + 1.85 + i*0.85}><Chair s={0.45}/></At>
        </g>
      ))}
      {/* SAM rug */}
      <At x={ROOMS.sam.x + 0.5} y={ROOMS.sam.y + 1.0}>
        <Rug w={2.8} h={3.8} color="rgba(110,122,78,.18)"/>
      </At>

      {/* SÉJOUR — L-sofa, coffee table, armchair, tv */}
      <At x={ROOMS.sejour.x + 0.30} y={ROOMS.sejour.y + 1.30}>
        <SofaL w={3.45} h={2.10}/>
      </At>
      <At x={ROOMS.sejour.x + 1.0} y={ROOMS.sejour.y + 3.60}>
        <CoffeeTable w={1.9} h={0.85}/>
      </At>
      <At x={ROOMS.sejour.x + 0.30} y={ROOMS.sejour.y + 4.70}>
        <Rug w={3.4} h={1.0} color="rgba(194,104,73,.15)"/>
      </At>
      <At x={ROOMS.sejour.x + 0.10} y={ROOMS.sejour.y + 0.10}>
        <TVConsole w={2.3} h={0.4}/>
      </At>

      {/* CH 2 — single bed + nightstand + wardrobe */}
      <At x={ROOMS.ch2.x + 0.30} y={ROOMS.ch2.y + 0.50}>
        <BedKing w={1.6} h={2.0}/>
      </At>
      <At x={ROOMS.ch2.x + 0.30} y={ROOMS.ch2.y + 2.55}>
        <Nightstand w={0.45} h={0.40}/>
      </At>
      <At x={ROOMS.ch2.x + 1.45} y={ROOMS.ch2.y + 2.55}>
        <Nightstand w={0.45} h={0.40}/>
      </At>
      <At x={ROOMS.ch2.x + 2.2} y={ROOMS.ch2.y + 0.30}>
        <Wardrobe w={1.5} h={0.55}/>
      </At>

      {/* CH 3 — bigger bed */}
      <At x={ROOMS.ch3.x + 1.5} y={ROOMS.ch3.y + 0.50}>
        <BedKing w={1.8} h={2.0}/>
      </At>
      <At x={ROOMS.ch3.x + 1.5} y={ROOMS.ch3.y + 2.55}>
        <Nightstand w={0.45} h={0.40}/>
      </At>
      <At x={ROOMS.ch3.x + 2.85} y={ROOMS.ch3.y + 2.55}>
        <Nightstand w={0.45} h={0.40}/>
      </At>
      <At x={ROOMS.ch3.x + 0.20} y={ROOMS.ch3.y + 0.30}>
        <Wardrobe w={1.0} h={0.55}/>
      </At>

      {/* COULOIR — runner rug */}
      <At x={ROOMS.couloir.x + 0.5} y={ROOMS.couloir.y + 0.2}>
        <Rug w={7.0} h={0.7} color="rgba(110,122,78,.10)"/>
      </At>

      {/* WC */}
      <At x={ROOMS.wc.x + 1.2} y={ROOMS.wc.y + 0.30}>
        <Toilet w={0.42} h={0.6}/>
      </At>
      <At x={ROOMS.wc.x + 0.20} y={ROOMS.wc.y + 0.30}>
        <Sink w={0.5} h={0.40}/>
      </At>

      {/* SDE COMMUNE */}
      <At x={ROOMS.sdec.x + 0.10} y={ROOMS.sdec.y + 0.20}>
        <Sink w={0.6} h={0.42}/>
      </At>
      <At x={ROOMS.sdec.x + 0.10} y={ROOMS.sdec.y + 0.85}>
        <Toilet w={0.42} h={0.6}/>
      </At>
      <At x={ROOMS.sdec.x + 0.40} y={ROOMS.sdec.y + 1.80}>
        <Shower w={1.20} h={1.10}/>
      </At>

      {/* CH PARENTS — king bed centered, nightstands, bench, rug */}
      <At x={ROOMS.parents.x + 1.5} y={ROOMS.parents.y + 0.50}>
        <BedKing w={2.0} h={2.20}/>
      </At>
      <At x={ROOMS.parents.x + 1.45} y={ROOMS.parents.y + 0.55}>
        <g transform="translate(-0.55 0)"><Nightstand w={0.5} h={0.5}/></g>
      </At>
      <At x={ROOMS.parents.x + 3.55} y={ROOMS.parents.y + 0.55}>
        <Nightstand w={0.5} h={0.5}/>
      </At>
      <At x={ROOMS.parents.x + 1.2} y={ROOMS.parents.y + 3.0}>
        <Rug w={2.6} h={1.4} color="rgba(110,122,78,.16)"/>
      </At>
      {/* tv console facing bed */}
      <At x={ROOMS.parents.x + 1.5} y={ROOMS.parents.y + 4.10}>
        <TVConsole w={2.0} h={0.4}/>
      </At>
      {/* bench */}
      <At x={ROOMS.parents.x + 1.7} y={ROOMS.parents.y + 2.85}>
        <rect width={1.65} height={0.40} rx={0.06}
              fill="rgba(180,140,90,.40)" stroke="rgba(31,26,20,.55)" strokeWidth={0.025}/>
      </At>

      {/* DRESSING — wardrobes both sides */}
      <At x={ROOMS.dressing.x + 0.05} y={ROOMS.dressing.y + 0.05}>
        <Wardrobe w={1.8} h={0.5}/>
      </At>
      <At x={ROOMS.dressing.x + 0.05} y={ROOMS.dressing.y + 1.30}>
        <Wardrobe w={1.8} h={0.5}/>
      </At>

      {/* SDE PARENTS — bath, sink, shower, wc */}
      <At x={ROOMS.sdep.x + 0.10} y={ROOMS.sdep.y + 0.20}>
        <Bathtub w={1.6} h={0.7}/>
      </At>
      <At x={ROOMS.sdep.x + 0.10} y={ROOMS.sdep.y + 1.15}>
        <Sink w={0.6} h={0.42}/>
      </At>
      <At x={ROOMS.sdep.x + 0.85} y={ROOMS.sdep.y + 1.15}>
        <Sink w={0.6} h={0.42}/>
      </At>
      <At x={ROOMS.sdep.x + 0.10} y={ROOMS.sdep.y + 1.95}>
        <Toilet w={0.42} h={0.6}/>
      </At>
      <At x={ROOMS.sdep.x + 0.75} y={ROOMS.sdep.y + 1.70}>
        <Shower w={1.0} h={0.95}/>
      </At>
    </g>
  );
}

/* ───── room labels ───── */
function Labels({ palette = {} }) {
  const items = [
    { id:'cuisine', name:'CUISINE',         x: ROOMS.cuisine.x + ROOMS.cuisine.w/2, y: ROOMS.cuisine.y + ROOMS.cuisine.h - 0.6 },
    { id:'cellier', name:'CELLIER',         x: ROOMS.cellier.x + ROOMS.cellier.w/2, y: ROOMS.cellier.y + ROOMS.cellier.h/2 },
    { id:'hall',    name:'HALL',            x: ROOMS.hall.x + ROOMS.hall.w/2,       y: ROOMS.hall.y + ROOMS.hall.h/2 + 0.1 },
    { id:'sam',     name:'SALLE À MANGER',  x: ROOMS.sam.x + ROOMS.sam.w/2,         y: ROOMS.sam.y + 0.7,  area: ROOMS.sam.area, big:true },
    { id:'sejour',  name:'SÉJOUR',          x: ROOMS.sejour.x + ROOMS.sejour.w/2,   y: ROOMS.sejour.y + 0.8, area: ROOMS.sejour.area, big:true },
    { id:'ch2',     name:'CHAMBRE 2',       x: ROOMS.ch2.x + ROOMS.ch2.w/2,         y: ROOMS.ch2.y + ROOMS.ch2.h - 0.6, area: ROOMS.ch2.area },
    { id:'ch3',     name:'CHAMBRE 3',       x: ROOMS.ch3.x + ROOMS.ch3.w/2,         y: ROOMS.ch3.y + ROOMS.ch3.h - 0.6, area: ROOMS.ch3.area },
    { id:'couloir', name:'DÉGAGEMENT',      x: ROOMS.couloir.x + ROOMS.couloir.w/2, y: ROOMS.couloir.y + ROOMS.couloir.h/2 + 0.05 },
    { id:'wc',      name:'WC',              x: ROOMS.wc.x + ROOMS.wc.w/2,           y: ROOMS.wc.y + ROOMS.wc.h/2 + 0.08 },
    { id:'sdec',    name:'SDE',             x: ROOMS.sdec.x + ROOMS.sdec.w/2,       y: ROOMS.sdec.y + 1.4 },
    { id:'parents', name:'CHAMBRE PARENTS', x: ROOMS.parents.x + ROOMS.parents.w/2, y: ROOMS.parents.y + ROOMS.parents.h - 0.55, area: ROOMS.parents.area, big:true },
    { id:'dressing',name:'DRESSING',        x: ROOMS.dressing.x + ROOMS.dressing.w/2, y: ROOMS.dressing.y + ROOMS.dressing.h/2 + 0.1 },
    { id:'sdep',    name:'SDE',             x: ROOMS.sdep.x + ROOMS.sdep.w/2,       y: ROOMS.sdep.y + 1.55 },
  ];
  return (
    <g style={{pointerEvents:'none'}}>
      {items.map(it => (
        <g key={it.id}>
          <text x={it.x} y={it.y}
                textAnchor="middle"
                fill="var(--ink)"
                style={{
                  font: `${it.big ? 500 : 500} ${it.big ? 0.32 : 0.24}px Manrope, sans-serif`,
                  letterSpacing: it.big ? '0.10em' : '0.14em',
                }}>
            {it.name}
          </text>
          {it.area && (
            <text x={it.x} y={it.y + (it.big ? 0.42 : 0.30)}
                  textAnchor="middle" fill="var(--ink-soft)"
                  style={{
                    font: `400 ${it.big ? 0.22 : 0.18}px 'JetBrains Mono', monospace`,
                    letterSpacing:'.04em'
                  }}>
              {it.area.toFixed(1)} m²
            </text>
          )}
        </g>
      ))}
      {/* Outdoor labels */}
      <text x={(3.6 + 16.6)/2} y={VILLA.y + VILLA.h + 1.05}
            textAnchor="middle" fill="var(--ink)"
            style={{font:'500 0.30px Manrope', letterSpacing:'.16em'}}>
        TERRASSE COUVERTE
      </text>
      <text x={13.25} y={16.40}
            textAnchor="middle" fill="rgba(31,41,51,.85)"
            style={{font:'500 0.28px Manrope', letterSpacing:'.18em'}}>
        PISCINE
      </text>
      <text x={5.5} y={18.4}
            textAnchor="middle" fill="var(--palm)"
            style={{font:'500 0.24px Manrope', letterSpacing:'.16em'}}>
        JARDIN TROPICAL
      </text>
      <text x={5.5} y={-0.6}
            textAnchor="middle" fill="var(--ink-soft)"
            style={{font:'500 0.20px Manrope', letterSpacing:'.20em'}}>
        ACCÈS VÉHICULE
      </text>
      <text x={IX + 8.2} y={-0.6}
            textAnchor="middle" fill="var(--ink-soft)"
            style={{font:'500 0.20px Manrope', letterSpacing:'.20em'}}>
        ENTRÉE
      </text>
    </g>
  );
}

/* ───── dimensions ───── */
function Dim({ x1, y1, x2, y2, label, side = 'top', offset = 0.6 }) {
  // simple horizontal/vertical dimension line
  const horiz = y1 === y2;
  const dx = horiz ? 0 : (side === 'left' ? -offset : offset);
  const dy = horiz ? (side === 'top' ? -offset : offset) : 0;
  const ox = x1 + dx, oy = y1 + dy;
  const ex = x2 + dx, ey = y2 + dy;
  const mx = (ox + ex)/2, my = (oy + ey)/2;
  const tickLen = 0.18;
  return (
    <g stroke="var(--ink-soft)" strokeWidth={0.015} fill="none">
      <line x1={x1} y1={y1} x2={ox} y2={oy}/>
      <line x1={x2} y1={y2} x2={ex} y2={ey}/>
      <line x1={ox} y1={oy} x2={ex} y2={ey}/>
      {/* tick marks */}
      {horiz ? (
        <>
          <line x1={ox} y1={oy - tickLen/2} x2={ox} y2={oy + tickLen/2}/>
          <line x1={ex} y1={ey - tickLen/2} x2={ex} y2={ey + tickLen/2}/>
        </>
      ) : (
        <>
          <line x1={ox - tickLen/2} y1={oy} x2={ox + tickLen/2} y2={oy}/>
          <line x1={ex - tickLen/2} y1={ey} x2={ex + tickLen/2} y2={ey}/>
        </>
      )}
      <text x={mx} y={my + (horiz ? -0.10 : 0)}
            textAnchor="middle"
            transform={horiz ? '' : `rotate(-90 ${mx} ${my})`}
            fill="var(--ink-soft)" stroke="none"
            style={{font:'500 0.22px "JetBrains Mono", monospace', letterSpacing:'.02em'}}>
        {label}
      </text>
    </g>
  );
}

function Dimensions() {
  return (
    <g>
      {/* Plot length top */}
      <Dim x1={0} y1={-0.05} x2={24} y2={-0.05} side="top" offset={0.9} label="22.00 m"/>
      {/* Plot height left */}
      <Dim x1={-0.05} y1={0} x2={-0.05} y2={20} side="left" offset={0.9} label="18.00 m"/>
      {/* Setback */}
      <Dim x1={0} y1={1.5} x2={3} y2={1.5} side="top" offset={0} label="3.00 m"/>
      {/* Villa width top */}
      <Dim x1={VILLA.x} y1={VILLA.y - 0.1} x2={VILLA.x + VILLA.w} y2={VILLA.y - 0.1} side="top" offset={1.1} label="17.00 m"/>
      {/* Villa height right */}
      <Dim x1={VILLA.x + VILLA.w + 0.1} y1={VILLA.y} x2={VILLA.x + VILLA.w + 0.1} y2={VILLA.y + VILLA.h} side="right" offset={1.0} label="10.00 m"/>
      {/* Terrasse */}
      <Dim x1={3.6} y1={VILLA.y + VILLA.h + 2.5 + 0.1} x2={16.6} y2={VILLA.y + VILLA.h + 2.5 + 0.1} side="bottom" offset={0.4} label="13.00 m"/>
    </g>
  );
}

function Setback() {
  return (
    <g>
      <rect x={SETBACK} y={SETBACK} width={PLOT.w - SETBACK*2} height={PLOT.h - SETBACK*2}
            fill="none" stroke="var(--terracotta)" strokeWidth={0.035}
            strokeDasharray="0.30 0.20" opacity=".75"/>
      <text x={SETBACK + 0.25} y={SETBACK - 0.20}
            fill="var(--terracotta-deep)"
            style={{font:'500 0.22px Manrope', letterSpacing:'.16em'}}>
        LIMITE DE RECUL — 3 m
      </text>
    </g>
  );
}

/* ───── rooms hover layer ───── */
function RoomHover({ hovered, setHover, palette }) {
  return (
    <g>
      {Object.entries(ROOMS).map(([id, room]) => (
        <rect
          key={id}
          x={room.x} y={room.y} width={room.w} height={room.h}
          fill={hovered === id ? 'rgba(194,104,73,.18)' : 'transparent'}
          stroke={hovered === id ? 'var(--terracotta)' : 'none'}
          strokeWidth={0.04}
          onMouseEnter={() => setHover(id)}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: 'pointer', transition: 'fill .2s, stroke .2s' }}
        />
      ))}
    </g>
  );
}

/* ───── compass ───── */
function CompassRose({ x = 22.6, y = 1.8 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={0} r={0.85} fill="var(--paper)" stroke="var(--ink-soft)" strokeWidth={0.025} opacity=".9"/>
      <path d="M 0 -0.65 L 0.18 0 L 0 0.65 L -0.18 0 Z"
            fill="var(--terracotta)" stroke="var(--ink)" strokeWidth={0.02}/>
      <path d="M 0 -0.65 L 0.18 0 L -0.18 0 Z"
            fill="var(--ink)"/>
      <text x={0} y={-0.95} textAnchor="middle"
            style={{font:'600 0.28px Manrope', letterSpacing:'.10em'}} fill="var(--ink)">N</text>
    </g>
  );
}

/* ───── scale bar ───── */
function ScaleBar({ x = 0.5, y = 19.6 }) {
  // 5m bar, 1m segments
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x={0} y={-0.2} fill="var(--ink-soft)"
            style={{font:'500 0.20px Manrope', letterSpacing:'.18em'}}>ÉCHELLE</text>
      <g>
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={i} y={0} width={1} height={0.15}
                fill={i % 2 === 0 ? 'var(--ink)' : 'var(--paper)'}
                stroke="var(--ink)" strokeWidth={0.015}/>
        ))}
      </g>
      {[0,1,2,3,4,5].map(i => (
        <text key={i} x={i} y={0.45} textAnchor="middle" fill="var(--ink-soft)"
              style={{font:'500 0.18px "JetBrains Mono", monospace'}}>{i}</text>
      ))}
      <text x={5.4} y={0.13} fill="var(--ink-soft)"
            style={{font:'500 0.20px Manrope', letterSpacing:'.04em'}}>m</text>
    </g>
  );
}

/* ───── orientation indicators (sun, breeze) ───── */
function SunPath({ x=0.6, y=10.5 }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity=".85">
      <text x={0} y={-0.1} fill="var(--ink-soft)"
            style={{font:'500 0.18px Manrope', letterSpacing:'.18em'}}>SOLEIL</text>
      <path d={`M 0 1 A 1.6 1.0 0 0 1 1.6 0`}
            fill="none" stroke="var(--terracotta)" strokeWidth={0.03} strokeDasharray=".10 .08"/>
      <circle cx={0.8} cy={0.10} r={0.10} fill="var(--terracotta)"/>
    </g>
  );
}

/* ───── main FloorPlan component ───── */
function FloorPlan({ tweaks, hovered, setHover }) {
  const {
    showFurniture = true,
    showDimensions = true,
    showSetback = true,
    showLabels = true,
    showCompass = true,
    palette = 'sand',
    showHatch = true,
  } = tweaks;

  const palettes = {
    sand:  { sejour:'#E2D5BB', sam:'#E5D7BA', cuisine:'#E0D2B6', parents:'#DCCFB2', ch2:'#D9CDB3', ch3:'#D6CAB0', couloir:'#D1C4A6', wc:'#CAB99A', sdec:'#CAB99A', sdep:'#CAB99A', dressing:'#D5C8AC', cellier:'#D2C5A8', hall:'#D5C8AC' },
    olive: { sejour:'#D8DBB8', sam:'#DBDDB9', cuisine:'#D3D8AC', parents:'#CDD3A1', ch2:'#C8CD9B', ch3:'#C4CA97', couloir:'#BFC692', wc:'#BCC18E', sdec:'#BCC18E', sdep:'#BCC18E', dressing:'#C7CD9C', cellier:'#C7CD9C', hall:'#CDD3A1' },
    cool:  { sejour:'#D4DDDB', sam:'#D7E0DD', cuisine:'#CFD9D7', parents:'#C7D3D2', ch2:'#C0CDCC', ch3:'#BCC9C7', couloir:'#B5C2C0', wc:'#B0BDBC', sdec:'#B0BDBC', sdep:'#B0BDBC', dressing:'#BBC8C6', cellier:'#BBC8C6', hall:'#C7D3D2' },
    mono:  { sejour:'#E7DFCF', sam:'#E7DFCF', cuisine:'#E2DAC8', parents:'#E2DAC8', ch2:'#DCD3BF', ch3:'#DCD3BF', couloir:'#D6CCB6', wc:'#D2C8B0', sdec:'#D2C8B0', sdep:'#D2C8B0', dressing:'#DCD3BF', cellier:'#DCD3BF', hall:'#E2DAC8' },
  };
  const pal = palettes[palette] || palettes.sand;

  return (
    <svg className="plan" viewBox="-1.5 -1.6 27 23" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="poolGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--pool)"/>
          <stop offset="100%" stopColor="var(--pool-deep)"/>
        </linearGradient>
        <pattern id="grassTexture" width="0.5" height="0.5" patternUnits="userSpaceOnUse">
          <circle cx="0.10" cy="0.10" r="0.020" fill="rgba(80,110,60,.40)"/>
          <circle cx="0.32" cy="0.30" r="0.018" fill="rgba(60,90,40,.40)"/>
          <circle cx="0.45" cy="0.05" r="0.015" fill="rgba(80,110,60,.30)"/>
        </pattern>
        <pattern id="concreteHatch" width="0.25" height="0.25" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0.25" x2="0.25" y2="0" stroke="rgba(31,26,20,.05)" strokeWidth="0.015"/>
        </pattern>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0.05" dy="0.10" stdDeviation="0.10" floodColor="rgba(31,26,20,.18)"/>
        </filter>
      </defs>

      <Site showFurniture={showFurniture} />
      {showSetback && <Setback />}

      {/* villa rooms — colored fills */}
      <g>
        {Object.entries(ROOMS).map(([id, r]) => (
          <rect key={id} x={r.x} y={r.y} width={r.w} height={r.h}
                fill={pal[id] || r.color}/>
        ))}
        {showHatch && (
          <rect x={IX} y={IY} width={IW} height={IH}
                fill="url(#concreteHatch)"/>
        )}
      </g>

      <Walls />
      <Doors />
      {showFurniture && <Furniture />}
      <RoomHover hovered={hovered} setHover={setHover} />
      {showLabels && <Labels palette={pal}/>}
      {showDimensions && <Dimensions />}
      {showCompass && <CompassRose />}
      <ScaleBar />
      <SunPath />

      {/* room highlight overlay (re-stroke the hovered room outline) */}
      {hovered && ROOMS[hovered] && (
        <rect x={ROOMS[hovered].x} y={ROOMS[hovered].y}
              width={ROOMS[hovered].w} height={ROOMS[hovered].h}
              fill="none" stroke="var(--terracotta)" strokeWidth={0.06}
              style={{pointerEvents:'none'}}/>
      )}
    </svg>
  );
}

Object.assign(window, { FloorPlan, ROOMS, SIX_PIECES });
