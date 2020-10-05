import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './store/user/Provider'
import { PeoplelistProvider } from './store/peoplelist/Provider'
import { ChatProvider } from './store/chat/Provider'
import LogickHandler from './store/Logichandler'

ReactDOM.render(
  <React.StrictMode>
    <ChatProvider>
      <PeoplelistProvider>
        <UserProvider>

          <LogickHandler>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </LogickHandler>

        </UserProvider>
      </PeoplelistProvider>
    </ChatProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
