import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import React, { useState } from 'react'; 
import axios from 'axios';
import { IconButton } from '@mui/material';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SendIcon from '@mui/icons-material/Send';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';

axios.defaults.baseURL = "http://166.104.34.158:5010";
axios.defaults.headers.post["content-Type"] = "application/json;charset=utf-8"
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*"

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});


export default function Album () {

  // 타겟 이미지 변경!  
  // Simulation  =====   cards_5294632 

  //  Test  |      Brief1      |     Brief 2
  // (S) TF |  cards_23667400  |  cards_12640188
  // (S) DM |  cards_16811768  |  cards_7804689
  // (N) TF |  cards_12640188  |  cards_23667400
  // (N) DM |  cards_7804689   |  cards_16811768



  const loadDefaultImage = async () => {
  const image = await import('./img/cards_23667400.jpg');
  setBackgroundImage(image.default);
  console.log("image", image.default)
  selectedImageToServer(image.default);
  lightsourceCCT(image.default);
  setImageDefault(image.default);
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

    //const isBackDetailedSliderEnabled = Back_controls.some(control => control.disabled === false);
    const isBackDetailedSliderEnabled = Back_controls.some(control => control.disabled === false) && back.some(val => val !== null); 
    //const isFurnDetailedSliderEnabled = Furn_controls.some(control => control.disabled === false); 
    const isFurnDetailedSliderEnabled = Furn_controls.some(control => control.disabled === false) && furn.some(val => val !== null);
  
    const backToggleValue = isBackDetailedSliderEnabled ? 1 : 0;
    const furnToggleValue = isFurnDetailedSliderEnabled ? 1 : 0;

    try {
      const response = await axios.post('/get_images', { 
        back_weight: back,
        furn_weight: furn,
        pageNum:pageNum,
        target_image_name : image,
        back_toggle: backToggleValue,
        furn_toggle: furnToggleValue
       });
       const imagesFromServer = response.data.images;
       filterLogToServer(back, furn, pageNum, image, imagesFromServer, backToggleValue, furnToggleValue); // [로그 저장]
       setCurrentImages(imagesFromServer);

    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  ///// [로그 저장1] 타겟이미지와 필터 로그 저장 코드! 

  async function filterLogToServer(back, furn, pageNum, image, sortedPaths, backToggle, furnToggle) {
    try {
        await axios.post('/filter_save_log', {
            back_weight: back,
            furn_weight: furn,
            pageNum: pageNum,
            target_image_name: image,
            sorted_image_paths: sortedPaths,
            back_toggle: backToggle,
            furn_toggle: furnToggle
        });
    } catch (error) {
        console.error('Error saving log:', error);
    }
  };

  //시뮬레이션 이미지와 슬라이더 바의 값을 가져오는 함슈
  async function SimulationDataToServer (simulImage, cctValues, location, backgroundImage){
    try {
      const response = await axios.post('/simulation',{
        simulImage: simulImage,
        cctValues: cctValues,
        location: location,  // 위치 정보 추가
        backgroundImage: backgroundImage
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
    SimulationDataToServer(dialogImage, simsliderValue, "cart_send");
    console.log('cart_simulation send', dialogImage, simsliderValue)
};

  //카드 이미지 원래 이미지로 바꾸기
  const SimulhandleResetClick = (index, dialogImage) => {
    const updatedSimulatedImages = [...simulatedImages];
    updatedSimulatedImages[index] = dialogImage; // 원래 이미지로 복구
    setSimulatedImages(updatedSimulatedImages);
    SimulationDataToServer(dialogImage, simsliderValue, "cart_cancel");
  };


  useEffect(() => {
    if(simsliderValue !== null && dialogImage !== null) {
      let location = "0"
        if (openDialog) {
          location = "dialog";
      } else if (openCartDialog) {
          location = "cart";
      }
      SimulationDataToServer(dialogImage, simsliderValue, location);
    }
    ; // simsliderValue 값이 변경될 때마다 서버로 전송
  }, [simsliderValue, dialogImage]);

  const handleSimulationChange = (event, newValue) => {
    setSimsliderValue(newValue);
  };

  const handleDialogOpen = (imagePath) => {
    setDialogImage(imagePath);
    setOpenDialog(true);
    lightsourceCCT(imagePath); //셈 slightsource
    // console.log("lightsourceCCT_imagePath", imagePath);
    // if(simsliderValue !== null) {
    // SimulationDataToServer(imagePath, simsliderValue, "dialog");
    // }
  };

  const [imageDefault, setImageDefault] = useState('');
  const handleDialogClose = () => {
    setOpenDialog(false);
    lightsourceCCT(imageDefault);
  };

  const CarthandleDialogOpen = (imagePath) => {
    setDialogImage(imagePath);
    setOpenCartDialog(true);
    lightsourceCCT(imagePath); //셈 slightsource
    // console.log("lightsourceCCT2_imagePath", imagePath);
    // if(simsliderValue !== null) {
    // SimulationDataToServer(imagePath, simsliderValue, "cart");
    // }
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


    // [로그 저장 2]  장바구니 이미지와 Background (Target) 이미지를 받아오는 함수 
    async function CartDataToServer (originalCart, targetImage){
      try {
        const response = await axios.post('/cartData',{
          originalCart: originalCart
        });
        console.log(response.data)
    } catch (error) {
      console.error('Error CartDataToServer :', error);
    }
  };

  //장바구니 이미지를 서버로 보내서 광원의 cct값을 받아오는 함수
  const [serverResponse, setServerResponse] = useState(null); 
  async function lightsourceCCT (cctimage){
    try {
      const response = await axios.post('/lightsourceCCT',{
        cctimage: cctimage
      });
      console.log("Light cct" , response.data)
      setServerResponse(response.data);
  } catch (error) {
    console.error('Error lightsourceCCT :', error);
  }
};

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
      if (simsliderValue !== null) {
        SimulationDataToServer(dialogImage, simsliderValue, "dialog_send");
    }
    }
  };

  // 셈 : cartImage 로그 
  useEffect(() => {
    console.log('cartImages :', cartImages);
    if (cartImages.length > 0) {
      CartDataToServer(cartImages);
  }
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
    lightsourceCCT(imgpath);
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

  //웹페이지 시작!
  const [showWebpage, setShowWebpage] = useState(false);

  async function handleToggleWebpage  (){
    setShowWebpage((prevValue) => !prevValue);
    try{
      const response = await axios.post('/starttime',{
      });
    } catch (error) {
      console.error('Error sending start time:', error);
    }
  };

  async function handlePrintTime  (){
    try{
      const response = await axios.post('/endtime',{
      });
    } catch (error) {
      console.error('Error sending end time:', error);
    }
  };


  async function endtime(currentTime) {
    try {
      console.log('End Time :', currentTime);
      const response = await axios.post('/endtime', {
        currentTime : currentTime 
      });
      //console.log(response.data);
    } catch (error) {
    }
  }

 //버튼&슬라이더 변경! 
  return ( 
    <ThemeProvider theme={darkTheme}>

      
      <CssBaseline />
      <main>
      {!showWebpage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '350px' }}>
            <Button
              variant="outlined"
              onClick={() => {
                handleToggleWebpage();
              }}
              sx={{ fontWeight: 'bold', width: '90px', height: '40px', color: 'black', borderColor: 'black' }}
            >
              start
            </Button>
          </Box>
      )}

      {showWebpage && (
      <Container sx={{ py:6}} maxWidth="false" >

        
      <Grid container spacing={0}>
        <Grid item xs={9} sx={{ marginLeft: '65px', marginRight: '180px' }}>
          {serverResponse && serverResponse["Mean Predict"] !== null && (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column', // 위아래로 배치
              alignItems: 'flex-start', // 왼쪽 정렬
              borderLeft: '2px solid #999', 
              paddingLeft: '10px', 
              width: `${
                Math.max(
                  serverResponse["Mean Predict"].length,
                  serverResponse["Predict"].join(', ').length
                ) * 50 + 50
              }px`,
              height: `65px` 
            }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                광원의 평균 색온도: {serverResponse["Mean Predict"]}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: '7px' }}>
                색온도: {serverResponse["Predict"].join(', ')}
              </Typography>
            </div>
          )}
        </Grid>
          
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 3 }}>
                 <Box>
                  <Button
                    variant="outlined"
                    sx={{ fontWeight: 'bold', width: '90px', height: '40px', color: 'gray', borderColor: 'gray' }} onClick={handlePrintTime}>
                    End
                  </Button>
                </Box>
                  <Button variant="filled" sx={{ color: '#666666', fontWeight: 'bold', padding: '2px 3px' }} onClick={handleCloseSelectedImages}>
                    <CloseIcon></CloseIcon>
                  </Button>
                </Box>
                
              <Grid container spacing={6}>
                {cartImages.map((imgPair, index) => (
                  <Grid item xs={12} sm={4} md={4} lg={2} key={index}>
                    <Card
                      sx={{
                        width: '90%',
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
      )}

      {showWebpage && (
      <Container sx={{ py: 0 }} maxWidth={false}>
        <Grid Grid container spacing={1}>
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
          <Box sx={{ mb: 2.5 }} />
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
          <Grid container spacing={9}>
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
      )}
        
      </main>
    </ThemeProvider>
  );
}