const API_BASE = "https://api.marketfiyati.org.tr";

const LATITUDE = 40.7731;
const LONGITUDE = 30.3948;
const DISTANCE_KM = 20;

const TARIM_KREDI_KEYS = ["tarım kredi","tarim kredi","tarım","tarim","koop","ko-op","kooperatif","çiftçi market","ciftci market","çiftçi marketi","ciftci marketi","tk koop","tk kooperatif"];
const RIVAL_MARKETS = ["bim","a101","şok","sok","migros","carrefour","carrefoursa","anpa","ess","essen"];

const PRODUCTS = [
  {label:"30'lu M Boy Yumurta", keywords:["yumurta m boy 30","30 adet yumurta","30 lu yumurta","m boy yumurta"], category:"egg", must:["yumurta"], ban:["çikolata","sürpriz","kinder","oyuncak","sakız","bisküvi","gofret","çikolatalı","6 adet","10 adet","15 adet"]},
  {label:"1 L Yarım Yağlı Süt", keywords:["yarım yağlı süt","1 lt yarım yağlı süt","süt 1 lt","uht süt 1 lt"], category:"milk_half", must:["süt"], size:{value:1, unit:"l"}, ban:["tam yağlı","tam yagli","laktozsuz","çikolata","yoğurt","kefir","ayran","devam sütü","bebek"]},
  {label:"1 kg Zeytin", keywords:["1 kg zeytin","zeytin 1 kg","siyah zeytin 1 kg","yeşil zeytin 1 kg"], category:"generic", must:["zeytin"], size:{value:1, unit:"kg"}, ban:["ezmesi","sos","yağı","yagi","sabun","500 gr","400 gr","250 gr"]},
  {label:"5 L Ayçiçek Yağı", keywords:["5 lt ayçiçek yağı","ayçiçek yağı 5 lt","5 litre ayçiçek"], category:"generic", must:["ayçiçek"], acceptAny:["5 l","5 lt","5 litre"], size:{value:5, unit:"l"}, ban:["zeytin","mısır","fındık","tereyağ","margarin"]},
  {label:"5 kg Toz Şeker", keywords:["5 kg toz şeker","toz şeker 5 kg","5 kg şeker"], category:"generic", must:["şeker"], acceptAny:["5 kg","5000 gr","5.000 gr"], size:{value:5, unit:"kg"}, ban:["küp","pudra","vanilin","sakız","çikolata","bisküvi"]},
  {label:"1 kg Baldo Pirinç", keywords:["1 kg baldo pirinç","baldo pirinç 1 kg"], category:"generic", must:["baldo","pirinç"], size:{value:1, unit:"kg"}, ban:["bulgur","makarna"]},
  {label:"1 kg Osmancık Pirinç", keywords:["1 kg osmancık pirinç","osmancık pirinç 1 kg"], category:"generic", must:["osmancık","pirinç"], size:{value:1, unit:"kg"}, ban:["bulgur","makarna"]},
  {label:"2 kg Un", keywords:["2 kg un","un 2 kg","buğday unu 2 kg"], category:"flour2", must:["un"], acceptAny:["2 kg","2000 gr","2.000 gr"], size:{value:2, unit:"kg"}, ban:["mısır unu","pirinç unu","galeta","nişasta","kabartma","vanilin","irmik"]},
  {label:"5 kg Un", keywords:["5 kg un","un 5 kg","buğday unu 5 kg","5 kg buğday unu"], category:"flour5", must:["un"], acceptAny:["5 kg","5000 gr","5.000 gr"], size:{value:5, unit:"kg"}, ban:["mısır unu","pirinç unu","galeta","nişasta","kabartma","vanilin","irmik"]},

  // v10: beyaz peynir artık tam yağlı hedefleniyor.
  {label:"1 kg Tam Yağlı Beyaz Peynir", keywords:["1 kg tam yağlı beyaz peynir","tam yağlı beyaz peynir 1 kg","1 kg beyaz peynir"], category:"cheese_full", must:["beyaz","peynir"], size:{value:1, unit:"kg"}, ban:["az yağlı","az yagli","yarım yağlı","yarim yagli","light","krem","labne","kaşar","süzme","lor","çökelek"]},

  // v10: yeni ürün
  {label:"1 kg Tereyağ", keywords:["1 kg tereyağ","1 kg tereyağı","tereyağ 1 kg","tereyağı 1 kg"], category:"generic", must:["tereyağ"], size:{value:1, unit:"kg"}, ban:["margarin","kahvaltılık","250 gr","500 gr","750 gr","125 gr"]},

  {label:"400 g Dana Kasap Sucuk", keywords:["400 gr dana kasap sucuk","dana kasap sucuk 400 gr","400 g dana sucuk"], category:"generic", must:["sucuk"], acceptAny:["400 gr","400 g"], size:{value:400, unit:"g"}, ban:["75 gr","50 gr","60 gr","250 gr","200 gr"]},
  {label:"400 g Dana Kıyma", keywords:["400 gr dana kıyma","dana kıyma 400 gr"], category:"generic", must:["kıyma"], acceptAny:["400 gr","400 g"], size:{value:400, unit:"g"}, ban:["kuzu","500 gr","1 kg","1000 gr","köfte","hamburger"]},
  {label:"1 kg Et ve Süt Kurumu Dana Kıyma", keywords:["kıyma","et ve süt kurumu kıyma","et ve süt kurumu dana kıyma","esk dana kıyma","1 kg dana kıyma"], category:"esk_minced", must:["kıyma"], ban:["kuzu","400 gr","500 gr","köfte","hamburger"]},
  {label:"1 kg Çay", keywords:["1 kg siyah çay","siyah çay 1 kg","rize çay 1 kg"], category:"tea", must:["çay"], size:{value:1, unit:"kg"}, ban:["buzlu","ice tea","soğuk","bitki","yeşil çay","papatya","ıhlamur","adaçayı","oralet","sakız","şeftali","limon"]},
  {label:"1 kg Karpuz", keywords:["karpuz kg","karpuz 1 kg"], category:"produce", must:["karpuz"], unitOnly:true, ban:["sakız","aroma","aromalı","şeker","meyve suyu","ice tea","çikolata","bisküvi","dondurma"]},
  {label:"1 kg Soğan", keywords:["soğan kg","soğan 1 kg"], category:"produce", must:["soğan"], unitOnly:true, ban:["kremalı","cips","baharat","tozu","çorba","sos","sakız"]},
  {label:"1 kg Patates", keywords:["patates kg","patates 1 kg"], category:"produce", must:["patates"], unitOnly:true, ban:["cips","dondurulmuş","püre","baharat","çubuk","kraker"]}
];

