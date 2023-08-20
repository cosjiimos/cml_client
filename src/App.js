import T from "./Tutorial.js";
import S from "./CMLtest_Simulation.js"
import N from "./CMLtest_NoSimulation.js"
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
  async function exp_info() {
    if (p_no && (system === 'simul' || system === 'nosimul' || system === 'tutorial')) {
      try {
        const response = await axios.post('/exp_info', {
          p_no:p_no,
          system:system
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
                <TextField label="p_no" variant="filled" value={p_no} onChange={(e) => setP_no(e.target.value)} sx={{ m: 1 }} />
            </div>
            <Button sx={{ mt: 2, width:'10%'}} disabled={!p_no || !system} onClick={() => exp_info()} variant="contained" color="secondary">Start</Button>
        </Container>
        </ThemeProvider>
      )}
      {showAlbum && system === "S" && <S/>}
      {showAlbum && system === "N" && <N/>}
      {showAlbum && system === "T" && <T/>}
    </div>
  );
}