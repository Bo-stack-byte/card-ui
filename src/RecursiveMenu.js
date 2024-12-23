import React from 'react';

const RecursiveMenu = ({ data, doButton, handleSubmenuOpen }) => {
    return (
        <div>
            {data.map((item, index) => (
                <span key={index}>
                    {item.submenu && item.submenu.length > 0 ? (
                        item.submenu.length === 1 ? (
                            // Directly show the single submenu item
                            <button onClick={doButton} value={item.submenu[0].command}>
                                {item.text + " " + item.submenu[0].text}
                            </button>
                        ) : (
                            // Show the button to open submenu
                            <button onClick={() => handleSubmenuOpen(item.submenu)} value={item.command}>
                                {item.text}...
                            </button>
                        )
                    ) : (
                        // Show the button for the current item
                        <button onClick={doButton} value={item.command}>
                            {item.text}
                        </button>
                    )}
                </span>
            ))}
        </div>
    );
};



export default RecursiveMenu;
