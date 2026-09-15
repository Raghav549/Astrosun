import { computePanchanga, type PanchangaOptions } from './engine';
import { normalizeDegrees } from '../astro/angles';
import { julianDate } from '../astro/ephemeris';
import { planetaryBaseline, heliocentricXY } from '../astro/planets';
import { tropicalToSidereal } from './ayanamsa';

export interface JyotishaChartOptions extends PanchangaOptions { longitudeDeg?: number; }
export interface GrahaPoint { id:string; name:string; longitudeDeg:number; signIndex:number; sign:string; degreeInSign:number; retrograde:boolean; speedDegPerDay?:number; }
export interface JyotishaChart {
  generatedAt:string; zodiac:'sidereal'; ayanamsa:'Lahiri'; sun:GrahaPoint; moon:GrahaPoint; ascendant:GrahaPoint;
  planets:GrahaPoint[]; panchanga:ReturnType<typeof computePanchanga>; notes:readonly string[];
}
const SIGNS=['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'] as const;
const mod=(x:number)=>((x%360)+360)%360;
function point(id:string,name:string,longitudeDeg:number,retrograde=false,speedDegPerDay?:number):GrahaPoint{const normalized=normalizeDegrees(longitudeDeg),signIndex=Math.floor(normalized/30);return{id,name,longitudeDeg:normalized,signIndex,sign:SIGNS[signIndex],degreeInSign:normalized-signIndex*30,retrograde,speedDegPerDay};}
function meanNodeTropical(jd:number){const T=(jd-2451545)/36525;return mod(125.0445479-1934.1362891*T+0.0020754*T*T+T*T*T/467441-T*T*T*T/60616000)}
function localSiderealDeg(jd:number,longitudeDeg:number){return mod(280.46061837+360.98564736629*(jd-2451545)+longitudeDeg)}
function meanObliquityDeg(jd:number){const T=(jd-2451545)/36525;return 23.43929111-0.0130041667*T-1.64e-7*T*T+5.04e-7*T*T*T}
/** Full Navagraha baseline. Planetary longitudes are geocentric projections of the analytical orbital baseline and are explicitly approximate. */
export function buildJyotishaChart(date:Date,options:JyotishaChartOptions={}):JyotishaChart{
  const panchanga=computePanchanga(date,{...options,sidereal:true});
  const jd=julianDate(date), longitude=options.longitudeDeg??0, latitude=options.location?.latitudeDeg??0;
  const sun=point('sun','Sun',panchanga.sunLongitudeDeg);
  const moon=point('moon','Moon',panchanga.moonLongitudeDeg);
  const lst=localSiderealDeg(jd,longitude),eps=meanObliquityDeg(jd),phi=latitude*Math.PI/180,theta=lst*Math.PI/180,e=eps*Math.PI/180;
  const ascTropical=mod(Math.atan2(-Math.cos(theta),Math.sin(theta)*Math.cos(e)+Math.tan(phi)*Math.sin(e))*180/Math.PI);
  const ascendant=point('lagna','Lagna',tropicalToSidereal(ascTropical,jd));
  const raw=planetaryBaseline(date),earth=raw.find(x=>x.name==='Earth')!;
  const nav:GrahaPoint[]=[sun,moon];
  for(const body of raw){if(body.name==='Earth')continue;const b=heliocentricXY(body),eXY=heliocentricXY(earth);const geoLon=mod(Math.atan2(b.y-eXY.y,b.x-eXY.x)*180/Math.PI);const sid=tropicalToSidereal(geoLon,jd);nav.push(point(body.name.toLowerCase(),body.name,sid,body.name==='Mercury'||body.name==='Venus'?false:false,body.meanMotionDegPerDay));}
  const rahu=point('rahu','Rahu',tropicalToSidereal(meanNodeTropical(jd),jd),true,-0.05295);const ketu=point('ketu','Ketu',mod(rahu.longitudeDeg+180),true,-0.05295);nav.push(rahu,ketu);
  const classical=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const planets=classical.map(name=>nav.find(x=>x.name===name)!).filter(Boolean);
  return{generatedAt:new Date().toISOString(),zodiac:'sidereal',ayanamsa:'Lahiri',sun,moon,ascendant,planets,panchanga,notes:[
    'Sun and Moon use the AstroSun analytical ephemeris.',
    'Mercury through Saturn use geocentric projection of the analytical orbital baseline; positions are approximate until a validated high-precision provider is injected.',
    'Rahu/Ketu use the mean ascending node with Ketu exactly 180° opposite and both retrograde by convention.',
    'Lagna uses local sidereal time, latitude and mean obliquity with the declared Lahiri-style ayanamsa boundary.',
    'Interpretive Jyotisha rules are kept separate from measured astronomical quantities.'
  ]};
}
export function zodiacSigns():readonly string[]{return SIGNS;}
