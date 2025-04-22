
// import './App.css';
import { v4 as uuidv4 } from 'uuid';
import imagesContext from "./util";
import io from 'socket.io-client';
import React, {
  useEffect, useState,
  createContext, useContext,
  useRef
} from 'react';
import { StatusWindow, populate_tree } from './StatusWindow';
import Counter from './Counter';
import Draggable from 'react-draggable';
import ClickableDraggable from './ClickableDraggable';
import LogDisplay from './LogDisplay';
import CardModal from './CardModal';
import RecursiveMenu from './RecursiveMenu';
import { motion } from 'framer-motion';

// Visualizer v0.8.0   improved buttons
// Visualizer v0.7.6   link questions on cards
// Visualizer v0.7.5   change layout of ESS and plugged cards
// Visualizer v0.7.4.4 roll-up of bugs
// Visualizer v0.7.4.3.2 handle future UI update
// Visualizer v0.7.4.2 more images
// Visualizer v0.7.4.1 highlighted text
// Visualizer v0.7.3   goofy trash view
// Visualizer v0.7.2   animation
// Visualizer v0.7.1   plugged cards 
// Visualizer v0.7.0.x better background and image, link effects, bugs
// Visualizer v0.6.5 more cards and option pop-ups
// Visualizer v0.6.4 effect chooser pop-up
// Visualizer v0.6.3 pop-over on test cases
// Visualizer v0.6.2.1 better context menus
// Visualizer v0.6.1 show search
// Visualizer v0.6.0 context menus
// Visualizer v0.5.10 both log windows start fixed but are draggable *AND* scrollable
// Visualizer v0.5.9 prepare for better UI, more card images
// Visualizer v0.5.8 show off creative mode, with warnings
// Visualizer v0.5.7 include ST19
// Visualizer v0.5.6 proper orientation on both parts?
// Visualizer v0.5.5 more overlay attempts
// Visualizer v0.5.4 fixing overlay, more tokens
// Visualizer v0.5.3 proper modal overlay
// Visualizer v0.5.2 better game init
// Visualizer v0.5.1 log window scrolls

export const FormContext = createContext();

const params = new URLSearchParams(window.location.search);
let _pid = params.get("pid");
let _gid = params.get("gid");

export const FormProvider = ({ children }) => {
  const [formState, setFormState] = useState({
    gid: _gid,
    pid: _pid,
    message: 'json',
    selectedValue: '',
    selectOptions: [],
    multiple: false,
    last_id: -1
  });
  return (
    <FormContext.Provider value={{ formState, setFormState }}>
      {children}
    </FormContext.Provider>
  );
};

const globalCardPositions = {};

export const getCardPosition = (id) => globalCardPositions[id] || { left: 0, top: 0 };

export const updateCardPosition = (id, newPosition) => {
  globalCardPositions[id] = newPosition;
};

/*
const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cardPositions, setCardPositions] = useState({});

  const updateCardPosition = (id, newPosition) => {
    setCardPositions((prevPositions) => ({
      ...prevPositions,
      [id]: newPosition,
    }));
  };

  return (
    <CardContext.Provider value={{ cardPositions, updateCardPosition }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => useContext(CardContext);
*/

const CardClickContext = createContext();
export const useCardClick = () => useContext(CardClickContext);
export const CardClickProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPileOpen, setIsPileOpen] = useState(false);
  const [pile, setPile] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const handleCardClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };
  const handlePileClick = (pile) => {
    setPile(pile);
    setIsPileOpen(true);
  }
  const closeModal = () => { setIsModalOpen(false); };
  const closePile = () => { setIsPileOpen(false); };
  return (
    <CardClickContext.Provider value={{
      handleCardClick, selectedImage, isModalOpen, closeModal,
      handlePileClick, pile, isPileOpen, closePile,
    }}>
      {children}
    </CardClickContext.Provider>
  );
};

const initialData = {}

const App = () => {
  // const [data] = useState(initialData);
  let _text = params.get("text");
  const [message, setMessage] = useState('');
  const [text, setText] = useState(_text);
  const handleSendMessage = (newMessage) => {
    setMessage(newMessage);
  };

  const textStyle = {
    zIndex: 19000, // Ensure the modal has a higher z-index
    position: 'fixed', // Setting position to fixed
    width: '500px',
    height: '500px',
    textAlign: 'center',
    fontFamily: 'VT323',
    fontSize: "35px"
  }

  let gid = params.get("gid");
  let test = params.get("test");
  const proceed = () => {

    console.log(99, "proceed");
    setText(false);
    try {
      console.log(102, "try");
      const response = fetch(`/game/witness?gid=${gid}&test=${test}&proceed=1`);
      console.log(104, "did");
    } catch (e) {
      console.error(e);
    }
  }


  return (
    <div className="game-field">
      <FormProvider>
        {text && (
          <div style={textStyle} >
            <ClickableDraggable className="reveal" style={textStyle}>
              <div className="reveal" style={textStyle}>
                <div style={{ backgroundColor: "white" }}>
                  {text}
                  <hr />
                  <button onClick={proceed} onTouchStart={proceed}>Proceed</button>
                  <button onClick={() => setText(false)} onTouchStart={() => setText(false)}>Run Manually</button>
                </div>
              </div>
            </ClickableDraggable>
          </div>
        )}

        <CardClickProvider>
          <div className="top-element" style={{ zIndex: 12000 }}>
            <InputBox onSendMessage={handleSendMessage} />
          </div>
          <TableTop response={message} onSendMessage={handleSendMessage} />
          <CardModalController />
          <PileModalController />
        </CardClickProvider>
      </FormProvider>

    </div>
  );
};

const PileModalController = () => {
  const { pile, isPileOpen, closePile } = useCardClick();
  //  console.log('ModalController re-render', { selectedImage, isModalOpen });
  if (!isPileOpen) return;
  return (<div onClick={closePile} onTouchStart={closePile}>
    <Chooser pile={pile} />
  </div>);
};

const CardModalController = () => {
  const { selectedImage, isModalOpen, closeModal } = useCardClick();
  //  console.log('ModalController re-render', { selectedImage, isModalOpen });
  return (<CardModal imageUrl={selectedImage} isOpen={isModalOpen} onClose={closeModal} />);
};

