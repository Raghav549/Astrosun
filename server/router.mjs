import http from 'node:http';

const port=Number(process.env.PORT||3000);
const providers=[
 {name:'NVIDIA NIM',base:process.env.NVIDIA_NIM_BASE_URL||'https://integrate.api.nvidia.com/v1',key:process.env.NVIDIA_NIM_API_KEY},
 {name:'AIHubMix',base:process.env.AIHUBMIX_BASE_URL||'https://aihubmix.com/v1',key:process.env.AIHUBMIX_API_KEY}
];

function send(res,status,data){res.writeHead(status,{'content-type':'application/json; charset=utf-8','access-control-allow-origin':'*'});res.end(JSON.stringify(data));}

async function callProvider(provider,body){
 if(!provider.key) throw new Error(`${provider.name} key is not configured`);
 const r=await fetch(`${provider.base}/chat/completions`,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${provider.key}`},body:JSON.stringify(body)});
 if(!r.ok) throw new Error(`${provider.name} HTTP ${r.status}: ${await r.text()}`);
 return r.json();
}

async function routeAI(body){
 let last;
 for(const p of providers){try{return {provider:p.name,result:await callProvider(p,body)}}catch(e){last=e}}
 throw last||new Error('No AI provider available');
}

const server=http.createServer(async(req,res)=>{
 if(req.method==='OPTIONS'){res.writeHead(204,{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type,authorization'});return res.end()}
 if(req.url==='/health'){return send(res,200,{ok:true,providers:providers.map(p=>({name:p.name,configured:Boolean(p.key)}))})}
 if(req.url==='/api/ai'&&req.method==='POST'){
  let raw=''; for await(const c of req) raw+=c; try{const body=JSON.parse(raw||'{}');return send(res,200,await routeAI(body))}catch(e){return send(res,502,{ok:false,error:String(e.message||e)})}
 }
 send(res,404,{error:'not_found'});
});
server.listen(port,'0.0.0.0',()=>console.log(`AstroSun API listening on ${port}`));
