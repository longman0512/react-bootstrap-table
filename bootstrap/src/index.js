
import App from './App';
import React from 'react';
import StoreContext from "./context/index";
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
function Root() {
  const [store, setStore] = React.useState([]);
  const value = { store, setStore };

  return  <StoreContext.Provider value = {value}>
              <App />
          </StoreContext.Provider>
        ;
}

ReactDOM.render(<Root />, document.getElementById("root"));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
