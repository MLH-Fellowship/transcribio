import React, { Component } from 'react';
import AppLayout from './components/AppLayout';
import { SnackbarProvider } from 'notistack';

class App extends Component {
  render() {
    return (
      <div>
        <SnackbarProvider>
          <AppLayout />
        </SnackbarProvider>
      </div>
    );
  }
}

export default App;
