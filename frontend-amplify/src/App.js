import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TrashCanCard from './components/trashCanCard';
import Header from './components/header'; 

Amplify.configure(awsconfig);

function App() {
  const { signOut } = useAuthenticator();
  const {
    isLoading,
    isError,
    error,
    data: trashCanData
  } = useQuery(
    {
      queryKey: ['items'],
      queryFn: async () => {
        try {
          const { data } = await axios.get('/items');
          console.log('trash can data', data);
          return data;
        } catch (err) {
          throw new Error(err.message); 
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
    return <div>Error: {error.message}</div>;
  }

  //assuming trashCanData is the data for the first trash can
  const trashDataArray = [trashCanData, null, null];

  return (
    <div className='app'>
      <Header onSignOut={signOut} />
      <div className="flex justify-around my-4">
        {trashDataArray.map((data, index) => {

          const isFull = data && parseInt(data[data.length -1].distance, 10) < 11;
          return (
            <React.Fragment key={index}>
              <TrashCanCard status={isFull} index={index} data={data} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
