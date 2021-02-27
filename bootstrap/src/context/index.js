import React from "react";

// set the defaults
const StoreContext = React.createContext({
  store: [
  ],
  setData: ()=>{}
});

export default StoreContext;