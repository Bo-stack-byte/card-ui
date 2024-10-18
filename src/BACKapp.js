
//import './BACKapp.css';
import { v4 as uuidv4 } from 'uuid';
import Draggable from 'react-draggable';

// UI version 0.4.8 as backup

// If you're looking at this code, we'd love to have you join our project. 

import 'react-toastify/dist/ReactToastify.css';

import React, { useRef, useState, useEffect } from 'react';
//import React, { useState } from 'react';

import card from './card.png';
import backgroundImage from './pixel-egg.png';
//import trashBackgroundImage from './trash.png';

import io from 'socket.io-client';

if (process.env.NODE_ENV === "development") {
  console.log("development");
} else {
  console.log("unknown env");
  console.log(process.env ? process.env.NODE_ENV : "nada");
}
console.dir(process.env, { depth: null });

const imagesContext = (_cardname) => {
  let [cardname,s_colors] = _cardname.split("@");
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

const unsafeImagesContext = require.context('./cards/', true, /\.png$/);
let socketurl = process.env.NODE_ENV === "development" ? "http://localhost:3001/" : "/";
// if (process.env.SOCKET_URL) socketurl = process.env.SOCKET_URL;
console.log("socket " + socketurl);
const socket4 = io(socketurl);

const LogViewer = ({ url }) => {

  const fetchLogsRef = useRef(null); // Ref to store the fetchLogs function

  const [logs, setLogs] = useState([]);
  const [lastLine, setLastLine] = useState(0);

  const params = new URLSearchParams(window.location.search);
  let _gid = params.get("gid");


  url = url + "?gid=" + _gid;
  const lv = useRef(null);

  useEffect(() => {

    if (lv.current) {
      lv.current.scrollTop = lv.current.scrollHeight;
    }
    fetchLogsRef.current = async () => {
      //      console.log("LOGGER");
      //    console.log(`${url}&from=${lastLine}`);
      try {
        const response = await fetch(`${url}&from=${lastLine}`);
        const newLines = await response.text();
        setLogs([...logs, ...newLines.split('\n')]);
      } catch (e) {
        console.log("can't get logs, server down?");
      }
    };

    fetchLogsRef.current();

    const intervalId = setInterval(fetchLogsRef.current, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [url, lastLine]); // Re-run useEffect on url or lastLine change

  return (
    <div className="logs" ref={lv}>
      <h2 >Logs</h2>
      <button id="logfresh" onClick={fetchLogsRef.current}>grab</button>
      <pre>{logs.join('\n')}</pre>
    </div>
  );
};



function InputBox({ onSendMessage }) {

  // Function to get a value from the query string

  /*
    function getQueryParam(param) {
      var urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }
  */

  const [hasInitialized, setHasInitialized] = useState(false);


  const [showMessage, setShowMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [masterQueue, setMasterQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);


  /*    
      useEffect(() => {
        setFormState({
          gid: '',
          pid: '',
          message: 'halp',
          selectedValue: '',
          selectOptions: []            
          });
      }, []); // Empty dependency array
  */


  //  console.log("calling usestate");
  const params = new URLSearchParams(window.location.search);
let _pid = params.get("pid");
  let _gid = params.get("gid");

  const [formState, setFormState] = useState(
    {
      gid: _gid,
      pid: _pid,
      message: 'json',
      selectedValue: '',
      selectOptions: [],
      multiple: false,
      last_id: -1
    }); // Initial values provided here


  //const [formState, setFormState] = useState(/* no initial values here */);
  /*
  useEffect(() => {
    // Initialize state within the useEffect
    setFormState({ 
      gid: '',
      pid: '',
      message: 'halp',
      selectedValue: '',
      selectOptions: []
     });
  }, []);
  */

  /*
    //  const [message, setMessage] = useState(''); 
    const [formState, setFormState] = useState(
      
      {
      gid: '',
      pid: '',
      message: 'halp',
      selectedValue: '',
      selectOptions: []
      // add more fields as needed
    });
  */

  /*
    useEffect(() => {
      setFormState({
        gid: getQueryParam('gid') || 'bob',
        pid: getQueryParam('pid') || '1',
        // Add more form fields here as needed
      });
    }, []); // Empty dep
  */

  const handleChange = (event) => {

    /*    setFormState((prevState) => ({
          ...prevState,
          [event.target.name]: event.target.value,
        }), () => {
          const name = formState.name; // Access formState here, guaranteed to be updated
        });
           */

    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });


    console.log("SET FORM STATE"); // Log statement outside the object
  };



  const handleSelectChange = (event) => {


    let value = Array.from(event.target.selectedOptions, option => option.value);

    //    this.setState({value});
    setFormState({
      ...formState,
      //      value: event.target.value, 
      selectedValue: value,
    });
  };


  const [response, setResponse] = useState(null);

  const setSelectOptions = (ggg) => {
    //    console.log("XXX >>>");
    //   console.log(ggg);
    console.log("ggg is ", ggg);

    //    fetchLogs();


    if (!ggg) return;

    formState.selectOptions.length = 0;
    let sec_value = null;

    console.log("====");
    console.log(formState);
    document.getElementById('message').value = 'json';


    let last_id = -1;
    let choose = 1;
    for (let blob of ggg) {
      console.log("blob", blob);
      let opt = { value: blob.command, label: blob.text, last_id: blob.last_id };
      if (blob.choose) {
        choose = blob.choose;
        formState.choose = choose;
        opt.choose = choose;
      }
      if (opt.last_id) {
        last_id = opt.last_id;
        console.log("got last_id of " + opt.last_id);
        document.getElementById("last_id").value = last_id;
        formState.last_id = opt.last_id;
      }
      if (last_id != -1) {
        opt.last_id = last_id;
      }
      if (!sec_value && !blob.text.match(/refresh/i)) {
        console.log("FOUND ONE TO SELECT", opt);
        sec_value = blob.command;
      }
      formState.selectOptions.push(opt);
    }
    if (sec_value) {
      console.log("selecting value " + sec_value);
      formState.selectedValue = sec_value;
    }
    console.log("LENGTH IS " + formState.selectOptions.length);
    if (formState.selectOptions.length == 0) {
      formState.selectOptions.push(
        { command: "json", text: "REFRESH", ver: uuidv4(), last_id: last_id }
      );
    }
    console.log("CHOOSE IS " + choose);
    setFormState({
      ...formState,
      multiple: choose > 1
    });


    /*
  <select id="mySelect" value={formState.selectedValue} onChange={handleSelectChange}>
    {formState.selectOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
*/


    //  console.log("XXX <<<");
  };


  function update_game_state(obj) {
    if (obj) {
      //      '{"turn_player":2,"n_turn":2,"phase":"HATCHING","memory":10,"control":2}'
      let status = obj.status;
      console.log("status is ", status);
      if (status) {
        var x = document.getElementById("status");

        x.innerHTML = `PLAYER ${status.turn_player}'S TURN <b>MEMORY ${status.memory} </b> ` +
          `Turn ${status.n_turn} <br> Phase ${status.phase} <br> ` +
          ` Waiting on player ${status.control} <br>` +
          ` Player 1: Deck ${obj.p1.deck.count} Security ${obj.p1.security.count} Eggs ${obj.p1.eggs.count} <br>` +
          ` Player 2: Deck ${obj.p2.deck.count} Security ${obj.p2.security.count} Eggs ${obj.p2.eggs.count} <br>` +
          `<span id=proc style='display:none'> Game Processing ${status.step_text} <br>  last ${status.last_id} </span>`;
        x.value = status.last_id;
        //        var last = document.getElementById("last_id");
        x.onclick = () => document.getElementById("proc").style.display = '';

        let s = document.getElementById("tick").style;
        if (status.step_text.startsWith("IN_LOOP")) {
          s.backgroundColor = 'blue';
          s.color = 'red';
        } else {
          s.backgroundColor = null;
          s.color = null;
        }
      }

      console.log("+++");
      console.log(formState);
      let pn = 'p' + formState.pid;
      console.log(pn);
      if (!obj[pn]) {
        return; // no data, don't mess with anything
      }

      const parsedOptions = obj[pn].moves;

      console.log("XXXXXXX");
      console.log(parsedOptions);
      console.log("YYYYYYY");



      setSelectOptions(parsedOptions); // Update select options

      let log = document.getElementById("logfresh");
      if (log) log.click();

      console.log("set!!");
    }
  }
  useEffect(() => {

    if (masterQueue.length > 0 && !isProcessing) {
      setIsProcessing(true);
      //      const nextMessage = masterQueue.shift();
      const nextMessage = masterQueue[0];
      console.log("MASTER QUEUE length " + masterQueue.length);
      console.log(nextMessage);
      setMessages(prevMessages => []);    // clear pop up queue

      switch (nextMessage.type) {
        case 'message':
          setMessages(prevMessages => [...prevMessages, nextMessage.data]);
          setShowMessage(true);
          setTimeout(() => {
            setIsProcessing(false);
          }, 300);
          break;
        case 'gameState':
          update_game_state(nextMessage.data);

          //why do I need two?
          let my_json = JSON.stringify(nextMessage.data);
          //setResponse(my_json);
          onSendMessage(my_json); // updates the UI

          //onSendMessage(my_json);

          setIsProcessing(false);
          if (masterQueue.length == 1) document.getElementById("send").disabled = false;
          break;
        case 'gameStateChange':
          // handle game state change
          setIsProcessing(false);
          //  masterQueue.splice(0);
          break;
        default:
          console.error('Unknown message type:', nextMessage.type);
      }

      // Remove the processed message from the queue
      setMasterQueue(prevQueue => prevQueue.slice(1));
      // if we're all caught up, let the user input stuff again


    }
  }, [masterQueue, isProcessing]); // re-run this effect whenever masterQueue or isProcessing changes

  useEffect(() => {
    // Handle incoming response from backend

    /*
  */


    /*
      if (false) {
        const intervalId = setInterval(() => {
          // Remove the first message from the array every 800 milliseconds
    
          setMessages(prevMessages => prevMessages.slice(1));
          console.log("set interval " + intervalId);
        }, 1200);
      }
    */


    let msgHandler = function (msg) {

      var obj = JSON.parse(msg);
      if (obj && obj.p1 && obj.p1.card_data) {
        document.card_data = obj.p1.card_data;
        console.log("got card data " );
      }
      if (obj.messages) {
        if (obj.messages && obj.messages.length > 0) {
          console.log("got a message " + obj.messages.length);
          console.log(obj.messages);
          console.log("<<<");
          for (let msg1 of obj.messages) {
            setMasterQueue(prevQueue => [...prevQueue, { "type": "message", "data": msg1 }]);

          }
          //        setMessages(prevMessages => [...prevMessages, ...obj.messages]);
          //          setShowMessage(true);
        }
      } else {

        console.log(obj);
        console.log("x=" + JSON.stringify(obj));

        if (obj) {
          setMasterQueue(prevQueue => [...prevQueue, { "type": "gameState", "data": obj }]);
        }
      }


      //    setResponse(msg); stay edelted


      //onSendMessage(msg); // updates the UI


      ////// I moved this into the queue handler
    };


    socket4.on('server-response', msgHandler);

    console.log("re-rendering");

    /*
    socket4.on('server-response', (data) => {
      console.log(2334);
      console.log(data);
  //      setStuff(data.message);
      setResponse(data.message);
      console.log("set!!");
    });
  */

    // Cleanup function to disconnect from socket on component unmount
    return () => {
      //      console.log("disconnecting");
      socket4.off('server-response', msgHandler);
      //  clearInterval(intervalId);

      //      console.log("Disconnected 4");
    }
  }, []); // Empty dependency array to run effect only once


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
    console.log("sending msg", json);
    document.getElementById("send").disabled = true;
    let x = socket4.emit('chat message', json); // Send message to backend    

  }

  const sendMessage = () => {
    //    console.log("Sending it");
    //  console.log(formState);

    var stat = document.getElementById("status");
    console.log(`stat.value is ${stat.value} formState.last_id is ${formState.last_id}`);
    let id_to_use = formState.last_id;
    if (stat.value > id_to_use) { id_to_use = stat.value; }

    let cmd = "?";
    let array = formState.selectedValue;
    console.log("### ", array);
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

    console.log("sending msg", json);
    // console.log("JSON IS", json);
    document.getElementById("send").disabled = true;
    let x = socket4.emit('chat message', json); // Send message to backend
    formState.message = 'json';

    //console.log("x is ", x);
    //    setMessage('');

  };

  return (

    <div className="inputbox" id="unique">
      <div className="gamestate" id="status">
        Press 'SEND' or 'TICK' to start.<br />
        Press 'SEND' after selecting command.<br />
        If 'TICK' is blue, either the game is waiting on an answer, or press it to advance game state.
      </div>
      <hr />


      <input
        id='message'
        type="text"
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
      <select multiple={formState.multiple} className="moves" id="command" value={formState.selectedValue} onChange={handleSelectChange}>
        {formState && formState.selectOptions &&
          formState.selectOptions.map((option) => (
            <option key={option.value} value={option.value} fred={option.last_id} thing1="two" >
              {option.label}
            </option>
          ))}
      </select>

      {/*        <button type="submit">Submit</button> */}

      <button id="send" onClick={sendMessage}>Send</button>
      <button id="tick" onClick={sendTick}>Tick</button>


      {/*        {response && <p>Response: {response}</p>}
        <button>123 and {response}</button> */}

      <div className={`popup ${messages.length > 0 ? 'show' : 'hide'}`} onClick={handleLogClick}>
        {messages.length > 0 && messages[0]}
      </div>


    </div>
  );


  let a = 3;
}



const Instance = ({ instance, cls }) => {
  //  console.log("instance is " + JSON.stringify(instance));
  // console.log(instance);
  //  stack = stack.reverse();

  const divStyle = (cls == "eggstack") ?
    {
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: 'repeat',
    }
    : (
      (cls == "trash2stack") ? {
        backgroundRepeat: 'repeat'
      } : {}
    );

  if (instance.newstack) {
    // I hate React.
    return (
      <div className="wrapper">
        <div className="text-overlay" dangerouslySetInnerHTML={{ __html: instance.summary }} />

        {(instance.text) && <span>${instance.text}</span>}
        <div className={cls} style={divStyle} >
          <div> {instance.newstack.map((card, index) =>
          (<img src={imagesContext(card.img)}
            alt={card.img}
            key={card.key}
            className="card"
            style={{
              position: 'absolute',
              top: card.x + 'px',
              left: card.y + 'px',
              zIndex: card.z,
              transform: 'rotate(' + card.rot + 'deg)'
            }} />))
          }
          </div>
        </div>
      </div>
    )
  }
  //  console.log(instance);

  let thingy = JSON.parse(JSON.stringify(instance.stack.reverse()));

  //  console.log("stack.length is " + thingy.length);
  //console.log("stack2 contents are " + thingy.join(","));

  let rot = instance.suspended ? 90 : 0;
  let cards = [];
  let i = 0;
  //  thingy.sort(function (x, y) { if (x.name == y.name) return 0; return x.name > y.name ? 1 : -1; });

  let delta_x = 30;
  let delta_y = 5;
  if (instance.name == "Trash") {
    delta_y = -30;
    delta_x = -5;
  }
  let max_x = delta_x * (thingy.length - 1) + 2;
  let max_y = (thingy.length - 1) * 5;
  // just reversing this list doesn't do the right thing
  for (let name of thingy) {

    //  stack.forEach((name, i) => {
    //    console.log("stack card thing is " + uuidv4());
    //   console.log("stack card name is " + name + " and i is " + i + " and pos1 is " + (i * 30 + 1));
    let z = 52 + i;
    let deg = (i == thingy.length - 1) ? rot : 0;
    //    console.log(`pushing1 ${name} is at z of ${z}`);
    cards.push(<Card key={uuidv4()} blobName={name} pos1={max_x - i * delta_x} pos2={max_y - i * delta_y} z={z} deg={deg} />);
    i++
  };


  // below is trash stack
  return (


    <div className="wrapper">
      <div className="text-overlay" dangerouslySetInnerHTML={{ __html: instance.summary }} />

      <div className={cls} style={divStyle} >
        <div>
          {cards}
        </div>
      </div>
    </div>

  );

};

//  {instance && instance.stack && instance.stack.map((card) => (
//  <div>
//<Card blobName={card} />
//       style=({ position: 'absolute'; top: {pos}+'px'; })

const Button = ({ content }) => {
  return (<button>{content}</button>)
}

const ControlPanelXXX = ({ data }) => {

  const [selectedValue, setSelectedValue] = useState('option1Value'); // Initial value
  const handleOptionChange = (event) => {
    setSelectedValue(event.target.value);
  };

  console.log(123);
  console.log(data);
  if (!data) {
    console.log("empty control panel");
    return;
  }
  let _data = JSON.parse(data);
  if (!_data) {
    console.log("we had string but no data structure");
  }
  let old_format = false;
  if (old_format) {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <Button content="Play" />
              <td>
                {JSON.stringify(_data.PLAY)}
              </td>
            </td>
          </tr>
          <tr>
            <td><Button content="Digivolve" /> <td> {JSON.stringify(_data.DIGIVOLVE)} </td> </td>
          </tr>
          <tr>
            <td><Button content="Attack" /> <td> {JSON.stringify(_data.ATTACK)} </td> </td>
          </tr>
          <tr>
            <td><Button content="Main" /> <td> {JSON.stringify(_data.MAI)} </td> </td>
          </tr>
        </tbody>
      </table>
    )
  }
  console.log("commands");
  console.log(_data);
  if (_data) {
    _data.map(x => console.log(`key=${x.ver} name=${x.command} ${x.text} `));
  }
  console.log("xxx");
  //     <select name="bob22" id="fred" className='select-element' value="PLAY 2" onChange={onChange}>

  return (
    <select className="moves" id="samuel" value={selectedValue} onChange={handleOptionChange} >

      {_data && _data.map(x => (<option key={x.ver} id={x.ver} value={x.command}>{x.text}</option>))}
    </select>
  );
}

