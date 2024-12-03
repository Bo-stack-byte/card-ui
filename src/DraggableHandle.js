import React from 'react';
import Draggable from 'react-draggable';

const DraggableHandle = ({ children, handleClassName, handleStyle, containerStyle }) => {
  return (
    <Draggable handle={`.${handleClassName}`}>
      <div
        style={{
          position: 'absolute',
          ...containerStyle,
        }}
      >
        <div
          className={handleClassName}
          style={{
            position: 'absolute',
            top: '0',
            left: '-30px', // Adjust this value to control the handle's position
            width: '30px',
            height: '30px',
            background: 'gray',
            cursor: 'grab',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            ...handleStyle,
          }}
        >
          <span style={{ fontSize: '20px', color: 'white' }}>|||</span>
        </div>
        <div
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            background: 'white',
            ...containerStyle, // Added containerStyle here for flexibility
          }}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableHandle;
