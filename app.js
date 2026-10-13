(function(){
const RAW=window.PITGRID_DATA;
const $=id=>document.getElementById(id);
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i').replace(/ø/g,'o').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const LAUNCH=new Date(2026,9,1);
const DN={1:'Basit',2:'Orta',3:'Zor'},MN={all:'Tüm Zamanlar',mod:'2000 Sonrası'},MS={all:'Tüm Z.',mod:'2000+'};
const GUESSES={1:18,2:14,3:11};
const MINKNOWN={1:3,2:2,3:1};

// ---------- pools ----------
const ALIAS={'Kimi Antonelli':'andrea','Sergio Pérez':'checo','Alexander Albon':'alex','Oliver Bearman':'ollie','Nelson Piquet Jr.':'nelsinho','Zhou Guanyu':'guanyu'};
const sp=s=>s?s.split(','):[];
function buildPool(k){
  const src=RAW[k];
  const D=src.d.map((r,i)=>{const d={id:i,n:r[0],nat:r[1],first:r[2],last:r[3],starts:r[4],wins:r[5],poles:r[6],pods:r[7],titles:r[8],teams:sp(r[9]),pod:sp(r[10]),winT:sp(r[11])};
    d.tokens=norm(d.n+' '+(ALIAS[d.n]||'')).split(' ');d.full=norm(d.n);
    d.known=k==='all'?(d.starts>=50||d.wins>0||d.titles>0):(d.starts>=40||d.pods>0);return d});
  const tm={};for(const [h,list] of Object.entries(src.tm))tm[h]=new Set(list);
  const fl={};for(const [f,list] of Object.entries(src.fl||{}))fl[f]=new Set(list);
  for(const d of D){d.lead=!!(fl.lead&&fl.lead.has(d.n));d.home=!!(fl.home&&fl.home.has(d.n));d.circ3=!!(fl.circ3&&fl.circ3.has(d.n))}
  return {D,tm,byName:Object.fromEntries(D.map(d=>[d.n,d]))};
}
const POOLS={all:buildPool('all'),mod:buildPool('mod')};

const NAT={GB:'İngiliz',DE:'Alman',FR:'Fransız',BR:'Brezilyalı',FI:'Finli',ES:'İspanyol',AU:'Avustralyalı',IT:'İtalyan',NL:'Hollandalı',CA:'Kanadalı',NZ:'Yeni Zelandalı',AT:'Avusturyalı',MX:'Meksikalı',AR:'Arjantinli',BE:'Belçikalı',US:'Amerikalı',JP:'Japon',SE:'İsveçli',CH:'İsviçreli',RU:'Rus',ZA:'Güney Afrikalı',DK:'Danimarkalı'};
const flag=c=>c.replace(/./g,ch=>String.fromCodePoint(127397+ch.charCodeAt(0)));
const TEAM={FER:['Ferrari','SF','#dc0000'],MCL:['McLaren','MCL','#ff8000'],MER:['Mercedes','MER','#00d2be'],RBR:['Red Bull','RBR','#1e41ff'],WIL:['Williams','WIL','#005aff'],REN:['Renault','REN','#ffd800'],
ALP:['Alpine','ALP','#0090ff'],AMR:['Aston Martin','AMR','#006f62'],HAA:['Haas','HAAS','#b6babd'],SAU:['Sauber','SAU','#52e252','BMW · Alfa · Kick'],TRO:['Toro Rosso','STR','#6692ff','AlphaTauri · RB'],
BEN:['Benetton','BEN','#00a651'],LOT:['Lotus','LOT','#0b5d1e'],JOR:['Jordan','JOR','#f5d300'],FIN:['Force India','VJM','#f596c8','Racing Point dahil'],TOY:['Toyota','TOY','#cc0000'],BAR:['BAR / Honda','BAR','#e8e8e8'],
BRW:['Brawn GP','BGP','#c8f000'],CAD:['Cadillac','CAD','#9a9a9a'],AUD:['Audi','AUDI','#bb0a30'],BRB:['Brabham','BT','#1f6b4e'],TYR:['Tyrrell','TYR','#1d3f8f'],BRM:['BRM','BRM','#2a5a3a'],COO:['Cooper','COO','#3f6f3f'],
LIG:['Ligier','LIG','#2d6fd6'],MAS:['Maserati','MAS','#8a1c1c'],MAR:['March','MAR','#e8792b'],ARR:['Arrows','ARR','#f28c1a','Footwork dahil'],MIN:['Minardi','MIN','#2b2b2b'],ALF:['Alfa Romeo','ALFA','#9b1b30','1950–85'],
MAT:['Matra','MS','#2c63c4'],SHA:['Shadow','DN','#444444'],SUR:['Surtees','TS','#b03030'],JAG:['Jaguar','JAG','#0d4f2e'],STE:['Stewart','SF','#ffffff'],PRO:['Prost','AP','#1f4fa8'],VAN:['Vanwall','VW','#1a5a3a'],
HON:['Honda','RA','#e8e8e8','1964–68'],TOL:['Toleman','TG','#2a6fd1'],WOL:['Wolf','WR','#c9a227'],HES:['Hesketh','HES','#f2f2f2'],MAN:['Marussia','MR','#c4141b','Virgin · Manor'],CAT:['Caterham','CT','#0a5b33'],EAG:['Eagle','AAR','#2b4fa0']};
const LOGO={"FER":"en/thumb/d/df/Scuderia_Ferrari_HP_logo_24.svg/500px-Scuderia_Ferrari_HP_logo_24.svg.png","MCL":"commons/thumb/b/bb/Mclaren_Logo_2021.svg/500px-Mclaren_Logo_2021.svg.png","MER":"commons/thumb/f/fc/Mercedes-AMG_Petronas_F1_Team_logo_%282026%29.svg/250px-Mercedes-AMG_Petronas_F1_Team_logo_%282026%29.svg.png","RBR":"https://brandlogos.net/wp-content/uploads/2022/08/oracle_red_bull_racing-logo_brandlogos.net_ktyln.png","WIL":"commons/thumb/1/12/Atlassian_Williams_F1_Team_logo.svg/250px-Atlassian_Williams_F1_Team_logo.svg.png","REN":"en/thumb/1/1d/Renault_F1_Team_logo_2019.svg/250px-Renault_F1_Team_logo_2019.svg.png","ALP":"commons/thumb/4/4a/BWT_Alpine_F1_Team_Logo.png/250px-BWT_Alpine_F1_Team_Logo.png","AMR":"en/thumb/1/15/Aston_Martin_Aramco_2024_logo.png/250px-Aston_Martin_Aramco_2024_logo.png","HAA":"commons/thumb/1/18/TGR_Haas_F1_Team_Logo_%282026%29.svg/250px-TGR_Haas_F1_Team_Logo_%282026%29.svg.png","SAU":"en/thumb/b/b7/Sauber_Motorsport_SVG_logo_%282023%29.svg/250px-Sauber_Motorsport_SVG_logo_%282023%29.svg.png","TRO":"en/thumb/4/4f/Scuderia_Toro_Rosso_logo.svg/250px-Scuderia_Toro_Rosso_logo.svg.png","BEN":"en/thumb/5/54/Benetton_Formula_logo.jpg/250px-Benetton_Formula_logo.jpg","LOT":"commons/9/9e/TeamLotus.jpg","JOR":"en/thumb/9/93/Jordan_Grand_Prix_logo.png/250px-Jordan_Grand_Prix_logo.png","FIN":"en/thumb/e/e8/Force_India.svg/250px-Force_India.svg.png","TOY":"commons/thumb/0/0e/Panasonic_Toyota_Racing_logo.svg/250px-Panasonic_Toyota_Racing_logo.svg.png","BAR":"en/thumb/2/25/British_american_racing_logo.png/250px-British_american_racing_logo.png","BRW":"commons/thumb/2/24/Brawn_GP_logo.svg/250px-Brawn_GP_logo.svg.png","CAD":"en/thumb/b/bc/Cadillac_Formula_1_Team_Logo_%282025%29.svg/250px-Cadillac_Formula_1_Team_Logo_%282025%29.svg.png","AUD":"commons/thumb/0/03/Audif1.com_logo17_%28cropped%29.svg/250px-Audif1.com_logo17_%28cropped%29.svg.png","BRB":"en/5/53/Brabham91.png","TYR":"commons/thumb/5/5e/Tyrrell.svg/250px-Tyrrell.svg.png","BRM":"en/b/bd/BritishRacingMotorsLogo.png","COO":"commons/thumb/b/b0/Cooper_car_company.png/250px-Cooper_car_company.png","LIG":"commons/thumb/8/8d/Ligier_logo.jpg/250px-Ligier_logo.jpg","MAS":"commons/thumb/7/78/Maserati_logo_2.svg/250px-Maserati_logo_2.svg.png","MAR":"en/0/02/March_Engineering.png","ARR":"commons/thumb/6/62/Arrows_Grand_Prix_logo.png/250px-Arrows_Grand_Prix_logo.png","MIN":"commons/thumb/3/3c/Minardi_F1_Team.svg/250px-Minardi_F1_Team.svg.png","ALF":"en/2/2a/Alfa_Romeo_logo.png","MAT":"en/thumb/0/08/Matra_logo.gif/250px-Matra_logo.gif","SHA":"en/c/c4/UOP_Shadow_logo.png","SUR":"commons/thumb/c/ce/SurteesLogo.svg/250px-SurteesLogo.svg.png","STE":"commons/3/3b/Stewart_Gran_Prix_logo.png","PRO":"commons/thumb/d/d1/Prost_Grand_Prix_Formula_One_Logo.png/250px-Prost_Grand_Prix_Formula_One_Logo.png","VAN":"en/thumb/5/58/Vanwall_logo.jpg/250px-Vanwall_logo.jpg","HON":"commons/thumb/0/0e/Logo_Honda_F1.svg/250px-Logo_Honda_F1.svg.png","TOL":"commons/thumb/3/38/Toleman_logo.svg/250px-Toleman_logo.svg.png","WOL":"en/0/03/WalterWolfRacing.png","HES":"commons/e/e5/Hesketh.gif","MAN":"en/thumb/7/71/Marussia_F1.png/250px-Marussia_F1.png","CAT":"en/thumb/6/61/Caterham_F1_Team_logo.svg/250px-Caterham_F1_Team_logo.svg.png","EAG":"en/thumb/5/55/Anglo_American_Racers_logo.svg/250px-Anglo_American_Racers_logo.svg.png"};
// Koyu temada kullanılan açık renk logolar
const LOGO_DARK={};
// Logonun sadece bir bölümü: [x0,y0,x1,y1] oranları
const CROP={Scuderia_Ferrari_HP:[0,0,.37,1],Red_Bull_Racing_Logo_2026:[0,.33,1,.74]};
const logoUrlDark=k=>LOGO_DARK[k]?'https://upload.wikimedia.org/wikipedia/'+LOGO_DARK[k]:null;
const logoUrl=k=>LOGO[k]?(LOGO[k].startsWith('http')?LOGO[k]:'https://upload.wikimedia.org/wikipedia/'+LOGO[k]):null;
const flagUrl=c=>'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/'+c.toLowerCase()+'.svg';
const textOn=hex=>{const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;return (r*299+g*587+b*114)/1000>150?'#111':'#fff'};
const IC={
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6M10 17h4"/>',
 trophies:'<path d="M5 5h6v4a3 3 0 0 1-6 0zM13 5h6v4a3 3 0 0 1-6 0z"/><path d="M8 12v4M16 12v4M5 20h14M6 16h4M14 16h4"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 stars:'<path d="M8 4l1.6 3.3 3.6.5-2.6 2.6.6 3.6L8 12.3 4.8 14l.6-3.6-2.6-2.6 3.6-.5zM17 10l1.4 2.8 3 .4-2.2 2.2.5 3-2.7-1.4-2.7 1.4.5-3-2.2-2.2 3-.4z"/>',
 podium:'<path d="M3 20v-6h6v6M9 20V9h6v11M15 20v-8h6v8M3 20h18"/><path d="M12 5v2"/>',
 pole:'<circle cx="12" cy="13" r="7"/><path d="M12 13V9M10 3h4M18 6l1.5-1.5"/>',
 x:'<circle cx="12" cy="12" r="8"/><path d="M9 9l6 6M15 9l-6 6"/>',
 cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 helm:'<path d="M4 15a8 8 0 0 1 16-2v4H8a4 4 0 0 1-4-2z"/><path d="M11 11h9"/>',
 two:'<path d="M3 20v-6h6v6M9 20V9h6v11M15 20v-8h6v8M3 20h18"/><path d="M17 4h3M18.5 2.5v3"/>',
 one:'<rect x="5" y="6" width="14" height="12" rx="3"/><path d="M12 9v6M10.5 10.5 12 9"/>',
 flag:'<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
 laps:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
 lead:'<path d="M4 20h16M7 16V11M12 16V6M17 16v-3"/><path d="M10 4l2-2 2 2"/>',
 home:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
 track:'<path d="M6 18c-2 0-3-2-2-4l3-6c1-2 3-3 5-2l2 1c1 1 3 1 4 0 2-1 4 1 3 3l-2 5c-1 2-3 3-5 3z"/><circle cx="9" cy="14" r="1"/>',
 people:'<circle cx="8.5" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M13 15c1-.7 2-1 3-1 3 0 5 2 5 5"/>'
};

// ---------- categories ----------
const CATS={};
function buildCats(mode){
  const P=POOLS[mode],C=[];
  const nat=(c,lv)=>C.push({id:'n'+c,type:'nat',lv,label:NAT[c],flag:flag(c),iso:c,t:d=>d.nat===c});
  const team=(k,lv)=>C.push({id:'t'+k,type:'team',lv,g:k==='FIN'||k==='AMR'?'AMRFIN':null,label:TEAM[k][0],code:TEAM[k][1],color:TEAM[k][2],sub:TEAM[k][3]||'',logo:logoUrl(k),logoDark:logoUrlDark(k),t:d=>d.teams.includes(k)});
  const ach=(id,lv,label,icon,g,t,sub,since)=>C.push({id,type:'ach',lv,label,icon,g,t,sub:sub||'',since});
  if(mode==='all'){
    ['GB','DE','FR','BR','IT','FI','AU'].forEach(c=>nat(c,1));
    ['NL','ES','US','AT','AR','CA','NZ','BE'].forEach(c=>nat(c,2));
    ['JP','SE','CH','MX','ZA'].forEach(c=>nat(c,3));
    ['FER','MCL','WIL','LOT','BRB','MER','RBR'].forEach(k=>team(k,1));
    ['REN','BEN','TYR','BRM','COO','LIG','JOR','SAU','TRO','MAS','MAR','ARR','MIN'].forEach(k=>team(k,2));
    ['TOY','BAR','BRW','ALF','MAT','SHA','SUR','JAG','STE','PRO','VAN','HES','WOL','TOL','ALP','AMR','HAA','FIN'].forEach(k=>team(k,3));
    ach('era50',2,'1950-60\'larda Çıkış','cal','era',d=>d.first<1970,'İlk yarışı 1950–69');
    ach('era70',2,'1970-80\'lerde Çıkış','cal','era',d=>d.first>=1970&&d.first<1990,'İlk yarışı 1970–89');
    ach('era90',2,'1990-2000\'lerde Çıkış','cal','era',d=>d.first>=1990&&d.first<2010,'İlk yarışı 1990–2009');
    ach('era10',2,'2010 ve Sonrası Çıkış','cal','era',d=>d.first>=2010);
    ach('w10',2,'10+ Galibiyet','stars','win',d=>d.wins>=10);
    ach('s200',3,'200+ Yarış','laps','starts',d=>d.starts>=200);
  }else{
    ['GB','DE','FR','BR'].forEach(c=>nat(c,1));
    ['IT','ES','NL','FI','JP','AU'].forEach(c=>nat(c,2));
    ['RU','AT','CA','US'].forEach(c=>nat(c,3));
    ['FER','MCL','MER','RBR','WIL','REN','SAU','TRO'].forEach(k=>team(k,1));
    ['ALP','AMR','HAA','JOR','FIN','TOY','BAR','MIN','JAG','LOT'].forEach(k=>team(k,2));
    ['BRW','CAD','AUD','MAN','CAT','HRT','ARR','BEN','PRO','SPY','SUP'].filter(k=>TEAM[k]).forEach(k=>team(k,3));
    ach('era00',2,'2010 Öncesi Çıkış','cal','era',d=>d.first<2010,'İlk yarışı 2009 ve öncesi');
    ach('era10',2,'2010-19 Arası Çıkış','cal','era',d=>d.first>=2010&&d.first<2020);
    ach('era20',2,'2020 ve Sonrası Çıkış','cal','era',d=>d.first>=2020);
    ach('w5',2,'5+ Galibiyet','stars','win',d=>d.wins>=5);
    ach('s200',3,'200+ Yarış','laps','starts',d=>d.starts>=200);
  }
  ach('champ',1,'Dünya Şampiyonu','trophy','title',d=>d.titles>0);
  ach('winner',1,'Yarış Galibi','star','win',d=>d.wins>0);
  ach('podium',1,'Podyum','podium','pod',d=>d.pods>0);
  ach('pole',1,'Pole Pozisyonu','pole','pole',d=>d.poles>0);
  ach('multi',2,'2+ Kez Şampiyon','trophies','title',d=>d.titles>1);
  ach('lead',2,'Şampiyona Lideri Olmuş','lead','title',d=>d.lead,'Bir yarış sonrası puan lideri');
  ach('home',2,"Kendi Ülkesinin GP'sini Kazanmış",'home','win',d=>d.home,'');
  ach('circ3',2,'3+ Farklı Pistte Kazanmış','track','win',d=>d.circ3,'');
  ach('nowin',2,'Hiç Kazanamadı','x','win',d=>d.wins===0);
  ach('nopod',3,'Hiç Podyum Yok','x','pod',d=>d.pods===0);
  ach('pod2',3,'2+ Takımla Podyum','two','pod',d=>d.pod.length>=2);
  ach('win2',3,'2+ Takımla Galibiyet','two','win',d=>d.winT.length>=2);
  ach('one',3,'Tek Takımlı Kariyer','one','teams',d=>d.teams.length===1);
  if(mode==='mod')ach('g26',2,'2026 Gridinde','helm','era',d=>d.last===2026);
  const HUB={HAM:'Hamilton',ALO:'Alonso',VER:'Verstappen',MSC:'M. Schumacher',SEN:'Senna',RAI:'Räikkönen',VET:'Vettel',BUT:'Button',ROS:'N. Rosberg'};
  for(const [k,s] of Object.entries(P.tm)){ach('tm'+k,3,HUB[k]+' ile Takım Arkadaşı','people','tm',d=>s.has(d.n),'Aynı yarışta aynı takım')}
  return C;
}
CATS.all=buildCats('all');CATS.mod=buildCats('mod');


// ---------- theme + logos ----------
const THEMES=['system','light','dark'];
const ICONS={system:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v16" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',light:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',dark:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'};
const TLABEL={system:'Tema: cihaza göre',light:'Tema: açık',dark:'Tema: koyu'};
let themePref='system';try{const t=localStorage.getItem('boxbox:theme');if(THEMES.includes(t))themePref=t}catch(e){}
const mq=window.matchMedia('(prefers-color-scheme: dark)');
const isDark=()=>themePref==='dark'||(themePref==='system'&&mq.matches);
function applyTheme(){
  if(themePref==='system')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=themePref;
  const b=$('themeBtn');b.innerHTML=ICONS[themePref];b.setAttribute('aria-label',TLABEL[themePref]);b.title=TLABEL[themePref];
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=isDark()?'#121316':'#eceef1';
  processLogos();
}
$('themeBtn').onclick=()=>{themePref=THEMES[(THEMES.indexOf(themePref)+1)%3];try{localStorage.setItem('boxbox:theme',themePref)}catch(e){}applyTheme();toast(TLABEL[themePref])};
mq.addEventListener&&mq.addEventListener('change',()=>{if(themePref==='system')applyTheme()});

const LOGO_CACHE={},LOGO_IMG={};
function loadImg(src){if(!LOGO_IMG[src])LOGO_IMG[src]=new Promise((res,rej)=>{const im=new Image();im.crossOrigin='anonymous';im.onload=()=>res(im);im.onerror=rej;im.src=src});return LOGO_IMG[src]}
// Removes the white backdrop around a logo and adapts near-black / near-white parts to the theme.
async function cleanLogo(src,dark){
  const key=src+'|'+(dark?1:0);if(LOGO_CACHE[key])return LOGO_CACHE[key];
  const im=await loadImg(src);const ck=Object.keys(CROP).find(k=>src.includes(k));const cr=ck?CROP[ck]:[0,0,1,1];
  const sw=im.naturalWidth*(cr[2]-cr[0]),sh=im.naturalHeight*(cr[3]-cr[1]),sc=Math.min(1,260/Math.max(sw,sh));
  const w=Math.max(1,Math.round(sw*sc)),h=Math.max(1,Math.round(sh*sc));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;const cx=cv.getContext('2d');cx.drawImage(im,im.naturalWidth*cr[0],im.naturalHeight*cr[1],sw,sh,0,0,w,h);
  const id=cx.getImageData(0,0,w,h),p=id.data,N=w*h;
  const whiteish=i=>{const r=p[i*4],g=p[i*4+1],b=p[i*4+2];return p[i*4+3]>0&&Math.min(r,g,b)>214&&Math.max(r,g,b)-Math.min(r,g,b)<30};
  const seen=new Uint8Array(N),st=[];
  for(let x=0;x<w;x++){st.push(x,(h-1)*w+x)}for(let y=0;y<h;y++){st.push(y*w,y*w+w-1)}
  while(st.length){const i=st.pop();if(seen[i])continue;seen[i]=1;if(!whiteish(i))continue;
    const r=p[i*4],g=p[i*4+1],b=p[i*4+2];const m=Math.min(r,g,b);p[i*4+3]=m>238?0:Math.round(p[i*4+3]*(238-m)/24);
    const x=i%w,y=(i/w)|0;if(x>0)st.push(i-1);if(x<w-1)st.push(i+1);if(y>0)st.push(i-w);if(y<h-1)st.push(i+w)}
  if(dark&&!/UOP_Shadow|Minardi_F1_Team|Scuderia_Ferrari/.test(src))for(let i=0;i<N;i++){const a=p[i*4+3];if(!a)continue;const r=p[i*4],g=p[i*4+1],b=p[i*4+2];const mx=Math.max(r,g,b),mn=Math.min(r,g,b),lum=.299*r+.587*g+.114*b;
    if(lum<70&&mx-mn<40){p[i*4]=232;p[i*4+1]=233;p[i*4+2]=237}}
  // Çok koyu renkli logolarda (lacivert, koyu yeşil) koyu tonları aynı renkte açık tona çek
  if(dark&&!/UOP_Shadow|Minardi_F1_Team|Scuderia_Ferrari/.test(src)){let sum=0,n=0;for(let i=0;i<N;i++){if(p[i*4+3]>128){sum+=.299*p[i*4]+.587*p[i*4+1]+.114*p[i*4+2];n++}}
    if(n&&sum/n<95)for(let i=0;i<N;i++){if(!p[i*4+3])continue;let r=p[i*4]/255,g=p[i*4+1]/255,b=p[i*4+2]/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let l=(mx+mn)/2;if(l>=.62)continue;
      let h=0,sat=0;const dd=mx-mn;if(dd){sat=l>.5?dd/(2-mx-mn):dd/(mx+mn);h=mx===r?(g-b)/dd+(g<b?6:0):mx===g?(b-r)/dd+2:(r-g)/dd+4;h/=6}
      l=.62;const q=l<.5?l*(1+sat):l+sat-l*sat,pp=2*l-q;const f=t=>{t<0&&(t+=1);t>1&&(t-=1);return t<1/6?pp+(q-pp)*6*t:t<1/2?q:t<2/3?pp+(q-pp)*(2/3-t)*6:pp};
      p[i*4]=Math.round((sat?f(h+1/3):l)*255);p[i*4+1]=Math.round((sat?f(h):l)*255);p[i*4+2]=Math.round((sat?f(h-1/3):l)*255)}}
  cx.putImageData(id,0,0);return LOGO_CACHE[key]=cv.toDataURL('image/png');
}
function processLogos(){
  const dark=isDark();
  document.querySelectorAll('.logochip img[data-logo]').forEach(img=>{
    const src=(dark&&img.dataset.logoDark)||img.dataset.logo;img.classList.remove('ready');
    if(!src.includes('wikimedia.org')){img.onload=()=>img.classList.add('ready');img.src=src;return}
    cleanLogo(src,dark).then(u=>{img.src=u;img.classList.add('ready')}).catch(()=>{
      const chip=img.parentNode;if(!chip||!chip.dataset)return;const col=chip.dataset.color;
      chip.outerHTML=`<div class="badge" style="background:${col};color:${textOn(col)}">${chip.dataset.badge}</div>`});
  });
}

// ---------- generation ----------
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(s){let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
const shuffle=(a,r)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const answersFor=(mode,r,c)=>POOLS[mode].D.filter(d=>r.t(d)&&c.t(d));
function matchable(mode,rows,cols){
  const cells=[];for(const r of rows)for(const c of cols)cells.push(answersFor(mode,r,c).map(d=>d.id));
  cells.sort((a,b)=>a.length-b.length);const used=new Set();
  const bt=i=>{if(i===cells.length)return true;for(const id of cells[i]){if(used.has(id))continue;used.add(id);if(bt(i+1))return true;used.delete(id)}return false};
  return bt(0);
}
const GCACHE={};
function generate(mode,diff,dateStr){
  const key=dateStr+'|'+mode+'|'+diff;if(GCACHE[key])return GCACHE[key];
  const rng=mulberry(hash(key+'|pitgrid1'));
  const pool=CATS[mode].filter(c=>c.lv<=diff&&(!c.since||dateStr.startsWith('free')||dateStr>=c.since));
  for(let k=0;k<12000;k++){
    const sh=shuffle(pool.slice(),rng),pick=[],gs=new Set();
    for(const c of sh){if(pick.length===6)break;if(c.g&&gs.has(c.g))continue;pick.push(c);if(c.g)gs.add(c.g)}
    const nT=pick.filter(c=>c.type==='team').length,nN=pick.filter(c=>c.type==='nat').length,nA=pick.filter(c=>c.type==='ach').length;
    if(nT<2||nN>2||nA<1||nA>3)continue;
    if(diff===2&&!pick.some(c=>c.lv>=2))continue;
    if(diff===3&&pick.filter(c=>c.lv===3).length<2)continue;
    const order=pick.map(c=>[c,(c.type==='ach'?0:1)+rng()*0.9]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
    const rows=order.slice(0,3),cols=order.slice(3);
    let ok=true;
    outer:for(const r of rows)for(const c of cols){const a=answersFor(mode,r,c);if(a.filter(d=>d.known).length<MINKNOWN[diff]){ok=false;break outer}}
    if(!ok||!matchable(mode,rows,cols))continue;
    return GCACHE[key]={rows,cols};
  }
  return null;
}

// ---------- dates ----------
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseYmd=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const TZF=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'});
const todayStr=()=>TZF.format(new Date());
const dayNum=s=>Math.round((parseYmd(s)-LAUNCH)/864e5)+1;
const addDays=(s,n)=>{const d=parseYmd(s);d.setDate(d.getDate()+n);return ymd(d)};
const AY=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const dailyDiff=dt=>[1,1,2,2,2,3,3][(parseYmd(dt).getDay()+6)%7];
const fmtDate=s=>{const d=parseYmd(s);return `${d.getDate()} ${AY[d.getMonth()]}`};

// ---------- storage ----------
// days: { 'YYYY-MM-DD': { 'all-2': {s:score, c:[ids], live:1, done:1, left:n} } }
const LS='boxbox:v1';
let ST={days:{}};
try{const s=JSON.parse(localStorage.getItem(LS));if(s&&s.days)ST=s}catch(e){}
const saveLocal=()=>{try{localStorage.setItem(LS,JSON.stringify(ST))}catch(e){}};
const gkey=(mode,diff)=>mode+'-'+diff;
function getGame(date,mode,diff){const d=ST.days[date];return d&&d[gkey(mode,diff)]||null}
function putGame(date,mode,diff,g){(ST.days[date]=ST.days[date]||{})[gkey(mode,diff)]=g;saveLocal()}

function computeStats(){
  const dates=Object.keys(ST.days).sort();
  const liveDays=new Set(),perfectDays=new Set();let played=0,perfect=0,total=0;const per={};
  for(const dt of dates){for(const [k,g] of Object.entries(ST.days[dt])){if(!g.done)continue;played++;total+=g.s;if(g.s===9)perfect++;
    const p=per[k]=per[k]||{n:0,sum:0,perfect:0};p.n++;p.sum+=g.s;if(g.s===9)p.perfect++;
    if(g.live){liveDays.add(dt);if(g.s===9)perfectDays.add(dt)}}}
  const t=todayStr();let streak=0;let cur=liveDays.has(t)?t:addDays(t,-1);
  while(liveDays.has(cur)){streak++;cur=addDays(cur,-1)}
  let best=0,run=0,prev=null;for(const dt of [...liveDays].sort()){run=prev&&addDays(prev,1)===dt?run+1:1;best=Math.max(best,run);prev=dt}
  return {streak,best,played,perfect,avg:played?total/played:0,per,liveDays,perfectDays};
}

// ---------- cloud (Supabase) ----------
const CFG=window.BOXBOX_CONFIG||{};
const sb=(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase)?window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey):null;
const cloud={user:null,profile:null,board:[],synced:new Set(),ready:false,error:false};
const rk=(dt,k)=>dt+'|'+k;

async function initCloud(){
  if(!sb){renderAuth();renderSyncNote();return}
  const {data}=await sb.auth.getSession();
  await setSession(data.session);
  sb.auth.onAuthStateChange((ev,session)=>{if((session&&session.user&&session.user.id)!==(cloud.user&&cloud.user.id))setSession(session)});
}
async function setSession(session){
  cloud.user=session?session.user:null;cloud.profile=null;cloud.synced=new Set();
  renderAuth();
  if(!cloud.user){renderSyncNote();return}
  try{
    const {data:prof}=await sb.from('profiles').select('id,username').eq('id',cloud.user.id).maybeSingle();
    cloud.profile=prof||null;
    if(!prof)openNameSheet(true);
    await pullResults();
    await pushBacklog();
  }catch(e){cloud.error=true}
  renderAuth();renderSyncNote();renderPill();route();
}
async function pullResults(){
  const {data,error}=await sb.from('results').select('day,mode,diff,score,cells,guesses_left,live').eq('user_id',cloud.user.id).limit(5000);
  if(error)throw error;
  for(const r of data){const k=gkey(r.mode,r.diff);cloud.synced.add(rk(r.day,k));
    const loc=ST.days[r.day]&&ST.days[r.day][k];
    if(!loc||!loc.done)(ST.days[r.day]=ST.days[r.day]||{})[k]={s:r.score,c:r.cells.map(x=>x<0?null:x),left:r.guesses_left,live:r.live?1:0,done:1};
    else loc.live=r.live?1:0;}
  saveLocal();
}
function rowFor(dt,k,g){const [m,d]=k.split('-');return {user_id:cloud.user.id,day:dt,mode:m,diff:+d,score:g.s,cells:g.c.map(x=>x==null?-1:x),guesses_left:g.left}}
async function pushBacklog(){
  if(!cloud.profile)return;
  const rows=[];
  for(const [dt,games] of Object.entries(ST.days))for(const [k,g] of Object.entries(games))if(g.done&&!cloud.synced.has(rk(dt,k)))rows.push(rowFor(dt,k,g));
  if(!rows.length)return;
  const {error}=await sb.from('results').upsert(rows,{onConflict:'user_id,day,mode,diff',ignoreDuplicates:true});
  if(!error){rows.forEach(r=>cloud.synced.add(rk(r.day,gkey(r.mode,r.diff))));await pullResults()}
}
function syncCloud(){
  if(!sb||!cloud.user||!cloud.profile)return;
  pushBacklog().then(()=>{renderPill();if(view==='siralama')renderLeaderboard()}).catch(()=>{cloud.error=true;renderSyncNote()});
}
function renderAuth(){
  const li=!!cloud.user;
  $('loginBtn').hidden=li||!sb;$('meBtn').hidden=!li;
  if(li){const md=cloud.user.user_metadata||{};$('meName').textContent=cloud.profile?cloud.profile.username:(md.full_name||'Hesabım');
    if(md.avatar_url){$('meAv').src=md.avatar_url;$('meAv').hidden=false}else $('meAv').hidden=true}
}
function suggestName(){const md=(cloud.user&&cloud.user.user_metadata)||{};let n=norm(md.full_name||md.name||(cloud.user&&cloud.user.email||'').split('@')[0]||'').replace(/ /g,'.');n=n.replace(/[^a-z0-9._]/g,'').slice(0,20);return n.length>=3?n:''}
function openNameSheet(first){
  $('nameInput').value=cloud.profile?cloud.profile.username:suggestName();$('nameErr').hidden=true;
  $('nameT').textContent=first?'Hoş geldin. Kullanıcı adını seç':'Kullanıcı adını değiştir';
  $('nameSheet').hidden=false;setTimeout(()=>$('nameInput').focus(),30);
}
$('nameForm').addEventListener('submit',async e=>{
  e.preventDefault();const v=$('nameInput').value.trim();const err=$('nameErr');
  if(!/^[A-Za-z0-9._]{3,20}$/.test(v)){err.textContent='3–20 karakter kullan: harf, rakam, nokta, alt çizgi.';err.hidden=false;return}
  const q=cloud.profile?sb.from('profiles').update({username:v}).eq('id',cloud.user.id):sb.from('profiles').insert({id:cloud.user.id,username:v});
  const {error}=await q;
  if(error){err.textContent=error.code==='23505'?'Bu ad alınmış. Başka bir ad dene.':'Kaydedilemedi. Biraz sonra tekrar dene.';err.hidden=false;return}
  cloud.profile={id:cloud.user.id,username:v};$('nameSheet').hidden=true;renderAuth();toast('Kullanıcı adın: '+v);
  await pushBacklog().catch(()=>{});renderSyncNote();renderPill();if(view==='siralama')renderLeaderboard();
});
$('loginBtn').onclick=()=>{$('authErr').hidden=true;$('authSheet').hidden=false};
$('googleBtn').onclick=async()=>{
  const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
  if(error){$('authErr').textContent='Google girişi başlatılamadı. Biraz sonra tekrar dene.';$('authErr').hidden=false}
};
$('meBtn').onclick=e=>{const m=$('meMenu');if(!m.hidden){m.hidden=true;return}const r=e.currentTarget.getBoundingClientRect();m.style.top=(r.bottom+6)+'px';m.style.right=(window.innerWidth-r.right)+'px';m.hidden=false};
document.addEventListener('click',e=>{if(!e.target.closest('#meMenu')&&!e.target.closest('#meBtn'))$('meMenu').hidden=true});
$('renameBtn').onclick=()=>{$('meMenu').hidden=true;openNameSheet(false)};
$('logoutBtn').onclick=async()=>{$('meMenu').hidden=true;await sb.auth.signOut();ST={days:{}};saveLocal();location.hash='tum';location.reload()};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{$(b.dataset.close).hidden=true});


// ---------- UI state ----------
let view='oyna',free=false,freeSeed=0,freeMode='all',playRoute='tum',mode='all',diff=2,date=todayStr(),G=null,S=null,active=null,lbMode='streak';
try{const p=JSON.parse(localStorage.getItem('boxbox:prefs'));if(p){if(p.mode==='all'||p.mode==='mod')mode=p.mode;if(p.diff>=1&&p.diff<=3)diff=p.diff}}catch(e){}
if(mode==='mod')playRoute='2000';
const savePrefs=()=>{try{localStorage.setItem('boxbox:prefs',JSON.stringify({mode,diff}))}catch(e){}};

function loadGame(){
  if(free){mode=freeMode;if(!freeSeed)freeSeed=(Math.random()*1e9)|0;G=generate(mode,diff,'free-'+freeSeed);S={c:Array(9).fill(null),left:GUESSES[diff],done:0,s:0,live:0};return}
  diff=dailyDiff(date);
  G=generate(mode,diff,date);
  const g=getGame(date,mode,diff);
  S=g?JSON.parse(JSON.stringify(g)):{c:Array(9).fill(null),left:GUESSES[diff],done:0,s:0,live:date===todayStr()?1:0};
  if(!S.c)S.c=Array(9).fill(null);
}
function persist(){S.s=S.c.filter(x=>x!=null).length;if(free)return;if(date!==todayStr())S.live=0;putGame(date,mode,diff,S);if(S.done)syncCloud()}

function headHTML(c){
  let top;
  if(c.type==='nat')top=`<img class="flagimg" src="${flagUrl(c.iso)}" alt="" loading="lazy">`;
  else if(c.type==='team')top=c.logo?`<div class="logochip" data-badge="${c.code}" data-color="${c.color}"><img data-logo="${c.logo}"${c.logoDark?` data-logo-dark="${c.logoDark}"`:''} alt=""></div>`:`<div class="badge" style="background:${c.color};color:${textOn(c.color)}">${c.code}</div>`;
  else top=`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC[c.icon]}</svg>`;
  return `${top}<div class="lbl">${c.label}</div>${c.sub?`<div class="sub">${c.sub}</div>`:''}`;
}
const initials=n=>n.replace(' Jr.','').split(/\s+/).filter(w=>/^[A-ZÀ-Ý]/.test(w)).map(w=>w[0]).slice(-2).join('').toUpperCase()||n[0];
const esc=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const nameHTML=n=>{const i=n.indexOf(' ');return i<0?esc(n):esc(n.slice(0,i))+'<br>'+esc(n.slice(i+1))};

function renderGame(){
  document.querySelectorAll('[data-fmode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fmode===freeMode)));
  $('freeBar').hidden=!free;$('newFree').hidden=!free;$('todayCard').hidden=free;
  document.querySelectorAll('[data-diff]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.diff===diff)));
  const isToday=date===todayStr();
  $('gTitle').innerHTML=free?`Serbest <span>·</span> ${MN[mode]}`:`Grid <span>#${dayNum(date)}</span> · ${MN[mode]}`;
  $('gDate').textContent=free?'Test modu':fmtDate(date);
  $('diffPill').innerHTML=`<span class="bars" aria-hidden="true">${[1,2,3].map(i=>`<i class="${i<=diff?'on':''}"></i>`).join('')}</span>${DN[diff]}`;$('diffPill').setAttribute('aria-label','Zorluk: '+DN[diff]);
  $('archTag').hidden=isToday||free;$('backToday').hidden=isToday||free;
  const P=POOLS[mode],g=$('grid');g.innerHTML='';
  const corner=document.createElement('div');corner.className='h corner';
  corner.innerHTML=`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC.flag}</svg><div class="lbl">${MS[mode]}</div><div class="num">${free?'TEST':'#'+dayNum(date)}</div>`;
  g.appendChild(corner);
  G.cols.forEach(c=>{const h=document.createElement('div');h.className='h';h.innerHTML=headHTML(c);g.appendChild(h)});
  G.rows.forEach((r,ri)=>{
    const h=document.createElement('div');h.className='h';h.innerHTML=headHTML(r);g.appendChild(h);
    G.cols.forEach((c,ci)=>{
      const i=ri*3+ci,b=document.createElement('button');b.className='c';b.type='button';const id=S.c[i];
      if(id!=null){const d=P.D[id];const tk=d.teams.find(t=>TEAM[t]);b.classList.add('filled');if(S.done)b.classList.add('rev');
        b.innerHTML=`<div class="av" style="border-color:${tk?TEAM[tk][2]:'#4a4b52'}">${esc(initials(d.n))}</div><div class="nm">${nameHTML(d.n)}</div>`;b.setAttribute('aria-label',d.n);
        b.classList.add('rev');b.onclick=()=>openSheet(i,true);}
      else if(S.done){b.classList.add('miss');b.textContent='Cevaplar';b.onclick=()=>openSheet(i,true)}
      else{b.textContent='+';b.setAttribute('aria-label',`${r.label} ve ${c.label}`);
        if(diff<3)b.insertAdjacentHTML('beforeend',`<span class="cnt">${answersFor(mode,r,c).length}</span>`);
        b.onclick=()=>openSheet(i,false)}
      g.appendChild(b);
    });
  });
  processLogos();
  $('gLeft').textContent=S.left;$('giveUp').hidden=!!S.done;
  const f=S.c.filter(x=>x!=null).length;$('end').hidden=!S.done;
  $('dayNav').hidden=free;$('mcal').hidden=free;if(!free)updateDayNav();if(S.done&&!free)renderMonthCal();
  if(S.done){$('score').innerHTML=`${f}<small> / 9</small>`;
    $('endMsg').textContent=f===9?'Kusursuz tur. Grid tamam.':f>=6?'Podyumluk sonuç.':f>=3?'Puanlara girdin.':'Zor bir yarıştı.';
    if(free){$('nextGame').hidden=false;$('nextGame').textContent='Yeni grid'}
    else{const nx=nextOpen();$('nextGame').hidden=!nx;if(nx)$('nextGame').textContent=`Sıradaki: ${MN[nx]}`}}
  renderTodayChips();
}
function nextOpen(){if(date!==todayStr())return null;const m=mode==='all'?'mod':'all';const g=getGame(date,m,dailyDiff(date));return g&&g.done?null:m}
function chipHTML(g){if(!g)return '–';if(g.done)return `${g.s}/9`;return `${g.c.filter(x=>x!=null).length}/9<small>devam</small>`}
function chipCls(g){return 'chip'+(g&&g.done?(g.s===9?' done perfect':' done'):g?' prog':'')}
function renderTodayChips(){
  const t=todayStr(),el=$('todayChips'),d=dailyDiff(t);el.innerHTML='';el.style.gridTemplateColumns='1fr 1fr';
  for(const m of ['all','mod']){const g=getGame(t,m,d);const b=document.createElement('button');b.className=chipCls(g);
    b.innerHTML=`${MN[m]}<small>${g?(g.done?g.s+' / 9':g.c.filter(x=>x!=null).length+' / 9 · devam'):'oynanmadı'}</small>`;
    b.onclick=()=>{date=t;openPlay(m==='all'?'tum':'2000')};el.appendChild(b)}
}
function renderSyncNote(){
  const n=$('syncNote');
  if(!sb)n.textContent='Sonuçların bu cihazda tutuluyor.';
  else if(cloud.user&&cloud.profile&&!cloud.error)n.textContent='Sonuçların hesabına kaydediliyor. Serin her cihazda aynı.';
  else if(cloud.user&&cloud.error)n.textContent='Sunucuya ulaşılamadı. Sonuçların şimdilik bu cihazda, bağlantı gelince yüklenecek.';
  else if(cloud.user)n.textContent='Kullanıcı adını seçince sonuçların hesabına kaydedilecek.';
  else n.textContent='Giriş yapmadan oynuyorsun. Sonuçların bu cihazda tutuluyor. Giriş yaparsan buradaki sonuçlar da hesabına aktarılır.';
}

// ---------- sheet ----------
let sugList=[],sugIdx=-1;
function openSheet(i,reveal){
  if(reveal){openDrawer(i);return}
  active=i;const r=G.rows[Math.floor(i/3)],c=G.cols[i%3];
  $('sheetT').innerHTML=`${esc(r.label)} <span>×</span> ${esc(c.label)}`;$('sheet').hidden=false;$('sheetNote').hidden=true;
  $('q').hidden=false;$('q').value='';$('sug').innerHTML='';sugList=[];setTimeout(()=>$('q').focus(),30);
}
function openDrawer(i){
  const r=G.rows[Math.floor(i/3)],c=G.cols[i%3],mine=S.c[i],P=POOLS[mode];
  $('drawerT').innerHTML=`${esc(r.label)} <span>×</span> ${esc(c.label)}`;
  const a=answersFor(mode,r,c).filter(d=>d.id!==mine).sort((x,y)=>(y.known-x.known)||y.wins-x.wins||y.starts-x.starts);
  const m=$('drawerMine');m.hidden=mine==null;if(mine!=null)m.textContent=P.D[mine].n;
  $('drawerNote').textContent=mine!=null?(a.length?`Bu kesişimde ${a.length} doğru cevap daha vardı:`:'Bu kesişimin tek doğru cevabıydı.'):`Bu kesişimin ${a.length} doğru cevabı:`;
  $('drawerList').innerHTML=a.map((d,k)=>`<li style="animation-delay:${Math.min(k,14)*35+120}ms">${esc(d.n)}<small>${S.c.includes(d.id)?'başka kutuda · ':''}${d.first}–${d.last}</small></li>`).join('');
  $('drawerList').scrollTop=0;
  const sc=$('drawerScrim'),dr=$('drawer');sc.hidden=false;requestAnimationFrame(()=>{sc.classList.add('on');dr.classList.add('open');dr.setAttribute('aria-hidden','false')});
}
function closeDrawer(){const sc=$('drawerScrim'),dr=$('drawer');if(!dr.classList.contains('open'))return;dr.classList.remove('open');dr.setAttribute('aria-hidden','true');sc.classList.remove('on');setTimeout(()=>{sc.hidden=true},280)}
$('closeDrawer').onclick=closeDrawer;$('drawerScrim').onclick=closeDrawer;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
function closeSheet(){$('sheet').hidden=true;active=null;$('q').blur()}
function search(q){
  const qn=norm(q);if(!qn)return[];const qt=qn.split(' ');
  return POOLS[mode].D.filter(d=>qt.every(t=>d.tokens.some(w=>w.startsWith(t)))||d.full.includes(qn))
   .sort((a,b)=>{const sa=a.tokens.some(w=>w.startsWith(qt[0]))?0:1,sb=b.tokens.some(w=>w.startsWith(qt[0]))?0:1;return sa-sb||b.known-a.known||b.last-a.last||a.n.localeCompare(b.n)}).slice(0,8);
}
function drawSug(){
  const used=new Set(S.c.filter(x=>x!=null));
  $('sug').innerHTML=sugList.map((d,k)=>`<li data-id="${d.id}" class="${used.has(d.id)?'used':''}${k===sugIdx?' act':''}">${esc(d.n)}<small>${used.has(d.id)?'kullanıldı':d.first+'–'+d.last}</small></li>`).join('');
}
$('q').addEventListener('input',e=>{sugList=search(e.target.value);sugIdx=sugList.length?0:-1;drawSug()});
$('q').addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){sugIdx=Math.min(sugIdx+1,sugList.length-1);drawSug();e.preventDefault()}
  else if(e.key==='ArrowUp'){sugIdx=Math.max(sugIdx-1,0);drawSug();e.preventDefault()}
  else if(e.key==='Enter'&&sugList[sugIdx])guess(sugList[sugIdx].id);
  else if(e.key==='Escape')closeSheet();
});
$('sug').addEventListener('click',e=>{const li=e.target.closest('li[data-id]');if(li&&!li.classList.contains('used'))guess(+li.dataset.id)});
$('closeSheet').onclick=closeSheet;
$('sheet').addEventListener('click',e=>{if(e.target===$('sheet'))closeSheet()});
let tt;function toast(m,bad){const t=$('toast');t.textContent=m;t.className='toast'+(bad?' bad':'');t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2400)}
function guess(id){
  if(active==null||S.done)return;
  if(S.c.includes(id)){toast('Bu pilotu bu gridde zaten kullandın',true);return}
  const d=POOLS[mode].D[id],r=G.rows[Math.floor(active/3)],c=G.cols[active%3];
  S.left--;
  if(r.t(d)&&c.t(d)){const cell=active;S.c[cell]=id;closeSheet();setTimeout(()=>openDrawer(cell),220)}
  else{const card=$('sheetCard');card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');
    const miss=!r.t(d)&&!c.t(d)?'iki şartı da':!r.t(d)?`"${r.label}" şartını`:`"${c.label}" şartını`;
    toast(`${d.n} ${miss} sağlamıyor`,true);$('q').select()}
  if(S.c.every(x=>x!=null)||S.left<=0){S.done=1;closeSheet()}
  persist();renderGame();renderPill();
}
$('giveUp').onclick=()=>{S.done=1;persist();renderGame();renderPill()};
$('backToday').onclick=()=>{date=todayStr();loadGame();renderGame()};
function openPlay(p,keepDate){if(!keepDate)date=todayStr();forceReload=true;go(p)}
let forceReload=false;
$('nextGame').onclick=()=>{if(free){freeSeed=0;loadGame();renderGame();return}const nx=nextOpen();if(!nx)return;openPlay(nx==='all'?'tum':'2000')};
document.querySelectorAll('[data-fmode]').forEach(b=>b.onclick=()=>{freeMode=b.dataset.fmode;freeSeed=0;loadGame();renderGame()});
$('newFree').onclick=()=>{freeSeed=0;loadGame();renderGame()};
document.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>{diff=+b.dataset.diff;savePrefs();loadGame();renderGame()});
// ---------- month calendar ----------
let calMonth=null;
const AYF=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
function goDate(dt){date=dt;calMonth=null;loadGame();renderGame();window.scrollTo({top:0,behavior:'smooth'})}
function renderMonthCal(){
  const t=todayStr(),sel=parseYmd(date);
  if(!calMonth)calMonth=new Date(sel.getFullYear(),sel.getMonth(),1);
  const y=calMonth.getFullYear(),m=calMonth.getMonth();
  $('mcTitle').textContent=`${AYF[m]} ${y}`;
  $('mcPrev').disabled=new Date(y,m,1)<=new Date(LAUNCH.getFullYear(),LAUNCH.getMonth(),1);
  const tt=parseYmd(t);$('mcNext').disabled=new Date(y,m+1,1)>tt;
  const g=$('mcGrid');g.innerHTML=['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map(x=>`<div class="mc-dh">${x}</div>`).join('');
  const first=new Date(y,m,1),lead=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate();
  for(let i=0;i<lead;i++)g.insertAdjacentHTML('beforeend','<div class="mc-d blank"></div>');
  for(let d=1;d<=days;d++){const dt=ymd(new Date(y,m,d));const b=document.createElement('button');b.type='button';
    const off=parseYmd(dt)>tt||parseYmd(dt)<LAUNCH;const gm=off?null:getGame(dt,mode,dailyDiff(dt));
    const st=off?'off':gm&&gm.done?'done':gm?'prog':'open';
    b.className='mc-d '+st+(dt===date?' sel':'');
    b.innerHTML=`${d}${st==='done'?`<small>${gm.s}/9</small>`:st==='prog'?'<small>…</small>':''}`;
    b.setAttribute('aria-label',`${d} ${AYF[m]}${st==='done'?', bitirildi, '+gm.s+' / 9':st==='prog'?', yarım kaldı':st==='open'?', oynanmadı':''}`);
    if(off)b.disabled=true;else b.onclick=()=>goDate(dt);
    g.appendChild(b)}
  updateDayNav();
}
function updateDayNav(){$('prevDay').disabled=addDays(date,-1)<ymd(LAUNCH);$('nextDay').disabled=date>=todayStr()}
$('prevDay').onclick=()=>{const d=addDays(date,-1);if(d>=ymd(LAUNCH))goDate(d)};
$('nextDay').onclick=()=>{const d=addDays(date,1);if(d<=todayStr())goDate(d)};
$('mcPrev').onclick=()=>{calMonth=new Date(calMonth.getFullYear(),calMonth.getMonth()-1,1);renderMonthCal()};
$('mcNext').onclick=()=>{calMonth=new Date(calMonth.getFullYear(),calMonth.getMonth()+1,1);renderMonthCal()};
$('share').onclick=()=>{
  const f=S.c.filter(x=>x!=null).length;let txt=(free?`Box Box Serbest · ${MN[mode]} · ${DN[diff]}  ${f}/9\n`:`Box Box #${dayNum(date)} · ${MN[mode]} (${DN[diff]})  ${f}/9\n`);
  for(let r=0;r<3;r++)txt+=[0,1,2].map(c=>S.c[r*3+c]!=null?'🟩':'⬛').join('')+'\n';
  const st=computeStats();if(st.streak>1)txt+=`Seri: ${st.streak} gün`;
  try{navigator.clipboard.writeText(txt.trim()).then(()=>toast('Sonuç kopyalandı'),()=>toast(txt.trim()))}catch(e){toast(txt.trim())}
};

// ---------- archive ----------
function renderArchive(){
  const el=$('archList');el.innerHTML='';const t=todayStr();
  for(let dt=t;parseYmd(dt)>=LAUNCH;dt=addDays(dt,-1)){
    const row=document.createElement('div');row.className='aday';
    row.innerHTML=`<div class="ad">#${dayNum(dt)}<small>${fmtDate(dt)}${dt===t?' · bugün':''}</small></div><div class="chips"></div>`;
    const ch=row.querySelector('.chips');
    {const d=dailyDiff(dt);for(const m of ['all','mod']){const g=getGame(dt,m,d);const b=document.createElement('button');b.className=chipCls(g);
      b.innerHTML=(g?(g.done?g.s+' / 9':'devam'):'oyna')+`<small>${DN[d]}</small>`;b.setAttribute('aria-label',`${fmtDate(dt)} ${MN[m]} ${DN[d]}${g&&g.done?', '+g.s+' / 9':''}`);
      b.onclick=()=>{date=dt;openPlay(m==='all'?'tum':'2000',true)};ch.appendChild(b)}}
    el.appendChild(row);
  }
}

// ---------- stats ----------
const flame='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2s1 4-2 7-4 5-2 9c-3-1-5-4-4-8 1-3 4-5 4-8 2 1 3 3 3 5 1-2 1-3 1-5z"/><path d="M14 22c3 0 6-2 6-6 0-3-2-5-3-7 0 3-1 4-3 5 1-2 0-4-1-5-1 3-4 5-4 8 0 3 2 5 5 5z"/></svg>';
function renderPill(){$('pillStreak').textContent=computeStats().streak}
function renderStats(){
  const s=computeStats();
  $('kpis').innerHTML=`<div class="kpi hero">${flame}<div><div class="v">${s.streak}</div><div class="k">Günlük seri${s.streak?'':' · bugün bir grid bitirerek başla'}</div></div></div>
   <div class="kpi"><div class="v">${s.best}</div><div class="k">En uzun seri</div></div>
   <div class="kpi"><div class="v">${s.played}</div><div class="k">Biten grid</div></div>
   <div class="kpi"><div class="v">${s.perfect}</div><div class="k">Kusursuz grid</div></div>
   <div class="kpi"><div class="v">${s.avg.toFixed(1)}</div><div class="k">Ortalama skor / 9</div></div>`;
  const cal=$('cal');cal.innerHTML=['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map(x=>`<div class="dh">${x}</div>`).join('');
  const t=todayStr();const td=parseYmd(t);const dow=(td.getDay()+6)%7;let start=addDays(t,-(28+dow));
  for(let i=0;i<35;i++){const dt=addDays(start,i);const el=document.createElement('div');
    if(parseYmd(dt)>td){el.className='day blank';cal.appendChild(el);continue}
    const games=ST.days[dt]||{};let sum=0,any=false;for(const g of Object.values(games))if(g.done&&g.live){sum+=g.s;any=true}
    el.className='day'+(any?' on':'')+(s.perfectDays.has(dt)?' full':'')+(dt===t?' today':'');
    el.innerHTML=`<span class="dn">${parseYmd(dt).getDate()}</span><span class="ds">${any?sum:''}</span>`;
    el.title=`${fmtDate(dt)}${any?': '+sum+' kutu':''}`;cal.appendChild(el)}
  let h='<tr><th style="text-align:left">Mod</th><th>Oynanan</th><th>Ort.</th><th>9/9</th></tr>';
  for(const m of ['all','mod']){const p={n:0,sum:0,perfect:0};for(const d of [1,2,3]){const q=s.per[gkey(m,d)];if(q){p.n+=q.n;p.sum+=q.sum;p.perfect+=q.perfect}}h+=`<tr><td style="color:var(--fg);width:auto">${MN[m]}</td><td>${p.n}</td><td>${p.n?(p.sum/p.n).toFixed(1):'–'}</td><td>${p.perfect}</td></tr>`}
  $('modeTable').innerHTML=h;
}

// ---------- leaderboard ----------
async function renderLeaderboard(){
  document.querySelectorAll('[data-lb]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lb===lbMode)));
  const tbl=$('lbTable'),empty=$('lbEmpty'),note=$('lbNote');
  if(!sb){tbl.innerHTML='';empty.hidden=false;empty.textContent='Sıralama şu an kapalı.';note.textContent='';return}
  let q=sb.from('leaderboard').select('id,username,streak,best,perfect,played,today_score,today_n').limit(50);
  if(lbMode==='streak')q=q.order('streak',{ascending:false}).order('best',{ascending:false});
  else if(lbMode==='best')q=q.order('best',{ascending:false}).order('streak',{ascending:false});
  else q=q.gt('today_n',0).order('today_score',{ascending:false}).order('today_n',{ascending:false});
  const {data,error}=await q;
  if(error){tbl.innerHTML='';empty.hidden=false;empty.textContent='Sıralama yüklenemedi. Biraz sonra tekrar dene.';note.textContent='';return}
  const rows=(data||[]).filter(r=>lbMode!=='streak'||r.streak>0||r.best>0);
  if(!rows.length){tbl.innerHTML='';empty.hidden=false;empty.textContent=lbMode==='today'?'Bugün henüz kimse grid bitirmedi. İlk sen ol.':'Henüz tabloda kimse yok. Giriş yap, bugünün gridini bitir, ilk sen gir.';note.textContent='';return}
  empty.hidden=true;
  tbl.innerHTML=lbMode==='today'?'<tr><th>#</th><th>Oyuncu</th><th>Grid</th><th>Kutu</th></tr>':'<tr><th>#</th><th>Oyuncu</th><th>Seri</th><th>En uzun</th><th>9/9</th></tr>';
  const me=cloud.user&&cloud.user.id;
  rows.forEach((p,i)=>{const tr=document.createElement('tr');if(p.id===me)tr.className='mine';
    const cells=[i+1,p.username||'Oyuncu',...(lbMode==='today'?[p.today_n,p.today_score]:[p.streak,p.best,p.perfect])];
    cells.forEach((v,j)=>{const td=document.createElement('td');if(j===1)td.className='nm';td.textContent=v;tr.appendChild(td)});
    tbl.appendChild(tr)});
  note.textContent=(lbMode==='today'?'Bugün bitirilen günlük gridler ve toplam bulunan kutu.':'Seri, en az bir günlük grid bitirilen ardışık günlerdir.')+(cloud.user?'':' Tabloya girmek için giriş yap.');
}
document.querySelectorAll('[data-lb]').forEach(b=>b.onclick=()=>{lbMode=b.dataset.lb;renderLeaderboard()});

// ---------- routing ----------
function go(v){if(location.hash!=='#'+v)location.hash=v;else route()}
function route(){
  if(!$('sheet').hidden)closeSheet();
  closeDrawer();
  let h=(location.hash||'#'+playRoute).slice(1);
  if(h==='oyna')h=playRoute;
  const playIdx={tum:'all','2000':'mod',serbest:'free'};
  if(playIdx[h]){view='oyna';const wasFree=free,prevMode=mode;playRoute=h;free=h==='serbest';
    if(!free)mode=playIdx[h];
    if(!G||forceReload||wasFree!==free||(!free&&prevMode!==mode)){if(!free&&!forceReload&&wasFree!==free)date=todayStr();loadGame()}
    forceReload=false;savePrefs();}
  else view=['arsiv','istatistik','siralama','nasil'].includes(h)?h:'oyna';
  document.querySelectorAll('.view').forEach(s=>s.hidden=s.id!=='v-'+view);
  document.querySelectorAll('nav a').forEach(a=>a.setAttribute('aria-current',a.dataset.v===view?'page':'false'));
  $('subnav').hidden=view!=='oyna';
  document.querySelectorAll('.subnav a').forEach(a=>a.setAttribute('aria-current',a.dataset.p===playRoute?'page':'false'));
  if(view==='oyna'){if(!G)loadGame();renderGame()}
  if(view==='arsiv')renderArchive();
  if(view==='istatistik')renderStats();
  if(view==='siralama')renderLeaderboard();
  window.scrollTo(0,0);
}

function renderAll(){renderPill();renderSyncNote();route()}
window.addEventListener('hashchange',route);
document.querySelector('nav a[data-v="oyna"]').addEventListener('click',e=>{e.preventDefault();go(playRoute)});
// day rollover while open
setInterval(()=>{const t=todayStr();if(t!==window.__pgDay){const was=window.__pgDay;window.__pgDay=t;if(was&&date===was&&!S.done){}renderPill();if(view==='oyna')renderTodayChips()}},60000);
window.__pgDay=todayStr();
applyTheme();loadGame();renderAll();
initCloud();
})();