function TableTop({ response }) {
  let _response = response ? JSON.parse(response) : null;
  let data = _response;
  const { formState, setFormState } = useContext(FormContext);


  useEffect(() => {
    if (formState.selectOptions.length == 0) {
      setTimeout(() => document.getElementById("send").click(), 1);
    }
  }, []);

  const params = new URLSearchParams(window.location.search);
  if (data && data.p1 && data.p2) {
    let pid = Number(params.get("pid"));
    let relative_memory = (pid === 1) ? data.p1.relative_memory : data.p2.relative_memory;
    let top = (pid === 1) ? data.p2 : data.p1;
    let bottom = (pid === 1) ? data.p1 : data.p2;

    // show moves; instances are for both players, but "egg" and "hand" only for bottom player
    let cards = [];
    let instances = [];
    let eggs = [];
    let trash = [];
    let handindex, instance, instance2, trashindex;
    let c, i, m, target, cost;
    console.log(177, "moves", document.getElementById("send").disabled);
    if (bottom.moves && document.getElementById("send").disabled == false)
      for (let opts of bottom.moves) {
        let cmd = opts.command;
        let text = opts.text;
        let target_id = opts.target_id;
        let name = opts.name;
        let evo_left = opts.evo_left;
        let evo_right = opts.evo_right;
        let evo_target = opts.evo_target;
        let evo_card = opts.evo_card;
        let cost = opts.cost;
        let words = cmd.split(" ");
        let link_source = opts.link_source;
        let link_target = opts.link_target;
        let link_trash = opts.link_trash;
        switch (cmd.substring(0, 3)) {
          case "ExxxVO": // EVO hand instance cost instance2
            //let [, handindex, instance, cost, instance2] = words;
            if (evo_card && evo_card.location === "HAND") {
              handindex = evo_card.id;
            }
            instance = evo_left && evo_left.id;
            instance2 = evo_right && evo_right.id;

            if (!cards[handindex]) cards[handindex] = [];
            c = cards[handindex];

            let e = c.find(x => x.text === 'Evolve1 on');
            if (!e) { e = { text: "Evolve1 on", submenu: [] }; c.push(e); }
            e.submenu.push({ text: `${evo_target} ${instance} ${instance2 || ""} (${cost})`, command: cmd });

            if (false) { // let things we can evo into have a link
              if (!instances[instance]) instances[instance] = [];
              i = instances[instance];
              i.push({ command: cmd, text: text });
              if (instance2) {
                if (!instances[instance2]) instances[instance2] = [];
                let i = instances[instance2];
                i.push({ command: cmd, text: text });
              }
            }
            break;
          case "PLA": // ...EVO hand instance cost instance2

            [, handindex] = words;
            if (!cards[handindex]) cards[handindex] = [];
            c = cards[handindex];
            c.push({ command: cmd, text: text });
            break;
          case "ATT": // ...EVO hand instance cost instance2
            [, instance,] = words;
            if (!instances[instance]) instances[instance] = [];
            i = instances[instance];
            i.push({ command: cmd, text: text });
            break;
          case "MAI": // ...EVO hand instance cost instance2
            [, instance] = words;
            if (!instances[instance]) instances[instance] = [];
            i = instances[instance];
            i.push({ command: cmd, text: text });
            break;
          case "HAT":
          case "RAI":
          case "NEX":
            eggs.push({ command: cmd, text: text });
            break;
          case "json": break;
          default:
            if (evo_card && evo_card.location === "HAND") {
              handindex = evo_card.id;
              instance = evo_left && evo_left.id;
              instance2 = evo_right && evo_right.id;

              if (!cards[handindex]) cards[handindex] = [];
              c = cards[handindex];

              let e = c.find(x => x.text === 'Evolve on');
              if (!e) { e = { text: "Evolve on", submenu: [] }; c.push(e); }
              e.submenu.push({ parenttext: "Evolve on", text: `${evo_target} ${instance} ${instance2 || ""} (${cost})`, command: cmd });
              console.error(258, e);
              break;
            }
            if (link_source) {
              if (link_source.location === "HAND") {
                handindex = link_source.id;
                if (!cards[handindex]) cards[handindex] = [];
                c = cards[handindex];
              } else if (link_source.location === "BATTLE"
                || link_source.location === "FIELD" // deprecated
              ) {
                instance = link_source.id;
                if (!instances[instance]) instances[instance] = [];
                c = instances[instance];
              } else if (link_source.location === "TRASH") {
                trashindex = link_source.id;
                if (!trash[trashindex]) trash[trashindex] = [];
                c = trash[trashindex];
              } else {
                console.error("unknown link source");
                c = [];

              }
              instance = link_target.id;
              link_target = link_target.name;

              let e = c.find(x => x.text === 'Link to');
              if (!e) { e = { text: "Link to", submenu: [] }; c.push(e); }
              let trash_text = "";
              if (link_trash) {
                trash_text = " trashing " + link_trash.name;
              }
              e.submenu.push({ parenttext: "Link to", text: `${link_target} ${instance}${trash_text} (${cost})`, command: cmd });
              console.error(274, c);
              break;

            }
            // do we have target ids?
            if (!target_id) break;
            if (target_id.kind === "CardLocation") {
              if (target_id.location === "HAND") {
                handindex = Number(target_id.id);
                if (!cards[handindex]) cards[handindex] = [];
                c = cards[handindex];
                c.push({ command: cmd, text: text });
                // CS1-02
              }
            } else {
              instance = Number(target_id.id);
              if (!instances[instance]) instances[instance] = [];
              i = instances[instance];
              i.push({ command: cmd, text: text });
            }

            break;
        }
      }

    // 2
    console.log(177, "counts", cards.length, instances.length, eggs.length);

    return (
      <div className="zoom">
        <PlayerArea key={5000} player={top} bottom={0} instanceMoves={instances} className="bottom"
          handMoves={[]} eggMoves={[]}

        />
        <Counter position={relative_memory} />
        <PlayerArea key={6000} player={bottom} bottom={1} instanceMoves={instances}
          handMoves={cards} eggMoves={eggs}
          className="bottom" />
      </div>
    );
  }
}

