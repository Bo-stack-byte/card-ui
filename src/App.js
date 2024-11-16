
// import './App.css';
import { v4 as uuidv4 } from 'uuid';
import imagesContext from "./util";
import io from 'socket.io-client';
import React, {
  useEffect, useState,
  createContext, useContext
} from 'react';
import { StatusWindow, populate_tree } from './StatusWindow';
import Counter from './Counter';
import Draggable from 'react-draggable';
import ClickableDraggable from './ClickableDraggable';
import LogDisplay from './LogDisplay';
import CardModal from './CardModal';

// Visualizer v0.5.3 proper modal overlay
// Visualizer v0.5.2 better game init
// Visualizer v0.5.1 log window scrolls

/*
const CardClickContext = createContext();
export const useCardClick = () => useContext(CardClickContext);
export const CardClickProvider = ({ children }) => {
  const handleCardClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };
  setSelectedImage(imageUrl);
  setIsModalOpen(true);
  return (
    <CardClickContext.Provider value={handleCardClick}>
      {children}
    </CardClickContext.Provider>
  );
};*/

/*
const CardClickContext = createContext();
export const useCardClick = () => useContext(CardClickContext);
export const CardClickProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const handleCardClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <CardClickContext.Provider value={{ handleCardClick, selectedImage, isModalOpen, closeModal }}>
            {children}
        </CardClickContext.Provider>
    );
};
*/



const CardClickContext = createContext();
export const useCardClick = () => useContext(CardClickContext);
export const CardClickProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const handleCardClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); };
  return (
    <CardClickContext.Provider value={{ handleCardClick, selectedImage, isModalOpen, closeModal }}>
      {children}
    </CardClickContext.Provider>
  );
};

const initialData = {}

const App = () => {
  const [data] = useState(initialData);
  const [message, setMessage] = useState(''); // Optional state for UI logic

  const handleSendMessage = (newMessage) => {
    setMessage(newMessage);
  };


  return (
    <div className="game-field">
      <div className="top-element" style={{ zIndex: 12000 }}>
        <InputBox onSendMessage={handleSendMessage} />
      </div>
      <CardClickProvider>
        <TableTop response={message} onSendMessage={handleSendMessage} />
        <StatusWindow />
        <CardModalController />
      </CardClickProvider>
    </div>
  );
};

const CardModalController = () => {
  const { selectedImage, isModalOpen, closeModal } = useCardClick();
  console.log('ModalController re-render', { selectedImage, isModalOpen });
  console.log("xxxx " + selectedImage + "fffff");
  return (<CardModal imageUrl={selectedImage} isOpen={isModalOpen} onClose={closeModal} />);
};

function TableTop({ response }) {
  let _response = response ? JSON.parse(response) : null;
  let data = _response;
  const params = new URLSearchParams(window.location.search);
  if (data && data.p1 && data.p2) {
    let pid = params.get("pid");
    let relative_memory = (pid == 1) ? data.p1.relative_memory : data.p2.relative_memory;
    let top = (pid == 1) ? data.p2 : data.p1;
    let bottom = (pid == 1) ? data.p1 : data.p2;
    return (
      <div>
        <PlayerArea key={5000} player={top} bottom={0} className="bottom" />
        <Counter position={relative_memory} />
        <PlayerArea key={6000} player={bottom} bottom={1} className="bottom" />
      </div>
    );
  }
  /*
    let _response = response ? JSON.parse(response) : null;
    let me_p1 = (_response && _response.p2 && _response.p2.moves === null);
    let p1 = _response ? (_response.p1) : "";
    let p2 = _response ? (_response.p2) : "";
  
    console.log("moves", p1.moves, p2.moves);
    //  console.log("in table, p1 is ", p1);;
  
    if (me_p1) {
      return (
        <div className="table">
          <UserField pnum="p2" place="north" json={response && p2} />
          <UserField pnum="p1" place="south" json={response && p1} />
        </div>);
    }
    return (
      <div className="table">
        <UserField pnum="p1" place="north" json={response && p1} />
        <UserField pnum="p2" place="south" json={response && p2} />
      </div>);
  */
}

const PlayerArea = ({ player, className, bottom }) => {
  if (!player) return;
  console.log("player area ");
  console.log(bottom ? " bottom " : " top ");
  console.log(player.eggzone);
  //       <Pile x={800} y={-200} pilelength={player.trash} />
  let width = 800;
  let height = 1120;
  let bot = (bottom == 1);
  console.log(103, player);
  return (
    <div className={`player-area ${className}`}>
      <div className="top-element">
        <Reveal pile={player.reveal} />
      </div>

      <EggZone eggzone={player.eggzone} x={bot ? 75 : width - 180} y={bot ? -230 : -1070} />
      <Deck bottom={bottom} x={bot ? -40 : width - 60} y={bot ? -230 : -1050} name={"eggs"} pile={player.eggs} card="eggback" />
      <Deck bottom={bottom} x={bot ? 670 : 25} y={bot ? -400 : -875} name={"deck"} pile={player.deck} card="back" />
      <Trash trash={player.trash} x={bot ? 670 : 25} y={bot ? -225 : -1050} />
      <Field field={player.field} y={bot ? -500 : -800} />
      <Hand hand={player.hand} _y={bot ? -40 : -1200} />
      <Security security={player.security} x={bot ? -20 : width - 100} y={bot ? -400 : -800} rot={bot ? 270 : 90} />
    </div>
  );
}

