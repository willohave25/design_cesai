// app.jsx — Root shell : header Cool Services + plan + sidebar légende + Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showFurniture": true,
  "showDimensions": true,
  "showSetback": true,
  "showLabels": true,
  "showCompass": true,
  "showHatch": true,
  "palette": "sand",
  "ambiance": "jour"
}/*EDITMODE-END*/;

const SIDEBAR_ROOMS = [
  { id:'sejour',  label:'Séjour' },
  { id:'sam',     label:'Salle à manger' },
  { id:'cuisine', label:'Cuisine' },
  { id:'parents', label:'Chambre Parents' },
  { id:'ch2',     label:'Chambre 2' },
  { id:'ch3',     label:'Chambre 3' },
  { id:'sdep',    label:'SDE Parents' },
  { id:'sdec',    label:'SDE Commune' },
  { id:'wc',      label:'WC' },
  { id:'dressing',label:'Dressing' },
  { id:'cellier', label:'Cellier · Buanderie' },
  { id:'hall',    label:'Hall d\u2019entrée' },
  { id:'couloir', label:'Dégagement' },
];

function Header() {
  return (
    <header className="head">
      <div className="logo">
        <img src="assets/cool-services-logo.png" alt="Cool Services"/>
        <div className="div"></div>
        <div className="meta">
          <span className="eyebrow">Agence Immobilière · Korhogo</span>
          <h1>Villa Basse <em>6 Pièces</em> · Plan d'Implantation</h1>
          <span className="sub">Style architectural <b>Ibiza</b> — murs blancs épais, lignes douces, ouvertures généreuses sur le jardin tropical.</span>
        </div>
      </div>
      <div></div>
      <div className="ref">
        <b>Réf. CS·VB6P / 2026</b>
        Échelle 1 : 100 — Cotes en mètres
        <small>Code Urbanisme · Côte d'Ivoire</small>
      </div>
    </header>
  );
}

function StatsStrip() {
  return (
    <div className="stats">
      <div className="stat">
        <div className="label">Surface terrain</div>
        <div className="value">432<span className="unit">m<sup>2</sup></span></div>
      </div>
      <div className="stat">
        <div className="label">Emprise au sol</div>
        <div className="value">170<span className="unit">m<sup>2</sup></span></div>
      </div>
      <div className="stat">
        <div className="label">Surface habitable</div>
        <div className="value">163<span className="unit">m<sup>2</sup></span></div>
      </div>
      <div className="stat">
        <div className="label">Terrasse couverte</div>
        <div className="value">32,5<span className="unit">m<sup>2</sup></span></div>
      </div>
      <div className="stat">
        <div className="label">Pièces principales</div>
        <div className="value">6<span className="unit">pièces</span></div>
      </div>
    </div>
  );
}

function Sidebar({ hovered, setHover }) {
  return (
    <aside className="side">
      <div>
        <h3>Composition · 6 Pièces</h3>
        <div className="group">
          {SIDEBAR_ROOMS.slice(0,6).map(r => {
            const room = ROOMS[r.id];
            return (
              <div key={r.id}
                   className={`legend-row ${hovered === r.id ? 'active' : ''}`}
                   onMouseEnter={() => setHover(r.id)}
                   onMouseLeave={() => setHover(null)}>
                <div className="dot" style={{
                  background: room.type === 'day' ? '#E2D5BB'
                           : room.type === 'night' ? '#DCCFB2'
                           : room.type === 'wet' ? '#CAB99A'
                           : '#D5C8AC'
                }}/>
                <div className="name">
                  {r.label}
                  <small>{room.type === 'day' ? 'Zone jour' : room.type === 'night' ? 'Zone nuit' : 'Service'}</small>
                </div>
                <div className="area">{room.area.toFixed(1)} m²</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3>Annexes</h3>
        <div className="group">
          {SIDEBAR_ROOMS.slice(6).map(r => {
            const room = ROOMS[r.id];
            return (
              <div key={r.id}
                   className={`legend-row ${hovered === r.id ? 'active' : ''}`}
                   onMouseEnter={() => setHover(r.id)}
                   onMouseLeave={() => setHover(null)}>
                <div className="dot" style={{ background:'#CAB99A' }}/>
                <div className="name" style={{fontWeight:500}}>{r.label}</div>
                <div className="area">{room.area.toFixed(1)} m²</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="note">
        <span className="pill">Normes CI</span>
        Recul minimum de <b>3 m</b> par rapport aux limites du terrain. Murs porteurs <b>20 cm</b>, cloisons <b>15 cm</b>.
        Orientation séjour <b>plein sud</b>, chambres protégées au nord.
      </div>

      <div className="note">
        <span className="pill" style={{background:'var(--olive)'}}>Ibiza</span>
        Sols en <b>béton ciré clair</b>, terrasse en <b>teck</b>, mobilier scandinavo-méditerranéen, plantation tropicale (palmiers, philodendrons, frangipaniers).
      </div>
    </aside>
  );
}

function Foot() {
  return (
    <div className="foot">
      <div>
        <span className="stamp">Cool Services · Agence Immobilière</span><br/>
        la rotonde· Korhogo, Côte d'Ivoire — contact@coolservicesagenceimmobilière-ci.com · +225 05 74 24 28 51
      </div>
      <div className="right">
        <span><b>Plan</b> 01/04</span>
        <span><b>Date</b> 09 / 05 / 2026</span>
        <span><b>Dressé par</b> Atelier CESAI</span>
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [hovered, setHover] = React.useState(null);

  return (
    <div className={`shell ${t.ambiance === 'nuit' ? 'night' : ''}`}>
      <div className="brochure">
        <Header/>
        <StatsStrip/>
        <div className="body">
          <div className="plan-wrap">
            <FloorPlan tweaks={t} hovered={hovered} setHover={setHover}/>
          </div>
          <Sidebar hovered={hovered} setHover={setHover}/>
        </div>
        <Foot/>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Affichage"/>
        <TweakToggle label="Mobilier"     value={t.showFurniture}  onChange={v => setTweak('showFurniture', v)}/>
        <TweakToggle label="Cotations"    value={t.showDimensions} onChange={v => setTweak('showDimensions', v)}/>
        <TweakToggle label="Étiquettes"   value={t.showLabels}     onChange={v => setTweak('showLabels', v)}/>
        <TweakToggle label="Recul 3 m"    value={t.showSetback}    onChange={v => setTweak('showSetback', v)}/>
        <TweakToggle label="Boussole"     value={t.showCompass}    onChange={v => setTweak('showCompass', v)}/>
        <TweakToggle label="Trame béton"  value={t.showHatch}      onChange={v => setTweak('showHatch', v)}/>

        <TweakSection label="Ambiance"/>
        <TweakRadio label="Heure"
                    value={t.ambiance}
                    options={['jour','nuit']}
                    onChange={v => setTweak('ambiance', v)}/>

        <TweakSection label="Palette des pièces"/>
        <TweakSelect label="Teinte"
                     value={t.palette}
                     options={[
                       {value:'sand',  label:'Sable & lin'},
                       {value:'olive', label:'Olive & terracotta'},
                       {value:'cool',  label:'Brise marine'},
                       {value:'mono',  label:'Monochrome ivoire'},
                     ]}
                     onChange={v => setTweak('palette', v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
