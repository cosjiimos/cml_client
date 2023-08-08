import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
// import Modal  from '@mui/material/Modal ';
import Slider from '@mui/material/Slider';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import React, { useRef, Suspense, useState } from 'react'; 
import axios from 'axios';
import { IconButton } from '@mui/material';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SendIcon from '@mui/icons-material/Send';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const cards = [1];












export default function Album () {
  const [pageNum, setPageNum] = useState(0); // 현재 page num (0번부터 시작)
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [open, setOpen] = useState(false);
  const imageContext = require.context('./images', false, /\.(jpg|jpeg|png)$/);
  const allImages = imageContext.keys().map(imageContext);
  const [showBackgroundButtons, setshowBackgroundButtons] = useState(false);
  const [showFurnitureButtons, setshowFurnitureButtons] = useState(false);
  // 현재 페이지에 맞는 이미지 선택
  const currentImages = allImages.slice(pageNum * 16, (pageNum + 1) * 16);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const handleUpClick = () => {
    setPageNum(pageNum - 1); 
  };

  const handleDownClick = () => {
    // 이미지 배열의 범위를 초과하지 않게 PageNum 고려
    if ((pageNum + 1) * 16 < allImages.length) {
      setPageNum(prevNum => prevNum + 1);
    }
  };



  const imghandleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  
  const imghandleClose = () => {
    setOpen(false);
  };


 
  useEffect(() => {
    const loadImage = async () => {
      const image = await import('./images/cards_2063650.jpg');
      setBackgroundImage(image.default);
    };
    loadImage();
  
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* <AppBar position="relative">
        <Toolbar sx={{ backgroundColor: 'white' }}>
          <Typography variant="h4" color="inherit" noWrap sx={{ textAlign: 'center', width: '100%', color : '#BE7A7B' , fontWeight : 'bold'}}>
            Furnishing Pairing System
          </Typography>
        </Toolbar>
      </AppBar> */}
      <main>
        <Container sx={{ py: 4}} maxWidth="false" >
          <Grid container spacing={0} justifyContent="flex-end">
            <Grid item xs={1}>
              <Button
                variant="outlined"
                endIcon={<AddShoppingCartIcon/>}
                sx={{ fontWeight: 'bold', width: '90px', height: '40px', color: 'gray', borderColor: 'gray', marginRight: '5px' }}
              >
                Cart
              </Button>
              <IconButton onClick={handleUpClick} disabled={pageNum === 0}>
                <KeyboardArrowUpRoundedIcon sx={{ fontSize: 40}} />
              </IconButton>
              <IconButton onClick={handleDownClick}>
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Grid>
            {/* <Grid item xs={0.5}>
              <Divider orientation="vertical" />
            </Grid> */}
          </Grid>           
        </Container>



        <Container sx={{ py: 4 }} maxWidth={false}>
          <Grid Grid container spacing={4}>
            <Grid item xs={2}>
              <Card
                sx={{ width: '360px', height: '240px', display: 'flex', flexDirection: 'column', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onClick={imghandleOpen}
              ></Card>
            <Box sx={{ mb: 4 }} />
            <Grid item>
              <Button variant="outlined" sx={{ borderColor: '#000', color: '#000', fontWeight: 'bold' }} onClick={() => setshowBackgroundButtons(!showBackgroundButtons)}>
                background
              </Button>
            </Grid>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            {showBackgroundButtons && ( // showButtons가 true일 때만 아래 버튼들을 렌더링
            <>
            <Grid item>
              <Button variant="filled" sx={{ width: '130px', height: '25px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Wall
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{width: '130px', height: '25px',  backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Floor
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{width: '130px',height: '25px', height: '25px',   backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Windowpane
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{width: '130px', height: '25px',  backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Ceiling
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{ width: '130px', height: '25px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Door
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>

              <Box sx={{ mb:3 }} />
            </>
           )}
            <Grid item>
              <Button variant="outlined" sx={{ borderColor: '#000', color: '#000', fontWeight: 'bold' }} onClick={() => setshowFurnitureButtons(!showFurnitureButtons)}>
                Furniture
              </Button>
            </Grid>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            {showFurnitureButtons && ( // showButtons가 true일 때만 아래 버튼들을 렌더링
            <>
            <Grid item>
              <Button variant="filled" sx={{ width: '130px', height: '25px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Sofa
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{width: '130px', height: '25px',  backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Table
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{width: '130px',height: '25px', height: '25px',   backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Cabinet
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{width: '130px', height: '25px',  backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Chair
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{ width: '130px', height: '25px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                Shelf
              </Button>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            </Grid>

              <Box sx={{ mb: 2 }} />
            </>
           )}
            <Box sx={{ mb: 3 }} />
            <Grid item>
              <Button variant="outlined" sx={{ borderColor: '#000', color: '#000', fontWeight: 'bold',marginLeft : '260px' }} endIcon={<SendIcon />}>
                Send
              </Button>
            </Grid>

            <Dialog open={open} onClose={imghandleClose}>
              <img src={backgroundImage}  style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </Dialog>


          </Grid>


          <Grid item xs={10}>
            <Grid container spacing={3}>
              {currentImages .map((image, index) => (
              // 카드 크기에 맞춰서 줌인
                <Grid item xs={3} key={index}>
                  <Card
                    sx={{ width: '100%', height: '240px', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => imghandleOpen(image)}
                  ></Card>
                </Grid>
              //  원본 이미지 보존
              // <Grid item xs={3} key={index}>
              //   <Card
              //     sx={{ width: '100%', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              //     onClick={() => imghandleOpen(image)}
              //   >
              //     <img src={image} alt={`Image ${index}`} style={{ maxWidth: '100%', maxHeight: '240px' }} />
              //    </Card>
              // </Grid>
              ))}
            </Grid>
            <Dialog open={open} onClose={imghandleClose}>
              <img src={selectedImage}  style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </Dialog>
          </Grid>
      </Grid>
    </Container>
        
        
      </main>
    </ThemeProvider>
  );
}