//const Deck = ({ deck }) => <div className="deck">Deck: {deck}</div>;
// stacked pile
// face down
const Deck = ({ pile, x, y, card, name, bottom }) => {
  //console.log("rendering " + bottom + " pile " + card + " " + x + " " + y + " length "); // + pile.length);

  if (!pile || pile.count == 0) { return (<span>0</span>); }
  //         <Card key={index} card={card} x={45} y={-180 - index*30} z={index} style={{ top: '80%', left: `${10 + index * 15}%` }} />
  let index = 1;
  return (
    <div>
      <div className="text-overlay" value={"SIZE: " + pile.count} dangerouslySetInnerHTML={{ __html: "CARDS:&nbsp;" + pile.count }}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `80px`
        }}
      />
      <Card key={uuidv4()} card={card} x={x} y={y} z={20} overlay={pile.count + " cards"} style={{ top: '80%', left: `${10 + index * 15}%`, width: `50px` }} />
    </div>
  );
}
const EggZone = ({ eggzone, x, y }) => {
  console.debug("eggzone area");
  if (!eggzone) return (<hr />);
  return (<Instance key={uuidv4()} instance={eggzone} x={x} y={y} />);
};

const Instance = ({ instance, x, y }) => {
  ///  console.log(`inside instance ${x} ${y}`);
  console.log("instance is");
  console.log(instance);
  let count = instance.stack.length;
  let delta = 25; //  - count * 3;
  if (count > 4) delta -= count; // scrunch cards a bit if stack is big
  // console.log(`count is ${count} delta is ${delta}`);
  let top = y + delta * (count - 1);

  return (
    <div className="wrapper">
      <div className="text-overlay" dangerouslySetInnerHTML={{ __html: instance.summary }} style={{ left: `${x}px`, top: `${y}px` }} />
      <div className="eggzone">
        {instance.stack.map((card, index) => (
          <Card key={uuidv4()} card={card} x={x} y={top - index * delta} z={30 + index} rotate={(index == count - 1 && instance.suspended) ? 90 : 0} style={{ top: '80%', left: `${10 + index * 15}%`, }} />
        ))}
      </div>
    </div>
  )
};


const Field = ({ field, y, }) => {
  return (

    <div className="field">
      {field.map((instance, index) => (
        <div className="field-instance" key={uuidv4()}>
          <Instance key={uuidv4()} instance={instance} x={200 + index * 130} y={y} />
        </div>
      ))}
    </div>
  );
}
// for scaling
function x(x) { return x; }
function y(y) { return y; }


const Hand = ({ hand, _y }) => {

  if (!hand.cards) hand.cards = Array(hand.count).fill("back");


  const card_width = 80;
  if (hand.count > 8) (card_width -= hand.count);
  if (hand.count > 12) (card_width -= hand.count);

  const center = 300; //??
  const width = hand.count * 50;
  const left = center - width / 2;
  console.log(left, width, center);

  return (
    <div className="hand">
      {hand.cards.map((card, index) => (
/*        <CardClickProvider> */
          <Card key={uuidv4()} card={card} x={x(left + card_width * index)} y={y(_y)} z={50} click={true} />
/*        </CardClickProvider> */
      ))}
    </div>
  );
};

const Card = ({ card, x, y, z, rotate, click }) => {

  //  const [isEnlarged, setIsEnlarged] = useState(false);

  /*
  const handleClick = () => {
      console.log("CLICK");
      setIsEnlarged(true);
    }
  
          {isEnlarged && ( 
                <img src={imagesContext(card)}     alt={card}   className="card" style={{position: 'absolute', scale:'500%', left: `${600}px`, top: `${-600}px`, zIndex:z }} />
        )}
  */
  const context = useCardClick();
  const { handleCardClick } = context;
  console.log(123, handleCardClick);
  const absPosition = {
    position: 'absolute', left: `${x}px`, top: `${y}px`, zIndex: z,
    transform: `rotate(${rotate}deg)`
  };
  const relPosition = {};
  let fn = click ?   ( () => handleCardClick(imagesContext(card)) ) : undefined;

  return (
    <div>
      <img onClick={fn} src={imagesContext(card)} alt={card} className="card"
        style={x ? absPosition : relPosition} />
    </div >
  );

};




