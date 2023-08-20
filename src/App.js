import S_DM_1 from "./S_DM_1.js";
import S_DM_2 from "./S_DM_2.js"
import S_TF_1 from "./S_TF_1.js"
import S_TF_2 from "./S_TF_2.js"

import N_DM_1 from "./N_DM_1.js";
import N_DM_2 from "./N_DM_2.js"
import N_TF_1 from "./N_TF_1.js"
import N_TF_2 from "./N_TF_2.js"

import T from "./Tutorial.js"
//    CMLtest_NoSimulation   CMLtest_NoSimulation     Tutorial
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';


axios.defaults.baseURL = "http://166.104.34.158:5012";
axios.defaults.headers.post["content-Type"] = "application/json;charset=utf-8"
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*"

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function App() {
  const [showAlbum, setShowAlbum] = useState(false);
  const [p_no, setP_no] = useState('');
  const [system, setSystem] = useState('');
  const [type, setType] = useState('');
  async function exp_info() {
    console.log(p_no && (system === 'S' || system === 'N' || system === 'T') && (type === 'TF_1' || type === 'TF_2' || type === 'DM_1' || type === 'DM_2' ))
    console.log(system)
    console.log(type)
    console.log(p_no)
    if (p_no && (system === 'S' || system === 'N' || system === 'T') && (type === 'TF_1' || type === 'TF_2' || type === 'DM_1' || type === 'DM_2' )) {
      try {
        const response = await axios.post('/exp_info', {
          p_no:p_no,
          system:system,
          type : type
        });
        
        setShowAlbum(true);
      } catch (e) {
        console.error(e);
      }
    }
  }
  
  return (
    <div className="App">
      {!showAlbum && (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh'}} maxWidth="false">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="system-label">System</InputLabel>
                    <Select
                        labelId="system-label"
                        id="system-select"
                        value={system}
                        onChange={(e) => setSystem(e.target.value)}
                    >
                        <MenuItem value="S">S</MenuItem>
                        <MenuItem value="N">N</MenuItem>
                        <MenuItem value="T">T</MenuItem> 
                    </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                        labelId="type-label"
                        id="type-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value="TF_1">TF_1</MenuItem>
                        <MenuItem value="TF_2">TF_2</MenuItem>
                        <MenuItem value="DM_1">DM_1</MenuItem>
                        <MenuItem value="DM_2">DM_2</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="p_no" variant="filled" value={p_no} onChange={(e) => setP_no(e.target.value)} sx={{ m: 1 }} />
            </div>
            <Button sx={{ mt: 2, width:'10%'}} disabled={!p_no || !system} onClick={() => exp_info()} variant="contained" color="secondary">Start</Button>
        </Container>
        </ThemeProvider>
      )}
      {showAlbum && system === "S" && type === 'TF_1' && <S_TF_1/>}
      {showAlbum && system === "S" && type === 'TF_2' && <S_TF_2/>}
      {showAlbum && system === "S" && type === 'DM_1' && <S_DM_1/>}
      {showAlbum && system === "S" && type === 'DM_2' && <S_DM_2/>}
      {showAlbum && system === "N" && type === 'TF_1' && <N_TF_1/>}
      {showAlbum && system === "N" && type === 'TF_2' && <N_TF_2/>}
      {showAlbum && system === "N" && type === 'DM_1' && <N_DM_1/>}
      {showAlbum && system === "N" && type === 'DM_2' && <N_DM_2/>}
      {showAlbum && system === "T" && <T/>}
    </div>
  );
}