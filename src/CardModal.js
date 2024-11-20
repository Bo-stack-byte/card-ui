import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element for accessibility

const customStyles2 = {
    content: {
        zIndex: 1000, // Ensure the modal has a higher z-index
        position: 'fixed', // Setting position to fixed
    },
    overlay: {
        zIndex: 999, // Ensure the overlay has a high z-index
        position: 'fixed' // Setting position to fixed
    }
};


const customStyles = {
     content: { 
        zIndex: 1000, position: 'fixed', top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 'auto', height: '100vh', 
        maxHeight: '100vh', overflow: 'auto',  background: 'transparent', 
        border: 'none', 
    }, 
    overlay: { 
        zIndex: 999,
         position: 'fixed',
         backgroundColor: 'rgba(0, 0, 0, 0.75)'
         } 
        }





const CardModal = ({ imageUrl, isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Card Image"
            style={customStyles}
        >
            <img src={imageUrl} alt="Card" className="modal-image" onClick={onClose} />
        </Modal>
    );
};

export default CardModal;
