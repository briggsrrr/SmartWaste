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

  const getLastItemDistance = () => {
    if (data && data.length > 0) {
      const lastItem = data[data.length - 1];
      return parseInt(lastItem.distance, 10); 
    }
    return null;
  };

  const lastItemDistance = getLastItemDistance();
  const isTrashCan1Full = lastItemDistance !== null && lastItemDistance < 11;
  const trashCanStatuses = [isTrashCan1Full, false, false];

  return (
    <div className='app'>
      <Header onSignOut={signOut} />
      <div className="flex justify-around my-4">
        {trashCanStatuses.map((status, index) => (
          <React.Fragment key={index}>
          <TrashCanCard key={index} status={status} index={index} data={data ? data : null} />
        </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
