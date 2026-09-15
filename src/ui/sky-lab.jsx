import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Compass, Crosshair, Globe2, MapPin, Pause, Play, RefreshCw, Search, Sun as SunIcon, TimerReset, ZoomIn, ZoomOut } from 'lucide-react';
import { planetaryBaseline } from '../core/astro/planets';
import { julianDate, sunEclipticLongitude } from '../core/astro/ephemeris';
import './sky-lab.css';

const RASHI = ['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुंभ','मीन'];
const NAK = ['अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिरा','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पूर्वा फाल्गुनी','उत्तरा फाल्गुनी','हस्त','चित्रा','स्वाती','विशाखा','अनुराधा','ज्येष्ठा','मूल','पूर्वाषाढ़ा','उत्तराषाढ़ा','श्रवण','धनिष्ठा','शतभिषा','पूर्वाभाद्रपद','उत्तराभाद्रपद','रेवती'];
const META = {
  सूर्य:{en:'Sun',size:48,c1:'#fff5ad',c2:'#e84a0d'},
  बुध:{en:'Mercury',size:8,c1:'#e9edf3',c2:'#69717d'},
  शुक्र:{en:'Venus',size:11,c1:'#fff0c7',c2:'#c58b52'},
  पृथ्वी:{en:'Earth',size:13,c1:'#78d7ff',c2:'#1e4d9b'},
  मंगल:{en:'Mars',size:10,c1:'#ffad82',c2:'#8d3020'},
  बृहस्पति:{en:'Jupiter',size:22,c1:'#f4cf9a',c2:'#815a3d'},
  शनि:{en:'Saturn',size:18,c1:'#f1dfad',c2:'#8d6c42'},
  अरुण:{en:'Uranus',size:15,c1:'#baf1ef',c2:'#438e9d'},
  वरुण:{en:'Neptune',size:15,c1:'#9abfff',c2:'#315899'},
  प्लूटो:{en:'Pluto',size:7,c1:'#e1d5ca',c2:'#716158'}
};
const norm = value => ((value % 360) + 360) % 360;

function gmst(jd) {
  return norm(280.46061837 + 360.98564736629 * (jd - 2451545));
}

function horizon(longitude, observerLat, observerLon, jd) {
  const e = 23.4393 * Math.PI / 180;
  const l = longitude * Math.PI / 180;
  const ra = Math.atan2(Math.sin(l) * Math.cos(e), Math.cos(l)) * 180 / Math.PI / 15;
  const dec = Math.asin(Math.sin(l) * Math.sin(e)) * 180 / Math.PI;
  const H = ((((gmst(jd) + observerLon) / 15 - ra + 12) % 24) + 24) % 24 - 12;
  const h = observerLat * Math.PI / 180;
  const d = dec * Math.PI / 180;
  const hr = H * 15 * Math.PI / 180;
  const alt = Math.asin(Math.sin(h) * Math.sin(d) + Math.cos(h) * Math.cos(d) * Math.cos(hr)) * 180 / Math.PI;
  const az = norm(Math.atan2(-Math.sin(hr), Math.tan(d) * Math.cos(h) - Math.sin(h) * Math.cos(hr)) * 180 / Math.PI + 180);
  return { alt, az };
}

function nakshatra(longitude) {
  const sidereal = norm(longitude - 24.14);
  const span = 360 / 27;
  const index = Math.min(26, Math.floor(sidereal / span));
  return { name: NAK[index], pada: Math.floor((sidereal % span) / (360 / 108)) + 1 };
}

function getBodies(date, lat, lon) {
  const jd = julianDate(date);
  const baseline = planetaryBaseline(date);
  const rows = [
    { name:'सूर्य', lon:sunEclipticLongitude(jd), dist:1, motion:0.9856 },
    ...baseline.map(item => ({
      name:Object.keys(META).find(key => META[key].en === item.name) || item.name,
      lon:item.longitudeDeg,
      dist:item.distanceAU,
      motion:item.meanMotionDegPerDay
    }))
  ];
  return rows.map(item => {
    const h = horizon(item.lon, lat, lon, jd);
    const sidereal = norm(item.lon - 24.14);
    return { ...item, ...h, sidereal, rashi:RASHI[Math.floor(sidereal / 30)], nak:nakshatra(item.lon), visible:h.alt > 0 };
  });
}

function orbitRadius(distance) {
  return 70 + Math.log10(distance + 1) * 105;
}

