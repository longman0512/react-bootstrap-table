import React, { useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Popper from '@material-ui/core/Popper';
import Slider from '@material-ui/core/Slider';
import { useHistory } from "react-router-dom";
import { getImageListItemUtilityClass } from '@material-ui/core';
import cogoToast from 'cogo-toast';
import Divider from '@material-ui/core/Divider';
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import RotateRightIcon from '@material-ui/icons/RotateRight'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import StoreContext from "../context/index";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { FileDrop } from 'react-file-drop';
import AvatarEditor from 'react-avatar-editor'
import { socketClient } from '../socket';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import { FixedSizeList } from 'react-window';

import Axios from 'axios';
Axios.defaults.baseURL = "http://127.0.0.1:4001/";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    "& .MuiIconButton-edgeEnd": {
      marginRight: "0"
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    color: "white",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: "white",
    "& .MuiAutocomplete-inputRoot": {
      color: "white",
      paddingLeft: "60px",
    },
    "& .MuiAutocomplete-inputRoot .MuiAutocomplete-input:first-child": {
      color: "white",
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
  },
  iconCompany: {
    "& .MuiSvgIcon-root": {
      width: "1.5em",
      height: "1.5em"
    },
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  accountModal: {

  },
  logoContainer: {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center'
  },
  NavBarlogoContent: {
    backgroundColor: "rgb(120, 144, 156)",
    width: 50,
    height: 50,
    borderRadius: 50,
    textAlign: "center",
    verticalAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
    color: "white",
    position: "relative"
  },
  logoContent: {
    backgroundColor: "rgb(120, 144, 156)",
    width: 100,
    height: 100,
    borderRadius: 100,
    textAlign: "center",
    verticalAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 42,
    color: "white",
    marginRight: 40,
    marginLeft: 40,
    position: "relative"
  },
  avatarChgBtn: {
    margin: 0,
    padding: 5,
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'white',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: 'rgba(150, 150, 150, 1)'
    },
  },
  avataBtnContainer: {
    position: "absolute",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    display: 'flex',
    bottom: 0,
    right: -50,
    width: 90
  },
  userNameContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 30
  },
  userNameSubContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  userNameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  },
  userEmailText: {
    fontSize: 24,
    color: "gray"
  },
  manageAcctBtn: {
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "solid",
    width: "80%",
    color: "gray",
    fontSize: 24,
    cursor: "pointer"
  },
  manageBtnContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center'
  },

  userInfoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  signOutButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
  userInfoTotalContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
    marginTop: 10,
    marginBottom: 10
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    width: '100%'
  },
  paper: {
    backgroundColor: "white",
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "80vw",
    height: "80vh",
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  appbar: {
    boxShadow: theme.shadows[5],
    zIndex: 10
  },
  cancelBtn: {
    marginLeft: 20
  },
  notiItem: {
    height: 30,
    marginTop: 8,
    fontSize: 25
  },
  notiClicked: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: 230,
  }, 
  noDrag: {
    color: 'gray',
    marginTop: 30,
    height: 30
  },
  onDrog: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform:' translate(-50%, -50%)',
    backgroundColor:' #5050f9',
    padding: 16
  }
}));

