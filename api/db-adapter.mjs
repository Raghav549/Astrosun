import fs from 'node:fs/promises';
import path from 'node:path';

const dataDir=process.env.ASTROSUN_DATA_DIR||path.join(process.cwd(),'.astrosun-data');
const dataFile=path.join(dataDir,'store.json');
let queue=Promise.resolve();
async function readStore(){try{return JSON.parse(await fs.readFile(dataFile,'utf8'))}catch{return {profiles:{},history:[],sources:[]}}}
async function writeStore(store){await fs.mkdir(dataDir,{recursive:true});await fs.writeFile(dataFile,JSON.stringify(store), 'utf8')}
function serial(fn){queue=queue.then(fn,fn);return queue}
export async function health(){return{connected:false,mode:'render-filesystem-fallback'}}
export async function getProfile(userId){const s=await readStore();return s.profiles[userId]||null}
export async function saveProfile(userId,p){return serial(async()=>{const s=await readStore();s.profiles[userId]={user_id:userId,language:p.language,theme:p.theme,unit_system:p.unitSystem,location_name:p.locationName,latitude_deg:p.latitude,longitude_deg:p.longitude,time_zone:p.timeZone,rule_set:p.ruleSet,precision_provider:p.precisionProvider,updated_at:new Date().toISOString()};await writeStore(s);return s.profiles[userId]})}
export async function addHistory(userId,feature,payload){return serial(async()=>{const s=await readStore();const row={id:Date.now()+Math.floor(Math.random()*1000),user_id:userId,feature,payload,created_at:new Date().toISOString()};s.history.unshift(row);s.history=s.history.slice(0,2000);await writeStore(s);return row})}
export async function getHistory(userId,feature){const s=await readStore();return s.history.filter(x=>x.user_id===userId&&(!feature||x.feature===feature)).slice(0,100)}
export async function getSources(){const s=await readStore();return s.sources}
