import React, { Component } from 'react';
import AppLayout from './components/AppLayout';
import { SnackbarProvider } from 'notistack';
import { Route } from 'react-router-dom';
import PermLayout from './components/PermLayout';

class App extends Component {
  render() {
    return (
      <div>
        <SnackbarProvider>
        <Route exact path="/" component={AppLayout} />
        <Route path="/v/:permId" component={PermLayout} />
        </SnackbarProvider>
      </div>
    );
  }
}

export default App;