const user_email = 'user@user.com'
const serverUrl = "http://localhost:4001/"
export default function PrimarySearchAppBar() {
  const { store, setStore } = React.useContext(StoreContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorNoti, setAnchorNoti] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  //   const { user: currentUser } = useSelector((state) => state.auth);
  const [myOptions, setMyOptions] = useState([])
  const [acctModal, setAcctModal] = useState(false)
  const [notiModal, setNotiModal] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const isMenuOpen = Boolean(anchorEl);
  const isMenu2Open = Boolean(anchorEl2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [uploadModal, setUploadModal] = useState(false);
  const [targetImage, setTargetImage] = useState("");
  const [selectedImage, setImage] = useState("");
  const [uploadState, setUploadState] = useState(0);
  const [nodifiedState, setNotified] = useState(0);
  const [notiNum, setNotiNum] = useState(0);
  const [newNoti, setNewNoti] = useState([]);
  const [tempImage, setTempImage] = useState("");
  const [rotate, setRotate] = useState(0);
  const [zoom, setZoom] = useState(1.2);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isDropping, setDropping] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [page, setPageNum] = useState(0);

  const fileUploadRef = React.useRef(null);
  const imageCrop = React.useRef(null);
  const handleZoom = (event, newValue) => {
    console.log(newValue)
    if (newValue) {
      setZoom(newValue)
    }
  }

  const intinitScroll = (e) => {
    console.log(e.target.scrollTop, e.target.offsetHeight, e.target.clientHeight, e.target.offsetTop);
    // if(e.target.scrollTop > e.target.clientHeight){
    //   Axios.post('getNoti', {pageNum: page+1}).then((res) => {
    //     if (res.status === 200) {
    //       console.log(res.data.data, "notification data")
    //       if(res.data.data.length){
    //         setNotified(res.data.data)
    //         getNewNoti();
    //         setPageNum(page+1)
    //       }
    //     }
    //   }).catch((err) => {
    //   });  
    // } else if(e.target.scrollTop == 0){
    //   if(page - 1 >= 0){
    //     Axios.post('getNoti', {pageNum: page-1}).then((res) => {
    //       if (res.status === 200) {
    //         console.log(res.data.data, "notification data")
    //         if(res.data.data.length){
    //           setNotified(res.data.data)
    //           getNewNoti();
    //           setPageNum(page-1)
    //         }
    //       }
    //     }).catch((err) => {
    //     });
    //   } else {
    //     Axios.post('getNoti', {pageNum: 0}).then((res) => {
    //       if (res.status === 200) {
    //         console.log(res.data.data, "notification data")
    //         if(res.data.data.length){
    //           setNotified(res.data.data)
    //           getNewNoti();
    //           setPageNum(0)
    //         }
    //       }
    //     }).catch((err) => {
    //     });
    //   }
    // } 
  }

  const upDateuserInfo = () => {
    Axios.post('getUserInfoById', {
      user: userInfo
    }).then((res) => {
      if (res.status === 200) {
        var userTempData = {
          userId: res.data.data.u_id,
          userEmail: res.data.data.u_email,
          userAvatar: '',
          userComAvatar: '',
          userName: res.data.data.u_name,
          userComName: res.data.data.u_company_name
        };
        var userRealData = {
          userId: res.data.data.u_id,
          userEmail: res.data.data.u_email,
          userAvatar: res.data.data.u_avatar,
          userComAvatar: res.data.data.u_com_avatar,
          userName: res.data.data.u_name,
          userComName: res.data.data.u_company_name
        }
        console.log(userRealData);
        setUserInfo(userRealData);
        setTimeout(()=>{
          setUserInfo(userRealData);
        }, 1000);
        localStorage.setItem('bootstrap', JSON.stringify(userRealData));
        
        setTempImage("");
        setImage("");
        console.log("userProfile is updated");
      }
    }).catch((err) => {
    });
  }
  const openDeleteModal = (target) => {
    setTargetImage(target)
    setDeleteModal(true);
  }

  const deleteImage = () => {
    Axios.post('deleteAvatar', {
      target: targetImage,
      user: userInfo
    }).then((res) => {
      setDeleteModal(false);
      if (res.status === 200) {
        cogoToast.success("Image is removed")
        upDateuserInfo()
      }
    }).catch((err) => {
      setDeleteModal(false);
    });
  }

  const uploadAvatar = () => {
    console.log(imageCrop.current.getImage().toDataURL(), "imageData");
    Axios.post('uploadavatar', {
      image: imageCrop.current.getImage().toDataURL(),
      target: targetImage,
      user: userInfo
    }, {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadPercent(percentCompleted)
      }
    }).then((res) => {
      setUploadPercent(0);
      if (res.status === 200) {
        cogoToast.success("upload is completed")
        setUploadModal(false);
        upDateuserInfo();
      }
    }).catch((err) => {
      setUploadPercent(0);
      setUploadModal(false);
    });
    // fetch(imageCrop.current.getImage().toDataURL()).then(res=>res.blob()).then(blob=>{
    //   console.log(window.URL.createObjectURL(blob), "blob")
    // })
  }

  const getNewNoti = () => {
    var user = JSON.parse(localStorage.getItem('bootstrap'));
    Axios.post('getNewNoti', { user }).then(res => {
      console.log(res.data)
      var num = 0;
      res.data.data.map((item, index)=>{
        if(!item.clicked){
          num++;
        }
      })
      setNotiNum(num);
      setNewNoti(res.data.data)
    })
  }
  const signout = () => {
    localStorage.removeItem("bootstrap");
    window.location = "/signin"
  }
  React.useEffect(() => {
    window.addEventListener("dragover", function (e) {
      e = e || event;
      e.preventDefault();
    }, false);
    window.addEventListener("drop", function (e) {
      e = e || event;
      e.preventDefault();
    }, false);
    var user = JSON.parse(localStorage.getItem('bootstrap'));
    setUserInfo(user);
    Axios.post('getNoti', { pageNum: page }).then((res) => {
      if (res.status === 200) {
        console.log(res.data.data, "notification data")
        setNotified(res.data.data)
        getNewNoti();
      }
    }).catch((err) => {
    });
    socketClient.off('Noti');
    socketClient.on('Noti', getUpdatedData)
  }, [])

  const getUpdatedData = (data, modify) => {
    setNotified(modify.noti_num)
    if (modify.noti_num) {
      getNewNoti();
    }
  }
  const handleProfileMenuOpen = (event) => {
    setImage("")
    setRotate(0)
    setAnchorEl(event.currentTarget);
    setAcctModal(!acctModal);
  };

  const openClick = (user) => {
    console.log(user);
    Axios.post('openNoti', user).then((res) => {
      if (res.status === 200) {
        console.log(res.data, "notification data")
        getNewNoti();
      }
    }).catch((err) => {
    });
  };

  const handleNotiMenuOpen = (event) => {
    setAnchorNoti(event.currentTarget);
    setNotiModal(!acctModal);
    Axios.post('getNoti', { pageNum: page }).then((res) => {
      if (res.status === 200) {
        console.log(res.data, "notification data")
        setNotified(res.data.data)
      }
    }).catch((err) => {
    });
    var user = JSON.parse(localStorage.getItem('bootstrap'));
    openClick(user);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleCreateMenuOpen = (event) => {
    setAnchorEl2(event.currentTarget.parentNode);
  };

  const handleCreateMenuClose = () => {
    setAnchorEl2(null);
    handleMobileMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const createId = 'primary-search-create-menu';

  const openModal = (target) => {
    setTargetImage(target)
    setUploadModal(true)
  }



  const getDataFromAPI = () => {
    console.log("Options Fetched from API")

    fetch('http://dummy.restapiexample.com/api/v1/employees').then((response) => {
      return response.json()
    }).then((res) => {
      for (var i = 0; i < res.data.length; i++) {
        myOptions.push(res.data[i])
      }
      setMyOptions(myOptions)
    })
  }

  const selectImage = async (file) => {
    if (file.type.substring(0, 5) != "image") return alert("You must select image file")
    setImage(file)
    console.log(URL.createObjectURL(file), "temp image url")
    setTempImage(URL.createObjectURL(file))
  }

  const renderMenu = (
    acctModal ? <ClickAwayListener onClickAway={(e) => {
      if (acctModal) { setAcctModal(false) }
    }} >

      <Popper
        open={acctModal}
        anchorEl={anchorEl}
        className="acctModal"
      >
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={uploadModal}
          onClose={() => { setUploadModal(false) }}
          closeAfterTransition
        >
          <Fade in={uploadModal}>
            <div>
              <AppBar position="static" className={classes.appbar}>
                <Toolbar>
                  <Typography className={classes.title} variant="h6" noWrap>
                    Select {targetImage} logo
                  </Typography>
                  <div className={classes.grow} />
                  <IconButton aria-label="show 17 new notifications" color="inherit" onClick={() => { setUploadModal(false) }}>
                    <CloseIcon style={{ color: "gray" }} />
                  </IconButton>
                </Toolbar>
              </AppBar>
              {
                selectedImage ? <div className={classes.paper}>
                  <div className="avatar-editor-container">
                    <div className="avatar-previewer">
                      <AvatarEditor
                        image={tempImage}
                        lineWidth={10}
                        width={250}
                        height={250}
                        border={50}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={zoom}
                        rotate={rotate}
                        ref={imageCrop}

                      />
                    </div>
                    <div className="editor-controller">
                      <div onClick={() => { setRotate(rotate - 90) }}><RotateLeftIcon />LEFT</div>
                      <div onClick={() => { setRotate(rotate + 90) }}><RotateRightIcon />RIGHT</div>
                      <div><Slider value={zoom} onChange={handleZoom} aria-labelledby="continuous-slider" step={0.1} min={1} max={2.5} />ZOOM</div>
                      <div></div>
                    </div>
                  </div>
                </div> : <FileDrop
                  onFrameDragEnter={(event) => console.log('onFrameDragEnter')}
                  onFrameDragLeave={(event) => setDropping(false)}
                  onFrameDrop={(event) => console.log('onFrameDrop')}
                  onDragOver={(event) => {console.log('DragOver'); setDropping(true) }}
                  onDragLeave={(event) => {console.log('DragLeave');  }}
                  onDrop={(files, event) => { selectImage(files[0]); setDropping(false); }}
                >

                  <div className={classes.paper}>
                    <img src={'/image_thumbnail.png'} alt="Logo" />
                    <h2 id="transition-modal-title" className={classes.noDrag}>{isDropping ? '' : 'Drog a '+ targetImage +' image here'}</h2>
                    {
                      isDropping ? <h2 id="transition-modal-title" className={classes.onDrog} >Drop your file here</h2> : null
                    }
                    <h5 id="transition-modal-description" style={{ color: 'gray', marginTop: 15 }}>- or -</h5>
                    <input type="file" ref={fileUploadRef} name="myImage" onChange={e => selectImage(e.target.files[0])} style={{ display: "none" }} />
                    <Button
                      variant="outlined"
                      color="primary"
                      className={classes.cancelBtn}
                      onClick={() => { fileUploadRef.current.click() }}
                    >Select a photo from your computer</Button>
                  </div>
                </FileDrop>
              }
              <AppBar position="static" className={classes.appbar} color="inherit">
                <Toolbar>
                  <Button variant="contained" disabled={selectedImage ? false : true} onClick={() => { uploadAvatar() }} >Upload {uploadPercent ? uploadPercent + "%" : null}</Button>
                  <div style={{ flexGrow: 0.03 }}></div>
                  <Button variant="outlined" className={classes.cancelBtn} onClick={() => { setUploadModal(false);  setTempImage(''); setImage('') }}>Cancel</Button>
                </Toolbar>
              </AppBar>
            </div>
          </Fade>
        </Modal>
        <div className={classes.logoContainer}>
          <div className={classes.logoContent}>
            {userInfo?.userComAvatar ? <img src={serverUrl + userInfo.userComAvatar} alt="comavatar" className="userAvatar" /> : userInfo?.userComName[0]?.toUpperCase()}
            <div className={classes.avataBtnContainer}>
              <div onClick={() => {
                openModal("Company")
              }}>
                <Box className={classes.avatarChgBtn} boxShadow={5}>
                  <Tooltip title="Edit Company Avatar" placement="bottom">
                    <CameraAltIcon style={{ color: "gray" }} />
                  </Tooltip>
                </Box>
              </div>
              <div
                onClick={() => {
                  openDeleteModal("Company")
                }}
              >
                <Box className={classes.avatarChgBtn} boxShadow={5}>
                  <Tooltip title="Remove Company Avatar" placement="bottom">
                    <CloseIcon style={{ color: "gray" }} />
                  </Tooltip>
                </Box>
              </div>
            </div>
          </div>

          <div className={classes.logoContent}>
            {userInfo?.userAvatar ? <img src={serverUrl + userInfo.userAvatar} alt="comavatar" className="userAvatar" /> : userInfo?.userName[0]?.toUpperCase()}
            {/* {userInfo?userCo} */}
            <div className={classes.avataBtnContainer}>
              <div onClick={() => {
                openModal("Profile")
              }}><Box className={classes.avatarChgBtn} boxShadow={5}>
                  <Tooltip title="Remove User Avatar" placement="bottom">
                    <CameraAltIcon style={{ color: "gray" }} />
                  </Tooltip>
                </Box>
              </div>
              <div
                onClick={() => {
                  openDeleteModal("Profile")
                }}
              >
                <Box className={classes.avatarChgBtn} boxShadow={5}>
                  <Tooltip title="Remove User Avatar" placement="bottom">
                    <CloseIcon style={{ color: "gray" }} />
                  </Tooltip>
                </Box>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.userNameContainer}>
          <div className={classes.userNameText}>{userInfo?.userName}</div>
          <div className={classes.userEmailText}>{userInfo?.userEmail}</div>
        </div>

        <div className={classes.manageBtnContainer}>
          <div className={classes.manageAcctBtn}>
            Manage your Google Account
          </div>
        </div>
        <Divider />

        <div className={classes.userInfoTotalContainer}>
          <div className={classes.userInfoContainer}>
            <div className="smallAvatar">
              <div className={"smallAvatarB"}>{userInfo?.userComAvatar ? <img src={'/banner2.png'} alt="comavatar" className="userAvatar" /> : userInfo?.userComName[0]?.toUpperCase()}</div>
            </div>
            <div className="smallAvatarR">
              <div className={"smallAvatarY"}>{userInfo?.userAvatar ? <img src={'/banner1.png'} alt="comavatar" className="userAvatar" /> : userInfo?.userName[0]?.toUpperCase()}</div>
            </div>
          </div>
          <div>
            <div className={classes.userNameSubContainer}>
              <div className={classes.userNameText}>{userInfo?.userName}</div>
              <div className={classes.userEmailText}>{userInfo?.userEmail}</div>
            </div>
          </div>
          <div>
            <ExpandMoreIcon />
          </div>
        </div>
        <Divider />
        <div className={classes.signOutButtonContainer} onClick={signout}>
          <Button variant="outlined">Sign Out</Button>
        </div>
      </Popper>
    </ClickAwayListener> : null
  );
  const notiClick = (id) => {
    var user = JSON.parse(localStorage.getItem('bootstrap'));
    Axios.post('readNoti', { userId: user.userId, noti_id: id }).then(res => {
      getNewNoti();
    })
  }
  const checkRead = (id) => {
    var flag = false;
    newNoti.map(newItem => {
      if (newItem.u_no_id == id) flag = true;
    })
    return flag;
  }
  const ownerCheck = (id) => {
    var flag = false;
    const userInfo = JSON.parse(localStorage.getItem("bootstrap"));

    newNoti.map(newItem => {
      if (newItem.u_no_id == id && newItem.u_u_id == userInfo.userId && newItem.clicked == 2) flag = true;
    })
    return flag;
  }
  const renderNotifications = (
    notiModal ? <ClickAwayListener onClickAway={() => { if (notiModal) { setNotiModal(false) } }}>
      <Popper
        open={notiModal}
        anchorEl={anchorNoti}
        className="notiMenu"
        onScroll={(e) => { intinitScroll(e) }}
      >
        {nodifiedState.map((item, index) => (
          !ownerCheck(item.noti_id) ? checkRead(item.noti_id) ? <ListItem key={`item-${item.noti_id}`} button className={classes.notiClicked} onClick={() => { notiClick(item.noti_id) }}>
            <ListItemText primary={item.noti_content} secondary={new Date(item.noti_created_at).toUTCString().substring(0, 22)} className="noti-date" />
          </ListItem> : <ListItem key={`item-${item.noti_id}`} button className={classes.notiClicked} selected onClick={() => { notiClick(item.noti_id) }}>
            <ListItemText primary={item.noti_content} secondary={new Date(item.noti_created_at).toUTCString().substring(0, 22)} className="noti-date" />
          </ListItem> : null
        ))}
      </Popper>
    </ClickAwayListener> : null
  );

  const renderMenu2 = (
    <Menu
      anchorEl={anchorEl2}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      id={createId}
      keepMounted
      open={isMenu2Open}
      onClose={handleCreateMenuClose}
    >
      <MenuItem onClick={handleCreateMenuClose}>Ric. Intervento</MenuItem>
      <MenuItem onClick={handleCreateMenuClose}>Fattura</MenuItem>
      <MenuItem onClick={handleCreateMenuClose}>Preventivo</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleCreateMenuOpen}>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <AddIcon />
          </Badge>
        </IconButton>
        <p>Crea</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          className={classes.iconCompany}
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={deleteModal}
        onClose={() => { setDeleteModal(false) }}
        closeAfterTransition
      >
        <div className="confirmModal">
          <div className="confirmTitle">Are you sure to delete this image?</div>
          <div className="confirmButtons">
            <Button
              variant="outlined"
              color="primary"
              className={classes.cancelBtn}
              onClick={() => { setDeleteModal(false) }}
            >No</Button>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.cancelBtn}
              onClick={() => { deleteImage() }}
            >Yes</Button>
          </div>
        </div>



      </Modal>



      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Wesy
          </Typography>
          <Autocomplete
            style={{ width: 300 }}
            freeSolo
            className={classes.inputRoot}
            autoComplete
            autoHighlight
            options={myOptions}
            // filterOptions={filterOptions}
            getOptionLabel={option => option.employee_name}
            renderOption={option => {
              return (
                <div>
                  <i className="fa fa-bell" aria-hidden="true"></i>
                  {option.employee_name + ' bella'}
                </div>
              );
            }}
            renderInput={(params) => (
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <TextField
                  variant="outlined"
                  onChange={getDataFromAPI}
                  placeholder="Cerca collaboratore"
                  {...params}
                />
              </div>
            )}
          />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              aria-haspopup="true"
              onClick={handleNotiMenuOpen}
            >
              <Badge badgeContent={notiNum} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              className={classes.iconCompany}
            >
              <AccountCircle />
              {/* <div className = {classes.NavBarlogoContent}>
                {userInfo?.u_company_name?userInfo?.u_company_name[0]?.toUpperCase():null}
              </div> */}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotifications}
      {renderMenu2}
    </div>
  );
}
