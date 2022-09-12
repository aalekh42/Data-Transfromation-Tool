import React from 'react';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Demo from './components/Demo';
import { Provider } from "react-redux";
import store from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* <Route exact path="/" element={<Home />}></Route> */}
          <Route exact path="/" element={<Demo />}></Route>

        </Routes>
      </Router>
    </Provider>
  );
}