const Card = ({ id, blobName, pos1, pos2, z, deg }) => {

  //  console.log(`stack card name ${id} ${blobName} pos ${pos1} ${pos2} z ${z} deg ${deg} `);
  let style = {};

  //  console.log("deg is " + deg);

  if (pos1) style = { position: 'absolute', top: pos1 + 'px', left: pos2 + 'px', zIndex: z };
  if (deg) { style['transform'] = 'rotate(' + deg + 'deg)'; }

  //console.log(`stack card name ${style} `);

  return (

    <img
      id={id}
      src={imagesContext(blobName)}   // Construct the image URL
      alt={blobName}
      style={style}
      className="card"
    />
  )

}

function fix_pile(mon) {
  let stack = mon.stack;
  let newstack = [];
  let rev = -1;
  for (let j = stack.length - 1; j >= 0; j--) {
    rev += 1;
    let card = {
      img: stack[j],
      rot: (j == stack.length - 1 && mon.suspended) ? 90 : 0 - j,
      z: 50 + j,
      x: 30 * rev,
      y: 2 * rev,
      key: stack[j] + j + rev,
    }
    newstack.push(card);
  }
  mon.newstack = newstack;
}

const Field = ({ eggzone, fieldc, trash, reveal }) => {
  //  console.log("fieldc is " + fieldc);
  // console.log(fieldc);

  for (let i = 0; i < fieldc.length; i++) {
    let mon = fieldc[i];
    fix_pile(mon);
  }
  if (eggzone) {
    fix_pile(eggzone);
  }


  let trashInstance = trash.length > 0 ? { id: 999, name: "Trash", dp: null, level: 0, suspended: false, stack: trash, summary: `${trash.length} card${trash.length > 1 ? 's' : ''}` } : null;
  return (
    <span>
      <span className="rowofstacks">
        <table>
          <tbody>
            <tr>
              <td key={"egg"} width="140px" height="80px" className="eggzone" >
                {eggzone ? (
                  <div className="eggzone" style={{ width: "100%" }}>
                    <Instance cls="eggstack" instance={eggzone} />

                  </div>
                )
                  : (<span>.</span>)}
              </td>
              {fieldc && fieldc.map((inst, index) => (
                <td key={"abc" + index} width="140px">
                  <Instance cls="stack" key={"def" + index} instance={inst} />
                </td>
              ))}

              <td key={"trash2"} width="140px" className="eggzone">
                {trashInstance ? (
                  <Instance cls="trashstack" key="trash3" instance={trashInstance} />
                )
                  : (<span>.</span>)}
              </td>
            </tr>
          </tbody>
        </table>
      </span>
    </span >);
}


