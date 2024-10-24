import React, { useState, useEffect, cloneElement } from 'react';

import Draggable from 'react-draggable';

const ClickableDraggable = ({ children, handleSelector, ...props }) => {
    const [draggingDisabled, setDraggingDisabled] = useState(false);

    const handleTouchStart = (event) => {
        if (event.target.tagName === 'SELECT') {
            setDraggingDisabled(true);
        }
    };

    const handleMouseDown = (event) => {
        if (event.target.tagName === 'SELECT') {
            setDraggingDisabled(true);
        }
    };

    const handleMouseUp = () => {
        setDraggingDisabled(false);
    };

    const handleTouchEnd = () => {
        setDraggingDisabled(false);
    };

    // Enhance children to copy event handlers
    const enhanceChildren = (children) => {
        return React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                const enhancedChild = cloneElement(child, {
                    onClick: (e) => {
                        child.props.onClick && child.props.onClick(e);
                        handleMouseUp();
                    },
                    onTouchStart: (e) => {
                        child.props.onTouchStart && child.props.onTouchStart(e);
                        handleTouchStart(e);
                    }
                });

                // Recursively enhance children if they have children
                if (child.props.children) {
                    return cloneElement(enhancedChild, {
                        children: enhanceChildren(child.props.children)
                    });
                }

                return enhancedChild;
            }
            return child;
        });
    };

    return (
        <Draggable {...props} disabled={draggingDisabled}>
            <div
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </div>
        </Draggable>
    );
};

export default ClickableDraggable;
