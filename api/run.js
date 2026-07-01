const API_BASE = "https://api.marketfiyati.org.tr";

const LATITUDE = 40.7731;
const LONGITUDE = 30.3948;
const DISTANCE_KM = 5;

const TARGET_MARKETS = ["bim","a101","şok","sok","migros","carrefour","carrefoursa","anpa","ess","essen"];

const PRODUCTS = [
  {label:"30'lu M Boy Yumurta", keyword:"30 lu m boy yumurta", must:["yumurta"]},
  {label:"1 L Tam Yağlı Süt", keyword:"1 lt tam yağlı süt", must:["süt"]},
  {label:"1 L Yarım Yağlı Süt", keyword:"1 lt yarım yağlı süt", must:["süt"]},
  {label:"5 L Ayçiçek Yağı", keyword:"5 lt ayçiçek yağı", must:["ayçiçek"]},
  {label:"5 kg Toz Şeker", keyword:"5 kg toz şeker", must:["şeker"]},
  {label:"1 kg Baldo Pirinç", keyword:"1 kg baldo pirinç", must:["baldo","pirinç"]},
  {label:"1 kg Osmancık Pirinç", keyword:"1 kg osmancık pirinç", must:["osmancık","pirinç"]},
  {label:"1 kg Un", keyword:"1 kg un", must:["un"]},
  {label:"5 kg Un", keyword:"5 kg un", must:["un"]},
  {label:"1 kg Beyaz Peynir", keyword:"1 kg beyaz peynir", must:["peynir"]},
  {label:"400 g Dana Sucuk", keyword:"400 gr dana sucuk", must:["sucuk"]},
  {label:"400 g Dana Kıyma", keyword:"400 gr dana kıyma", must:["kıyma"]},
  {label:"1 kg Dana Kıyma", keyword:"1 kg dana kıyma", must:["kıyma"]},
  {label:"1 kg Çay", keyword:"1 kg çay", must:["çay"]},
  {label:"1 kg Karpuz", keyword:"karpuz kg", must:["karpuz"]},
  {label:"1 kg Soğan", keyword:"soğan kg", must:["soğan"]},
  {label:"1 kg Patates", keyword:"patates kg", must:["patates"]},
];

function trLower(s){
  return String(s || "").replaceAll("I","ı").replaceAll("İ","i").toLowerCase();
}

async function apiPost(path, payload){
  const res = await fetch(API_BASE + path, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json",
      "User-Agent":"ARTS-Vercel-Pilot/1.0"
    },
    body:JSON.stringify(payload)
  });
  if(!res.ok) throw new Error(`Market Fiyatı API hata: ${res.status}`);
  return await res.json();
}

async function getNearestDepots(){
  const depots = await apiPost("/api/v2/nearest", {
    latitude:LATITUDE, longitude:LONGITUDE, distance:DISTANCE_KM
  });
  return (Array.isArray(depots) ? depots : []).filter(d => {
    const m = trLower(d.marketName || d.sellerName || d.name);
    return TARGET_MARKETS.some(x => m.includes(x));
  });
}

function relevant(product, spec){
  const text = trLower([
    product.title,
    product.brand,
    product.refinedVolumeOrWeight,
    product.refinedQuantityUnit
  ].join(" "));
  return spec.must.every(m => text.includes(trLower(m)));
}

async function searchProduct(spec, depotIds){
  const data = await apiPost("/api/v2/search", {
    keywords:spec.keyword,
    pages:0,
    size:50,
    latitude:LATITUDE,
    longitude:LONGITUDE,
    distance:DISTANCE_KM,
    depots:depotIds
  });

  const products = Array.isArray(data?.content) ? data.content : [];
  const candidates = [];

  for(const p of products){
    if(!relevant(p, spec)) continue;
    for(const info of (p.productDepotInfoList || [])){
      const market = trLower(info.marketAdi || info.depotName || "");
      if(!TARGET_MARKETS.some(x => market.includes(x))) continue;
      const price = Number(info.price);
      if(!Number.isFinite(price)) continue;
      candidates.push({
        target:spec.label,
        title:p.title || "",
        brand:p.brand || "",
        quantity:p.refinedVolumeOrWeight || p.refinedQuantityUnit || "",
        market:info.marketAdi || info.depotName || "",
        depot:info.depotName || "",
        price,
        unitPrice:info.unitPrice || "",
        indexTime:info.indexTime || ""
      });
    }
  }
  candidates.sort((a,b)=>a.price-b.price);
  return candidates.slice(0,8);
}

export default async function handler(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if(req.method === "OPTIONS") return res.status(200).end();

  try{
    const depots = await getNearestDepots();
    const depotIds = depots.map(d => d.id).filter(Boolean);
    const results = [];

    for(const spec of PRODUCTS){
      const item = {
        target:spec.label,
        keyword:spec.keyword,
        best:null,
        alternatives:[],
        status:"not_found"
      };
      try{
        const found = await searchProduct(spec, depotIds);
        item.alternatives = found;
        if(found.length){
          item.best = found[0];
          item.status = "ok";
        }
      }catch(e){
        item.status = "error";
        item.error = e.message;
      }
      results.push(item);
    }

    return res.status(200).json({
      checkedAt:new Date().toLocaleString("tr-TR", {timeZone:"Europe/Istanbul"}),
      location:"Sakarya / Adapazarı",
      depotCount:depotIds.length,
      results
    });
  }catch(e){
    return res.status(500).json({error:e.message});
  }
}
