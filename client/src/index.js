import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import store from './store';
import { Provider } from 'react-redux';
import AlertTemplate from "react-alert-template-basic";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
//import { Provider as AlertProvider } from 'react-alert'

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  //offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

ReactDOM.render(
  <React.StrictMode> 
    <Provider store={store} >
      <BrowserRouter>
    <AlertProvider template={AlertTemplate} {...options}>
        <App />
    </AlertProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals