import { julianDate, moonEclipticPosition, sunEclipticLongitude } from '../astro/ephemeris';
import { tropicalToSidereal } from './ayanamsa';
import { karanaName, yogaName } from './names';
import { civilDateParts, validatePanchangaLocation, type PanchangaLocation } from './location';
import type { Nakshatra, PanchangaSnapshot, Tithi } from './types';
const norm=(x:number)=>((x%360)+360)%360;
const NAKSHATRAS=['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const TITHI_NAMES=['Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima','Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Amavasya'];
export interface PanchangaOptions{sidereal?:boolean;ruleSet?:string;location?:PanchangaLocation;}
function sunriseSunsetApprox(date:Date,lat:number,lon:number){const jd=julianDate(date);const n=jd-2451545;const g=(357.529+0.98560028*n)*Math.PI/180;const q=280.459+0.98564736*n;const L=(q+1.915*Math.sin(g)+0.020*Math.sin(2*g))*Math.PI/180;const e=(23.439-0.00000036*n)*Math.PI/180;const dec=Math.asin(Math.sin(e)*Math.sin(L));const latRad=lat*Math.PI/180;const h0=-0.833*Math.PI/180;const cosH=(Math.sin(h0)-Math.sin(latRad)*Math.sin(dec))/(Math.cos(latRad)*Math.cos(dec));if(cosH>=1||cosH<=-1)return{};const H=Math.acos(cosH)*180/Math.PI;const noon=12-lon/15;const dayOfYear=Math.floor((date.getTime()-Date.UTC(date.getUTCFullYear(),0,0))/86400000);const eqt=7.5*Math.sin(2*g)-5*Math.sin(g)-1.5*Math.sin(3*g);const correction=eqt/60;const rise=noon-H/15-correction;const set=noon+H/15-correction;const iso=(hours:number)=>{const h=((hours%24)+24)%24;const m=Math.floor(h);const s=Math.round((h-m)*60);return `${String(m).padStart(2,'0')}:${String(Math.min(59,s)).padStart(2,'0')}`};void dayOfYear;return{sunrise:iso(rise),sunset:iso(set)};}
export function computePanchanga(date:Date,options:PanchangaOptions={}):PanchangaSnapshot{
 if(options.location)validatePanchangaLocation(options.location);
 const jd=julianDate(date); const tropicalSun=sunEclipticLongitude(jd), tropicalMoon=moonEclipticPosition(jd).longitudeDeg;
 const sun=options.sidereal?tropicalToSidereal(tropicalSun,jd):tropicalSun; const moon=options.sidereal?tropicalToSidereal(tropicalMoon,jd):tropicalMoon;
 const phase=norm(tropicalMoon-tropicalSun); const tithiNumber=Math.min(30,Math.floor(phase/12)+1) as Tithi['number'];
 const tithi:Tithi={number:tithiNumber,name:TITHI_NAMES[tithiNumber-1],paksha:tithiNumber<=15?'Shukla':'Krishna',phaseAngleDeg:phase};
 const segment=360/27; const nakIndex=Math.min(26,Math.floor(moon/segment)); const local=moon-nakIndex*segment;
 const yogaDeg=norm(sun+moon); const nakshatra:Nakshatra={number:nakIndex+1,name:NAKSHATRAS[nakIndex],longitudeStartDeg:nakIndex*segment,longitudeEndDeg:(nakIndex+1)*segment,pada:Math.min(4,Math.floor(local/(segment/4))+1)};
 const halfTithiIndex=Math.floor(phase/6)+1; const localParts=options.location?civilDateParts(date,options.location.timeZone):undefined; const ss=options.location?sunriseSunsetApprox(date,options.location.latitudeDeg,options.location.longitudeDeg):{};
 const parva=tithiNumber===15?'Purnima':tithiNumber===30?'Amavasya':`${tithi.paksha} ${tithi.name}`;
 return{jd,localDate:localParts?`${localParts.year}-${String(localParts.month).padStart(2,'0')}-${String(localParts.day).padStart(2,'0')}`:date.toISOString().slice(0,10),timeZone:options.location?.timeZone,location:options.location?{latitudeDeg:options.location.latitudeDeg,longitudeDeg:options.location.longitudeDeg,elevationMeters:options.location.elevationMeters??0}:undefined,sunrise:ss.sunrise,sunset:ss.sunset,tithi,nakshatra,yogaDeg,yogaName:yogaName(yogaDeg),karanaIndex:halfTithiIndex,karanaName:karanaName(halfTithiIndex),sunLongitudeDeg:sun,moonLongitudeDeg:moon,sun:{longitudeDeg:sun},moon:{longitudeDeg:moon},accuracy:'approximate',ruleSet:options.ruleSet,parva,grahaEvents:[`Sun ${sun.toFixed(3)}° sidereal`,`Moon ${moon.toFixed(3)}° sidereal`]};
}
