import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Popup.css'

function Popup(props) {
  const { message, type, onConfirm, onCancel, onClose, needRedirect, urlRedirect } = props;
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  /*
    PopUp Description

    Version 1.0
    PopUp is created with props that is usefull to customize based on the usecases
    message - The text to be printed inside the popup
    type - either confirm or not confirm(anything else)
          confirm type will render buttons that user can click which is Yes or No
          success type will render text to user on positive note
          error type will render text to user on negative note
    onConfirm & onCancel - can brings function from where the popup is used
                          thus, when user click yes, the function passed to onConfirm will be executed
    onClose - brings function when user close the popup. required to make sure popup works perfectly in not confirm type
    needRedirect - boolean if need to direct user to other page
    urlRedirect - path to direct user

    Implementaion example can refer to crud.js
  */

  function handleClosePopup() {
    setVisible(false);

    if(onClose) {
      onClose();
    }
    
    if (needRedirect) {
      navigate(urlRedirect);
    }
  }

  function handleConfirm() {
    handleClosePopup();
    if (onConfirm) {
      onConfirm();
    }
  }

  function handleCancel() {
    handleClosePopup();
    if (onCancel) {
      onCancel();
    }
  }

  if(!visible) {
    return null;
  }

  return (
    <div className={`popup popup-${type}`}>
      {visible && (
        <>
        <div className='popup-box'>
          <div className='popup-message'>
            {message}
          </div>
          <div className='popup-buttons-container'>
            {type === 'confirm' && (
              <>
                <button onClick={handleConfirm} className="buttonPopup">Yes</button>
                <button onClick={handleCancel} className="buttonPopup">No</button>
              </>
            )}
            {type !== 'confirm' && (
              <button onClick={handleClosePopup} className="buttonPopup">Close</button>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default Popup;
