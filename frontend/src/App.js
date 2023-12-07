import './App.css';
import Logo from "./images/logo.png";
import redTrash from "./images/redtrash.png";
import greenTrash from "./images/greentrash.png";
import { useState } from 'react';

function App() {
  const [trash, setTrash] = useState(false);
  const buttonClick = () => {
    setTrash(!trash);
  };

  return (
    <div className='app'>
      <img src={Logo} alt="Logo" />
      <div className='text'>
        <h1 className='app-welcome'>Welcome to Smart waste!</h1>
        <img className="trash" src={trash ? greenTrash : redTrash} alt="Trash" />
      </div>
      <div className="button-container">
        {!trash && (
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
