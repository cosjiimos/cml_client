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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

axios.defaults.baseURL = "http://166.104.34.158:5004";
axios.defaults.headers.post["content-Type"] = "application/json;charset=utf-8"
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*"

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});


export default function Album () {
  const [pageNum, setPageNum] = useState(0); // 현재 page num (0번부터 시작)
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [open, setOpen] = useState(false);
  const imageContext = require.context('./img', false, /\.(jpg|jpeg|png)$/);
  // console.log(imageContext)
  const allImages = imageContext.keys().map(imageContext);
  const [showBackgroundButtons, setshowBackgroundButtons] = useState(false);
  const [showFurnitureButtons, setshowFurnitureButtons] = useState(false);
  //슬라이더값 send버튼 누르면 값 콘솔창에 보내기
  
  // 현재 페이지에 맞는 이미지 선택
  const [serverImages, setServerImages] = useState([]);
  // const currentImages = serverImages.slice(pageNum * 16, (pageNum + 1) * 16);
  const currentImages = serverImages;
  const [selectedImage, setSelectedImage] = useState(null);
  // const currentImages = allImages.slice(pageNum * 16, (pageNum + 1) * 16);

  // 장바구니 이미지
  const [cartImages, setcartImages] = useState([]);
  const [showSelected, setShowSelected] = useState(false);
  const [viewSelectedImages, setViewSelectedImages] = useState(false);
  //세부 파라미터 버튼
  const [Back_controls, Back_setControls] = useState([
    { name: 'Wall', disabled: true },
    { name: 'Floor', disabled: true },
    { name: 'Windowpane', disabled: true },
    { name: 'Ceiling', disabled: true },
    { name: 'Door', disabled: true },
  ]);
  const [Furn_controls, Furn_setControls] = useState([
    { name: 'Sofa', disabled: true },
    { name: 'Table', disabled: true },
    { name: 'Cabinet', disabled: true },
    { name: 'Chair', disabled: true },
    { name: 'Shelf', disabled: true },
  ]);
  //슬라이더값 send버튼 누르면 값 콘솔창에 보내기
  const [backSliderValues, setBackSliderValues] = useState(Array(Back_controls.length).fill(null));
  const [furnSliderValues, setFurnSliderValues] = useState(Array(Furn_controls.length).fill(null));
  const [backsavedValues, setbackSavedValues] = useState(Array(Back_controls.length).fill(null)); // 저장된 값 초기화
  const [furnsavedValues, setfurnSavedValues] = useState(Array(Back_controls.length).fill(null)); // 저장된 값 초기화

  async function sendWeight(back, furn) {
    try {
      const response = await axios.post('/save_back_slider_values', { 
        back_weight: back,
        furn_weight: furn
      });
      const res = response.data; // JSON 응답에서 필요한 데이터 추출
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  } 

  // 이미지를 가져오는 함수
  async function fetchImages(pageNum, image) {
    try {
      const response = await axios.post('/get_images', { 
        pageNum:pageNum,
        target_image_name : image
       });
      const currentImages = response.data.images;
      setServerImages(currentImages);
      console.log('cI: ', serverImages)
      console.log('SI: ', serverImages)
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  // pageNum이 변경될 때마다 fetchImages를 호출
  useEffect(() => {
    fetchImages(pageNum, backgroundImage);
  }, [pageNum]);


  const handleBackSliderChange = (index, event, newValue) => {
    const newSliderValues = [...backSliderValues];
    newSliderValues[index] = newValue;
    setBackSliderValues(newSliderValues);

  };
  const handleFurnSliderChange = (index, event, newValue) => {
    const newSliderValues = [...furnSliderValues];
    newSliderValues[index] = newValue;
    setFurnSliderValues(newSliderValues);
  };

  const handleSendClick = () => {
    console.log('Back Controls:', backSliderValues);
    console.log('Furn Controls:', furnSliderValues);
    sendWeight(backSliderValues, furnSliderValues);
    fetchImages(pageNum, backgroundImage);
  };


  const Back_toggleSlider = (index) => {
    const Back_updatedControls = [...Back_controls];
    Back_updatedControls[index].disabled = !Back_updatedControls[index].disabled;
    console.log(Back_updatedControls[index])
    Back_updatedControls[index].active = !Back_updatedControls[index].active;
    if (Back_controls[index].disabled) {
      // 비활성화되면 현재 값을 저장하고 sliderValues에서는 null로 설정
      const newSavedValues = [...backsavedValues];
      newSavedValues[index] = backSliderValues[index];
      setbackSavedValues(newSavedValues);
      backSliderValues[index] = null;
    } else {
      // 활성화되면 저장된 값을 사용
      backSliderValues[index] = backsavedValues[index];
    }
    setBackSliderValues(backSliderValues);

    Back_setControls(Back_updatedControls);
  };

  const Furn_toggleSlider = (index) => {
    const Furn_updatedControls = [...Furn_controls];
    Furn_updatedControls[index].disabled = !Furn_updatedControls[index].disabled;
    Furn_updatedControls[index].active = !Furn_updatedControls[index].active;
    if (Furn_controls[index].disabled) {
      // 비활성화되면 현재 값을 저장하고 sliderValues에서는 null로 설정
      const newSavedValues = [...furnsavedValues];
      newSavedValues[index] = furnSliderValues[index];
      setfurnSavedValues(newSavedValues);
      furnSliderValues[index] = null;
    } else {
      // 활성화되면 저장된 값을 사용
      furnSliderValues[index] = furnsavedValues[index];
    }
    setFurnSliderValues(furnSliderValues);
    Furn_setControls(Furn_updatedControls);
  };

  const handleViewSelectedImages = () => {
    setViewSelectedImages(true);
  };
  
  const handleCloseSelectedImages = () => {
    setViewSelectedImages(false);
  };


  const toggleSelectImage = (image) => {
    if (cartImages.includes(image)) {
      setcartImages(prev => prev.filter(img => img !== image));
    } else {
      setcartImages(prev => [...prev, image]);
    }
    console.log(cartImages)
  };
  

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
    setServerImages(image);
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
      <main>
        <Container sx={{ py: 4}} maxWidth="false" >
          <Grid container spacing={0} justifyContent="flex-end">
            <Grid item xs={1.5}>
              <Button
                variant="outlined"
                endIcon={<AddShoppingCartIcon/>}
                sx={{ fontWeight: 'bold', width: '90px', height: '40px', color: 'gray', borderColor: 'gray', marginRight: '5px' }} onClick={handleViewSelectedImages}
              >
                Cart
              </Button>
              <Dialog open={viewSelectedImages} onClose={handleCloseSelectedImages}  maxWidth="false " PaperProps={{
                  style: {
                    height: '100%', 
                    width: '100%', 
                  },
                }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 3 }}>
                  <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold', padding: '2px 3px' }} onClick={handleCloseSelectedImages}>
                    닫기
                    <CloseIcon></CloseIcon>
                  </Button></Box>
                <Grid container spacing={6}>
                  {cartImages.map((image, index) => (
                    <Grid item xs={12} sm={4} md={4} lg={2} key={index}>
                      <Card
                        sx={{
                          width: '90%',
                          height: '240px',
                          backgroundImage: `url(${image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          margin: ' 20px'
                        }}
                      ><Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 0 }}>
                      <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' ,padding: '2px 3px' }} onClick={() => toggleSelectImage(image)}>
                        {cartImages.includes(image) ? (
                          <RemoveCircleOutlineIcon fontSize="small" /> // 이미지가 선택된 경우
                        ) : (
                          <AddCircleOutlineIcon fontSize="small" /> // 이미지가 선택되지 않은 경우
                        )}
                      </Button>
                      <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => toggleSelectImage(image)}>
                        <AutoFixHighIcon fontSize="small" />
                      </Button>
                      <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => imghandleOpen(image)}>
                        <ImageSearchIcon fontSize="small" />
                      </Button>
                    </Box></Card>
                    </Grid>
                  ))}
                </Grid>
              </Dialog>
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
          <Grid Grid container spacing={2}>
          <Grid item xs={0.4}></Grid>
            <Grid item xs={1.6}>
              <Card
                sx={{ width: '360px', height: '240px', display: 'flex', flexDirection: 'column', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button variant="filled" sx={{ color: '#fff', fontWeight: 'bold' ,width : '10px'}} onClick={() => imghandleOpen(backgroundImage)}>
                    <ImageSearchIcon fontSize="small" />
                  </Button>
                </Box>
                <Dialog open={open} onClose={imghandleClose}>
                  <img src={backgroundImage}  style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Dialog>
              </Card>
              <Box sx={{ mb: 4 }} />
            <Grid item>
              <Button variant="outlined" sx={{ borderColor: '#000', color: '#000', fontWeight: 'bold' }} onClick={() => setshowBackgroundButtons(!showBackgroundButtons)}>
                background
              </Button>
            </Grid>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" size="small" sx={{width: '360px', color: '#000'}} />
            {showBackgroundButtons && ( // showButtons가 true일 때만 아래 버튼들을 렌더링
            <>
            <Grid container>
                  {Back_controls.map((control, index) => (
                    <Grid item key={index}>
                      <Button
                        variant={control.disabled ? 'outlined' : 'filled'}
                        sx={{ width: '130px', height: '25px', backgroundColor: control.active ? '#000' : '#999', color:  '#fff', borderColor :control.active ? '#000' : '#999', fontWeight: 'bold' }}
                        onClick={() => Back_toggleSlider(index)}
                      >
                        {control.name}
                      </Button>
                      <Slider
                        defaultValue={50}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        size="small"
                        sx={{ width: '360px', color: '#000' }}
                        disabled={control.disabled}
                        onChange={(event, newValue) => handleBackSliderChange(index, event, newValue)}
                      />
                    </Grid>
                  ))}
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
            <Grid container>
                  {Furn_controls.map((control, index) => (
                    <Grid item key={index}>
                      <Button
                        variant={control.disabled ? 'outlined' : 'filled'}
                        sx={{ width: '130px', height: '25px', backgroundColor: control.active ? '#000' : '#999', color:  '#fff', borderColor :control.active ? '#000' : '#999', fontWeight: 'bold' }}
                        onClick={() => Furn_toggleSlider(index)}
                      >
                        {control.name}
                      </Button>
                      <Slider
                        defaultValue={50}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        size="small"
                        sx={{ width: '360px', color: '#000' }}
                        disabled={control.disabled}
                        onChange={(event, newValue) => handleFurnSliderChange(index, event, newValue)}
                      />
                    </Grid>
                  ))}
            </Grid>
              <Box sx={{ mb: 2 }} />
            </>
           )}
            <Box sx={{ mb: 3 }} />
            <Grid item>
              <Button variant="outlined" sx={{ borderColor: '#000', color: '#000', fontWeight: 'bold',marginLeft : '260px' }} endIcon={<SendIcon />} onClick={handleSendClick}>
                Send
              </Button>
            </Grid>
            
            


          </Grid>
          <Grid item xs={0.5}></Grid>
          <Grid item xs={9.5}>
            <Grid container spacing={3}>
              {currentImages.map((image, index) => (
              // 카드 크기에 맞춰서 줌인
              <Grid item xs={3} key={index}>
                <Card
                  sx={{ width: '80%', height: '240px', backgroundImage: `url(./img/${image})`, backgroundSize: 'cover', backgroundPosition: 'center', border: cartImages.includes(image) ? '5px solid #CF4ECB' : 'none' }}               
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 0 }}>
                    <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' ,padding: '2px 3px' }} onClick={() => toggleSelectImage(image)}>
                    {cartImages.includes(image) ? (
                        <RemoveCircleOutlineIcon fontSize="small" /> // 이미지가 선택된 경우
                      ) : (
                        <AddCircleOutlineIcon fontSize="small" /> // 이미지가 선택되지 않은 경우
                      )}
                    </Button>
                    <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => toggleSelectImage(image)}>
                      <AutoFixHighIcon fontSize="small" />
                    </Button>
                    <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => imghandleOpen(image)}>
                      <ImageSearchIcon fontSize="small" />
                    </Button>
                  </Box>
                </Card>
              </Grid>
              //  원본 이미지 보존
              // <Grid item xs={3} key={index}>
              //   <Card
              //     sx={{ width: '100%', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              //     onClick={() => imghandleOpen(image)}
              //   >
              //     <img src={image} alt={`Image ${index}`} style={{ maxWidth: '100%', maxHeight: '240px' }} />
              //    </Card>
              // </Grid>RemoveCircleOutlineIcon
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
