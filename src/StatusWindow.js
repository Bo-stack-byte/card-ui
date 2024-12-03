
import chain1 from './chain1.png';
import chain2 from './chain2.png';
import chain3 from './chain3.png';
import chain4 from './chain4.png';
import chain5 from './chain5.png';
import chain6 from './chain6.png';
import chain7 from './chain7.png';
import chain8 from './chain8.png';
import chain9 from './chain9.png';

import DraggableHandle from './DraggableHandle';

//font modern futura medium 36 point

export const populate_tree = (tree) => {
    let effects = document.getElementById("effects");
    if (effects) {
        effects.style.display = "none";
        for (let i of [1, 2, 3, 4]) {
            let e = tree[i];
            // console.log(`e ${i} is `);
            if (e) {
                console.log("123123");
                console.log(e);
                let text = e.layer;
                let output = "";
                console.log("text is " + text);
                if (text) {
                    let items = text.split(", ");
                    let m;
                    let fancy = [];
                    for (let item of items) {
                        if ((m = item.match(/DONE:(.*)/))) {
                            fancy.push(`<s>${m[1]}</s>`);
                        } else {
                            fancy.push(item);
                        }

                    }
                    output = fancy.join(", ");
                }

                effects.style.display = "block";
                document.getElementById("text" + i).innerHTML = output;
                document.getElementById("effect" + i).style.display = "block";
            } else {
                document.getElementById("text" + i).innerText = '';
                document.getElementById("effect" + i).style.display = "none";
            }
        }
    }

}

export const StatusWindow = () => {
    /*
        const [visible, setVisible] = useState(true);
    
        const toggleVisibility = () => {
            setVisible(!visible);
        };
    */
    return (
        <DraggableHandle handleClassName="handle2" containerStyle={{ top: '300px', left: '750px' }}>
            <div id={"effects"} style={{ width: '300px', position: "absolute", display: "auto" }} >
                <div style={{ position: 'absolute', border: '1px solid black', padding: '10px', backgroundColor: 'white' }}>
                    <table>
                        <tbody>
                            <tr style={{ display: "none" }} id={"effect1"}><td><img width={30} height={30} alt="layer1" src={chain1} /></td><td id={"text1"}>  </td></tr>
                            <tr style={{ display: "none" }} id={"effect2"}><td><img width={30} height={30} alt="layer2" src={chain2} /></td><td id={"text2"}>   </td></tr>
                            <tr style={{ display: "none" }} id={"effect3"}><td><img width={30} height={30} alt="layer3" src={chain3} /></td><td id={"text3"}>  </td></tr>
                            <tr style={{ display: "none" }} id={"effect4"}><td><img width={30} height={30} alt="layer4" src={chain4} /></td><td id={"text4"}>   </td></tr>
                            <tr style={{ display: "none" }} id={"effect5"}><td><img width={30} height={30} alt="layer5" src={chain5} /></td><td id={"text5"}>   </td></tr>
                            <tr style={{ display: "none" }} id={"effect6"}><td><img width={30} height={30} alt="layer6" src={chain6} /></td><td id={"text6"}>   </td></tr>
                            <tr style={{ display: "none" }} id={"effect7"}><td><img width={30} height={30} alt="layer7" src={chain7} /></td><td id={"text7"}>   </td></tr>
                            <tr style={{ display: "none" }} id={"effect8"}><td><img width={30} height={30} alt="layer8" src={chain8} /></td><td id={"text8"}>   </td></tr>
                            <tr style={{ display: "none" }} id={"effect9"}><td><img width={30} height={30} alt="layer9" src={chain9} /></td><td id={"text9"}>   </td></tr>
                        </tbody></table></div>
            </div>
        </DraggableHandle>

    );
};
