import React, { useEffect, useState, useRef } from 'react';
//import React, { useState, useEffect, cloneElement } from 'react';

//import Draggable from 'react-draggable';
import chain1 from './chain1.png';
import chain2 from './chain2.png';
import chain3 from './chain3.png';
import chain4 from './chain4.png';
import chain5 from './chain5.png';
import chain6 from './chain6.png';
import chain7 from './chain7.png';
import chain8 from './chain8.png';
import chain9 from './chain9.png';
import './LogDisplay.css';
import Modal from 'react-modal';
//import ClickableDraggable from './ClickableDraggable';
import DraggableHandle from './DraggableHandle';

function getChainImage(i) {
    switch (i) {
        case 0: return undefined;
        case 1: return chain1;
        case 2: return chain2;
        case 3: return chain3;
        case 4: return chain4;
        case 5: return chain5;
        case 6: return chain6;
        case 7: return chain7;
        case 8: return chain8;
        case 9: return chain9;
        default: return undefined;
    }
}

const LogDisplay = ({ logs, gid }) => {
    const [visibleLogs, setVisibleLogs] = useState([]);
    const logContainerRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullLogs, setFullLogs] = useState('');

    const openModal = async () => {
        setIsModalOpen(true);
        try {
            // host should be API server when doing dev
            const URL = `/game/logs?gid=${gid}&from=0`;
            console.log(URL);
            const response = await fetch(URL); // Replace with your URL
            const data = await response.text();
            setFullLogs(data);
        } catch (error) {
            console.error('Error fetching the logs:', error);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };



    useEffect(() => {
        setVisibleLogs(logs);
    }, [logs]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [visibleLogs]);

    const copyAllText = () => {
        const allText = visibleLogs.map(log => `${log.id}: ${log.layer} ${LogEntry(log).innerText}`).join('\n');
        let clip = navigator.clipboardl
        clip && clip.writeText(allText);
    };

    const customStyles = {
        content: {
            zIndex: 1000, // Ensure the modal has a higher z-index
            position: 'fixed', // Setting position to fixed
        },
        overlay: {
            zIndex: 999, // Ensure the overlay has a high z-index
            position: 'fixed' // Setting position to fixed
        }
    };


    return (
        <DraggableHandle handleClassName="handle1" containerStyle={{ top: '50px', left: '750px' }}>
            <div className="log-container">
                <div className="log-header">
                    <button onClick={copyAllText} onTouchStart={copyAllText} >Copy All Text</button>
                    <button>⚙️</button> {/* Placeholder for settings */}
                    <button onClick={openModal} onTouchStart={openModal}>Full Logs</button>
                </div>
                <div className="log-body" ref={logContainerRef}>
                    {visibleLogs.map(log => (
                        <div key={log.id} className="log-entry">
                            <LogEntry log={log} />
                        </div>
                    ))}
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Full Logs"
                    style={customStyles}
                >
                    <h2>Full Logs</h2>
                    <button onClick={closeModal} onTouchStart={closeModal}>Close</button>
                    <div className="log-content">
                        <pre>{fullLogs}</pre>
                    </div>
                </Modal>
            </div>
        </DraggableHandle>

    );
};

// the effect should have as children n_player, label, and text
const ClickyLabel = (effect) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleText = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <span>
            <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={toggleText}
            >
                {isExpanded ? `P${effect.n_player} ${effect.label} ${effect.text}` : effect.label}
            </span>
            &nbsp;
        </span>
    );
};

const LogEntry = ({ log }) => {
    if (!log) return (<hr />);
    let layer = log.layer;
    let chainimg = getChainImage(layer);
    let img = layer ? (<img valign="bottom" src={chainimg} alt={`L${layer}`} height="20px" width="20px" />) : " - ";
    if (log.action) {
        return (<div className="log-action"> {img}  {log.action}</div>);
    }
    if (log.triggers) {

        //        const triggersHTML = log.triggers.map((trigger, index) => `<div class="log-trigger">Trigger ${index + 1}: ${JSON.stringify(trigger)}</div>`).join('');
        //  const triggersHTML = log.triggers.map((trigger, index) => (<span className="log-trigger">{trigger.label}</span>));

        // const tr = (<span className="log-trigger">{log.triggers.map( t=> t.label ).join(", ")}</span>);
        const tr = (<span className="log-trigger">
            {log.triggers.map((label) => ClickyLabel(label))}
        </span>);


        return (<div className="log-triggers">{img} Triggers: {tr}</div>);
    }
    if (log.event) {
        console.log("log event is "); console.log(log.event);
        console.log(JSON.stringify(log.event));
        const events = log.event.join(", ");
        return (<div className="log-events">{img} {ClickyLabel(log)} {events}</div>)


    }
    return (<div class="log-unknown">{img} Unknown log format</div>);
};

export default LogDisplay;

