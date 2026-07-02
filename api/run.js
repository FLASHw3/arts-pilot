const API_BASE = "https://api.marketfiyati.org.tr";
const LATITUDE = 39.0;
const LONGITUDE = 35.0;
const DISTANCE_KM = 1000;
const SAKARYA_LATITUDE = 40.7731;
const SAKARYA_LONGITUDE = 30.3948;
const SAKARYA_DISTANCE_KM = 25;

const TARIM_KREDI_KEYS = ["tarım kredi","tarim kredi","tarım","tarim","koop","ko-op","kooperatif","çiftçi market","ciftci market","çiftçi marketi","ciftci marketi","tk koop","tk kooperatif"];
const RIVAL_MARKETS = ["bim","a101","şok","sok","migros","carrefour","carrefoursa","anpa","ess","essen"];

const PRODUCTS = [
  {group:"Yumurta", label:"30'lu M Boy Yumurta", keywords:["Türem Yumurta M Boy 30 Adet","Turem Yumurta M Boy 30 Adet","Türem Yumurta 53-62 Gr 30 Adet","yumurta m boy 30","Yumurta 53-62 Gr 30 Adet","53-62 gr 30 adet yumurta","30 adet yumurta","30 lu yumurta","m boy yumurta"], category:"egg", must:["yumurta"], prefer:["türem","turem","m boy","53-62"], ban:["anadolu çiftliği","anadolu ciftligi","keskinoğlu","keskinoglu","çikolata","sürpriz","kinder","oyuncak","sakız","bisküvi","gofret","çikolatalı","6 adet","10 adet","15 adet"]},

  {group:"Süt Ürünleri", label:"1 L Yarım Yağlı Süt", keywords:["yarım yağlı süt","1 lt yarım yağlı süt","süt 1 lt","uht süt 1 lt"], category:"milk_half", must:["süt"], size:{value:1, unit:"l"}, ban:["tam yağlı","tam yagli","laktozsuz","çikolata","yoğurt","kefir","ayran","devam sütü","bebek","enka","%0.15","0.15 yağlı","0.15 yagli","0.1 yağlı","0.1 yagli","carrefour 0.1","pınar","pinar","%0,5","%0.5","0,5 yağlı","0.5 yağlı","0,5 yagli","0.5 yagli"]},
  {group:"Süt Ürünleri", label:"1 kg Tam Yağlı Beyaz Peynir", keywords:["1 kg tam yağlı beyaz peynir","tam yağlı beyaz peynir 1 kg","1 kg beyaz peynir"], category:"cheese_full", must:["beyaz","peynir"], size:{value:1, unit:"kg"}, ban:["az yağlı","az yagli","yarım yağlı","yarim yagli","light","krem","labne","kaşar","süzme","lor","çökelek"]},
  {group:"Süt Ürünleri", label:"1 kg Tereyağ", keywords:["1 kg tereyağ","1 kg tereyağı","tereyağ 1 kg","tereyağı 1 kg"], category:"generic", must:["tereyag"], size:{value:1, unit:"kg"}, ban:["margarin","kahvaltılık","250 gr","500 gr","750 gr","125 gr","mengen","mengen çiftliği","mengen ciftligi"]},

  {group:"Temel Gıda / Bakliyat", label:"5 L Ayçiçek Yağı", keywords:["5 lt ayçiçek yağı","ayçiçek yağı 5 lt","5 litre ayçiçek","TMO Ayçiçek Yağı 5 Lt","Tmo Ayçiçek Yağı 5 L"], category:"generic", must:["ayçiçek"], acceptAny:["5 l","5 lt","5 litre"], size:{value:5, unit:"l"}, ban:["safya","zeytin","mısır","fındık","tereyağ","margarin"]},
  {group:"Temel Gıda / Bakliyat", label:"5 kg Toz Şeker", keywords:["5 kg toz şeker","toz şeker 5 kg","5 kg şeker"], category:"generic", must:["şeker"], acceptAny:["5 kg","5000 gr","5.000 gr"], size:{value:5, unit:"kg"}, ban:["küp","pudra","vanilin","sakız","çikolata","bisküvi"]},
  {group:"Temel Gıda / Bakliyat", label:"1 kg Baldo Pirinç", keywords:["1 kg baldo pirinç","baldo pirinç 1 kg"], category:"generic", must:["baldo","pirinç"], size:{value:1, unit:"kg"}, ban:["bulgur","makarna","anadolu lezzetleri","gönen","gonen"]},
  {group:"Temel Gıda / Bakliyat", label:"1 kg Osmancık Pirinç", keywords:["1 kg osmancık pirinç","osmancık pirinç 1 kg"], category:"generic", must:["osmancık","pirinç"], size:{value:1, unit:"kg"}, ban:["bulgur","makarna","zeki"]},
  {group:"Temel Gıda / Bakliyat", label:"5 kg Un", keywords:["5 kg un","un 5 kg","buğday unu 5 kg","5 kg buğday unu"], category:"flour5", must:["un"], acceptAny:["5 kg","5000 gr","5.000 gr"], size:{value:5, unit:"kg"}, ban:["mısır unu","pirinç unu","galeta","nişasta","kabartma","vanilin","irmik"]},
  {group:"Temel Gıda / Bakliyat", label:"1 kg Zeytin", keywords:["1 kg zeytin","zeytin 1 kg","siyah zeytin 1 kg","yeşil zeytin 1 kg"], category:"generic", must:["zeytin"], size:{value:1, unit:"kg"}, ban:["ezmesi","sos","yağı","yagi","sabun","500 gr","400 gr","250 gr"]},

  {group:"Et Ürünleri", label:"400 g Dana Kasap Sucuk", keywords:["400 gr dana kasap sucuk","dana kasap sucuk 400 gr","400 g dana sucuk"], category:"generic", must:["sucuk"], acceptAny:["400 gr","400 g"], size:{value:400, unit:"g"}, ban:["75 gr","50 gr","60 gr","250 gr","200 gr","maret"]},
  {group:"Et Ürünleri", label:"400 g Dana Kıyma", keywords:["400 gr dana kıyma","dana kıyma 400 gr"], category:"generic", must:["kıyma"], acceptAny:["400 gr","400 g"], size:{value:400, unit:"g"}, ban:["kuzu","500 gr","1 kg","1000 gr","köfte","hamburger"]},
  {group:"Et Ürünleri", label:"1 kg Et ve Süt Kurumu Dana Kıyma", keywords:["kıyma","et ve süt kurumu kıyma","et ve süt kurumu dana kıyma","esk dana kıyma","1 kg dana kıyma"], category:"esk_minced", must:["kıyma"], ban:["kuzu","400 gr","500 gr","köfte","hamburger"]},

  {group:"İçecek", label:"1 kg Çay", keywords:["1 kg siyah çay","siyah çay 1 kg","rize çay 1 kg"], category:"tea", must:["çay"], size:{value:1, unit:"kg"}, ban:["efor","buzlu","ice tea","soğuk","bitki","yeşil çay","papatya","ıhlamur","adaçayı","oralet","sakız","şeftali","limon","doğuş","dogus","doğuş rize","dogus rize"]},

  {group:"Meyve Sebze", label:"1 kg Karpuz", keywords:["karpuz kg","karpuz 1 kg","düz karpuz kg"], category:"produce", must:["karpuz"], unitOnly:true, ban:["çekirdeksiz","cekirdeksiz","mini","baby","sakız","aroma","aromalı","şeker","meyve suyu","ice tea","çikolata","bisküvi","dondurma"]},
  {group:"Meyve Sebze", label:"1 kg Soğan", keywords:["soğan kg","soğan 1 kg"], category:"produce", must:["soğan"], unitOnly:true, ban:["kremalı","cips","baharat","tozu","çorba","sos","sakız"]},
  {group:"Meyve Sebze", label:"1 kg Patates", keywords:["patates kg","patates 1 kg"], category:"produce", must:["patates"], unitOnly:true, ban:["cips","dondurulmuş","püre","baharat","çubuk","kraker"]},
  {group:"Meyve Sebze", label:"1 kg Domates", keywords:["domates pembe 1 kg","pembe domates kg","domates kg","domates 1 kg"], category:"produce", must:["domates"], unitOnly:true, ban:["salkım","salkim","atıştırmalık","atistirmalik","cherry","kokteyl","salça","salca","sos","kurutulmuş","kurutulmus","çorba","corba","konserve","tagem","turuncu domates","turuncu","tagem","turuncu domates","turuncu"]},
  {group:"Meyve Sebze", label:"1 kg Muz", keywords:["muz kg","muz 1 kg"], category:"produce", must:["muz"], unitOnly:true, ban:["aroma","puding","bisküvi","çikolata","meyve suyu"]},
  {group:"Meyve Sebze", label:"1 kg Salatalık", keywords:["salatalık kg","salatalık 1 kg"], category:"produce", must:["salatalık"], unitOnly:true, ban:["turşu","tursu","cips","aroma","sos"]},
  {group:"Meyve Sebze", label:"1 kg Limon", keywords:["limon kg","limon 1 kg"], category:"produce", must:["limon"], unitOnly:true, ban:["file","suyu","sos","aroma","kolonya","çay","cay"]},
  {group:"Meyve Sebze", label:"1 kg Kavun", keywords:["kavun kg","kavun 1 kg"], category:"produce", must:["kavun"], unitOnly:true, ban:["aroma","dondurma","sakız","meyve suyu"]},

  {group:"Meyve Sebze", label:"1 kg Çekirdeksiz Karpuz", keywords:["çekirdeksiz karpuz kg","çekirdeksiz karpuz 1 kg","karpuz çekirdeksiz 1 kg"], category:"produce", must:["karpuz","çekirdeksiz"], unitOnly:true, ban:["mini","baby","sakız","aroma","aromalı","şeker","meyve suyu","ice tea","çikolata","bisküvi","dondurma"]},

  {group:"Temizlik", label:"Bambu 3 Katlı Tuvalet Kağıdı 40 Adet", keywords:["Aqua Bambulu 3 Katlı Tuvalet Kağıdı 40 Adet","Softy Bambu 3 Katlı Tuvalet Kağıdı 40 Adet"], category:"toilet40_bamboo", must:["tuvalet","kağıdı"], acceptAny:["40 adet","40'lı","40 lı"], brandAny:["aqua","softy"], requireAny:["3 kat","3 katlı","3 katli"], ban:["solo","blume","elit","confort","beyaz güvercin","geri dönüşüm","geri donusum","2 kat","çift kat","cift kat","havlu","peçete","mendil"]},
  {group:"Temizlik", label:"2 Katlı Tuvalet Kağıdı 16 Adet", keywords:["Blume Çift Katlı Tuvalet Kağıdı 16 Adet","Elit 2 Katlı Tuvalet Kağıdı 16 Adet","Confort Tuvalet Kağıdı 16 Adet","Beyaz Güvercin Tuvalet Kağıdı 16 Adet"], category:"toilet16", must:["tuvalet","kağıdı"], acceptAny:["16 adet","16'lı","16 lı"], brandAny:["blume","elit","confort","beyaz güvercin"], requireAny:["2 kat","2 katlı","2 katli","çift kat","cift kat","tuvalet kağıdı 16"], ban:["solo","aqua","softy","bambu","geri dönüşüm","geri donusum","havlu","peçete","mendil","40 adet","40'lı"]},

  {group:"Temizlik", label:"2 Katlı Kağıt Havlu 6 Adet", keywords:["Blume Kağıt Havlu 6 Adet","Mistral 2 Katlı Kağıt Havlu 6 Adet","Elit 2 Katlı Kağıt Havlu 6 Adet","Confort Kağıt Havlu 6 Adet"], category:"paper_towel6", must:["havlu"], acceptAny:["6 adet","6'lı","6 lı"], brandAny:["blume","mistral","elit","confort"], ban:["wells","peros","solo","aqua","softy","tuvalet","peçete","mendil","geri dönüşüm","geri donusum","geri dönüşümlü","geri donusumlu","recycled"]},

  {group:"Temizlik", label:"Bulaşık Makinesi Kapsülü 30-32 Adet", keywords:["Asperox Diamond Sparx Bulaşık Makinesi Kapsülü 30 Adet","Bingo Promax Bulaşık Makinesi Kapsülü 32 Adet"], category:"dish_capsule", must:["bulaşık","kapsül"], acceptAny:["30 adet","32 adet","30'lu","32'li"], brandAny:["asperox","bingo"], ban:["renax","finish","fairy","pril","elde","sıvı","jel","parlatıcı"]},

  {group:"Temizlik", label:"Renkliler Toz Deterjan 5 kg", keywords:["Elit Matik Toz Deterjan Renkliler 5 Kg","Billmatik Renkliler Toz Deterjan 5 Kg"], category:"detergent_color5", must:["toz","deterjan"], acceptAny:["5 kg","5000 gr","5.000 gr"], brandAny:["elit","billmatik"], requireAny:["renkliler"], ban:["peros","omo","alo","abc","tursil","beyazlar","sıvı","kapsül","jel","1.5 kg","1,5 kg"]},
  {group:"Temizlik", label:"Beyazlar Toz Deterjan 5 kg", keywords:["Elit Matik Beyazlar Toz Deterjan 5 Kg","Billmatik Beyazlar Toz Deterjan 5 Kg"], category:"detergent_white5", must:["toz","deterjan"], acceptAny:["5 kg","5000 gr","5.000 gr"], brandAny:["elit","billmatik"], requireAny:["beyazlar"], ban:["peros","omo","alo","abc","tursil","renkliler","sıvı","kapsül","jel","1.5 kg","1,5 kg"]},

  {group:"İçecek", label:"Kızılay Sade / Doğal Maden Suyu 6x200 ml", keywords:["Kızılay Sade Maden Suyu 6x200 Ml","Kızılay Doğal Maden Suyu 6x200 Ml","kızılay maden suyu 6x200 ml","kızılay doğal maden suyu 6x200 ml","kızılay sade maden suyu 6x200 ml"], category:"mineral_water6_plain", must:["kızılay","maden suyu"], acceptAny:["6x200","6 x 200","6*200","1200 ml","1.2 l","1,2 l"], ban:["limonlu","elmalı","elmali","mandalina","karpuz","çilek","cilek","meyveli","aromalı","aromali","tekli","1 adet","200 ml tek"]},
  {group:"İçecek", label:"Kızılay Limonlu Maden Suyu 6x200 ml", keywords:["Kızılay Limonlu Maden Suyu 6x200 Ml","kızılay limonlu maden suyu 6x200 ml"], category:"mineral_water6_flavored", must:["kızılay","maden suyu","limon"], acceptAny:["6x200","6 x 200","6*200","1200 ml","1.2 l","1,2 l"], ban:["sade","doğal","dogal","mandalina","karpuz","çilek","cilek","tekli","1 adet","200 ml tek"]},
  {group:"İçecek", label:"Kızılay Mandalinalı Maden Suyu 6x200 ml", keywords:["Kızılay Maden Suyu Mandalina Aromalı 6x200 Ml","Kızılay Mandalinalı Maden Suyu 6x200 Ml","kızılay mandalina maden suyu 6x200 ml"], category:"mineral_water6_flavored", must:["kızılay","maden suyu","mandalina"], acceptAny:["6x200","6 x 200","6*200","1200 ml","1.2 l","1,2 l"], ban:["sade","doğal","dogal","limon","karpuz","çilek","cilek","tekli","1 adet","200 ml tek"]},

  {group:"Gazlı İçecek", label:"Sarıyer Kola 2.5 L", keywords:["sarıyer kola 2.5 l","sarıyer kola 2,5 l","sarıyer kola 2.5 lt","sarıyer kola 2,5 lt","sarıyer kola gazlı içecek 2.5 l","sarıyer kola gazlı içecek 2,5 lt","sariyer kola 2.5 lt"], category:"beverage_exact", must:["sarıyer","kola"], size:{value:2.5, unit:"l"}, ban:["limonata","enerji","maden suyu","soda","ayran","su"]},
  {group:"Gazlı İçecek", label:"Sarıyer Portakallı Gazoz 2.5 L", keywords:["sarıyer portakallı gazoz 2.5 l","sarıyer portakallı gazlı içecek 2.5 l","sarıyer portakallı gazoz 2,5 l"], category:"beverage_exact", must:["sarıyer","portakal"], size:{value:2.5, unit:"l"}, ban:["limonata","kola","enerji","maden suyu","soda","ayran","su"]},
  {group:"Gazlı İçecek", label:"Sarıyer Gazoz 2.5 L", keywords:["sarıyer gazoz 2.5 l","sarıyer gazlı içecek 2.5 l","sarıyer gazoz 2,5 l"], category:"beverage_exact", must:["sarıyer"], prefer:["gazoz","gazli icecek"], size:{value:2.5, unit:"l"}, ban:["limonata","portakal","kola","enerji","maden suyu","soda","ayran","su"]},
  {group:"Gazlı İçecek", label:"Pepsi Kola 330 ml", keywords:["pepsi kola 330 ml","pepsi 330 ml","pepsi kutu 330 ml","pepsi 0.33 l","pepsi 33 cl"], category:"beverage_exact", must:["pepsi"], size:{value:330, unit:"ml"}, ban:["max","zero","limonata","enerji","maden suyu","soda","ayran","su","24x","koli"]},
  {group:"Gazlı İçecek", label:"Pepsi Kola 1.5 L", keywords:["pepsi kola 1.5 l","pepsi kola 1,5 l","pepsi 1.5 l","pepsi 1,5 l","pepsi 1500 ml"], category:"beverage_exact", must:["pepsi"], size:{value:1.5, unit:"l"}, ban:["max","zero","limonata","enerji","maden suyu","soda","ayran","su"]},
  {group:"Gazlı İçecek", label:"Pepsi Kola 2.5 L", keywords:["pepsi kola 2.5 l","pepsi 2.5 l","pepsi 2,5 l"], category:"beverage_exact", must:["pepsi"], size:{value:2.5, unit:"l"}, ban:["max","zero","limonata","enerji","maden suyu","soda","ayran","su"]},
    {group:"Gazlı İçecek", label:"Yedigün Portakal 2.5 L", keywords:["yedigün portakal 2.5 l","yedigun portakal 2.5 l","yedigün gazlı içecek 2.5 l","yedigün 2,5 l","yedigün portakal 2,5 lt"], category:"beverage_exact", must:["yedigün"], prefer:["portakal","gazli icecek"], size:{value:2.5, unit:"l"}, ban:["limonata","kola","enerji","maden suyu","soda","ayran","su"]}
];

