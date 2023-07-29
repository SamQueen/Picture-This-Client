import React from 'react';
import './Popup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark as faXmark } from '@fortawesome/free-solid-svg-icons'

export function Popup(props) {
    return(props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <FontAwesomeIcon 
                    className='exit-btn'
                    onClick={() => props.setTrigger(false)}
                    icon={faXmark} 
                />

                {props.children}
            </div>
        </div>
    ) : "";
}