let width = 1200; // 800;

// 0 is bottom, 1 is top
let coordinates = {
  0: {

    TrashOld: { x: 25, y: -1050 },
    TrashMed: { x: 40, y: -800 },
    Trash: { x: 904, y: -250 }, // ?

    DeckOld: { x: 670, y: -400 },
    DeckMed: { x: 912, y: -522 },
    Deck: { x: 904, y: -424 },

    HandOld: { y: -40 },
    Hand: { y: 100 },

    SecurityOld: { x: -20, y: -400 },
    SecurityMed: { x: -10, y: -250 },
    Security: { x: -10, y: -150 },

    FieldOld: { y: -450 },
    Field: { y: -450 },

    EggOld: { x: 75, y: -230 },
    Egg: { x: 175, y: -100 },

    EggDeckOld: { x: -40, y: -230 },
    EggDeck: { x: 75, y: -80 },

  },
  1: {
    TrashOld: { x: 25, y: -1050 },
    TrashMed: { x: 40, y: -800 },
    Trash: { x: 40, y: -880 }, // ?

    DeckOld: { x: 25, y: -875 },
    DeckMed: { x: 50, y: -750 },
    Deck: { x: 40, y: -700 },

    HandOld: { y: -1200 },
    Hand: { y: -1200 },

    SecurityOld: { x: width - 100, y: -800 },
    Security: { x: width - 200, y: -800 },

    FieldOld: { y: -800 },
    Field: { y: -750 },

    EggOld: { x: width - 180, y: -1070 },
    EggMed: { x: width - 450, y: -1080 },
    Egg: { x: width - 450, y: -1040 },

    EggDeckOld: { x: width - 60, y: -1050 },
    EggDeck: { x: width - 330, y: -1040 },

  }
}


const PlayerArea = ({ player, className, bottom, instanceMoves, eggMoves, handMoves }) => {
  //       <Pile x={800} y={-200} pilelength={player.trash} />
  let height = 2000;
  let bot = (bottom === 1);

  // for evo lines
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to parent container
    canvas.width = 800; //canvas.parentElement.offsetWidth;
    canvas.height = 1200; //canvas.parentElement.offsetHeight;
    console.log(285, "canvas", canvas.width, canvas.height);

    // for drawing lines to show all evos
    const drawLinesBetweenCards = () => {
      const cardPairs = [
        { sourceId: 'card1', targetId: 'card4' },
        { sourceId: 'card1', targetId: 'card5' },
        { sourceId: 'card2', targetId: 'card6' }
      ];

      const getCardCenter = (card) => {
        const rect = card.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2, // container.getBoundingClientRect().left,
          y: rect.top + rect.height / 2 + 600 - container.getBoundingClientRect().top,
        };
      };

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.5;
      // ctx.fillStyle = 'blue'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw lines between specified pairs
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      cardPairs.forEach(({ sourceId, targetId }) => {
        const sourceCard = container.querySelector(`#${sourceId}`);
        const targetCard = container.querySelector(`#${targetId}`);
        console.log("canvas", sourceCard, targetCard);
        if (false) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
          ctx.lineTo(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 20;
          ctx.stroke();

        }

        if (sourceCard && targetCard) {
          const sourceCenter = getCardCenter(sourceCard);
          const targetCenter = getCardCenter(targetCard);
          console.log(315, "canvas", sourceCenter, targetCenter);
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 5;
          ctx.moveTo(sourceCenter.x, sourceCenter.y);
          ctx.lineTo(targetCenter.x, targetCenter.y);
          ctx.stroke();
        }
      });
    };

    // Initial draw
    drawLinesBetweenCards();

    // Optionally, add event listeners to update lines on resize or scroll
    if (false) {
      window.addEventListener('resize', drawLinesBetweenCards);
      window.addEventListener('scroll', drawLinesBetweenCards);
    }
    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('resize', drawLinesBetweenCards);
      window.removeEventListener('scroll', drawLinesBetweenCards);
    };
  }, []);

  // evo lines end
  if (!player) return;


  let c = coordinates[bot ? 0 : 1];

  return (
    <div className={`player-area ${className}`} ref={containerRef}
      style={{
        position: 'absolute',
        top: bottom ? '1100px' : '1080px',
        left: '1px',
        height: '0px'
      }} >
      <canvas ref={canvasRef} style={{ pointerEvents: "none", position: 'absolute', top: "-600px", left: 0, zIndex: 4000 }} />
      {/* Render your <Card> components here or inside nested components */}
      {/* Add more <Card> components as needed */}
      <div className="top-element">
        <Reveal pile={player.reveal} />
      </div>
      <div className="top-element">
        <Reveal pile={player.search} />
      </div>

      <EggZone moves={eggMoves} eggzone={player.eggzone} x={c.Egg.x} y={c.Egg.y} />
      <Deck bottom={bottom} x={c.Deck.x} y={c.Deck.y} name={"deck"} pile={player.deck} card="back" />
      <Trash trash={player.trash} x={c.Trash.x} y={c.Trash.y} />
      <Field moves={instanceMoves} field={player.field} y={c.Field.y} />
      <Hand moves={handMoves} hand={player.hand} _y={c.Hand.y} />
      <Security security={player.security} x={c.Security.x} y={c.Security.y} rot={bot ? 270 : 90} />
      <Deck bottom={bottom} x={c.EggDeck.x} y={c.EggDeck.y} name={"eggs"} pile={player.eggs} card="eggback" />

      <div className="top-element">
        <Chooser pile={player.nullzone} rot={45} />
      </div>

    </div>
  );
}

