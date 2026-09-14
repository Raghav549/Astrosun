import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Orbit, BookOpen, Sparkles, Telescope, Calculator, CalendarDays, ChevronRight, Atom, Globe2, ShieldCheck, Activity, Eclipse, MapPin} from 'lucide-react';
import {buildRuntimeSnapshot} from './core';
import './styles.css';

const slides=[
 {title:'See the sky as a system',text:'Astronomical state, calendar geometry, and evidence are exposed as separate computational layers.',icon:Telescope},
 {title:'Calculate, don’t guess',text:'Planetary longitude, phase geometry, and event calculations come from explicit deterministic functions.',icon:Calculator},
 {title:'Research-backed intelligence',text:'Scientific claims carry accuracy boundaries, provenance, and evidence contracts.',icon:BookOpen},
 {title:'A school for cosmic thinking',text:'Learn calendars, sky motion, seasons, physics, celestial mechanics, and traditional interpretation without mixing evidence levels.',icon:Atom}
];

const features=[['Kundali Lab','Birth chart, houses, nakshatra, dasha and classical interpretation'],['Planet Engine','Geocentric/heliocentric positions, angular separation, retrograde state'],['Graha Research','Mass, radius, atmosphere, gravity, albedo and physical context'],['Muhurta','Day and time selection with astronomical and calendar factors'],['Patra / Panchanga','Tithi, vara, nakshatra, yoga, karana and sunrise/sunset'],['Sky Explorer','Interactive celestial sphere and planet trajectories'],['Research Vault','Paper-backed explanations, citations and confidence labels'],['Stone & Material Lab','Mineral/property matching presented as cultural/traditional guidance—not medical fact'],['AI Council','Multi-model answer synthesis with source agreement and fallbacks'],['Life Atlas','Education-first planning, habits and reflection—not deterministic fortune claims']];

function App(){
 const [intro,setIntro]=useState(true); const [slide,setSlide]=useState(0); const [tab,setTab]=useState('Home');
 const [runtime,setRuntime]=useState(()=>buildRuntimeSnapshot());
 useEffect(()=>{const t=setTimeout(()=>setIntro(false),1800); return()=>clearTimeout(t)},[]);
 useEffect(()=>{const id=setInterval(()=>setRuntime(buildRuntimeSnapshot()),60000);return()=>clearInterval(id)},[]);
 if(intro) return <div className="splash"><div className="sun-orbit"><Orbit size={62}/></div><h1>ASTROSUN</h1><p>Cosmic Intelligence • Research • Jyotisha</p><div className="loader"><span/></div></div>
 const S=slides[slide]; const Icon=S.icon;
 const passed=runtime.invariants.filter(x=>x.passed).length;
 const moon=runtime.positions.find(x=>x.body==='Moon'); const sun=runtime.positions.find(x=>x.body==='Sun');
 return <div className="app"><header><div className="brand"><div className="brandMark"><Orbit/></div><div><b>ASTROSUN</b><small>RESEARCH GRADE COSMIC INTELLIGENCE</small></div></div><button className="round"><Globe2 size={18}/></button></header>
 <main>
  <section className="hero"><div className="stars"><span/><span/><span/><span/><span/></div><div className="planet planet-a"/><div className="planet planet-b"/><div className="copy"><label>SCIENCE × JYOTISHA</label><h2>{S.title}</h2><p>{S.text}</p><button className="orange" onClick={()=>setTab('Explore')}>Explore engine <ChevronRight size={18}/></button></div><div className="glassCard"><Icon size={34}/><strong>Live Scientific Snapshot</strong><small>{runtime.provenance.accuracy} • deterministic • provenance-aware</small></div></section>
  <section className="carousel"><div className="carouselTop"><span>{String(slide+1).padStart(2,'0')} / 04</span><div className="dots">{slides.map((_,i)=><button className={i===slide?'active':''} onClick={()=>setSlide(i)} key={i}/>)}</div></div><p>Moon {moon?.longitudeDeg.toFixed(3)}° • Sun {sun?.longitudeDeg.toFixed(3)}° • {runtime.panchanga.tithi.paksha} Tithi {runtime.panchanga.tithi.number} • {runtime.panchanga.nakshatra.name} • {runtime.panchanga.yogaName}</p></section>
  <section className="researchBadges"><span><ShieldCheck size={14}/> Invariants {passed}/{runtime.invariants.length}</span><span><Activity size={14}/> Ephemeris: {runtime.capability.ephemeris}</span><span><Eclipse size={14}/> Eclipse geometry ready</span><span><MapPin size={14}/> Observer geometry ready</span></section>
  <section className="featureGrid">{features.map(([a,b],i)=><button className="feature" key={a} onClick={()=>setTab(a)}><span className="num">{String(i+1).padStart(2,'0')}</span><div><b>{a}</b><small>{b}</small></div><ChevronRight size={18}/></button>)}</section>
  <section className="research"><div><label>RESEARCH FOUNDATION</label><h3>Modern celestial mechanics, astronomical computation & evidence-aware AI</h3><p>High-precision kernels are consumed only through explicit external DE/SPICE/CALCEPH providers. Approximate fallback results stay labelled approximate.</p></div><div className="researchBadges"><span>Provider contracts</span><span>Uncertainty layer</span><span>Benchmark gates</span><span>Regional Panchanga policies</span></div></section>
 </main>
 <nav>{[['Home',Sparkles],['Explore',Telescope],['Kundali',Orbit],['Panchanga',CalendarDays],['Research',BookOpen]].map(([n,I])=><button className={tab===n?'sel':''} onClick={()=>setTab(n)} key={n}><I size={19}/><span>{n}</span></button>)}</nav>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);