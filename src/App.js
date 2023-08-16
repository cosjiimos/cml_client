import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
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
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';

axios.defaults.baseURL = "http://166.104.34.158:5008";
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
  const allImages = imageContext.keys().map(imageContext);
  const [showBackgroundButtons, setshowBackgroundButtons] = useState(false);
  const [showFurnitureButtons, setshowFurnitureButtons] = useState(false);
  // 현재 페이지에 맞는 이미지 선택
  const [currentImages, setCurrentImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  // 장바구니 이미지
  const [cartImages, setcartImages] = useState([]);
  const [viewSelectedImages, setViewSelectedImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  //세부 파라미터 버튼
  const [Back_controls, Back_setControls] = useState([
    { name: 'Wall', disabled: true ,value: 0 },
    { name: 'Floor', disabled: true ,value: 0 },
    { name: 'Windowpane', disabled: true ,value: 0 },
    { name: 'Ceiling', disabled: true ,value: 0 },
    { name: 'Door', disabled: true ,value: 0 },
  ]);
  const [Furn_controls, Furn_setControls] = useState([
    { name: 'Sofa', disabled: true  ,value: 0 },
    { name: 'Table', disabled: true ,value: 0 },
    { name: 'Cabinet', disabled: true ,value: 0 },
    { name: 'Chair', disabled: true ,value: 0 },
    { name: 'Shelf', disabled: true ,value: 0 },
  ]);

  const initialobjectInfo = {
    wall: false,
    floor: false,
    windowpane: false,
    ceiling: false,
    door: false,
    sofa: false,
    table: false,
    cabinet: false,
    chair: false,
    shelf: false
  };
  const [objectInfo, setObjectInfo] = useState(initialobjectInfo);
  
  //타겟이미지에서 오브젝트 체크하는 함수! 
  async function selectedImageToServer (selected){
    try{
      const response = await axios.post('/check_object',{
        selected : selected
      });
      setObjectInfo({ ...initialobjectInfo, ...response.data });
    } catch (error) {
      console.error('Error fetching object values:', error);
    }
  };

  
  //슬라이더값 send버튼 누르면 값 콘솔창에 보내기
  const [backSliderValues, setBackSliderValues] = useState(Array(Back_controls.length).fill(null));
  const [furnSliderValues, setFurnSliderValues] = useState(Array(Furn_controls.length).fill(null));

  const [mainBackSliderValue, setMainBackSliderValue] = useState(null);
  const [mainFurnSliderValue, setMainFurnSliderValue] = useState(null);

  // 결과 이미지를 가져오는 함수
  async function fetchImages(back, furn, pageNum, image) {
    try {
      const response = await axios.post('/get_images', { 
        back_weight: back,
        furn_weight: furn,
        pageNum:pageNum,
        target_image_name : image
       });
       const imagesFromServer = response.data.images;
      //  console.log('cI: ', imagesFromServer);
       setCurrentImages(imagesFromServer);

    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  //시뮬레이션 이미지와 슬라이더 바의 값을 가져오는 함슈
  async function SimulationDataToServer (simulImage, cctValues){
    try {
      const response = await axios.post('/simulation',{
        simulImage: simulImage,
        cctValues: cctValues,
      });
      console.log(response.data)
      setSimulatedImage(response.data.image); // 받은 이미지를 상태로 설정
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

//시뮬레이션 
  const [openDialog, setOpenDialog] = useState(false);
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [dialogImage, setDialogImage] = useState(null);
  const [simsliderValue, setSimsliderValue] = useState(null);
  const [simulatedImage, setSimulatedImage] = useState(null);
  const [simulatedImages, setSimulatedImages] = useState(Array(cartImages.length).fill(null));
  //시뮬레이션 이미지로 바꾸기
  const SimulhandleSendClick = (index, simulatedImage) => {
    const newSimulatedImages = [...simulatedImages];
    // console.log(index, simulatedImages)
    // 인자로 받은 index 위치의 이미지만 simulatedImage로 설정
    newSimulatedImages[index] = simulatedImage;

    // 상태 업데이트
    setSimulatedImages(newSimulatedImages);

    // Send 버튼을 누르면 서버로 데이터 전송
    SimulationDataToServer(dialogImage, simsliderValue);
    console.log('simul', dialogImage, simsliderValue)
};

  //카드 이미지 원래 이미지로 바꾸기
  const SimulhandleResetClick = (index, dialogImage) => {
    const updatedSimulatedImages = [...simulatedImages];
    updatedSimulatedImages[index] = dialogImage; // 원래 이미지로 복구
    setSimulatedImages(updatedSimulatedImages);
  };


  useEffect(() => {
    if(simsliderValue !== null) {
      SimulationDataToServer(dialogImage, simsliderValue)
    }
    ; // simsliderValue 값이 변경될 때마다 서버로 전송
  }, [simsliderValue, dialogImage]);

  const handleSimulationChange = (event, newValue) => {
    setSimsliderValue(newValue);
  };

  const handleDialogOpen = (imagePath) => {
    setDialogImage(imagePath);
    setOpenDialog(true);
    // selectedImageToServer(imagePath); //cct 받던거 
    console.log("imagePath", imagePath)
    if(simsliderValue !== null) {
    SimulationDataToServer(imagePath, simsliderValue);
    }
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const CarthandleDialogOpen = (imagePath) => {
    setDialogImage(imagePath);
    setOpenCartDialog(true);
    if(simsliderValue !== null) {
    SimulationDataToServer(imagePath, simsliderValue);
    }
  };
  
  const CarthandleDialogClose = () => {
    setOpenCartDialog(false);
  };


  const [currentImagePaths, setCurrentImagesPaths] = useState([])
  useEffect(()=>{
    const tmpImagePaths = currentImages.map(imageName => require(`./img/${imageName}`))
    setCurrentImagesPaths(tmpImagePaths)
    console.log(tmpImagePaths)
  },[currentImages])

  // pageNum이 변경될 때마다 fetchImages를 호출
  useEffect(() => {
    if (backgroundImage !== null){
      fetchImages(backSliderValues, furnSliderValues, pageNum, backgroundImage);
    }
  }, [pageNum]);


  const handleBackSliderChange = (index, event, newValue) => {
    const newSliderValues = [...backSliderValues];
    newSliderValues[index] = newValue === 0 ? null : newValue; // 값이 0인 경우 null 할당
    setBackSliderValues(newSliderValues);
  };

  const handleFurnSliderChange = (index, event, newValue) => {
    const newSliderValues = [...furnSliderValues];
    newSliderValues[index] = newValue === 0 ? null : newValue;
    setFurnSliderValues(newSliderValues);
  };

  const handleSendClick = () => {
    console.log('Back Controls:', backSliderValues);
    console.log('Furn Controls:', furnSliderValues);
    console.log('backgroundImage:', backgroundImage);
    fetchImages(backSliderValues, furnSliderValues, pageNum, backgroundImage);
    setPageNum(0);
  };

  //메인 슬라이더 값 조정 / "전체"
  const handleBackMainSliderChange = (event, newValue) => {
    setMainBackSliderValue(newValue === 0 ? null : newValue);
    setBackSliderValues(Array(Back_controls.length).fill(newValue === 0 ? null : newValue)); // 값이 0이면 null로 설정
  };
  const handleFurnMainSliderChange = (event, newValue) => {
    setMainFurnSliderValue(newValue === 0 ? null : newValue);
    setFurnSliderValues(Array(Back_controls.length).fill(newValue === 0 ? null : newValue)); // 값이 0이면 null로 설정
  };

// 셈 : "전체"  슬라이더 활성화/비활성화
const toggleAllBackSliders = (enable) => {
  const updatedControls = Back_controls.map(control => ({ ...control, disabled: enable }));
  Back_setControls(updatedControls);
  if (enable) {
    setBackSliderValues(Array(Back_controls.length).fill(null));
  }
};
const toggleAllFurnSliders = (enable) => {
  const updatedControls = Furn_controls.map(control => ({ ...control, disabled: enable })); // 'disabled' 값을 'enable'로 설정
  Furn_setControls(updatedControls);
  if (enable) { // 'enable'이 true인 경우에 슬라이더 값을 null로 설정
    setFurnSliderValues(Array(Furn_controls.length).fill(null));
  }
};

// 셈 : "개별" 슬라이더 활성화/비활성화
const Back_toggleSlider = (index) => {
  const BackcontrolName = Back_controls[index].name.toLowerCase();
  if (objectInfo[BackcontrolName]) { // 오브젝트가 있는 경우에만 활성화
    const Back_updatedControls = [...Back_controls];
    Back_updatedControls[index].disabled = !Back_updatedControls[index].disabled;
    Back_setControls(Back_updatedControls);
    if (Back_updatedControls[index].disabled) { // If the control is now disabled
      const newBackSliderValues = [...backSliderValues];
      newBackSliderValues[index] = null; // Set the corresponding value to null
      setBackSliderValues(newBackSliderValues);
  }
  }
};
const Furn_toggleSlider = (index) => {
  const FurncontrolName = Furn_controls[index].name.toLowerCase();
  if (objectInfo[FurncontrolName]) { // 오브젝트가 있는 경우에만 활성화
    const Furn_updatedControls = [...Furn_controls];
    Furn_updatedControls[index].disabled = !Furn_updatedControls[index].disabled;
    Furn_setControls(Furn_updatedControls);
    
    if (Furn_updatedControls[index].disabled) { // If the control is now disabled
      const newFurnSliderValues = [...furnSliderValues];
      newFurnSliderValues[index] = null; // Set the corresponding value to null
      setFurnSliderValues(newFurnSliderValues);
     }
  }
};

// 셈 : 전체 버튼 클릭 이벤트
const handleBackgroundButtonClick = () => {
  if (showBackgroundButtons) {
    toggleAllBackSliders(false);
  } else {
    toggleAllBackSliders(true);
  }
  setshowBackgroundButtons(!showBackgroundButtons);
};
const handleFurnitureButtonClick = () => {
  if (!showFurnitureButtons) { // 'showFurnitureButtons'가 false인 경우에 슬라이더를 활성화
    toggleAllFurnSliders(true);
  } else {
    toggleAllFurnSliders(false);
  }
  setshowFurnitureButtons(!showFurnitureButtons);
};



  const handleViewSelectedImages = () => {
    setViewSelectedImages(true);
  };
  
  const handleCloseSelectedImages = () => {
    setViewSelectedImages(false);
  };


  // const toggleSelectImage = (image) => {
  //   if (cartImages.includes(image)) {
  //     setcartImages(prev => prev.filter(img => img !== image));
  //   } else {
  //     setcartImages(prev => [...prev, image]);
  //   }
  // };

  
  const toggleSelectImage = (originalImage, simulatedImage) => {
    const imagePair = { original: originalImage, simulated: simulatedImage };
  
    // 이미 배열에 해당 원본 이미지가 있는지 확인
    const existingPairIndex = cartImages.findIndex(
      imgPair => imgPair.original === originalImage
    );
  
    if (existingPairIndex !== -1) {
      // 이미 존재하면 제거
      setcartImages(prev => [
        ...prev.slice(0, existingPairIndex),
        ...prev.slice(existingPairIndex + 1),
      ]);
    } else {
      // 존재하지 않으면 추가
      setcartImages(prev => [...prev, imagePair]);
    }
  };

  // 셈 : cartImage 로그 
  useEffect(() => {
    console.log('cartImages :', cartImages);
  }, [cartImages])

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
    // selectedImageToServer(image); // 이미지 이름을 서버로 전송 후  cct 받던거
    // console.log('Large image : ', image) //이거를 가져와 셈아
    setOpen(true);
  };

  
  const imghandleClose = () => {
    setOpen(false);
  };


  const CustomizedMark = ({ value, label, align }) => (
    <div style={{ width: '100%', textAlign: align, position: 'relative' }}>
      <span style={{ fontSize: '12px', position: 'absolute', left: align === 'center' ? '-12px' : '5', [align]: 0 }}>{label}</span>
    </div>
  );
  
  const marks = [
    { value: -50, label: <CustomizedMark label="dissmiliar" align="left" /> },
    { value: 0, label: <CustomizedMark label="none" align="center" /> },
    { value: 50, label: <CustomizedMark label="similiar" align="right" /> },
  ];


//   const CustomSlider = styled(Slider)`
//   & .MuiSlider-thumb {
//     width: 20px;
//     height: 20px;
//   }
//   & .MuiSlider-track {
//     height: ${props => 5 - Math.abs(props.value)}px; // 중앙에서 가장 두꺼워지도록 함
//     background: currentColor;
//   }
//   & .MuiSlider-rail {
//     height: 1px; // 최대 두께로 설정
//   }
// `;

  // 잘 나와요 : cards_5294632()  cards_23386963(노랑거)
  // 세민 궁금해요 : cards_21561263, cards_20394197 cards_12137732
  // 유경 궁금해요 : cards_8486233 cards_17760123 cards_4143928 cards_10687665
  const loadDefaultImage = async () => {
    const image = await import('./img/cards_4930502.jpg');
    setBackgroundImage(image.default);
    console.log("image", image.default)
    selectedImageToServer(image.default)
    setPageNum(0);

    // 메인 슬라이더 값을 null로 초기화
    setMainBackSliderValue(null);
    setMainFurnSliderValue(null);

    const copyBackControls = [...Back_controls] 
    // 모든 슬라이더 값을 null로 초기화
    const newBackSliderValues = Array(copyBackControls.length).fill(null);
    setBackSliderValues(newBackSliderValues);
    const newFurnSliderValues = Array(copyBackControls.length).fill(null);
    setFurnSliderValues(newFurnSliderValues);

    const Back_newControls = Back_controls.map(control => ({ ...control, disabled: true, active: false, value: 0 })); //이렇게해야 버튼 초기화
    Back_setControls(Back_newControls);
    const Furn_newControls = Furn_controls.map(control => ({ ...control, disabled: true, active: false, value: 0 }));
    Furn_setControls(Furn_newControls);

    setshowBackgroundButtons(false);
    setshowFurnitureButtons(false);
  };
  
  useEffect(() => {
    loadDefaultImage();
  }, []);

  // Target Image 변경
  const loadImage = (url) => {
    const extractedUrl = url.match(/\((.*?)\)/)[1];
    const fileName = extractedUrl.substring(extractedUrl.lastIndexOf('/') + 1).split('.')[0] + '.jpg';
    console.log(fileName); 
    const imgpath = require(`./img/${fileName}`)
    console.log('imgPath',imgpath)
    setBackgroundImage(imgpath);
    selectedImageToServer(imgpath); //오브젝트 정보 받아오기 --> 토글 비활성화
    // pageNum을 0으로 설정
    setPageNum(0);

    // 메인 슬라이더 값을 null로 초기화
    setMainBackSliderValue(null);
    setMainFurnSliderValue(null);

    const copyBackControls = [...Back_controls]
    // 모든 슬라이더 값을 null로 초기화
    const newBackSliderValues = Array(copyBackControls.length).fill(null);
    setBackSliderValues(newBackSliderValues);
    const newFurnSliderValues = Array(copyBackControls.length).fill(null);
    setFurnSliderValues(newFurnSliderValues);

    const Back_newControls = Back_controls.map(control => ({ ...control, disabled: true, active: false, value: 0 })); //이렇게해야 버튼 초기화
    Back_setControls(Back_newControls);
    const Furn_newControls = Furn_controls.map(control => ({ ...control, disabled: true, active: false, value: 0 }));
    Furn_setControls(Furn_newControls);

    // 타겟 이미지가 변경되면 showBackgroundButtons을 false로 설정
    setshowBackgroundButtons(false);
    setshowFurnitureButtons(false);

  };

  // backSliderValues와 furnSliderValues 중 하나라도 null이 아닌 값을 가지면 true를 반환하는 함수
  const isSendEnabled = () => {
    return backSliderValues.some(value => value !== null) || furnSliderValues.some(value => value !== null);
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  


 //버튼&슬라이더 변경! 
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Container sx={{ py:6}} maxWidth="false" >
          <Grid container spacing={0} justifyContent="flex-end">
            <Grid item xs={1.8}>
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
                    <CloseIcon></CloseIcon>
                  </Button></Box>
                  
                <Grid container spacing={6}>
                  {cartImages.map((imgPair, index) => (
                    <Grid item xs={12} sm={4} md={4} lg={2} key={index}>
                      <Card
                        sx={{
                          width: '100%',
                          height: '240px',
                          backgroundImage: `url(${simulatedImages[index] || imgPair.simulated || imgPair.original})`, // 시뮬레이션 이미지가 없으면 원래 이미지 사용
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          margin: ' 20px'
                        }}
                      >
                  

                      {/* 오른쪽 위에 위치할 나머지 버튼들 */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 0 }}>
                          <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => imghandleOpen(imgPair.original)}>
                              <ImageSearchIcon fontSize="small" />
                          </Button>
                          <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => toggleSelectImage(imgPair.original)}>
                          { cartImages.some(pair => pair.original === imgPair.original) ?  (
                                  <RemoveShoppingCartIcon fontSize="small" /> // 이미지가 선택된 경우
                              ) : (
                                  <AddShoppingCartIcon fontSize="small" /> // 이미지가 선택되지 않은 경우
                              )}
                          </Button>
                            {/* // 시뮬레이션  */}
                            <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => { 
                                CarthandleDialogOpen(imgPair.original); 
                                setCurrentImageIndex(index);
                            }}>
                                <AutoFixHighIcon fontSize="small" />
                            </Button>


                    

                  


                  <Dialog open={openCartDialog} onClose={CarthandleDialogClose} maxWidth="false" PaperProps={{
                    style: {
                      height: '80%', 
                      width: '80%', 
                    },
                  }}>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 3 }}>
                      <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold', padding: '2px 3px' }} onClick={CarthandleDialogClose}>
                        <CloseIcon />
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', height: '100%',marginTop : '100px' }}>
                    <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column', // 세로 방향으로 정렬
                            alignItems: 'center', // 가운데 정렬
                            gap: 10 // 카드와 슬라이더 사이의 간격
                          }}
                        >
                      <Card sx={{ width: '720px', height: '480px', backgroundImage: `url(${dialogImage})`, backgroundSize: 'cover', backgroundPosition: 'center', marginLeft: '200px',marginBottom : '50px'}}>
                        <Typography variant="h5" sx={{ position: 'absolute', top: '100px', left: '480px', color: '#000',fontFamily: '"futura", sans-serif',fontWeight: 'bold'}}>Original Image</Typography>
                      </Card>
                      <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', marginLeft: '200px' , fontWeight: 'bold'}}>세민짱!</Typography> 
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column', // 세로 방향으로 정렬
                          alignItems: 'center', // 가운데 정렬
                          gap: 10 // 카드와 슬라이더 사이의 간격
                          , marginLeft: '200px'
                        }}
                      >
                        <Card sx={{ width: '720px', height: '480px', backgroundImage: `url(${simulatedImage})`, backgroundSize: 'cover', 
                        backgroundPosition: 'center' }}>
                          <Typography variant="h5" sx={{ position: 'absolute', top: '100px', left: '1380px', color: '#000' ,fontWeight: 'bold'}}>Simulation Image</Typography>
                        </Card>
                        
                        <Slider 
                          value={simsliderValue}
                          onChange={handleSimulationChange} 
                          defaultValue={2850}
                          aria-label="Default" 
                          valueLabelDisplay="auto" 
                          size="large" 
                          sx={{ width: '360px', color: '#000' }} 
                          max={7500} min={2850}
                          marks={[
                          { value: 2850, label: '2850K' },
                          { value: 7500, label: '7500K' },
                        ]} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 0 }}>
                          <Button variant="filled" endIcon={<ChangeCircleIcon/>} sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => SimulhandleSendClick(currentImageIndex,simulatedImage)}>
                          simulation image
                          </Button>
                          <Button variant="filled" endIcon={<RestartAltIcon/>} sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => SimulhandleResetClick(currentImageIndex,dialogImage )}>
                        origirnal image
                      </Button>
                          
                        </Box>
                      </Box>
                    
                  </Box>
                </Dialog>


                  
                  </Box>
                    </Card>
                    </Grid>
                  ))}
                </Grid>
              </Dialog>
              <Button
                variant="outlined"
                endIcon={<DeleteIcon  />}
                sx={{ fontWeight: 'bold', width: '90px', height: '40px', color: 'gray', borderColor: 'gray', marginLeft: '20px' }} onClick={loadDefaultImage}>
                Reset
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

        {/* <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '400px' }}>
            <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold', padding: '2px 3px' }} onClick={loadDefaultImage}>
              <RestartAltIcon></RestartAltIcon>
        </Button></Box> */}

        <Container sx={{ py: 1 }} maxWidth={false}>
          <Grid Grid container spacing={2}>
          <Grid item xs={0.3}></Grid>
            <Grid item xs={1.7}>
              
              <Card
                sx={{ width: '400px', height: '240px', display: 'flex', flexDirection: 'column', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button variant="filled" sx={{ color: '#fff', fontWeight: 'bold' ,width : '10px'}} onClick={() => imghandleOpen(backgroundImage)}>
                    <ImageSearchIcon fontSize="small" />
                  </Button>
                </Box>
              </Card>
              <Box sx={{ mb: 2 }} />
            <Grid item>
              <Button //(큰 버튼:Furniture)
                variant="outlined"
                sx={{ borderColor: '#000', color: '#000', fontWeight: 'bold',  width: '130px', height: '25px' }}
                onClick={handleBackgroundButtonClick}
              >
                background
              </Button>
            </Grid>
            {!showBackgroundButtons && // showButtons가 false인거 (큰 슬라이더:Background)
              <Slider
                value={mainBackSliderValue || 0}
                defaultValue={0} 
                aria-label="Default" 
                valueLabelDisplay="auto" 
                size="small" 
                sx={{width: '400px', color: '#000'}} 
                max={50} 
                min={-50} 
                onChange={handleBackMainSliderChange}
                valueLabelFormat={(value) => (value === 0 ? 'none' : value)}
                marks={marks}
            />}
            {showBackgroundButtons && ( // showButtons가 true일 때만 아래 버튼들을 렌더링 (작은 슬라이더 :Background)
            <>
            <Grid container>
              <Box sx={{ mb: 2 }} />
              {Back_controls.map((control, index) => (
                <Grid item key={index}>
                  <Button
                    variant={control.disabled ? 'outlined' : 'filled'}
                    sx={{ width: '130px', height: '25px', backgroundColor: control.disabled ? '#999' : '#000', color:  '#fff', borderColor :control.disabled ? '#999' : '#000', fontWeight: 'bold' }}
                    onClick={() => Back_toggleSlider(index)}
                  >
                    {control.name}
                  </Button>
                  <Slider
                    value={backSliderValues[index] !== null ? backSliderValues[index] : 0}
                    defaultValue={0}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    size="small"
                    sx={{ width: '400px', color: '#000' }} 
                    disabled={control.disabled}
                    onChange={(event, newValue) => handleBackSliderChange(index, event, newValue)}
                    max={50} min={-50}
                    valueLabelFormat={(value) => (value === 0 ? 'none' : value)}
                    marks={marks}
                    />
                    </Grid>
                    ))}
            </Grid>

              <Box sx={{ mb:2 }} />
            </>
           )}
            <Grid item>
              
            <Button variant="outlined" sx={{ borderColor: '#000', color: '#000', fontWeight: 'bold' ,  width: '130px', height: '25px'}} //(큰 버튼:Furniture)
            onClick={handleFurnitureButtonClick}>
            Furniture</Button>
            </Grid>
            {!showFurnitureButtons && //(큰 슬라이더:Furniture)
              <Slider 
              value={mainFurnSliderValue || 0}
              defaultValue={0} 
              aria-label="Default" 
              valueLabelDisplay="auto" 
              size="small" 
              sx={{width: '400px', color: '#000'}} 
              max={50} min={-50} 
              onChange={handleFurnMainSliderChange}
              valueLabelFormat={(value) => (value === 0 ? 'none' : value)}
              marks={marks}
              />
            }
            {showFurnitureButtons && ( // showButtons가 true일 때만 아래 버튼들을 렌더링  (작은 슬라이더:Furniture)
            <><Box sx={{ mb: 2 }} />
            <Grid container>
                  {Furn_controls.map((control, index) => (
                    <Grid item key={index}>
                      <Button
                        variant={control.disabled ? 'outlined' : 'filled'}
                        sx={{ width: '130px', height: '25px', backgroundColor: control.disabled ? '#999' : '#000', color:  '#fff', borderColor :control.disabled ? '#999' : '#000', fontWeight: 'bold' }}
                        onClick={() => Furn_toggleSlider(index)}
                      >
                        {control.name}
                      </Button>
                      <Slider
                        value={furnSliderValues[index] !== null ? furnSliderValues[index] : 0}
                        defaultValue={0}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        size="small"
                        sx={{ width: '400px', color: '#000' }}
                        disabled={control.disabled}
                        onChange={(event, newValue) => handleFurnSliderChange(index, event, newValue)}
                        max={50} min={-50}
                        valueLabelFormat={(value) => (value === 0 ? 'none' : value)}
                        marks={marks}
                      />
                    </Grid>
                  ))}
            </Grid>
              <Box sx={{ mb: 1 }} />
            </>
           )}
            <Box sx={{ mb: 1 }} />
            <Grid item>
              <Button variant="outlined" sx={{ borderColor: '#000', color: '#000', fontWeight: 'bold',marginLeft : '310px' }} endIcon={<SendIcon />} 
              onClick={handleSendClick}
              disabled={!isSendEnabled()}>
                Send
              </Button>
            </Grid>
            
            


          </Grid>
          <Grid item xs={0.7}></Grid>
          <Grid item xs={9.3}>
            <Grid container spacing={5}>
              {currentImagePaths.map((imgPath, index) => (
              // 카드 크기에 맞춰서 줌인
              <Grid item xs={3} key={index}>
                <Card
                  sx={{ width: '90%', height: '250px', backgroundImage: `url(${imgPath})`, backgroundSize: 'cover', backgroundPosition: 'center', border: cartImages.some(pair => pair.original === imgPath) ? '5px solid #CF4ECB' : 'Other Value'}}               
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 0 }}>
                    
                    <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => loadImage(`url(${imgPath})`)}>
                      <ChangeCircleIcon fontSize="small" />
                    </Button>
                    <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => imghandleOpen(imgPath)}>
                      <ImageSearchIcon fontSize="small" />
                    </Button>
                    <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' ,padding: '2px 3px' }} onClick={() => toggleSelectImage(imgPath)}>
                    { cartImages.some(pair => pair.original === imgPath) ?  (
                        <RemoveShoppingCartIcon fontSize="small" /> // 이미지가 선택된 경우
                      ) : (
                        <AddShoppingCartIcon fontSize="small" /> // 이미지가 선택되지 않은 경우
                      )}
                    </Button>

                  {/* // 시뮬레이션  */}
                  <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold' }} onClick={() => handleDialogOpen(imgPath)}>
                    <AutoFixHighIcon fontSize="small" />
                  </Button>




                  <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="false" PaperProps={{
                    style: {
                      height: '80%', 
                      width: '80%', 
                    },
                    }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 3 }}>
                      <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold', padding: '2px 3px' }} onClick={handleDialogClose}>
                        <CloseIcon />
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', height: '100%',marginTop : '100px'  }}>
                    <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column', // 세로 방향으로 정렬
                            alignItems: 'center', // 가운데 정렬
                            gap: 10 
                          }}
                        >
                      <Card sx={{ width: '720px', height: '480px', backgroundImage: `url(${dialogImage})`, backgroundSize: 'cover', backgroundPosition: 'center', marginLeft: '200px',marginBottom : '50px'}}>
                        <Typography variant="h5" sx={{ position: 'absolute', top: '100px', left: '480px', color: '#000' }}>Original Image</Typography>
                      </Card>
                      <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', marginLeft: '200px' , fontWeight: 'bold'}}>세민짱!</Typography> 
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column', // 세로 방향으로 정렬
                          alignItems: 'center', // 가운데 정렬
                          gap: 10 // 카드와 슬라이더 사이의 간격
                          , marginLeft: '200px'
                        }}
                      >
                        <Card sx={{ width: '720px', height: '480px', backgroundImage: `url(${simulatedImage})`, backgroundSize: 'cover', 
                        backgroundPosition: 'center' }}>
                          <Typography variant="h5" sx={{ position: 'absolute', top: '100px', left: '1380px', color: '#000' }}>Simulation Image</Typography>
                        </Card>
                        
                        <Slider 
                          value={simsliderValue}
                          onChange={handleSimulationChange} 
                          defaultValue={2850}
                          aria-label="Default" 
                          valueLabelDisplay="auto" 
                          size="large" 
                          sx={{ width: '360px', color: '#000' }} 
                          max={7500} min={2850}
                          marks={[
                          { value: 2850, label: '2850k' },
                          { value: 7500, label: '7500k' },
                        ]} />
                      <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold', padding: '2px 3px' }} onClick={() => toggleSelectImage(dialogImage, simulatedImage)}>
                          { cartImages.some(pair => pair.original === dialogImage) ?  (
                              <>
                                Simulated Image {/* 선택된 경우의 텍스트 */}
                                <RemoveShoppingCartIcon fontSize="large" /> {/* 이미지가 선택된 경우 */}   
                              </>
                          ) : (
                              <>
                                Simulated Image {/* 선택되지 않은 경우의 텍스트 */}
                                <AddShoppingCartIcon fontSize="large" /> {/* 이미지가 선택되지 않은 경우 */}
                              </>
                          )}
                      </Button>
                      </Box>
                    </Box>
                  </Box>
                </Dialog>


                  </Box>
                </Card>
              </Grid>

              ))}
            </Grid>

            <Dialog open={open} onClose={imghandleClose} fullWidth={true} maxWidth="md">
                  <img src={selectedImage} style={{ width: '100%', height: '100%' }} />

            </Dialog>
          </Grid>
      </Grid>
    </Container>
        
        
      </main>
    </ThemeProvider>
  );
}