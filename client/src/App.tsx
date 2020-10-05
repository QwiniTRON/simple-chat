import React, { useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom'
import Auth from './containers/Auth'
import Chat from './containers/Chat'
import Lookfor from './containers/LookFor'
import socket from './utils/SocketConnect'
import { userContext } from './store/user/context'
import { UserValueContext } from './store/user/Provider'
import Logout from './components/Logout/Logout'
import { PeoplelistValueContext } from './store/peoplelist/Provider'
import { peopleListContext } from './store/peoplelist/context'
import { chatContext } from './store/chat/context'
import { ChatValueContext } from './store/chat/Provider'
import Friends from './containers/Friends'

function App() {
  const userStore: UserValueContext = useContext(userContext)
  const peoplelistStore: PeoplelistValueContext = useContext(peopleListContext)
  const chatStore: ChatValueContext = useContext(chatContext)

  
  useEffect(() => {
    userStore.methods.INIT()
  }, []);
  useEffect(() => {
    if(userStore.state.id){
      socket.refresh()
      peoplelistStore.methods.INIT_PEOPLELIST(true, socket.current!)
      chatStore.methods.INIT_CHAT(socket.current!)
    }
  }, [userStore.state.id]);

  const routes = [
    {
      path: "/chat",
      component: Chat,
      exact: true
    },
    {
      path: "/users",
      component: Lookfor,
      exact: true
    },
    {
      path: "/friends",
      component: Friends,
      exact: true
    },
    {
      path: "/chat/:id",
      component: Chat,
      exact: true
    }
  ];
  if (!userStore.state.id) routes.push({
    path: "/auth",
    component: Auth,
    exact: true
  });
  else routes.push({
    path: "/logout",
    component: Logout,
    exact: true
  });
  const routesJsx = routes.map((el) => (
    <Route path={el.path} exact={el.exact} component={el.component} key={el.path} />
  ));


  return (
    <div className="App">
      <Switch>
        {/* <Route path="/auth" component={Auth} />
        <Route exact path="/chat" component={Chat} />
        <Route exact path="/users" component={Lookfor} /> */}
        {routesJsx}
        <Redirect to="/chat" />
      </Switch>
    </div>
  );
}

export default App;