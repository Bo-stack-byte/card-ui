const unsafeImagesContext = require.context('./cards/', true, /\.png$/);


export const imagesContext = (_cardname) => {
  if (_cardname == "eggback") return unsafeImagesContext("./eggback.png");
  if (_cardname == "back") return unsafeImagesContext("./back.png");

  let [cardname, s_colors] = _cardname.split("@");
  s_colors ||= "ORANGE"
  let colors = s_colors.split(",");
  colors ||= ["orange"]
  let color1 = colors[0];
  let color2 = colors[1] || colors[0];

  try {
    return unsafeImagesContext(`./fd-${cardname}.png`);
  } catch (error) {
    let name = cardname;
    let info = document && document.card_data[cardname];
    let dp = "";
    let cost = "";
    let atk = "";
    let text = "";
    let lv = "";
    let ess_text = "";
    if (info) {
      name = info.name;
      dp = info.dp ? info.dp : "";
      cost = info.cost ? info.cost : "";
      text = info.effect;
      ess_text = info.ess ? info.ess : "";
      lv = info.level ? "Lv." + info.level : "";
    }
    let eff_arrays = text.match(/.{1,40}/g) || []
    let ess_arrays = ess_text.match(/.{1,40}/g) || []

    return 'data:image/svg+xml,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="40%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="60%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="200" height="300" style="fill:url(#grad1);stroke-width:3;stroke:rgb(0,0,0)" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" stroke="black" font-size="50">
      ${name}
    </text>
    <text x="10" y="200" dominant-baseline="middle" fill="BLACK" stroke="black" font-size="30" font-family="Arial, Helvetica, sans-serif">
      ${lv}
    </text>
    <text x="10" y="40" fill="black" stroke="white" font-size="50" font-family="Arial, Helvetica, sans-serif">
      ${cost}
    </text>
    <text x="190" y="40" stroke-width="2" text-anchor="end" fill="WHITE" stroke="BLACK" font-size="40" font-family="Arial, Helvetica, sans-serif">
      ${dp}
    </text>
    <line x1="0" y1="260" x2="200" y2="260" style="stroke:white; stroke-width: 100"/>    
    <line x1="0" y1="260" x2="200" y2="260" style="stroke:black; stroke-width: 1"/>    
  
    <text x="10" y="240" fill="white" stroke="black" font-size="10" font-family="Arial, Helvetica, sans-serif">
      ${eff_arrays[0]}
    </text>
    <text x="10" y="250" fill="white" stroke="black" font-size="10" font-family="Arial, Helvetica, sans-serif">
      ${eff_arrays[1] || ""}
    </text>
    <text x="10" y="260" fill="white" stroke="black" font-size="10" font-family="Arial, Helvetica, sans-serif">
      ${eff_arrays[2] || ""}
    </text>
    <text x="10" y="270" fill="white" stroke="black" font-size="10" font-family="Arial, Helvetica, sans-serif">
      ${ess_arrays[0]}
    </text>
    <text x="10" y="280" fill="white" stroke="black" font-size="10" font-family="Arial, Helvetica, sans-serif">
      ${ess_arrays[1] || ""}
    </text>
    <text x="10" y="290" fill="white" stroke="black" font-size="10" font-family="Arial, Helvetica, sans-serif">
      ${ess_arrays[2] || ""}
    </text>
  
  
    </svg>
  
      `);
  }
};

export default imagesContext;