const Reveal = ({ blobNames }) => {
  //const imageSrc = imagesContext(`./cards/fd-${selectedState}.png`);
  //
  //  const [response, setResponse] = useState('');
  //  console.log("blob names is " + blobNames);
  // console.log(blobNames);
  // console.log(JSON.stringify(blobNames));
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
                <Card key={uuidv4()} blobName={blobName} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};


const Hand = ({ blobNames }) => {
  //const imageSrc = imagesContext(`./cards/fd-${selectedState}.png`);
  //
  //  const [response, setResponse] = useState('');
  //  console.log("blob names is " + blobNames);
  // console.log(blobNames);
  // console.log(JSON.stringify(blobNames));
  if (!blobNames) return

  let self = true;
  let hand = blobNames.cards;
  if (!hand) {
    self = false;
    hand = Array(blobNames.count).fill("blue");
  }
  //  console.log(hand);
  // console.log("hand " + hand);

  let angle = -25;
  let step = 60.0 / hand.length;
  if (hand.length < 6) { angle = -10; step = 5; }

  if (!self) { angle *= -1; step *= -1; }
  if (!self) angle += 180;


  return (
    <div className="hand">
      <table>
        <tbody>
          <tr>

            {hand && hand.map((blobName, index) => (
              <td key={uuidv4()} width="10px">
                <Card key={uuidv4()} blobName={blobName} deg={angle + step * index} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

function UserField({ place, pnum, json }) { // call with "p1" or "p2"

  if (!json) {
    return;
  }
  //  let _json = json ? JSON.parse(json) : null;
  let _json = json ? json : null;
  let field = _json ? _json.field : null;
  let eggzone = _json ? _json.eggzone : null;
  let trash = _json ? _json.trash : null;
  let reveal = _json ? _json.reveal : null;
  if (!_json || !field) {
    console.error("NO JSON/FIELD!");
  }

  //  console.log("underscore json is ", _json);

  let f = (<div className="field">
    <Field id={"f" + pnum} eggzone={eggzone} fieldc={field} trash={trash} reveal={reveal} /></div>);

  let r = (
    <Draggable>
      <div className="reveal">
        <Reveal id={pnum} blobNames={_json && _json.reveal} />
      </div>
    </Draggable>
  );
  if (_json.reveal.count == 0) r = (<span />);
  let fr = (<div className="field-container"> {f} {r} </div>)
  let h = (<div className="hand">
    <Hand id={pnum} blobNames={_json && _json.hand} /> </div>);

  if (place == "north") [fr, h] = [h, fr];
  /*
    //  console.log("moves is ", _json.moves);
    if (_json.moves) {
            _json.moves['extra'] = uuidv4();
    }
          let jm = JSON.stringify(_json.moves);
          console.log("moves is ", jm);*/
  return (
    <div>
      {fr}
      {h}
    </div>

  )
}

//      <ControlPanel data={jm} /> */}    </div>

function UI() {
  const [message, setMessage] = useState(''); // Optional state for UI logic
  const handleSendMessage = (newMessage) => {
    console.log("STUFF HAPPENS");
    setMessage(newMessage); // Update UI state (optional)
    // Send message to server (optional)
  };

  return (


    <table style={{ tableLayout: "fixed", width: "100%" }}>
      <tbody>
        <tr>
          <td width="800px" valign="top">
            <InputBox onSendMessage={handleSendMessage} />
            <TableTop response={message} onSendMessage={handleSendMessage} />
          </td>
          <td className="rightcell">
            <LogViewer url={socketurl + "game/logs"} />
          </td>
        </tr>
      </tbody>
    </table>

  );
}


export function TableTop({ response }) {


  let _response = response ? JSON.parse(response) : null;
  //  console.trace();


  let me_p1 = (_response && _response.p2 && _response.p2.moves === null);

  console.log("response is", response);  // text
  console.log("_response is", _response);  // object

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

}

export function Square() {
  return <button className="square">X</button>;
}


let inst = {
  "name": "whatever", "dp": null,
  "level": null, "suspended": false,
  "summary": "(&nbsp;&nbsp;5) TAMER Tai Kamiya ",
  "stack": ["ST15-14", "ST15-13", "ST15-02", "ST15-01"],
  "sa": 1
}

let inst2 = {
  "name": "Andromon", "dp": 7000, "level": "5", "suspended": false,
  "summary": "(&nbsp;22) Andromon <span class=status>CAN_ATK</span> Lv5 7K [3 Greymon ToyAgumon Agumon ] [All Turns] [Once Per Turn] When an attack target is switched, gain 1 memory.   [All Turns] [Once Per Turn] When an attack target is switched, gain 1 memory. ",
  "stack": ["ST15-12", "ST15-11", "ST15-03", "ST15-12", "ST15-04", "ST15-04", "ST15-04"], "sa": 1
}

export function TestInstance() {
  return (
    <Instance instance={inst2} />
  );
};

export default UI;

//export default TestInstance; 