//const Deck = ({ deck }) => <div className="deck">Deck: {deck}</div>;
// stacked pile
// face down
const Deck = ({ pile, x, y, card, name, bottom }) => {
  console.log("rendering  deck " + bottom + " pile " + card + " x " + x + " y " + y + " length "); // + pile.length);

  let visibility = "show";
  if (!pile || pile.count === 0) {
    visibility = "hidden";
  }
  //         <Card key={index} card={card} x={45} y={-180 - index*30} z={index} style={{ top: '80%', left: `${10 + index * 15}%` }} />
  let index = 0;

  return (
    <span id={"deck" + bottom}>
      <div>
        <div className="text-overlay" value={"SIZE: " + pile.count} dangerouslySetInnerHTML={{ __html: "DECK SIZE:&nbsp;" + pile.count }}
          style={{
            display: 'flex',
            position: 'absolute',
            left: `${x}px`,
            top: `${y + 25}px`,
            width: `80px`
          }}
        />
        <div style={{ visibility: visibility }} >
          <Card id={uuidv4()} key={bottom ? 20 : 30} card={card}
            position={{ left: x, top: y }} z={20}
            overlay={pile.count + " cards"}
            OBSOLETEstyle={{ top: '80%', left: `${10 + index * 15}%`, width: `50px`, visibility: visibility }} />
        </div>
      </div>
    </span >
  );
}
const EggZone = ({ eggzone, moves, x, y }) => {

  console.debug("eggzone area");
  const style = { position: 'absolute', left: `${x}px`, top: `${y}px`, zIndex: 2000 }
  const { formState, setFormState } = useContext(FormContext);

  const doButton = (e) => {
    console.log(303, "BUTTON", e.target.value);
    let send = document.getElementById("send");
    let value = e.target.value;
    setFormState({
      ...formState,
      selectedValue: value,
    });
    console.log(177, "disabling send in egg");
    setTimeout(() => { send.click(); send.disabled = true; console.log(177, "abc") }, 0);
  }

  return (
    <div>
      {moves.length > 0 && (
        <div style={style} className="menu">
          {moves.map(item => (<button onClick={doButton} value={item.command}>{item.text}</button>))}
        </div>
      )}
      {eggzone && (
        <Instance key={uuidv4()} instance={eggzone} x={x} y={y} />)}
    </div>
  )
};

const Instance = ({ moves, instance, x, y }) => {

  // is the menu here used at all?
  const closeMenu = () => {
    setShowMenu(false);
  }
  const [showMenu, setShowMenu] = useState(false);

  let count = instance.stack.length;
  let delta = 25; //  - count * 3;
  if (count > 4) delta -= count; // scrunch cards a bit if stack is big
  console.log("OVERRIDE DELTA");
  delta = 40;
  let plug_delta = 35;
  // console.log(`count is ${count} delta is ${delta}`);

  const { formState, setFormState } = useContext(FormContext);
  const doButton = (e) => {
    let send = document.getElementById("send");
    send.disabled = true;
    setShowMenu(false);


    console.log(490, "BUTTON FOR INSTANCE", e.target.value);
    let value = e.target.value;
    setFormState({
      ...formState,
      selectedValue: value,
    });
    setTimeout(() => {
      send.disabled = false; send.click(); send.disabled = true;
    }, 1);
  }

  const handleInstanceCardClick = () => {
    console.log(350, showMenu);
    setShowMenu(!showMenu);
    //onCardAction(card);
  };


  let ypos = [];
  let coordinate = 0;
  let top = y;
  for (let i = 0; i < instance.stack.length; i++) {
    ypos[i] = coordinate;
    top = y + coordinate;
    coordinate += delta;
    let card_id = instance.stack[i].split('@')[0];
    let data = document.card_data[card_id];
    if (data.ess.length < 3) coordinate -= delta * 0.6;
    console.log(686, data.ess);
    //    buffer += field[i].plugs.length * 35; // slide over for plugs
  }

  const instanceStyle = {
    position: 'absolute', left: `${x}px`, top: `${top}px`, zIndex: 90,
  };
  // unused?
  const menuStyle = {
    position: 'absolute', left: `${x}px`, top: `${y + 10}px`, zIndex: 90,
  }

  let fn = moves ? handleInstanceCardClick : undefined;
  let plugs = instance.plugs || [];
  let rot = plugs.length ? 70 : 90; // if plugs, don't fully rotate
  // the instance isn't well-placed on the field, only its cards, 
  // so a card-acttion for it doesn't make much sense



  return (
    <div className={`wrapper ${false ? 'card-action' : ''}`}  >

      <div className="dp-overlay" dangerouslySetInnerHTML={{ __html: typeof instance.dp === "number" ? `${instance.dp} DP` : null }} style={{ left: `${x}px`, top: `${y - 30}px` }} />
      <div className={`detail-overlay`} dangerouslySetInnerHTML={{ __html: instance.summary }} style={{ left: `${x}px`, bottom: `${-y + 30}px` }} />
      <div className={`detail-overlay`} dangerouslySetInnerHTML={{ __html: instance.id }} style={{ width: '20px', textAlign: `right`, left: `${x + 80}px`, bottom: `${-y - 30}px` }} />
      <div style={{ zIndex: 2 }}>
        {plugs.map((card, index) => (
          <Card id={card.split('@')[2]} key={card.split('@')[2]} card={card} position={{ left: x + 20 + plug_delta * index, top: y, rotate: -90 }} z={10 - index} style={{ top: '80%', left: `${10 + index * 15}%`, }} />
        ))}
      </div>
      <div style={{ zIndex: 10 }} onClick={fn} styfle={instanceStyle} clasfsName={moves ? 'card-action' : ''} >
        {instance.stack.map((card, index) => (
          <Card id={card.split('@')[2]} key={card.split('@')[2]} moves={index === instance.stack.length - 1 ? moves : undefined} card={card}
            position={{
              left: x,
              top: top - ypos[index],
              rotate: (index === count - 1 && instance.suspended) ? rot : 0
            }}
            z={30 + index}
            style={{ top: '80%', left: `${10 + index * 15}%`, }} />
        ))}
      </div>
      {false && showMenu && (<div className="menu" style={menuStyle}  >
        <div >
          <RecursiveMenu
            moves={moves}
            doButton={doButton}
            closeMenu={closeMenu}
          />
        </div>
      </div>)}

    </div>
  )
};