function ntr(s){
  return String(s || "").replaceAll("I","ı").replaceAll("İ","i").toLowerCase()
    .replaceAll("â","a").replaceAll("î","i").replaceAll("û","u")
    .replaceAll("ş","s").replaceAll("ğ","g").replaceAll("ü","u").replaceAll("ö","o").replaceAll("ç","c")
    .replaceAll("ı","i");
}
function marketType(name){
  const m=ntr(name);
  if(TARIM_KREDI_KEYS.some(k=>m.includes(ntr(k)))) return "tarim";
  if(RIVAL_MARKETS.some(k=>m.includes(ntr(k)))) return "rival";
  return "other";
}
function textOfProduct(p){ return ntr([p.title,p.brand,p.refinedVolumeOrWeight,p.refinedQuantityUnit,p.quantity,p.unit].join(" ")); }
function hasAny(text, arr){ return !arr || arr.length===0 || arr.some(x=>text.includes(ntr(x))); }
function hasAll(text, arr){ return !arr || arr.length===0 || arr.every(x=>text.includes(ntr(x))); }
function hasNone(text, arr){ return !arr || arr.length===0 || !arr.some(x=>text.includes(ntr(x))); }
function sizeMatches(product,spec){
  if(spec.category === "esk_minced") return true;
  if(!spec.size && !spec.unitOnly) return true;
  const text=textOfProduct(product).replaceAll(",",".").replace(/\s+/g," ");
  if(spec.unitOnly) return text.includes("kg") || text.includes("kilogram") || text.includes("1 kg");
  const v=spec.size.value, unit=spec.size.unit;
  if(unit==="l") return [`${v} l`,`${v}lt`,`${v} lt`,`${v} litre`,`${v}.0 l`].some(x=>text.includes(x));
  if(unit==="kg"){ const gram=v*1000; return [`${v} kg`,`${v}kg`,`${v}.0 kg`,`${gram} gr`,`${gram}g`,`${gram} g`,`${gram} gram`].some(x=>text.includes(x)); }
  if(unit==="g") return [`${v} gr`,`${v}g`,`${v} g`,`${v} gram`].some(x=>text.includes(x));
  return true;
}
function categoryScore(product,spec){
  const text=textOfProduct(product); let score=0;
  if(spec.category==="egg"){
    const has30=text.includes("30") || text.includes("otuz");
    const hasM=text.includes("m boy") || text.includes("53-62") || text.includes("53 62");
    if(!has30) return -9999;
    if(hasM) score+=50;
    score+=20;
  }
  if(spec.category==="milk_half"){
    if(text.includes("yarim yagli")) score+=60;
    else if(text.includes("sut")) score+=10;
  }
  if(spec.category==="esk_minced"){
    const isEsk = text.includes("et ve sut kurumu") || text.includes("esk");
    if(isEsk) score += 80;
    if(text.includes("dana")) score += 20;
    if(text.includes("1 kg") || text.includes("1000 gr")) score += 30;
    if(!isEsk && !(text.includes("1 kg") || text.includes("1000 gr"))) return -9999;
  }
  if(spec.category==="cheese_full"){
    if(text.includes("tam yagli")) score += 60;
    else score += 10; // Eğer sistemde tam yağlı ifadesi yoksa yine yakalasın ama düşük puan versin.
  }
  if(spec.category==="tea"){ if(text.includes("siyah")) score+=25; if(text.includes("rize")) score+=10; }
  if(spec.category==="produce") score+=20;
  return score;
}
function scoreProduct(product,spec){
  const text=textOfProduct(product);
  if(!hasAll(text,spec.must)) return -9999;
  if(!hasNone(text,spec.ban)) return -9999;
  if(spec.acceptAny && !hasAny(text,spec.acceptAny)) return -9999;
  if(!sizeMatches(product,spec)) return -9999;
  const cat=categoryScore(product,spec); if(cat<0) return -9999;
  let score=cat;
  for(const m of spec.must||[]) if(text.includes(ntr(m))) score+=20;
  for(const a of spec.acceptAny||[]) if(text.includes(ntr(a))) score+=10;
  if(spec.size) score+=25;
  if(spec.unitOnly) score+=15;
  for(const w of ntr(spec.label).split(/\s+/).filter(w=>w.length>2)) if(text.includes(w)) score+=2;
  return score;
}
async function apiPost(path,payload){
  const res=await fetch(API_BASE+path,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","User-Agent":"ARTS-Vercel-Pilot/10.0"},body:JSON.stringify(payload)});
  if(!res.ok) throw new Error(`Market Fiyatı API hata: ${res.status}`);
  return await res.json();
}
async function getNearestDepots(){
  const depots=await apiPost("/api/v2/nearest",{latitude:LATITUDE,longitude:LONGITUDE,distance:DISTANCE_KM});
  const list=Array.isArray(depots)?depots:[];
  const marketNames=[...new Set(list.map(d=>d.marketName||d.sellerName||d.name||d.depotName).filter(Boolean))];
  return {depots:list,marketNames};
}
async function searchProduct(spec,depotIds){
  const all=[];
  const keywords=spec.keywords || [spec.keyword];
  for(const keyword of keywords){
    const data=await apiPost("/api/v2/search",{keywords:keyword,pages:0,size:150,latitude:LATITUDE,longitude:LONGITUDE,distance:DISTANCE_KM,depots:depotIds});
    const products=Array.isArray(data?.content)?data.content:[];
    for(const p of products){
      const score=scoreProduct(p,spec); if(score<0) continue;
      for(const info of (p.productDepotInfoList||[])){
        const marketName=info.marketAdi||info.depotName||"";
        const type=marketType(marketName); if(type==="other") continue;
        const price=Number(info.price); if(!Number.isFinite(price)) continue;
        all.push({target:spec.label,title:p.title||"",brand:p.brand||"",quantity:p.refinedVolumeOrWeight||p.refinedQuantityUnit||"",market:marketName,depot:info.depotName||"",marketType:type,price,unitPrice:info.unitPrice||"",indexTime:info.indexTime||"",score,keyword});
      }
    }
  }
  const seen=new Map();
  for(const c of all){
    const key=[c.title,c.market,c.price].join("|");
    if(!seen.has(key) || seen.get(key).score<c.score) seen.set(key,c);
  }
  return [...seen.values()].sort((a,b)=>a.price-b.price || b.score-a.score);
}
function bestOf(arr){ return (!arr||arr.length===0)?null:[...arr].sort((a,b)=>a.price-b.price || b.score-a.score)[0]; }
export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  try{
    const depotResult=await getNearestDepots();
    const depotIds=depotResult.depots.map(d=>d.id).filter(Boolean);
    const results=[];
    for(const spec of PRODUCTS){
      const item={target:spec.label,keyword:(spec.keywords||[spec.keyword]).join(" / "),tarim:null,rival:null,best:null,alternatives:[],status:"not_found",comparison:"unknown",difference:null};
      try{
        const found=await searchProduct(spec,depotIds);
        item.alternatives=found.slice(0,10);
        item.tarim=bestOf(found.filter(x=>x.marketType==="tarim"));
        item.rival=bestOf(found.filter(x=>x.marketType==="rival"));
        item.best=bestOf(found);
        if(item.tarim||item.rival){
          item.status="ok";
          if(item.tarim&&item.rival){
            item.difference=Math.round((item.tarim.price-item.rival.price)*100)/100;
            if(item.difference>0)item.comparison="tarim_expensive";
            else if(item.difference<0)item.comparison="tarim_cheaper";
            else item.comparison="equal";
          }else if(item.tarim&&!item.rival)item.comparison="only_tarim";
          else if(!item.tarim&&item.rival)item.comparison="no_tarim";
        }
      }catch(e){ item.status="error"; item.error=e.message; }
      results.push(item);
    }
    const disadvantageCount=results.filter(x=>x.comparison==="tarim_expensive").length;
    const advantageCount=results.filter(x=>["tarim_cheaper","equal","only_tarim"].includes(x.comparison)).length;
    return res.status(200).json({checkedAt:new Date().toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"}),location:"Sakarya / Adapazarı",depotCount:depotIds.length,marketNames:depotResult.marketNames,results,summary:{disadvantageCount,advantageCount}});
  }catch(e){ return res.status(500).json({error:e.message}); }
}
