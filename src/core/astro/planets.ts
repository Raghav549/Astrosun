import { julianDate } from './ephemeris';

export type PlanetName='Mercury'|'Venus'|'Earth'|'Mars'|'Jupiter'|'Saturn'|'Uranus'|'Neptune';
export interface PlanetState{name:PlanetName;longitudeDeg:number;distanceAU:number;meanMotionDegPerDay:number;accuracy:'analytical-baseline'}
const TAU=Math.PI*2; const RAD=Math.PI/180;
const DATA:Record<PlanetName,{a:number;period:number;phase:number}>={
 Mercury:{a:0.387,period:87.969,phase:252.25},Venus:{a:0.723,period:224.701,phase:181.98},Earth:{a:1,period:365.256,phase:100.46},Mars:{a:1.524,period:686.98,phase:355.45},Jupiter:{a:5.203,period:4332.59,phase:34.4},Saturn:{a:9.537,period:10759.22,phase:50.08},Uranus:{a:19.191,period:30685.4,phase:314.2},Neptune:{a:30.07,period:60189.0,phase:304.88}
};
const norm=(x:number)=>((x%360)+360)%360;
export function planetaryBaseline(date:Date):PlanetState[]{const d=julianDate(date)-2451545;return(Object.entries(DATA) as [PlanetName,{a:number;period:number;phase:number}][]).map(([name,c])=>({name,longitudeDeg:norm(c.phase+360*d/c.period),distanceAU:c.a,meanMotionDegPerDay:360/c.period,accuracy:'analytical-baseline'}))}
export function heliocentricXY(body:PlanetState){const r=body.distanceAU, a=body.longitudeDeg*RAD;return{x:r*Math.cos(a),y:r*Math.sin(a)}}
export function angularDifference(a:number,b:number){return Math.abs(((a-b+180)%360+360)%360-180)}
export const PLANETS:Object=DATA;