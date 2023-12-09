import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import Logo from "./images/logo.png";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import redTrash from "./images/redtrash.png";
import yellowTrash from "./images/yellowtrash.png";
import greenTrash from "./images/greentrash.png";

Amplify.configure(awsconfig);

function App() {
  const { signOut } = useAuthenticator();
  const {
    isLoading,
    isError,
    error,
    data
  } = useQuery(
    {
      queryKey: ['items'],
      queryFn: async () => {
        try {
          const { data } = await axios.get('/items');
          console.log('trash can data', data);
          return data;
        } catch (err) {
          throw new Error(err.message); // Throwing an error to be caught by react-query
        }
      },
      refetchInterval: 1000,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error('Error fetching data:', error);
    return <div>Error: {error.message}</div>; // Displaying the error message on the UI
  }

  const getLastItemDistance = () => {
    if (data && data.length > 0) {
      // Accessing 'distance' of the last item in the data array
      const lastItem = data[data.length - 1];
      return parseInt(lastItem.distance, 10); // Typecasting to integer
    }
    return null;
  };

  // const [buttonCounter, setButtonCounter] = useState(0);
  const lastItemDistance = getLastItemDistance();
  const isTrashFull = lastItemDistance !== null && lastItemDistance < 11;

  // const buttonClick = () => {
  //       setButtonCounter(buttonCounter + 1);
  //       fetch('http://127.0.0.1:5000/send_sms', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ to: '+19492953006' }),  // The recipient's number
  //       })
  //       .then(response => response.json())
  //       .then(data => {
  //         console.log('Success:', data);
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error);
  //       });
  //     };

   return (
        <div className='app'>
          <img src={Logo} alt="Logo" />
          <div className='text'>
            <h1 className='app-welcome'>Welcome to Smart waste!</h1>
            {isTrashFull ===0 &&(
              <img className="trash" src={redTrash} alt="Red Trash" />
            )}
            {isTrashFull ===1 &&(
              <img className="trash" src={yellowTrash} alt="Yellow Trash" />
            )}
            {!isTrashFull && (
              <img className="trash" src={greenTrash} alt="Green Trash" />
            )}
          </div>
          <div className="button-container">
            {isTrashFull &&(
              <button className='button'>Send SMS</button>
              )}
            </div>
          <div className='details'>
          {isTrashFull && (
              <h1 className='app-welcome-details'> The trash needs to be taken out!</h1>
    
            )}
            {isTrashFull && (
              <h1 className='app-welcome-details'> Waiting for someone to take out the trash!</h1>
    
            )}
            {!isTrashFull &&(
              <h1 className='app-welcome-details-trash'>The Trash is not full yet!</h1>
            )}      
          </div>
             <button onClick={() => signOut()}>Log Out</button>
        </div>
      );
    }
    

export default withAuthenticator(App);