const Reveal = ({ pile }) => {

  let _y = -600;

  console.log(249, pile);
  if (!pile || !pile.count) return (<hr />);
  if (!pile.cards) pile.cards = Array(pile.count).fill("back");
  return (
    <div className="top-element">
      <ClickableDraggable>
        <p>another thing</p>
        <div className="reveal">
          <table className="revtable">
            <tbody>
              <tr>
                {pile.cards.map((card, index) => (
                  <td key={uuidv4()} width="200px" height="300px">
                    <Card key={uuidv4()} card={card} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </ClickableDraggable>
    </div >
  );


};

//const imageSrc = imagesContext(`./cards/fd-${selectedState}.png`);
//
//  const [response, setResponse] = useState('');
//  console.log("blob names is " + blobNames);
// console.log(blobNames);
// console.log(JSON.stringify(blobNames));
/*
if (!blobNames) return

let self = true;
let reveal = blobNames.cards;
if (!reveal) {
}

return (
 <div className="reveal">
   <table>
     <tbody>
       <tr>

         {reveal && reveal.map((blobName, index) => (
           <td key={uuidv4()} width="10px">
             XXXXXX <Card key={uuidv4()} blobName={blobName} />
           </td>
         ))}
       </tr>
     </tbody>
   </table>
 </div>
);
};
*/

const Trash = ({ trash, x, y }) => (

  <div className="trash">
    {trash.map((card, index) => (
      <Card key={uuidv4()} card={card} x={x + index * 2} y={y + index * 2} />
    ))}
  </div>
);
const Security = ({ security, x, y, rot }) => {
  let cards = security.cards;
  //  cards =  ["BT19-052@GREEN,BLACK","BT18-046@GREEN,BLACK","BT18-046@GREEN,BLACK","back","back"];
  let count = cards.length;
  cards = cards.map(c => c == "DOWN" ? "back" : c);

  let delta = 30;
  if (count > 6) delta -= count;

  // this shouldn't say "eggzone"
  return (
    <div className="wrapper">
      <div className="eggzone">
        {cards.map((card, index) => (
          <Card key={uuidv4()} card={card} x={x + (index % 2 * 50)} y={y - index * delta} z={30 + index} rotate={rot} style={{ top: '80%', left: `${10 + index * 15}%`, }} />
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

function InputBox({ onSendMessage }) {

  const [hasInitialized, setHasInitialized] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [masterQueue, setMasterQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState(null);

  const params = new URLSearchParams(window.location.search);
  let _pid = params.get("pid");
  let _gid = params.get("gid");
  console.log("iput box _gid is " + _gid);

  const [formState, setFormState] = useState(
    {
      gid: _gid,
      pid: _pid,
      message: 'json',
      selectedValue: '',
      selectOptions: [],
      multiple: false,
      last_id: -1
    });

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
      let opt = { value: blob.command, label: blob.text, last_id: blob.last_id };
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
      if (last_id != -1) {
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
    if (formState.selectOptions.length == 0) {
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
        let s = document.getElementById("tick").style;
        if (status.step_text.startsWith("IN_LOOP")) {
          s.backgroundColor = 'blue';
          s.color = 'red';
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
          if (masterQueue.length == 1) document.getElementById("send").disabled = false;
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

  const sendMessage = () => {
    var stat = document.getElementById("status");

    console.log(`stat.value is ${stat.value} formState.last_id is ${formState.last_id}`);
    let id_to_use = formState.last_id;
    if (stat.value > id_to_use) { id_to_use = stat.value; }

    let cmd = "?";
    let array = formState.selectedValue;
    //console.log("### ", array);
    if (Array.isArray(array)) {
      if (array.length == 1) {
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
    let x = socket4.emit('chat message', json); // Send message to backend
    formState.message = 'json';

    //console.log("x is ", x);
    //    setMessage('');

  };

  console.log("at ted gid is " + _gid);

  return (
    <div>
      <ClickableDraggable>
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

          {/*        <button type="submit">Submit</button> */}

          <button id="send" onClick={sendMessage} onTouchStart={sendMessage}>Send</button>
          <button id="tick" onClick={sendTick} onTouchStart={sendTick}>Tick</button>


          {/*        {response && <p>Response: {response}</p>}
        <button>123 and {response}</button> */}

        </div>
      </ClickableDraggable>
      <Draggable cancel="touchstart">
        <div className={`popup ${messages.length > 0 ? 'show' : 'hide'}`} onClick={handleLogClick}>
          {messages.length > 0 && messages[0]}
        </div>
      </Draggable>
      <LogDisplay logs={logs} style={{ left: '1200px' }} gid={_gid} />

    </div>
  );


  let a = 3;
}


export default App;
