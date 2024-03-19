import React, {useEffect, useState} from 'react';
import './css/style.css';
import axios from 'axios';
import Layout from "./Component/Header";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Transaction from "./View/Transaction";
import Operation from "./View/Operation";
import Account from "./View/Account";
import History from "./View/History";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    userId: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  async function fetchData() {
      return axios.get('http://localhost:8080/api/v1/user')
          .then(response => response.data.data[0])
          .catch(error => {
              console.error('Error fetching data:', error);
              throw error;
          });
  }

  useEffect(() => {
    fetchData().then(userData => setUser(userData))
        .catch(error => console.error('Error setting user:', error));
  }, [])

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={user ? <Layout data={user} /> : <div>Loading...</div>}>
                  <Route index element={user ? <Account data={user} /> : <div>Loading...</div>} />
                  <Route path="transaction" element={user ? <Transaction data={user} /> : <div>Loading...</div>} />
                  <Route path="history/:accountId" element={<History/>} />
                  <Route path="operation" element={user ? <Operation data={user} /> : <div>Loading...</div>} />
                  <Route path="*" element={<div>Error 404</div>} />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
