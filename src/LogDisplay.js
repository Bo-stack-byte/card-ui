import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
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


function getChainImage(i) {
    switch (i) {
        case 1: return chain1;
        case 2: return chain2;
        case 3: return chain3;
        case 4: return chain4;
        case 5: return chain5;
        case 6: return chain6;
        case 7: return chain7;
        case 8: return chain8;
        case 9: return chain9;
    }
}

const LogDisplay = ({ logs }) => {
    const [visibleLogs, setVisibleLogs] = useState([]);
    const logContainerRef = useRef(null);

    useEffect(() => {
        setVisibleLogs(logs);
    }, [logs]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [visibleLogs]);

    const copyAllText = () => {
        const allText = visibleLogs.map(log => `${log.id}: ${log.message}`).join('\n');
        navigator.clipboard.writeText(allText);
    };

    return (
        <Draggable>
            <div className="log-container">
                <div className="log-header">
                    <button onClick={copyAllText}>Copy All Text</button>
                    <button>⚙️</button> {/* Placeholder for settings */}
                </div>
                <div className="log-body" ref={logContainerRef}>
                    {visibleLogs.map(log => (
                        <div key={log.id} className="log-entry">
                            <LogEntry log={log} />
                        </div>
                    ))}
                </div>
            </div>
        </Draggable>

    );
};


const LogEntry = ({ log }) => {
    let layer = log.layer;
    let chainimg = getChainImage(layer);
    if (log.action) {
        return (<div className="log-action"><img valign="bottom" src={chainimg} alt={layer} height="20px" width="20px" /> {log.action}</div>);
    }
    if (log.triggers) {
        //        const triggersHTML = log.triggers.map((trigger, index) => `<div class="log-trigger">Trigger ${index + 1}: ${JSON.stringify(trigger)}</div>`).join('');
        //  const triggersHTML = log.triggers.map((trigger, index) => (<span className="log-trigger">{trigger.label}</span>));
        const tr = (<span className="log-trigger">{log.triggers.map( t=> t.label ).join(", ")}</span>);
        
        return (<div className="log-triggers"><img valign="bottom" src={chainimg} alt={layer} height="20px" width="20px" /> Triggers: {tr}</div>);
    }
    return (<div class="log-unknown">Unknown log format</div>);
};

export default LogDisplay;

