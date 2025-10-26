import React, { useState } from 'react';

const RecursiveMenu = ({ doButton, moves, closeMenu, isSelected, toggleSelect }) => {
    const [currentLevel, setCurrentLevel] = useState(0); // State to track the current menu level
    const [menuPath, setMenuPath] = useState([moves]); // State to track the path to the current menu


    let data = menuPath[currentLevel]

    const getParentText = () => {
        if (currentLevel > 0 && menuPath[currentLevel - 1].length > 0) {
            console.log(681, currentLevel, menuPath);
            return menuPath[currentLevel][0].parenttext + ":";
            //      return menuPath[currentLevel - 1][0].text; // Get the text field of the parent level
        }
        return 'Back';
    }

    const handleSubmenuOpen = (submenu) => {
        console.log(616, menuPath, submenu);
        setMenuPath([...menuPath, submenu]);
        setCurrentLevel(currentLevel + 1);
    };
    const handleBack = () => {
        setMenuPath(menuPath.slice(0, -1));
        setCurrentLevel(currentLevel - 1);
    };

    const finalButton = (item) => {
        return isSelected ? (
            // Show the button for the current item
            // for a single-select, just 1 button, {doButton}
            // for a multi-select, we need 3 functions: {isSelected}, {toggleSelection}, and {submit}
            <span>
                <input type="checkbox"
                checked={isSelected(item.command)}
                onClick={toggleSelect} value={item.command} />
                <button onClick={toggleSelect} value={item.command}>
                    {item.text}
                </button>
                <button onClick={doButton} value="multiSelect" >
                    Go
                </button>
            </span>
        ) : (
            <button onClick={doButton} value={item.command}>
                {item.text}
            </button>
        )};

    return (
        <div>
            {(currentLevel > 0 && (
                <button onClick={handleBack}>{getParentText()}</button>
            )) || (
                    <button onClick={closeMenu}>×</button>
                )}
            {data.map((item, index) => (
                <span key={index}>
                    {item.submenu && item.submenu.length > 0 ? (
                        item.submenu.length === 1 ? (
                            // Directly show the single submenu item
                            <span>
                                <checkbox />
                                <button onClick={doButton} value={item.submenu[0].command}>
                                    {item.text + " " + item.submenu[0].text}
                                </button>
                            </span>
                        ) : (
                            // Show the button to open submenu
                            <button onClick={() => handleSubmenuOpen(item.submenu)} value={item.command}>
                                {item.text}...
                            </button>
                        )
                    ) : finalButton(item)}
                </span>
            ))}
        </div>
    );
};



export default RecursiveMenu;
