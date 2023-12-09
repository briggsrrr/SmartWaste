import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const { signOut } = useAuthenticator();
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch('/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => signOut()}>Log Out</button>
        {items && <pre>{JSON.stringify(items, null, 2)}</pre>} {/* Display the fetched data */}
      </header>
    </div>
  );
}

export default withAuthenticator(App);
