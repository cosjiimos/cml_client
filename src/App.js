import Album from "./Tutorial.js";
//    CMLtest_NoSimulation   CMLtest_NoSimulation     Tutorial
import { createTheme } from '@mui/material/styles'; 
import { useEffect } from 'react';
import React, { useState } from 'react'; 
import axios from 'axios';


axios.defaults.baseURL = "http://166.104.34.158:5010";
axios.defaults.headers.post["content-Type"] = "application/json;charset=utf-8"
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*"

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});


export default function App () {

 //버튼&슬라이더 변경! 
 return (
  <div className="App">
    <Album/>
  </div>
);
}