export function SkyLab({ onBack, onOpen, onAsk, profile }) {
  const [observer, setObserver] = useState({ lat:Number(profile?.location?.latitudeDeg ?? 25.5941), lon:Number(profile?.location?.longitudeDeg ?? 85.1376), name:profile?.location?.name || 'भारत' });
  const [now, setNow] = useState(new Date());
  const [playing, setPlaying] = useState(true);
  const [rate, setRate] = useState(1);
  const [focus, setFocus] = useState('सूर्य');
  const [tab, setTab] = useState('आकाश');
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => setNow(value => new Date(value.getTime() + 250 * rate * 1000)), 250);
    return () => clearInterval(timer);
  }, [playing, rate]);

  const data = useMemo(() => getBodies(now, observer.lat, observer.lon), [now, observer.lat, observer.lon]);
  const selected = data.find(item => item.name === focus) || data[0];
  const sun = data.find(item => item.name === 'सूर्य') || data[0];

  const selectBody = body => {
    if (!body) return;
    if (focus === body.name && zoom > 1.05) {
      setZoom(1);
      setTab('आकाश');
      return;
    }
    setFocus(body.name);
    setZoom(1.65);
    setTab('विवरण');
  };

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setObserver({ lat:position.coords.latitude, lon:position.coords.longitude, name:`${position.coords.latitude.toFixed(3)}°, ${position.coords.longitude.toFixed(3)}°` });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy:true, timeout:10000, maximumAge:300000 }
    );
  };

  const result = data.find(item => item.name === query.trim() || META[item.name]?.en.toLowerCase() === query.trim().toLowerCase());
  const speed = rate === 1 ? '1×' : rate === 60 ? '1 min/s' : rate === 3600 ? '1 hr/s' : '1 day/s';

  return (
    <div className="sky-lab">
      <header className="sl-top">
        <button className="sl-back" onClick={onBack} aria-label="वापस"><ArrowLeft /></button>
        <div><small>ASTRONOMY · REAL-TIME LAB</small><h1>आकाश प्रयोगशाला</h1></div>
        <div className="sl-top-right">
          <button onClick={locate} aria-label="वर्तमान स्थान"><MapPin /><span>{locating ? '…' : observer.name}</span></button>
          <button onClick={() => setPlaying(value => !value)} aria-label="चलाएँ रोकें">{playing ? <Pause /> : <Play />}</button>
          <button onClick={() => setNow(new Date())} aria-label="वर्तमान समय"><RefreshCw /></button>
        </div>
      </header>

      <main className="sl-main">
        <section className="sl-status">
          <div><span>अवलोकन समय</span><b>{now.toLocaleDateString('hi-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</b><small>{now.toLocaleTimeString('hi-IN')} · {observer.lat.toFixed(3)}°, {observer.lon.toFixed(3)}°</small></div>
          <div className={sun.alt > 0 ? 'day' : 'night'}><span>{sun.alt > 0 ? 'दिन का आकाश' : 'रात्रि आकाश'}</span><b>{selected.alt.toFixed(1)}°</b><small>{selected.name} की ऊँचाई</small></div>
        </section>

        <section className="sl-lab-card">
          <div className="sl-lab-head"><div><small>सौर मंडल · गणना आधारित 2.5D दृश्य</small><h2>सूर्य से प्लूटो तक</h2></div><div className="sl-controls"><button onClick={() => setZoom(value => Math.max(1,value-.1))}><ZoomOut /></button><span>{Math.round(zoom*100)}%</span><button onClick={() => setZoom(value => Math.min(1.8,value+.1))}><ZoomIn /></button></div></div>
          <div className="sl-space">
            <div className="sl-starfield" />
            <div className="sl-plane">
              <div className="sl-ecliptic" /><div className="sl-ecliptic sl-ecliptic-b" />
              <button className="sl-sun" onClick={() => selectBody(sun)} aria-label="सूर्य"><div className="sl-corona" /><SunIcon /><small>सूर्य</small></button>
              {data.filter(item => item.name !== 'सूर्य').map(item => {
                const meta = META[item.name] || {size:10,c1:'#b9c5d8',c2:'#49566c'};
                const angle = item.lon * Math.PI / 180;
                const radius = orbitRadius(item.dist) * zoom;
                const left = 50 + Math.cos(angle) * radius / 3.6;
                const top = 50 + Math.sin(angle) * radius / 3.6 * .58;
                const size = meta.size * (focus === item.name ? 1.32 : 1);
                return <button key={item.name} className={`sl-body ${focus === item.name ? 'focused' : ''}`} style={{left:`${left}%`,top:`${top}%`,'--size':`${size}px`,'--c1':meta.c1,'--c2':meta.c2}} onClick={() => selectBody(item)} aria-label={item.name}><i />{item.name === 'शनि' && <em />}<span>{item.name}</span></button>;
              })}
            </div>
            <div className="sl-timebar"><button onClick={() => setRate(rate===1?60:rate===60?3600:rate===3600?86400:1)}><TimerReset /> {speed}</button><input type="range" min="0" max="3" value={rate===1?0:rate===60?1:rate===3600?2:3} onChange={event => setRate([1,60,3600,86400][Number(event.target.value)])} /><button onClick={() => setPlaying(value => !value)}>{playing ? 'रोकें' : 'चलाएँ'}</button></div>
          </div>
        </section>

        <div className="sl-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="किसी ग्रह का नाम खोजें…" />{result && <button onClick={() => selectBody(result)}>खोलें</button>}</div>
        <div className="sl-tabs">{['आकाश','विवरण','डेटा','घटनाएँ','निरीक्षण'].map(name => <button key={name} className={tab===name?'on':''} onClick={() => setTab(name)}>{name}</button>)}</div>

        {tab === 'आकाश' && <section className="sl-grid">
          <article><small>चयनित पिंड</small><h2>{selected.name}</h2><b>{selected.rashi}</b><p>नक्षत्र: <strong>{selected.nak.name}</strong> · पाद {selected.nak.pada}</p><p>दिगंश {selected.az.toFixed(1)}° · ऊँचाई {selected.alt.toFixed(1)}°</p></article>
          <article><small>सूर्य स्थिति</small><h2>{sun.alt>0?'अभी दिन है':'अभी रात है'}</h2><p>सूर्य की ऊँचाई: <strong>{sun.alt.toFixed(1)}°</strong></p><p>Simulation time बदलते ही मॉडल की स्थिति पुनर्गणित होती है।</p></article>
          <article><small>त्वरित प्रयोग</small><div className="sl-actions"><button onClick={() => setTab('डेटा')}>सभी ग्रह डेटा</button><button onClick={() => setTab('घटनाएँ')}>आज की घटनाएँ</button><button onClick={() => setTab('निरीक्षण')}>दृश्यता जाँच</button></div></article>
        </section>}

        {tab === 'विवरण' && <section className="sl-detail">
          <div className="sl-detail-hero"><span className="sl-detail-orb" style={{'--detail-c1':META[selected.name]?.c1||'#ffd36b','--detail-c2':META[selected.name]?.c2||'#ff7c19'}} /><div><small>चयनित खगोलीय पिंड</small><h2>{selected.name}</h2><p>{META[selected.name]?.en||'Celestial body'}</p></div></div>
          <div className="sl-metrics">{[['दीर्घांश',`${selected.lon.toFixed(4)}°`],['निरयन',`${selected.sidereal.toFixed(4)}°`],['राशि',selected.rashi],['नक्षत्र',selected.nak.name],['पाद',selected.nak.pada],['दूरी',`${selected.dist.toFixed(4)} AU`],['ऊँचाई',`${selected.alt.toFixed(2)}°`],['अज़ीमुथ',`${selected.az.toFixed(2)}°`],['दैनिक गति',`${selected.motion.toFixed(5)}°/दिन`]].map(([label,value]) => <div key={label}><small>{label}</small><b>{value}</b></div>)}</div>
          <div className="sl-detail-actions"><button onClick={() => onOpen?.('panchanga')}>आज का पंचांग</button><button onClick={() => onOpen?.('graha')}>ग्रह निरीक्षक</button><button onClick={() => onAsk?.(`${selected.name} की वर्तमान खगोलीय स्थिति समझाओ`)}>इस पिंड के बारे में पूछें</button></div>
          <p className="sl-note">यह दृश्य AstroSun के उपलब्ध analytical baseline से चलता है; इसे JPL/IAU high-precision ephemeris न माना जाए।</p>
        </section>}

        {tab === 'डेटा' && <section className="sl-table"><div className="sl-table-head"><span>पिंड</span><span>दीर्घांश</span><span>राशि</span><span>ऊँचाई</span><span>दूरी</span></div>{data.map(item => <button key={item.name} onClick={() => selectBody(item)}><b>{item.name}</b><span>{item.lon.toFixed(3)}°</span><span>{item.rashi}</span><span>{item.alt.toFixed(1)}°</span><span>{item.dist.toFixed(4)} AU</span></button>)}</section>}

        {tab === 'घटनाएँ' && <section className="sl-events"><article><b>कक्षीय स्थिति</b><span>Simulation time बदलते ही मॉडलित ग्रह-दीर्घांश और दृश्य position पुनर्गणित होती है।</span></article><article><b>अवलोकन स्थान</b><span>{observer.lat.toFixed(4)}°, {observer.lon.toFixed(4)}° से horizon geometry निकाली गई है।</span></article><article><b>मॉडल सीमा</b><span>सूर्य analytical ephemeris और अन्य ग्रह AstroSun baseline orbital model से आते हैं।</span></article></section>}

        {tab === 'निरीक्षण' && <section className="sl-observe"><button className="sl-primary" onClick={locate}><Crosshair size={17} />{locating?'स्थान खोज रहे हैं…':'वर्तमान स्थान से आकाश जाँचें'}</button><div className="sl-observe-card"><Compass /><div><b>{selected.name}</b><span>{selected.visible?'क्षितिज के ऊपर':'क्षितिज के नीचे'}</span><small>अज़ीमुथ {selected.az.toFixed(1)}° · ऊँचाई {selected.alt.toFixed(1)}°</small></div></div><div className="sl-observe-card"><Globe2 /><div><b>निरीक्षण समय</b><span>{now.toLocaleTimeString('hi-IN')}</span><small>{observer.name}</small></div></div></section>}
      </main>
    </div>
  );
}