const Field = ({ moves, field, y, }) => {
  console.log(425, moves);
  let xpos = [];
  let buffer = 0;
  for (let i = 0; i < field.length; i++) {
    xpos[i] = 200 + i * 150 + buffer;
    buffer += field[i].plugs.length * 35; // slide over for plugs
  }
  return (
    <div className="field">
      {field.map((instance, index) => (
        <div className="field-instance" key={uuidv4()}>
          <Instance key={uuidv4()} moves={moves[instance.id]} instance={instance} x={xpos[index]} y={y} />
        </div>
      ))}
    </div>
  );
}
// for scaling
//function x(x) { return x; }
//gfunction y(y) { return y; }


const Hand = ({ moves, hand, _y }) => {

  if (!hand.cards) hand.cards = Array(hand.count).fill("back");

  console.log(633, _y, hand.count);
  // if x is 0 for any card it gets misaligned
  let card_width = 98;
  if (hand.count > 8) (card_width -= hand.count);
  if (hand.count > 12) (card_width -= hand.count);
  if (hand.count * card_width > 790) { card_width = 790 / hand.count; }

  const center = 400 + 200;
  const width = hand.count * card_width;
  const left = (center - width / 2) || 1;
  console.log(left, width, center);

  return (
    <div className="hand">
      {hand.cards.map((card, index) => (
        /*        <CardClickProvider> */
        // uuidv4 because i don't want them tracked 
        <Card offset="-20px" id={card.split('@')[2] > 0 ? card.split('@')[2] : uuidv4()} key={index} moves={moves[index]} card={card} position={{ left: left + card_width * index, top: _y }} z={50} click={true} />
        /*        </CardClickProvider> */
      ))}
    </div>
  );
};

const Card = ({ id, card, position: newPosition, z, click, moves, offset /*, onCardAction*/ }) => {
  console.log("making card " + id + " card " + card + " pos " + newPosition);
  const initialRender = useRef(true);
  const initialPosition = useRef(getCardPosition(id)); // Capture initial position
  const [position, setPosition] = useState(initialPosition.current);
  const prevPosition = useRef(initialPosition.current); // Ensure a default value for prevPosition

  useEffect(() => {
    if (newPosition) {
      if (initialRender.current) {
        initialRender.current = false;
        updateCardPosition(id, newPosition);
        prevPosition.current = newPosition;      // Make sure we set prevPosition to the newPosition on the first render
        setPosition(newPosition);
      } else {
        const currentPosition = getCardPosition(id);
        if (currentPosition.left !== newPosition.left || currentPosition.top !== newPosition.top) {
          setPosition(newPosition);
          updateCardPosition(id, newPosition);
        }
      }
    }
  }, [id, newPosition]);


  // Track the last successful render's position
  useEffect(() => {
    prevPosition.current = position;
  }, [position]);

  const closeMenu = () => {
    setShowMenu(false);
  }
  const [showMenu, setShowMenu] = useState(false);

  const { formState, setFormState } = useContext(FormContext);
  const doButton = (e) => {
    console.log(371, "BUTTON", e, e.target.value);
    const value = e.target.value;
    sideSubmit(value);
  }
  const sideSubmit = (value) => {
    console.log(846, value);
   let send = document.getElementById("send");
    send.disabled = true;
    setShowMenu(false);
    setFormState({
      ...formState,
      selectedValue: value,
    });
    setTimeout(() => { 
      console.log("doing disable flip");
      send.disabled = false; send.click(); send.disabled = true;
      console.log(177, 'disabld send');
    }, 0);
  }

  const context = useCardClick();
  const { handleCardClick } = context;


  const rotation = { transform: `rotate(${newPosition && newPosition.rotate}deg)` }
  const relPosition = { transform: `rotate(${newPosition && newPosition.rotate}deg)` };
  const absPosition = newPosition ? {
    position: 'absolute', left: `${newPosition.left}px`, top: `${newPosition.top}px`, zIndex: z,
    transform: `rotate(${newPosition && newPosition.rotate}deg)`
  } : { transform: `rotate(${newPosition && newPosition.rotate}deg)` };
  const menuPosition = {
    position: 'absolute',
     bottom: offset, zIndex: z + 4,
  };
  const handleHandCardClick = () => {
    console.log(350, showMenu);
    if (!showMenu)
      setShowMenu(!showMenu);
  };

  let show_modal = true ? (() => { closeMenu(); handleCardClick(imagesContext(card)) }) : undefined;

  let nested_value;
  let fn = moves ? handleHandCardClick : show_modal;
  if (moves && moves[0] && moves[0].text === "CLICK") {
    fn = () => sideSubmit(moves[0].command);
  }
  if (showMenu) console.log(359, moves);

  console.log(685, card, "ID" + id, position.left, position.top, "5555", prevPosition.left, prevPosition.top); // position.left, position.top, newPosition.left, newPosition.top, "X");


  const initial = newPosition ? { x: prevPosition.current.left, y: prevPosition.current.top } : {}
  const animate = newPosition ? { x: position.left, y: position.top } : {}

  let duration = 0.6;
  if (!initial.x && !initial.y) {
    duration = 0.05; // i should just be able to set the original coordinates, right?
  }

  const style = relPosition;
  const divstyle = newPosition ? {} : style;
  const transition = newPosition ? { duration: duration, ease: 'easeInOut' } : {}

  //     style={newPosition ? absPosition : relPosition}



  let card_img = <img cancel=".no-drag" src={imagesContext(card)} alt={`Card ${id}`}
    id={card.split('@')[2]}
    value={nested_value}
    style={id ? rotation : {}}
    className={`card ${moves ? 'card-action' : ''}`}
  />
  let menuhtml = <div className="menu" style={menuPosition} >
    <div >
      <RecursiveMenu
        moves={moves}
        doButton={doButton}
        closeMenu={closeMenu}
      />
      <button id="sendDELETEME" style={{ display: 'none' }}>SendDELETEME</button>
    </div>
    <button onClick={show_modal}>See Card</button>
  </div>;

  //   const style = newPosition ? {} : { left: x, top: y };
  return (
    <div onClick={fn} style={{ position: "relative", zIndex: z }}
    >
      {id ? <motion.div
        className="xxx"
        id={`card-${id}`}
        layoutId={`card-${id}`}
        initial={initial}
        animate={animate}
        style={relPosition}
        transition={transition}
      >
        {card_img}
        {showMenu && menuhtml}
      </motion.div>
        :
        <div style={absPosition}  >
          {card_img}
          {showMenu && menuhtml}
        </div>
      }


    </div >
  );

};

