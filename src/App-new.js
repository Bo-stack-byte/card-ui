
import './App.css';

// Visualizer v0.11

import React, { useEffect, useState } from 'react';


const unsafeImagesContext = require.context('./cards/', true, /\.png$/);
const imagesContext = (_cardname) => {
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
    console.log("Xxx");
    console.log(text);
    console.log(ess_text);
    let eff_arrays = text.match(/.{1,40}/g) || []
    let ess_arrays = ess_text.match(/.{1,40}/g) || []
    console.log(eff_arrays);
    console.log(ess_arrays);

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

const initialData2 = {
  "status": {
    "last_id": 44,
    "turn_player": 1,
    "n_turn": 5,
    "phase": "MAIN",
    "memory": 2,
    "control": 1,
    "gamestep": "NORMAL_PLAY",
    "step_text": "NORMAL_PLAY",
    "ver": "c8d26d3c-d4c7-47e0-b7bf-ba9ea582ce91"
  },
  "instances": [
    null,
    {
      "id": 1,
      "label": "Xxx",
      "name": "Bakemon",
      "colors": "PURPLE",
      "dp": 5000,
      "level": 4,
      "suspended": false,
      "stack": [
        "ST16-01@PURPLE",
        "ST16-03@PURPLE",
        "ST16-06@PURPLE"
      ],
      "sa": 1,
      "loc": 4,
      "location": "FIELD",
      "summary": "<span class=status>CAN_ATK</span> <span class=keyword>&lt;Blocker&gt;</span> 5K "
    },
    {
      "id": 2,
      "label": "Xxx",
      "name": "Fluffymon",
      "colors": "GREEN",
      "dp": null,
      "level": 2,
      "suspended": false,
      "stack": [
        "ST18-01@GREEN"
      ],
      "sa": 1,
      "loc": 32,
      "location": "EGGZONE",
      "summary": ""
    },
    {
      "id": 3,
      "label": "Yyy",
      "name": "Galemon",
      "colors": "GREEN",
      "dp": 6000,
      "level": 4,
      "suspended": false,
      "stack": [
        "ST18-02@GREEN,RED",
        "ST18-08@GREEN"
      ],
      "sa": 1,
      "loc": 4,
      "location": "FIELD",
      "summary": "<span class=status>CAN_ATK</span> 6K "
    },
    {
      "id": 4,
      "label": "Yyy",
      "name": "Gotsumon",
      "colors": "PURPLE",
      "dp": 4000,
      "level": 3,
      "suspended": false,
      "stack": [
        "ST16-05@PURPLE"
      ],
      "sa": 1,
      "loc": 4,
      "location": "FIELD",
      "summary": "<span class=status>CAN_ATK</span> 4K "
    },
    {
      "id": 5,
      "label": "Yyy",
      "name": "Kiwimon",
      "colors": "GREEN",
      "dp": 3000,
      "level": 4,
      "suspended": false,
      "stack": [
        "ST18-06@GREEN"
      ],
      "sa": 1,
      "loc": 4,
      "location": "FIELD",
      "summary": "<span class=status>CAN_ATK</span> 3K "
    },
    {
      "id": 6,
      "label": "Xxx",
      "name": "Gotsumon",
      "colors": "PURPLE",
      "dp": 4000,
      "level": 3,
      "suspended": false,
      "stack": [
        "ST16-01@PURPLE",
        "ST16-05@PURPLE"
      ],
      "sa": 1,
      "loc": 32,
      "location": "EGGZONE",
      "summary": "4K "
    }
  ],
  "p1": {
    "moves": [
      {
        "command": "json",
        "text": "REFRESH",
        "ver": "da950f41-edd3-4add-9d97-cd98bef5e2f0",
        "last_id": 44
      },
      {
        "command": "EVOLVE 0 1 3",
        "text": "Evolve Lv.5 Mammothmon onto Bakemon (3)",
        "ver": "5d935c3c-053b-40aa-8fc4-afeef2a5679a"
      },
      {
        "command": "EVOLVE 5 6 2",
        "text": "Evolve Lv.4 Piercemon onto Gotsumon (2)",
        "ver": "7420d51f-8919-4f41-b0b7-39a1fc49bbb1"
      },
      {
        "command": "EVOLVE 5 4 2",
        "text": "Evolve Lv.4 Piercemon onto Gotsumon (2)",
        "ver": "b2b5f8d8-5bb6-4b79-90f7-bb75c3312e46"
      },
      {
        "command": "PLAY 0",
        "text": "Play Mammothmon",
        "ver": "15f7b13c-40b8-448f-8954-0556cf753e87"
      },
      {
        "command": "PLAY 1",
        "text": "Play SkullMammothmon",
        "ver": "ae9ead23-2c60-4812-9bef-9b279347bf99"
      },
      {
        "command": "PLAY 2",
        "text": "Play SkullMammothmon",
        "ver": "ad80bcb5-3bf7-4024-9b78-cedf70ce4c2f"
      },
      {
        "command": "PLAY 3",
        "text": "Use Lament of Friendship",
        "ver": "63e35291-b8d9-4bf2-b229-16382a84ec15"
      },
      {
        "command": "PLAY 4",
        "text": "Use Baldy Blow",
        "ver": "2df73772-577d-4453-a012-2abb9e2fdcc9"
      },
      {
        "command": "PLAY 5",
        "text": "Play Piercemon",
        "ver": "4801aa4b-d8fa-4ac2-a432-b6417265819c"
      },
      {
        "command": "ATTACK 1 0",
        "text": "Attack Bakemon into player",
        "ver": "9aed7879-482b-494f-9201-570f4d318dc7"
      },
      {
        "command": "ATTACK 4 0",
        "text": "Attack Gotsumon into player",
        "ver": "a9d3a67f-ea78-46d1-9960-9df992a55b8d"
      },
      {
        "command": "NEXT",
        "text": "PASS TURN",
        "ver": "6135ec33-e369-49ab-bc76-7cc7bb9abd89"
      }
    ],
    "eggzone": {
      "id": 6,
      "label": "Xxx",
      "name": "Gotsumon",
      "colors": "PURPLE",
      "dp": 4000,
      "level": 3,
      "suspended": false,
      "stack": [
        "ST16-01@PURPLE",
        "ST16-05@PURPLE"
      ],
      "sa": 1,
      "loc": 32,
      "location": "EGGZONE",
      "summary": "4K "
    },
    "field": [
      {
        "id": 1,
        "label": "Xxx",
        "name": "Bakemon",
        "colors": "PURPLE",
        "dp": 5000,
        "level": 4,
        "suspended": false,
        "stack": [
          "ST16-01@PURPLE",
          "ST16-03@PURPLE",
          "ST16-06@PURPLE"
        ],
        "sa": 1,
        "loc": 4,
        "location": "FIELD",
        "summary": "<span class=status>CAN_ATK</span> <span class=keyword>&lt;Blocker&gt;</span> 5K "
      },
      {
        "id": 4,
        "label": "Yyy",
        "name": "Gotsumon",
        "colors": "PURPLE",
        "dp": 4000,
        "level": 3,
        "suspended": false,
        "stack": [
          "ST16-05@PURPLE"
        ],
        "sa": 1,
        "loc": 4,
        "location": "FIELD",
        "summary": "<span class=status>CAN_ATK</span> 4K "
      }
    ],
    "hand": {
      "count": 12,
      "cards": [
        "ST16-10@PURPLE",
        "ST16-13@PURPLE",
        "ST16-13@PURPLE",
        "ST16-15@PURPLE",
        "ST16-16@PURPLE",
        "ST16-17@PURPLE",
        "ST16-10@PURPLE",
        "ST16-13@PURPLE",
        "ST16-13@PURPLE",
        "ST16-15@PURPLE",
        "ST16-16@PURPLE",
        "ST16-17@PURPLE"
      ]
    },
    "security": {
      "count": 5
    },
    "eggs": {
      "count": 2
    },
    "deck": {
      "count": 35
    },
    "trash": [],
    "reveal": {
      "count": 0,
      "cards": []
    },
    "card_data": {
      "ST16-01": {
        "name": "Tsunomon",
        "level": 2,
        "colors": "PURPLE",
        "dp": null,
        "type": "EGG",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "evo_cost": -1
      },
      "ST16-05": {
        "name": "Gotsumon",
        "level": 3,
        "colors": "PURPLE",
        "dp": 4000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 4,
        "evo_cost": 0
      },
      "ST16-03": {
        "name": "Gabumon",
        "level": 3,
        "colors": "PURPLE",
        "dp": 1000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 3,
        "evo_cost": 0
      },
      "ST16-06": {
        "name": "Bakemon",
        "level": 4,
        "colors": "PURPLE",
        "dp": 5000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 4,
        "evo_cost": 2
      },
      "ST18-01": {
        "name": "Fluffymon",
        "level": 2,
        "colors": "GREEN",
        "dp": null,
        "type": "Digi-Egg",
        "effect": "-",
        "ess": "[When Attacking] [Once Per Turn] You may suspend 1 other Monster with DP less than or equal to this Monster.",
        "evo_cost": -1
      },
      "ST18-02": {
        "name": "Biyomon",
        "level": 3,
        "colors": "GREEN,RED",
        "dp": 3000,
        "type": "Monster",
        "effect": "＜Fortitude＞ (When this Monster with evolution cards is deleted, play this card without paying the cost).",
        "ess": "-",
        "cost": 3,
        "evo_cost": 1
      },
      "ST18-08": {
        "name": "Galemon",
        "level": 4,
        "colors": "GREEN",
        "dp": 6000,
        "type": "Monster",
        "effect": "[Security] You may play 1 card with the [LIBERATOR] trait and a play cost of 4 or less from your hand or trash without paying the cost.\n＜Vortex＞.",
        "ess": "[Your Turn] This Monster gets +2000 DP.",
        "sec": "[Security] You may play 1 card with the [LIBERATOR] trait and a play cost of 4 or less from your hand or trash without paying the cost.",
        "cost": 6,
        "evo_cost": 2
      },
      "ST18-06": {
        "name": "Kiwimon",
        "level": 4,
        "colors": "GREEN",
        "dp": 3000,
        "type": "Monster",
        "effect": "[On Play] [On Deletion] Suspend 1 of your opponent's Monster.\n[Rule] Trait: Has the [Vegetation] type.",
        "ess": "-",
        "cost": 3,
        "evo_cost": 2
      },
      "ST16-10": {
        "name": "Mammothmon",
        "level": 5,
        "colors": "PURPLE",
        "dp": 7000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 7,
        "evo_cost": 3
      },
      "ST16-13": {
        "name": "SkullMammothmon",
        "level": 6,
        "colors": "PURPLE",
        "dp": 12000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 11,
        "evo_cost": 4
      },
      "ST16-15": {
        "name": "Lament of Friendship",
        "level": null,
        "colors": "PURPLE",
        "dp": null,
        "type": "OPTION",
        "effect": "err",
        "ess": "err",
        "sec": "[Security] Activate this card's [Main] effect.",
        "cost": 3,
        "evo_cost": -1
      },
      "ST16-16": {
        "name": "Baldy Blow",
        "level": null,
        "colors": "PURPLE",
        "dp": null,
        "type": "OPTION",
        "effect": "err",
        "ess": "err",
        "sec": "[Security] Activate this card's [Main] effect.",
        "cost": 4,
        "evo_cost": -1
      },
      "ST16-17": {
        "name": "Piercemon",
        "level": 4,
        "colors": "PURPLE",
        "dp": 5000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 6,
        "evo_cost": 2
      }
    }
  },
  "p2": {
    "moves": null,
    "eggzone": {
      "id": 2,
      "label": "Xxx",
      "name": "Fluffymon",
      "colors": "GREEN",
      "dp": null,
      "level": 2,
      "suspended": false,
      "stack": [
        "ST18-01@GREEN"
      ],
      "sa": 1,
      "loc": 32,
      "location": "EGGZONE",
      "summary": ""
    },
    "field": [
      {
        "id": 3,
        "label": "Yyy",
        "name": "Galemon",
        "colors": "GREEN",
        "dp": 6000,
        "level": 4,
        "suspended": false,
        "stack": [
          "ST18-02@GREEN,RED",
          "ST18-08@GREEN"
        ],
        "sa": 1,
        "loc": 4,
        "location": "FIELD",
        "summary": "<span class=status>CAN_ATK</span> 6K "
      },
      {
        "id": 5,
        "label": "Yyy",
        "name": "Kiwimon",
        "colors": "GREEN",
        "dp": 3000,
        "level": 4,
        "suspended": false,
        "stack": [
          "ST18-06@GREEN"
        ],
        "sa": 1,
        "loc": 4,
        "location": "FIELD",
        "summary": "<span class=status>CAN_ATK</span> 3K "
      }
    ],
    "hand": {
      "count": 5
    },
    "security": {
      "count": 5
    },
    "eggs": {
      "count": 3
    },
    "deck": {
      "count": 37
    },
    "trash": [],
    "reveal": {
      "count": 0,
      "cards": []
    },
    "card_data": {
      "ST16-01": {
        "name": "Tsunomon",
        "level": 2,
        "colors": "PURPLE",
        "dp": null,
        "type": "EGG",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "evo_cost": -1
      },
      "ST16-05": {
        "name": "Gotsumon",
        "level": 3,
        "colors": "PURPLE",
        "dp": 4000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 4,
        "evo_cost": 0
      },
      "ST16-03": {
        "name": "Gabumon",
        "level": 3,
        "colors": "PURPLE",
        "dp": 1000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 3,
        "evo_cost": 0
      },
      "ST16-06": {
        "name": "Bakemon",
        "level": 4,
        "colors": "PURPLE",
        "dp": 5000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 4,
        "evo_cost": 2
      },
      "ST18-01": {
        "name": "Fluffymon",
        "level": 2,
        "colors": "GREEN",
        "dp": null,
        "type": "Digi-Egg",
        "effect": "-",
        "ess": "[When Attacking] [Once Per Turn] You may suspend 1 other Monster with DP less than or equal to this Monster.",
        "evo_cost": -1
      },
      "ST18-02": {
        "name": "Biyomon",
        "level": 3,
        "colors": "GREEN,RED",
        "dp": 3000,
        "type": "Monster",
        "effect": "＜Fortitude＞ (When this Monster with evolution cards is deleted, play this card without paying the cost).",
        "ess": "-",
        "cost": 3,
        "evo_cost": 1
      },
      "ST18-08": {
        "name": "Galemon",
        "level": 4,
        "colors": "GREEN",
        "dp": 6000,
        "type": "Monster",
        "effect": "[Security] You may play 1 card with the [LIBERATOR] trait and a play cost of 4 or less from your hand or trash without paying the cost.\n＜Vortex＞.",
        "ess": "[Your Turn] This Monster gets +2000 DP.",
        "sec": "[Security] You may play 1 card with the [LIBERATOR] trait and a play cost of 4 or less from your hand or trash without paying the cost.",
        "cost": 6,
        "evo_cost": 2
      },
      "ST18-06": {
        "name": "Kiwimon",
        "level": 4,
        "colors": "GREEN",
        "dp": 3000,
        "type": "Monster",
        "effect": "[On Play] [On Deletion] Suspend 1 of your opponent's Monster.\n[Rule] Trait: Has the [Vegetation] type.",
        "ess": "-",
        "cost": 3,
        "evo_cost": 2
      },
      "ST16-10": {
        "name": "Mammothmon",
        "level": 5,
        "colors": "PURPLE",
        "dp": 7000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 7,
        "evo_cost": 3
      },
      "ST16-13": {
        "name": "SkullMammothmon",
        "level": 6,
        "colors": "PURPLE",
        "dp": 12000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 11,
        "evo_cost": 4
      },
      "ST16-15": {
        "name": "Lament of Friendship",
        "level": null,
        "colors": "PURPLE",
        "dp": null,
        "type": "OPTION",
        "effect": "err",
        "ess": "err",
        "sec": "[Security] Activate this card's [Main] effect.",
        "cost": 3,
        "evo_cost": -1
      },
      "ST16-16": {
        "name": "Baldy Blow",
        "level": null,
        "colors": "PURPLE",
        "dp": null,
        "type": "OPTION",
        "effect": "err",
        "ess": "err",
        "sec": "[Security] Activate this card's [Main] effect.",
        "cost": 4,
        "evo_cost": -1
      },
      "ST16-17": {
        "name": "Piercemon",
        "level": 4,
        "colors": "PURPLE",
        "dp": 5000,
        "type": "MONSTER",
        "effect": "err",
        "ess": "err",
        "sec": "",
        "cost": 6,
        "evo_cost": 2
      }
    }
  },
  "temp_zones": []
}


const initialData = {
  status: {},
  instances: {},
  p1: {
    card_data: {},
    deck: 0,
    eggs: 0,
    eggzone: [],
    field: [],
    security: 0,
    "hand": {
      "count": 12,
      "cards": [
        "ST15-10@PURPLE",
        "ST15-13@PURPLE",
        "ST15-13@PURPLE",
        "ST15-15@PURPLE",
        "ST16-16@PURPLE",
        "ST16-17@PURPLE",
        "ST16-10@PURPLE",
        "ST16-13@PURPLE",
        "ST16-13@PURPLE",
        "ST16-15@PURPLE",
        "ST15-16@PURPLE",
        "ST16-17@PURPLE"
      ]
    },


    trash: []
  },
  p2: {
    card_data: {},
    deck: { "count": 2},
    eggs: { "count": 2},
    eggzone: { "id": 6, "label": "Xxx", "name": "Gotsumon", "colors": "PURPLE", "dp": 4000, "level": 3, "suspended": false, "stack": ["ST16-01@PURPLE", "ST16-05@PURPLE"], "sa": 1, "loc": 32, "location": "EGGZONE", "summary": "4K " },

    field: [],
    security: 0,
    updatehisone: 1,
    "hand": {
      "count": 12,
      "cards": [
        "ST17-10@PURPLE",
        "ST15-13@PURPLE",
        "ST15-13@PURPLE",
        "ST16-15@PURPLE",
        "ST16-16@PURPLE",
        "ST16-17@PURPLE",
        "ST16-10@PURPLE",
        "ST16-13@PURPLE",
        "ST16-13@PURPLE",
        "ST16-15@PURPLE",
        "ST15-16@PURPLE",
        "ST15-17@PURPLE"
      ]
    },

    trash: [ ]
  }
}


const App = () => {
  const [data] = useState(initialData);

  return (
    <div className="game-field">
      <PlayerArea player={data.p2} className="bottom" />
    </div>
  );
};

const PlayerArea = ({ player, className }) => {
  console.log(player.eggzone);
  /*
        <Pile x={-60} y={-200} pilelength={player.eggs} card="eggback" />
      <Pile x={800} y={-200} pilelength={player.trash} />
      <Pile x={800} y={-400} pilelength={player.deck} card="back" />
      <Trash trash={player.trash} />

      */
  return (
    <div className={`player-area ${className}`}>
      <Deck deck={player.deck} />
      <EggZone eggzone={player.eggzone} x={45} y={-180} />
      <Field field={player.field} />
      <Hand hand={player.hand} />
      <Security security={player.security} />
    </div>
  );
}

const Deck = ({ deck }) => <div className="deck">Deck: {deck}</div>;
// stacked pile
// face down
const Pile = ( { pile, x, y, card }) => {
//     <div className="text-overlay" value={"SIZE: " + pile.length}  />                                    
  

  if (!pile || pile.length == 0) { return (<hr/>); }
    //         <Card key={index} card={card} x={45} y={-180 - index*30} z={index} style={{ top: '80%', left: `${10 + index * 15}%` }} />
  let index = 1;
  return (
    <Card card={card} x={x} y={y} z="1" overlay={pile.length + " cards"} style={{ top: '80%', left: `${10 + index * 15}%` }} />
  );
}
const EggZone = ({ eggzone, x, y  }) => {

  if (!eggzone) return ( <hr/> );
  return (
    <div className="eggzone">
      {eggzone.stack.map((card, index) => (
        <Card key={index} card={card} x={x} y={y - index*30} z={index} style={{ top: '80%', left: `${10 + index * 15}%` }} />
      ))}
    </div>);

};
const Field = ({ field }) => (
  <div className="field">
    {field.map((instance, index) => (
      <div className="field-instance" key={index}>
        {instance.map((card, cardIndex) => (
          <Card key={cardIndex} card={card} style={{ top: '20%', left: `${index * 15}%` }} />
        ))}
      </div>
    ))}
  </div>
);

// for scaling
function x(x) { return x; }
function y(y) { return y; }


const Hand = ({ hand }) => {
  return (
    <div className="hand">
      {hand.cards.map((card, index) => (
        <Card key={index} card={card} x={x(100 + 50 * index)} y={y(-40)} />
      ))}
    </div>
  );
};

const Card = ({ card, x, y, z }) => {
  return (
    <img
      src={imagesContext(card)}
      alt={card}
      className="card"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: z
      }}
    />
  );
};




const Trash = ({ trash }) => (
  <div className="trash">
    {trash.map((card, index) => (
      <Card key={index} card={card} style={{ top: '70%', left: `${index * 15}%` }} />
    ))}
  </div>
);
const Security = ({ security }) => <div className="security">Security: {security}</div>;



export default App;