function ntr(s){return String(s||"").replaceAll("I","ı").replaceAll("İ","i").toLowerCase().replaceAll("â","a").replaceAll("î","i").replaceAll("û","u").replaceAll("ş","s").replaceAll("ğ","g").replaceAll("ü","u").replaceAll("ö","o").replaceAll("ç","c").replaceAll("ı","i");}
function marketType(name){const m=ntr(name); if(TARIM_KREDI_KEYS.some(k=>m.includes(ntr(k)))) return "tarim"; if(RIVAL_MARKETS.some(k=>m.includes(ntr(k)))) return "rival"; return "other";}
function textOfProduct(p){return ntr([p.title,p.brand,p.refinedVolumeOrWeight,p.refinedQuantityUnit,p.quantity,p.unit].join(" "));}
function hasAny(text,arr){return !arr||arr.length===0||arr.some(x=>text.includes(ntr(x)));}
function hasAll(text,arr){return !arr||arr.length===0||arr.every(x=>text.includes(ntr(x)));}
function hasNone(text,arr){return !arr||arr.length===0||!arr.some(x=>text.includes(ntr(x)));}
function sizeMatches(product,spec){
  if(spec.category==="esk_minced") return true;
  if(!spec.size&&!spec.unitOnly) return true;
  const text=textOfProduct(product).replaceAll(",",".").replace(/\s+/g," ");
  if(spec.unitOnly) return text.includes("kg")||text.includes("kilogram")||text.includes("1 kg");
  const v=spec.size.value, unit=spec.size.unit;
  if(unit==="ml"){
    const litre = v/1000;
    const cl = v/10;
    return [`${v} ml`,`${v}ml`,`${v} cc`,`${cl} cl`,`${cl}cl`,`${litre} l`,`${String(litre).replace(".",",")} l`,`${litre}lt`,`${String(litre).replace(".",",")}lt`].some(x=>text.includes(x));
  }
  if(unit==="l"){
    const s=String(v), c=s.replace(".",",");
    const ml = Math.round(v*1000), cl = Math.round(v*100);
    return [`${s} l`,`${s}lt`,`${s} lt`,`${s} litre`,`${c} l`,`${c}lt`,`${c} lt`,`${c} litre`,`${ml} ml`,`${ml}ml`,`${cl} cl`,`${cl}cl`].some(x=>text.includes(x));
  }
  if(unit==="kg"){const gram=v*1000; return [`${v} kg`,`${v}kg`,`${v}.0 kg`,`${gram} gr`,`${gram}g`,`${gram} g`,`${gram} gram`].some(x=>text.includes(x));}
  if(unit==="g") return [`${v} gr`,`${v}g`,`${v} g`,`${v} gram`].some(x=>text.includes(x));
  return true;
}
function categoryScore(product,spec){
  const text=textOfProduct(product); let score=0;
  if(spec.category==="egg"){const has30=text.includes("30")||text.includes("otuz"); const hasM=text.includes("m boy")||text.includes("53-62")||text.includes("53 62"); if(!has30)return -9999; if(hasM)score+=50; if(text.includes("turem")||text.includes("türem"))score+=80; score+=20;}
  if(spec.category==="milk_half"){if(text.includes("yarim yagli"))score+=60; else if(text.includes("sut"))score+=10;}
  if(spec.category==="esk_minced"){const isEsk=text.includes("et ve sut kurumu")||text.includes("esk"); if(isEsk)score+=80; if(text.includes("dana"))score+=20; if(text.includes("1 kg")||text.includes("1000 gr"))score+=30; if(!isEsk&&!(text.includes("1 kg")||text.includes("1000 gr")))return -9999;}
  if(spec.category==="cheese_full"){if(text.includes("tam yagli"))score+=60; else score+=10;}
  if(spec.category==="flyer"){score+=25; if(spec.prefer&&hasAny(text,spec.prefer))score+=20;}
  if(spec.category==="beverage_exact"){score+=40; if(hasAny(text,spec.prefer))score+=20;}
  if(spec.category==="toilet40_bamboo"){if(text.includes("bambu"))score+=45; if(text.includes("3 kat"))score+=25; score+=20;}
  if(spec.category==="toilet16"){if(text.includes("2 kat")||text.includes("cift kat"))score+=30; score+=20;}
  if(spec.category==="paper_towel6"){if(text.includes("2 kat"))score+=20; score+=25;}
  if(spec.category==="dish_capsule"){if(text.includes("asperox")||text.includes("bingo"))score+=35; score+=25;}
  if(spec.category==="detergent_color5"){if(text.includes("renkliler"))score+=45; score+=20;}
  if(spec.category==="detergent_white5"){if(text.includes("beyazlar"))score+=45; score+=20;}
  if(spec.category==="icecream"){score+=35; if(text.includes("dondurma"))score+=35;}
if(spec.category==="mineral_water6_plain"||spec.category==="mineral_water6_flavored"){if(text.includes("kizilay"))score+=40; if(text.includes("6x200")||text.includes("6 x 200")||text.includes("1200 ml"))score+=35; score+=20;}
  if(spec.category==="tea"){if(text.includes("siyah"))score+=25; if(text.includes("rize"))score+=10;}
  if(spec.category==="produce"){if(text.includes("pembe"))score+=40; score+=20;}
  return score;
}
function scoreProduct(product,spec){
  const text=textOfProduct(product);
  if(!hasAll(text,spec.must))return -9999;
  if(!hasNone(text,spec.ban))return -9999;
  if(spec.prefer && !hasAny(text,spec.prefer)) return -9999;
  if(spec.acceptAny&&!hasAny(text,spec.acceptAny))return -9999;
  if(spec.requireAny&&!hasAny(text,spec.requireAny))return -9999;
  if(spec.brandAny&&!hasAny(text,spec.brandAny))return -9999;
  if(!sizeMatches(product,spec))return -9999;
  const cat=categoryScore(product,spec); if(cat<0)return -9999;
  let score=cat;
  for(const m of spec.must||[]) if(text.includes(ntr(m)))score+=20;
  for(const a of spec.acceptAny||[]) if(text.includes(ntr(a)))score+=10;
  if(spec.size)score+=25; if(spec.unitOnly)score+=15;
  for(const w of ntr(spec.label).split(/\s+/).filter(w=>w.length>2)) if(text.includes(w))score+=2;
  return score;
}
async function apiPost(path,payload){const res=await fetch(API_BASE+path,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","User-Agent":"ARTS-Vercel-Pilot/51.0"},body:JSON.stringify(payload)}); if(!res.ok) throw new Error(`Market Fiyatı API hata: ${res.status}`); return await res.json();}
async function getNearestDepotsAt(latitude,longitude,distance){
  const depots=await apiPost("/api/v2/nearest",{latitude,longitude,distance});
  const list=Array.isArray(depots)?depots:[];
  const marketNames=[...new Set(list.map(d=>d.marketName||d.sellerName||d.name||d.depotName).filter(Boolean))];
  return {depots:list,marketNames};
}
async function getNearestDepots(){const depots=await apiPost("/api/v2/nearest",{latitude:LATITUDE,longitude:LONGITUDE,distance:DISTANCE_KM}); const list=Array.isArray(depots)?depots:[]; const marketNames=[...new Set(list.map(d=>d.marketName||d.sellerName||d.name||d.depotName).filter(Boolean))]; return {depots:list,marketNames};}
async function searchProduct(spec,depotIds,opts={}){
  const all=[]; const keywords=spec.keywords||[spec.keyword];
  for(const keyword of keywords){
    const data=await apiPost("/api/v2/search",{keywords:keyword,pages:0,size:150,latitude:opts.latitude??LATITUDE,longitude:opts.longitude??LONGITUDE,distance:opts.distance??DISTANCE_KM,depots:opts.depots??[]});
    const products=Array.isArray(data?.content)?data.content:[];
    for(const p of products){
      const score=scoreProduct(p,spec); if(score<0)continue;
      for(const info of (p.productDepotInfoList||[])){
        const marketName=info.marketAdi||info.depotName||""; const type=marketType(marketName); if(type==="other")continue;
        const price=Number(info.price); if(!Number.isFinite(price))continue; if(spec.minPrice&&price<spec.minPrice)continue;
        all.push({
          group:spec.group,
          target:spec.label,
          title:p.title||"",
          brand:p.brand||"",
          quantity:p.refinedVolumeOrWeight||p.refinedQuantityUnit||"",
          imageUrl:p.imageUrl||p.image||p.imagePath||p.pictureUrl||p.productImageUrl||p.thumbnail||"",
          productId:p.id||p.productId||p.gtin||"",
          market:marketName,
          depot:info.depotName||"",
          marketType:type,
          price,
          unitPrice:info.unitPrice||"",
          indexTime:info.indexTime||"",
          score,
          keyword
        });
      }
    }
  }
  const seen=new Map();
  for(const c of all){const key=[c.title,c.market,c.price].join("|"); if(!seen.has(key)||seen.get(key).score<c.score)seen.set(key,c);}
  return [...seen.values()].sort((a,b)=>a.price-b.price||b.score-a.score);
}
function bestOf(arr){return(!arr||arr.length===0)?null:[...arr].sort((a,b)=>a.price-b.price||b.score-a.score)[0];}
function makeGroupSummary(results){const map={}; for(const x of results){const g=x.group||"Diğer"; if(!map[g])map[g]={group:g,total:0,tarimExpensive:0,tarimCheaper:0,equal:0,noTarim:0,incomplete:0}; map[g].total++; if(x.comparison==="tarim_expensive")map[g].tarimExpensive++; else if(x.comparison==="tarim_cheaper")map[g].tarimCheaper++; else if(x.comparison==="equal")map[g].equal++; else if(x.comparison==="no_tarim")map[g].noTarim++; else map[g].incomplete++;} return Object.values(map);}
export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*"); res.setHeader("Access-Control-Allow-Methods","GET,OPTIONS"); res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS")return res.status(200).end();
  try{
    const depotResult=await getNearestDepots(); const depotIds=depotResult.depots.map(d=>d.id).filter(Boolean); const results=[];
    for(const spec of PRODUCTS){
      const item={group:spec.group,target:spec.label,keyword:(spec.keywords||[spec.keyword]).join(" / "),tarim:null,rival:null,best:null,alternatives:[],status:"not_found",comparison:"unknown",difference:null};
      try{
        let found=await searchProduct(spec,depotIds);

        // v29 özel düzeltme:
        // Türkiye geneli aramada API bazen Tarım Kredi Türem yumurtayı döndürmüyor.
        // Yumurta için Tarım Kredi bulunamazsa Sakarya/Adapazarı odaklı ek arama yapılır.
        if(spec.category==="egg" && !found.some(x=>x.marketType==="tarim")){
          const eggFallbackSpec = {
            ...spec,
            keywords:[
              "Türem Yumurta M Boy 30 Adet",
              "Turem Yumurta M Boy 30 Adet",
              "Türem Yumurta 53-62 Gr 30 Adet",
              "Türem Yumurta 30 Adet",
              "Türem Yumurta",
              "türem yumurta",
              "yumurta 53-62 gr 30 adet"
            ],
            must:["yumurta"],
            prefer:["türem","turem","m boy","53-62"],
            ban:["keskinoğlu","keskinoglu","anadolu çiftliği","anadolu ciftligi","çikolata","sürpriz","kinder","oyuncak","sakız","bisküvi","gofret","çikolatalı","6 adet","10 adet","15 adet"]
          };

          // 1) Sakarya koordinatlı geniş arama
          let fallbackFound = await searchProduct(eggFallbackSpec,depotIds,{
            latitude:SAKARYA_LATITUDE,
            longitude:SAKARYA_LONGITUDE,
            distance:SAKARYA_DISTANCE_KM,
            depots:[]
          });

          // 2) Eğer yine Tarım Kredi yoksa Sakarya çevresindeki gerçek depo ID'leriyle tekrar dene
          if(!fallbackFound.some(x=>x.marketType==="tarim")){
            try{
              const sakaryaDepotResult = await getNearestDepotsAt(SAKARYA_LATITUDE,SAKARYA_LONGITUDE,SAKARYA_DISTANCE_KM);
              const sakaryaDepotIds = sakaryaDepotResult.depots.map(d=>d.id).filter(Boolean);
              const depotFallback = await searchProduct(eggFallbackSpec,sakaryaDepotIds,{
                latitude:SAKARYA_LATITUDE,
                longitude:SAKARYA_LONGITUDE,
                distance:SAKARYA_DISTANCE_KM,
                depots:sakaryaDepotIds
              });
              fallbackFound = [...depotFallback, ...fallbackFound];
            }catch(e){}
          }

          found = [...fallbackFound.filter(x=>x.marketType==="tarim"), ...found];
        }

        item.alternatives=found.slice(0,20); item.tarim=bestOf(found.filter(x=>x.marketType==="tarim")); item.rival=bestOf(found.filter(x=>x.marketType==="rival")); item.best=bestOf(found);
        const imageCandidate = item.tarim || item.best || item.rival || found.find(x=>x.imageUrl);
        item.imageUrl = imageCandidate?.imageUrl || "";
        item.imageSource = item.tarim?.imageUrl ? "tarim" : (item.rival?.imageUrl ? "rival" : "fallback");
        if(item.tarim||item.rival){item.status="ok"; if(item.tarim&&item.rival){item.difference=Math.round((item.tarim.price-item.rival.price)*100)/100; if(item.difference>0)item.comparison="tarim_expensive"; else if(item.difference<0)item.comparison="tarim_cheaper"; else item.comparison="equal";}else if(item.tarim&&!item.rival)item.comparison="only_tarim"; else if(!item.tarim&&item.rival)item.comparison="no_tarim";}
      }catch(e){item.status="error"; item.error=e.message;}
      results.push(item);
    }
    const disadvantageCount=results.filter(x=>x.comparison==="tarim_expensive").length; const advantageCount=results.filter(x=>["tarim_cheaper","equal","only_tarim"].includes(x.comparison)).length;
    return res.status(200).json({checkedAt:new Date().toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"}),location:"Sakarya / Adapazarı",depotCount:depotIds.length,marketNames:depotResult.marketNames,results,groupSummary:makeGroupSummary(results),summary:{productCount:PRODUCTS.length,disadvantageCount,advantageCount,changedCount:0}});
  }catch(e){return res.status(500).json({error:e.message});}
}