const highlightedText = (text, alltexts, index) => {
  let style = {};
  if (!alltexts) return (<span>{text}</span>);
  const alltext = alltexts[index];
  if (!alltext) return (<span>{text}</span>);

  const textArray = alltext.split(text);
  if (textArray.length > 1) {
    textArray.splice(1, 0, text);
  }
  return textArray.map((txt, index) => {
    let style = {};
    if (index === 0) {
      style = {}; // First element color
    } else if (index === 1) {
      style = { color: 'cyan' }; // Second element color
    }

    return (
      <span key={index} style={style}>
        {txt}
      </span>
    );
  });

};

const Chooser = ({ pile }) => {

  console.log(904, pile);
  if (!pile || !pile.count) return (<hr />);
  if (!pile.cards) pile.cards = Array(pile.count).fill("back");

  const texts = pile.texts;
  const alltexts = pile.alltexts;

  console.log(550, texts, alltexts);
  return (
    <div className="top-element" id="chooser">
      <Draggable cancel=".no-drag">
        <div className="chooser">
          <table classNafme="revtable">
            <tbody>
              <tr>
                <td colspan="100%" className="cardtext" align="center">
                  {pile.title}
                </td>
              </tr>
              <tr style={{ opacity: 1, zIndex: 90 }}  >
                {pile.cards.map((card, index) => (
                  <td key={uuidv4()} width="200px" >
                    <div className="no-drag" style={{ zIndex: 60, opacity: "1", width: "50px", height: "200px" }}>
                      <Card id={card.split('@')[2]} key={card.split('@')[2]} card={card} moves={pile.moves && pile.moves[index]} />
                    </div>
                  </td>
                ))}
              </tr>
              <tr style={{ opacity: 1, zIndex: 100 }}>
                {texts && texts.map((text, index) => (
                  <td key={uuidv4()} className="cardtext" width="200px" height="100px">
                    <div style={{ paddingTop: "0px" }}>
                      {highlightedText(text, alltexts, index)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
            </tbody>
          </table>
        </div>

      </Draggable>
    </div >
  );


};




const Reveal = ({ pile }) => {

  if (!pile || !pile.count) return (<hr />);
  if (!pile.cards) pile.cards = Array(pile.count).fill("back");

  const texts = pile.texts;
  console.log(550, texts);
  return (
    <div className="top-element">
      <ClickableDraggable>
        <div className="reveal">
          <table className="revtable">
            <tbody>
              <tr style={{ opacity: 1, zIndex: 90 }}>
                {pile.cards.map((card, index) => (
                  <td key={uuidv4()} width="200px" >
                    <div style={{ zIndex: 60, opacity: "1", width: "50px", height: "200px" }}>
                      <Card id={card.split('@')[2]} key={card.split('@')[2]} card={card} />
                    </div>
                  </td>
                ))}
              </tr>
              <tr style={{ opacity: 1, zIndex: 100 }}>
                {texts && texts.map((text, index) => (
                  <td key={uuidv4()} className="cardtext" width="200px" height="100px" valign="center">
                    <div style={{ paddingTop: "-20px" }}>
                      {text}
                    </div>
                  </td>
                ))}
              </tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
              <tr><td>.</td></tr>
            </tbody>
          </table>
        </div>

      </ClickableDraggable>
    </div >
  );


};


const Trash = ({ trash, x, y }) => {


  /*  const closeTrash = () => {
      setShowTrash(false);
    }
    const [showTrash, setShowTrash] = useState(false);
  */
  const doButton = (e) => {
    console.log("DOING BUTTON 1001");
    //    setShowTrash(true);
  }

  const context = useCardClick();
  const { handlePileClick } = context;

  let temp_pile = {
    count: trash.length,
    cards: trash
  }

  let fn = () => { handlePileClick(temp_pile) };

  return (

    <div onClick={fn} onTouchStart={fn} >
      <div className="text-overlay" value={"SIZE: " + trash.length} dangerouslySetInnerHTML={{ __html: "TRASH SIZE:&nbsp;" + trash.length }}
        style={{
          display: 'flex',
          position: 'absolute',
          left: `${x}px`,
          top: `${y + 25}px`,
          width: `80px`
        }}
      />

      <div className="trash">
        {trash.map((card, index) => (
          <Card id={card.split('@')[2]} key={card.split('@')[2]} card={card} position={{ left: x + index * 2, top: y + index * 2 }} />
        ))}
      </div>
    </div>
  );
}

const Security = ({ security, x, y, rot }) => {
  let cards = security.cards;
  //  cards =  ["BT19-052@GREEN,BLACK","BT18-046@GREEN,BLACK","BT18-046@GREEN,BLACK","back","back"];
  let count = cards.length;
  cards = cards.map(c => c === "DOWN" ? "back" : c);

  let delta = 30;
  if (count > 6) delta -= count;

  // this shouldn't say "eggzone"
  return (
    <div className="wrapper">
      <div>
        {cards.map((card, index) => (
          <Card key={uuidv4()} card={card} position={{ left: x + (index % 2 * 50), top: y - index * delta, rotate: rot }} z={30 + index} style={{ top: '80%', left: `${10 + index * 15}%`, }} />
        ))}
      </div>
    </div>
  )


}




///
const loc = document.location;
const s_url = `${loc.protocol}//${loc.hostname}:3001`;


let socketurl = process.env.NODE_ENV === "development" ? s_url : "/";
if (process.env.REACT_APP_SOCKET_URL) socketurl = process.env.REACT_APP_SOCKET_URL;
//if (process.env.SOCKET_URL) socketurl = process.env.SOCKET_URL;
const socket4 = io(socketurl);

const InputBox = ({ onSendMessage }) => {

  //  const [hasInitialized, setHasInitialized] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [masterQueue, setMasterQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  //  const [response, setResponse] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const { formState, setFormState } = useContext(FormContext);
  const handleChange = (event) => {

    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });

    console.log("SET FORM STATE"); // Log statement outside the object
  };

  const handleSelectChange = (event) => {
    let value = Array.from(event.target.selectedOptions, option => option.value);
    setFormState({
      ...formState,
      selectedValue: value,
    });
  };

  const setSelectOptions = (ggg) => {
    //  console.log("ggg is ", ggg);
    if (!ggg) return;

    formState.selectOptions.length = 0;
    let sec_value = null;

    console.log("====");
    console.log(formState);
    document.getElementById('message').value = 'json';

    let last_id = -1;
    let choose = 1;
    for (let blob of ggg) {
      //      console.log("blob", blob);
      let opt = {
        value: blob.command,
        label: blob.text,
        last_id: blob.last_id,
        instance: blob.instance,
        card: blob.card,
        fulltext: blob.fulltext,
        alltext: blob.alltext,
      };
      if (blob.choose) {
        choose = blob.choose;
        formState.choose = choose;
        opt.choose = choose;
      }
      if (opt.last_id) {
        last_id = opt.last_id;
        // console.log("got last_id of " + opt.last_id);
        document.getElementById("last_id").value = last_id;
        formState.last_id = opt.last_id;
      }
      if (last_id !== -1) {
        opt.last_id = last_id;
      }
      if (!sec_value && !blob.text.match(/refresh/i)) {
        // console.log("FOUND ONE TO SELECT", opt);
        sec_value = blob.command;
      }
      formState.selectOptions.push(opt);
    }
    if (sec_value) {
      // console.log("selecting value " + sec_value);
      formState.selectedValue = sec_value;
    }
    //console.log("LENGTH IS " + formState.selectOptions.length);
    if (formState.selectOptions.length === 0) {
      formState.selectOptions.push(
        { command: "json", text: "REFRESH", ver: uuidv4(), last_id: last_id }
      );
    }
    //  console.log("CHOOSE IS " + choose);
    setFormState({
      ...formState,
      multiple: choose > 1
    });
  };

  function update_game_state(obj) {
    if (obj) {
      let status = obj.status;
      if (status) {
        var x = document.getElementById("status");
        x.innerHTML = `<b>MEMORY ${status.memory} </b> <br>` +
          `PLAYER ${status.turn_player}'S TURN ` +
          `<br> Phase ${status.phase} Turn ${status.n_turn}  <br> ` +
          ` Waiting on player ${status.control} <br>` +
          ` Security P1: ${obj.p1.security.count} &nbsp; P2: ${obj.p2.security.count} `
        x.value = status.last_id;
        let t = document.getElementById("tick");
        let s = t.style;
        if (status.step_text.startsWith("IN_LOOP")) {
          console.log(917, status.step_text);
          s.backgroundColor = 'blue';
          s.color = 'red';
          console.log(932, "tick?", messages.length, status.control, document.getElementById("send").disabled)
          if (false && messages.length === 0 && document.getElementById("send").disabled === false) {
            // start of main can't get in here because send not disabled
            console.error("autoticking 1");
            console.log("this is the one I need");
            // t.click();
          } else if (status.control == 0 && messages.length == 0 && document.getElementById("send").disabled == false) { // waiting on no one, try clicking?
            console.error("autoticking 2");
            setTimeout(() => t.click(), 1500);
            //  t.click();
          }
        } else {
          s.backgroundColor = null;
          s.color = null;
        }
      }


      //      console.log("+++");      console.log(formState);
      let pn = 'p' + formState.pid;
      if (!obj[pn]) {
        return; // no data, don't mess with anything
      }
      console.log(status.effect_tree);
      let tree = status.effect_tree;
      if (tree) {
        populate_tree(tree);
      }
      const parsedOptions = obj[pn].moves;

      //setDoableActions( [cards, instances ] );

      //      console.log("XXXXXXX");      console.log(parsedOptions);      console.log("YYYYYYY");

      setSelectOptions(parsedOptions); // Update select options
      let log = document.getElementById("logfresh");
      if (log) log.click();
    }
  }
  useEffect(() => {

    const updateLogs = (newLog) => {
      setLogs(prevLogs => {
        const updatedLogs = [...prevLogs];
        const existingLogIndex = updatedLogs.findIndex(log => log.id === newLog.id);
        console.log("index is " + existingLogIndex);
        if (existingLogIndex !== -1) {
          updatedLogs[existingLogIndex] = newLog;
        } else {
          updatedLogs.push(newLog);
        }

        return updatedLogs;
      });
    };



    if (masterQueue.length > 0 && !isProcessing) {
      setIsProcessing(true);
      const nextMessage = masterQueue[0];
      console.log("MASTER QUEUE length " + masterQueue.length);
      console.log(nextMessage);
      setMessages(prevMessages => []);

      console.log("message " + nextMessage.type);
      switch (nextMessage.type) {
        case 'message':
          setMessages(prevMessages => [...prevMessages, nextMessage.data]);
          setShowMessage(true);
          setTimeout(() => {
            setIsProcessing(false);
          }, 2500);
          break;
        case 'gameState':
          update_game_state(nextMessage.data);
          let my_json = JSON.stringify(nextMessage.data);
          onSendMessage(my_json); // updates the UI
          setIsProcessing(false);
          if (masterQueue.length === 1) document.getElementById("send").disabled = false;
          break;
        // I'm not sure the below is ever used
        case 'gameStateChange':
          setIsProcessing(false);
          break;
        case 'fancy':
          let fancy = nextMessage.data;
          fancy.forEach((log, index) => {
            updateLogs(log);
          });
          setIsProcessing(false);
          break;
        default:
          console.error('Unknown message type:', nextMessage.type);
      }
      setMasterQueue(prevQueue => prevQueue.slice(1));
    }
  }, [masterQueue, isProcessing]); // re-run this effect whenever masterQueue or isProcessing changes

  const [logs, setLogs] = useState([]);
  useEffect(() => {

    let msgHandler = function (msg) {
      var obj = JSON.parse(msg);
      if (obj && obj.p1 && obj.p1.card_data) {
        document.card_data = obj.p1.card_data;
      }
      if (obj.messages || obj.fancy) {
        if (obj.messages && obj.messages.length > 0) {
          //          console.log("got a message " + obj.messages.length);          console.log(obj.messages);          console.log("<<<");
          for (let msg1 of obj.messages) {
            setMasterQueue(prevQueue => [...prevQueue, { "type": "message", "data": msg1 }]);
          }
        }
        if (obj.fancy && obj.fancy.length > 0) {
          // put into queue instead of processing immediately
          setMasterQueue(prevQueue => [...prevQueue, { "type": "fancy", "data": obj.fancy }]);
          //      console.error(obj.fancy);
          //          obj.fancy.forEach((log, index) => {
          //            updateLogs(log);
          //         });
        }
      } else {
        // console.log(obj);
        console.debug("x=" + JSON.stringify(obj));
        if (obj) {
          setMasterQueue(prevQueue => [...prevQueue, { "type": "gameState", "data": obj }]);
        }
      }
    };

    socket4.on('server-response', msgHandler);
    // Cleanup function to disconnect from socket on component unmount
    return () => {
      socket4.off('server-response', msgHandler);
    }
  }, []); // Empty dependency array; runs effect only once

  const handleLogClick = () => {
    setMessages(prevMessages => prevMessages.slice(1));
    setIsProcessing(false);
  };

  const sendTick = () => {
    let json = {
      gid: formState.gid,
      pid: formState.pid,
      message: "step",
      last_id: 1 // document.getElementById("last_id").value
    };
    //    console.log("sending msg", json);
    document.getElementById("send").disabled = true;
    let x = socket4.emit('chat message', json); // Send message to backend    
  }

  // when 'send' is directly clicked, it disables the 'send'
  // button. when the value is set elsewhere and then indirectly
  // clicked, the value updating causes a React refresh, and
  // "send" hasn't been disabled yet
  const sendMessage = () => {
    console.log(1099, "calling sm");
    document.getElementById("send").disabled = true;

    var stat = document.getElementById("status");

    console.log(`stat.value is ${stat.value} formState.last_id is ${formState.last_id}`);
    let id_to_use = formState.last_id;
    if (stat.value > id_to_use) { id_to_use = stat.value; }

    let cmd = "?";
    let array = formState.selectedValue;
    //console.log("### ", array);
    if (Array.isArray(array)) {
      if (array.length === 1) {
        cmd = array[0];
      }
      if (array.length > 1) {
        let key = array[0].split(" ")[0];
        let val = array.map(x => parseInt(x.split(" ")[1])).join()
        cmd = `${key} ${val}`;
      }
    } else {
      cmd = array;
    }
    let json = {
      gid: formState.gid,
      pid: formState.pid,
      message: formState.message,
      last_id: id_to_use,
      command: cmd // formState.selectedValue
    };

    //    console.log("sending msg", json);
    // console.log("JSON IS", json);
    document.getElementById("send").disabled = true;
    socket4.emit('chat message', json); // Send message to backend
    formState.message = 'json';

    //console.log("x is ", x);
    //    setMessage('');

  };

  const card_ids = [];
  const texts = [];
  const alltexts = [];
  let title = "";
  const moves = [];
  let send = document.getElementById("send");
  console.log(1173, "disable is ", (send && send.disabled));
  let can_show_cards = (send && send.disabled == false);

  for (let opt of formState.selectOptions) {
    if (opt.value === "json") { title = opt.label; continue; }
    if (!opt.card) {
      can_show_cards = false;
      break;
    }
    card_ids.push(opt.card + "@grey");
    texts.push(opt.fulltext);
    alltexts.push(opt.alltext);
    const move = [{ command: opt.value, text: "CLICK" }];
    moves.push(move); // command to run
    console.log(924, can_show_cards, opt);
  }
  let pile = {};
  if (can_show_cards) {
    pile.cards = card_ids;
    pile.texts = texts;
    pile.alltexts = alltexts;
    pile.moves = moves;
    pile.count = texts.length;
    pile.title = title;
  }
  console.log(936, pile);


  return (
    <div>
      <div className="inputbox" id="unique">
        <div className="gamestate" id="status">
          Press 'SEND' or 'TICK' to start.<br />
          Press 'SEND' after selecting command.<br />
        </div>
        <hr />


        <input
          id='message'
          type="hidden"
          name="message"
          value={formState.message}
          onChange={handleChange}
          size="8"
        />
        <input
          type="hidden"
          name="gid"
          value={formState.gid}
          onChange={handleChange}
          size="8"
        />
        <input
          type="hidden"
          name="pid"
          value={formState.pid}
          onChange={handleChange}
          size="4"
        />
        <input type="hidden"
          name="count" value={formState.count}
          onChange={handleChange} size="4" />
        <input
          type="hidden"
          name="last_id"
          value="-1"
          onChange={handleSelectChange}
          id="last_id"
          size="4"
        />
        <select multiple={formState.multiple} className="moves" id="command"
          value={formState.selectedValue} onChange={handleSelectChange} onTouchStart={handleSelectChange}>
          {formState && formState.selectOptions &&
            formState.selectOptions.map((option) => (
              <option key={option.value} value={option.value} fred={option.last_id} thing1="two" >
                {option.label}
              </option>
            ))}
        </select>
        {can_show_cards && (<Chooser pile={pile} />)}
        {/*        <button type="submit">Submit</button> */}

        <button id="send" onClick={sendMessage} onTouchStart={sendMessage}>Send</button>
        <button id="tick" onClick={sendTick} onTouchStart={sendTick}>Tick</button>
      </div>
      <Draggable cancel=".no-drag">
        <div className={`popup ${messages.length > 0 ? 'show' : 'hide'}`} onClick={handleLogClick}>
          <button className="no-drag" onClick={handleLogClick}>[X]</button>
          <br />
          {messages.length > 0 && messages[0]}
        </div>
      </Draggable>
      <LogDisplay logs={logs} style={{ left: '1200px' }} gid={_gid} />
      <StatusWindow />


    </div>
  );
}


export default App;
