export interface RemoteProviderConfig{id:string;label:string;baseUrl:string;enabled:boolean;authEnv?:string;description:string}
export const REMOTE_PROVIDERS:RemoteProviderConfig[]=[
{id:'nasa-horizons',label:'NASA/JPL Horizons',baseUrl:'https://ssd-api.jpl.nasa.gov/horizons.api',enabled:true,description:'External ephemeris endpoint; use through a server-side provider adapter.'},
{id:'nasa-api',label:'NASA Open APIs',baseUrl:'https://api.nasa.gov',enabled:true,authEnv:'NASA_API_KEY',description:'NASA API family; key comes from deployment environment.'},
{id:'nvidia-nim',label:'NVIDIA NIM',baseUrl:'https://integrate.api.nvidia.com/v1',enabled:false,authEnv:'NVIDIA_NIM_API_KEY',description:'OpenAI-compatible AI inference endpoint.'},
{id:'openai-compatible',label:'OpenAI-compatible AI provider',baseUrl:'',enabled:false,authEnv:'AI_PROVIDER_API_KEY',description:'User-configured secondary AI provider.'},
{id:'aihubmix',label:'AIHubMix',baseUrl:'https://aihubmix.com/v1',enabled:false,authEnv:'AIHUBMIX_API_KEY',description:'OpenAI-compatible AI routing endpoint.'}];
export function providerStatus(env:Record<string,string|undefined>){return REMOTE_PROVIDERS.map(p=>({...p,enabled:p.enabled&&(p.authEnv?Boolean(env[p.authEnv]):true)}));}
