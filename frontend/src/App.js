import './App.css';
import Logo from "./images/logo.png";
import redTrash from "./images/redtrash.png";
import yellowTrash from "./images/yellowtrash.png";
import greenTrash from "./images/greentrash.png";
import { useEffect, useState } from 'react';

function App() {
  const [isTrashFull, setIsTrashFull] = useState(false);
  const [buttonCounter, setButtonCounter] = useState(0);

  const trashStatus = async () => {
    fetch('/items')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      const mostRecentItem = data[data.length - 1];
      if (mostRecentItem.distance<10) {
        setIsTrashFull(true);
        console.log(mostRecentItem.distance);
        console.log(isTrashFull);
      }
      else{
        console.log(mostRecentItem.distance);
        console.log(isTrashFull);
        setIsTrashFull(false)
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
    //if timestamp && id is still same timestamp set trash to false otherwise trash is true
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      trashStatus();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const buttonClick = () => {
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
        {isTrashFull &&(
          <img className="trash" src={redTrash} alt="Red Trash" />
        )}
        {/* {isTrashFull &&(
          <img className="trash" src={yellowTrash} alt="Yellow Trash" />
        )} */}
        {!isTrashFull && (
          <img className="trash" src={greenTrash} alt="Green Trash" />
        )}
      </div>
      <div className="button-container">
        {isTrashFull && buttonCounter===0 &&(
          <button className='button' onClick={buttonClick}>Send SMS</button>
          )}
        </div>
      <div className='details'>
      {isTrashFull && buttonCounter === 0 && (
          <h1 className='app-welcome-details'> The trash needs to be taken out!</h1>

        )}
        {isTrashFull && buttonCounter === 1 && (
          <h1 className='app-welcome-details'> Waiting for someone to take out the trash!</h1>

        )}
        {!isTrashFull &&(
          <h1 className='app-welcome-details-trash'>The Trash is not full yet!</h1>
        )}      
      </div>
        
    </div>
  );
}

export default App;
