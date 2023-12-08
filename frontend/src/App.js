import './App.css';
import Logo from "./images/logo.png";
import redTrash from "./images/redtrash.png";
import yellowTrash from "./images/yellowtrash.png";
import greenTrash from "./images/greentrash.png";
import { useState } from 'react';

function App() {
  const [trash, setTrash] = useState(false);
  const [buttonCounter, setButtonCounter] = useState(0);
  // const trashStatus = () => {
    
  // }
  const buttonClick = () => {
    setTrash(!trash);
    setButtonCounter(buttonCounter + 1);
    fetch('http://127.0.0.1:5000/send_sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: '+19492953006' }),  // The recipient's number
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className='app'>
      <img src={Logo} alt="Logo" />
      <div className='text'>
        <h1 className='app-welcome'>Welcome to Smart waste!</h1>
        {!trash && buttonCounter === 0 && (
          <img className="trash" src={redTrash} alt="Red Trash" />
        )}
        {trash && buttonCounter === 1 && (
          <img className="trash" src={yellowTrash} alt="Yellow Trash" />
        )}
        {trash && buttonCounter === 2 && (
          <img className="trash" src={greenTrash} alt="Green Trash" />
        )}
      </div>
      <div className="button-container">
        {!trash && buttonCounter===0 &&(
          <button className='button' onClick={buttonClick}>Send SMS</button>
          )}
        </div>
      <div className='details'>        
        <h1 className='app-welcome-details'> Does the trash need to be taken out?</h1>
        <h1 className='app-welcome-details-trash'>(if your trashcan needs to be taken out, the trash can will be red. Otherwise, it is not full yet!)</h1>
      </div>
        
    </div>
  );
}

export default App;
