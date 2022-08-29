import React from "react";
import axios from 'axios'
import Head from 'next/head'
import Link from "next/link";
import moment from "moment";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'
import { GiThreeFriends } from 'react-icons/gi'
import { AiFillHome } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { FaSignOutAlt, FaImage, FaShareSquare } from 'react-icons/fa'
import { FiEdit3 } from 'react-icons/fi'
import { FcLike } from 'react-icons/fc'
import { GoKebabHorizontal } from 'react-icons/go'
import { GiSelfLove } from 'react-icons/gi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useToast } from '@chakra-ui/react'
import { Text, Image, Menu, MenuButton, Avatar, AvatarBadge, MenuList, MenuGroup, MenuItem, Button, Textarea, Divider } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Spinner
} from '@chakra-ui/react'
import { BiMailSend } from "react-icons/bi";


const timelinePage = () => {
    const toast = useToast()
    const router = useRouter()
    const [toggle, setToggle] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const API_URL = "http://localhost:1997"
    const [dataUser, setDataUser] = React.useState('')
    const [news, setNews] = React.useState([]);
    const [likePost, setLikePost] = React.useState([])
    const [posting, setPosting] = React.useState([])
    const [like, setLike] = React.useState([])
    const [edit, setEdit] = React.useState([])
    const [editCapt, setEditCapt] = React.useState('')
    const [img, setImg] = React.useState('');
    const [caption, setCaption] = React.useState('');
    const [prevImg, setPrevImg] = React.useState('')
    const [limit, setLimit] = React.useState(2)
    const [hasMore, setHasMore] = React.useState(true)
    const [allPost, setAllPost] = React.useState([])
    const [postKey, setPostKey] = React.useState(1)
    const [toggleSpinResend, setToggleSpinResend] = React.useState(false)
    let checkLike = []

    const keepLogin = () => {
        let socmedLog = localStorage.getItem('socmedLog');
        if (socmedLog != "null") {
            axios.get(API_URL + `/users/keep`, {
                headers: {
                    'Authorization': `Bearer ${socmedLog}`
                }
            })
                .then((res) => {
                    console.log(res.data)
                    if (res.data.idusers) {
                        localStorage.setItem('socmedLog', res.data.token);
                        setLoading(false)
                        setDataUser(res.data)
                        setLikePost(res.data.likes)
                    }
                }).catch((err) => {
                    console.log(err);
                })
        } else if (socmedLog == "null") {
            router.push({
                pathname: '/login'
            })
        }
    }

    const getNews = () => {
        axios.get("https://newsapi.org/v2/top-headlines?country=id&apiKey=d412e5b8eaa34147b38d9c4766de98d9").
            then((res) => {
                setNews(res.data.articles)
            }).catch((err) => {
                console.log(err)
            })
    }

    const printHotNews = () => {
        return news.map((val, idx) => {
            if (idx < 6) {
                return <div className='mb-3'>
                    <div className='position-relative d-flex'>
                        <img src={val.urlToImage} className='img-fluid border' alt="" style={{ maxWidth: 130, maxHeight: 100 }}></img>
                        <div className='ms-2'>
                            <span className='text-muted'>{val.publishedAt.split('T')[0]}</span>
                            <br />
                            {val.title.length > 50 ?
                                <span className=' fw-bold'>{val.title.slice(0, 51)}...</span>
                                :
                                <span className='fw-bold'>{val.title}</span>
                            }
                        </div>
                    </div>
                    <Divider />
                </div>
            }
        })
    }

    const imageHandler = (e) => {
        setImg(e.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setPrevImg(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    const handleResend = async () => {
        try {
            setToggleSpinResend(true)
            let token = localStorage.getItem('socmedLog');
            console.log(token)
            let res = await axios.get(API_URL + `/users/resend`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            console.log(res.data)
            if (res.data.idusers) {
                localStorage.setItem('verifToken', res.data.token);
                toast({
                    title: "Resend Success",
                    position: 'top',
                    description: `Check your Email to Verification`,
                    status: "success",
                    duration: 3000,
                    isClosable: true
                })
                setToggleSpinResend(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllPost = () => {
        axios.get(API_URL + `/post`)
            .then((res) => {
                setAllPost(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const getPost = () => {
        axios.get(API_URL + `/post?limit=${limit}`)
            .then((res) => {
                setPosting(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const getMorePost = () => {
        axios.get(API_URL + `/post?limit=${limit + 2}`)
            .then((res) => {
                setPosting(res.data)
                setLimit(limit + 2)
                if (limit >= allPost.length) {
                    setHasMore(false)
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    const getLike = () => {
        axios.get(API_URL + `/post/getLike`)
            .then((res) => {
                setLike(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const handleLogout = () => {
        let socmedLog = localStorage.getItem('socmedLog');
        if (socmedLog) {
            localStorage.setItem('socmedLog', null)
            router.push({
                pathname: '/'
            })
        }
    }

    const onAddPost = () => {
        setPostKey(postKey + 1)
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            user_id: dataUser.idusers,
            username_post: dataUser.username,
            caption,
            profilepicture: dataUser.profilepicture
        }))
        formData.append('image', img);
        axios.post(API_URL + '/post/add', formData).then((response) => {
            if (response.data.success) {
                getPost();
                toast({
                    title: "Post Added",
                    description: ``,
                    status: "success",
                    duration: 3000,
                    isClosable: true
                })
                setImg('');
                setCaption('');
                setPrevImg('');
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const onDelete = (idposting) => {
        axios.delete(API_URL + `/post/delete?id=${idposting}`)
            .then((response) => {
                if (response.data.success) {
                    getPost()
                    toast({
                        title: "Post Deleted",
                        status: "success",
                        duration: 3000,
                        isClosable: true
                    })
                }
            }).catch((error) => {
                console.log(error)
                toast({
                    title: "Error Deleted",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true
                })
            })
    }

    const handleLike = (idposting) => {
        axios.post(API_URL + '/post/like', {
            user_id: dataUser.idusers,
            post_id: idposting
        }).then((response) => {
            if (response.data.success) {
                keepLogin()
                getLike()
                getPost();
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleUnlike = (idposting) => {
        axios.delete(API_URL + `/post/unlike?iduser=${dataUser.idusers}&idposting=${idposting}`)
            .then((response) => {
                if (response.data.success) {
                    keepLogin()
                    getLike()
                    getPost();
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    const onEdit = (val) => {
        let date = val.date.split('T')[0].split('-')
        let dateMan = val.date.split('T')[1].split('.')[0].split(':')
        dateMan.splice(0, 1, parseInt(dateMan[0]) + 7)
        if (dateMan[0] >= 24) {
            dateMan[0] = parseInt(dateMan[0]) - 24;
            date[2] = parseInt(date[0] + 1);
        }
        axios.patch(API_URL + `/post/edit?id=${val.idposting}`, {
            caption: editCapt,
            date: date + ' ' + dateMan
        }).then((response) => {
            if (response.data.success) {
                keepLogin()
                getLike()
                getPost();
            }
        }).catch((error) => {
            console.log(error)
        })
    }


    const printPost = () => {
        return posting.map((val, idx) => {
            let angka2 = [val.date.split('-')[2].split('T')[0], val.date.split('-')[1], val.date.split('-')[0]]
            let angka3 = val.date.split('T')[1].split('.')[0].split(':')
            angka3.splice(0, 1, parseInt(angka3[0]) + 7)
            if (angka3[0] >= 24) {
                angka3[0] = parseInt(angka3[0]) - 24;
                angka2[0] = parseInt(angka2[0] + 1);
            }
            let jam = angka3.join(':')
            let date = angka2.join('-')
            let tanggal = date + ' ' + jam
            let startTime = moment(`${tanggal}`, 'DD-MM-YYYY hh:mm:ss');
            let angka4 = [moment().format().split('-')[2].split('T')[0], moment().format().split('-')[1], moment().format().split('-')[0]]
            let angka5 = moment().format().split('T')[1].split('+')[0].split(':')
            let jam1 = angka5.join(':')
            let date1 = angka4.join('-')
            let tanggal1 = date1 + ' ' + jam1
            let endTime = moment(`${tanggal1}`, 'DD-MM-YYYY hh:mm:ss');
            let diff = endTime.diff(startTime, 'seconds')
            let printDiff = diff + ' seconds ago'
            if (diff > 60 && diff < 3600) {
                diff = endTime.diff(startTime, 'minutes')
                printDiff = diff + ' minutes ago'
            } else if (diff >= 3600 && diff < 86400) {
                diff = endTime.diff(startTime, 'hours')
                printDiff = diff + ' hours ago'
            } else if (diff >= 86400 && diff < 604800) {
                diff = endTime.diff(startTime, 'days')
                printDiff = diff + ' days ago'
            } else if (diff >= 604800 && diff < (43200 * 60)) {
                diff = endTime.diff(startTime, 'weeks')
                printDiff = diff + ' weeks ago'
            } else if (diff >= (43200 * 60) && diff < (525600 * 60)) {
                diff = endTime.diff(startTime, 'months')
                printDiff = diff + ' months ago'
            } else if (diff >= (525600 * 60)) {
                diff = endTime.diff(startTime, 'years')
                printDiff = diff + ' years ago'
            }
            if (edit.idposting != val.idposting) {
                return <div>
                    <div className="card row">
                        <div className="m-3 col-12">
                            <div className="d-flex">
                                <Avatar name={val.username} src={API_URL + val.profilepicture} className="col-1">
                                </Avatar>
                                <div className="fs-4 col-11 ms-4">{val.username}</div>
                            </div>
                            <div className="ms-3 col-11 mt-3">
                                <Link href={`/post?id=${val.idposting}`}>
                                    <Image type="button" src={API_URL + val.image} margin='auto' objectFit='cover' width={640} height={640} />
                                </Link>
                                <div className="d-flex my-0">
                                    <div className="fs-5 fw-bold">{val.username}</div>
                                    <div className='fs-5 ms-3 text-wrap w-75'>{val.caption}</div>
                                </div>
                                <span className="fs-6 text-muted">{printDiff}</span>
                                <div className="d-flex justify-content-between">
                                    {likePost.map((value, index) => {
                                        if (val.idposting == value.idposting) {
                                            checkLike.push(true)
                                        } else {
                                            checkLike.push(false)
                                        }
                                    })
                                    }
                                    {
                                        (checkLike.includes(true)) ?
                                            <div className="d-flex">
                                                <FcLike size={30} type='button' onClick={() => handleUnlike(val.idposting)} />
                                                {like.map((value, index) => {
                                                    if (value.post_id == val.idposting) {
                                                        return <span className="fs-5 ms-3">{value.totalLike}</span>
                                                    }
                                                })}
                                            </div>
                                            :
                                            <div className="d-flex">
                                                <GiSelfLove size={30} type='button' onClick={() => handleLike(val.idposting)} />
                                                {like.map((value, index) => {
                                                    if (value.post_id == val.idposting) {
                                                        return <span className="fs-5 ms-3">{value.totalLike}</span>
                                                    }
                                                })}
                                            </div>
                                    }
                                    {checkLike = []}
                                    <Menu >
                                        <MenuButton>
                                            <GoKebabHorizontal size={30} />
                                        </MenuButton>
                                        <MenuList>
                                            <MenuGroup>
                                                {val.user_id == dataUser.idusers ?
                                                    <div>
                                                        <MenuItem onClick={() => setEdit(val)} ><FiEdit3 className="me-3" />Edit</MenuItem>
                                                        <MenuItem ><FaShareSquare className="me-3" />Share</MenuItem>
                                                        <MenuItem onClick={() => onDelete(val.idposting)}><RiDeleteBin6Line className="me-3" />Delete</MenuItem>
                                                    </div>
                                                    :
                                                    <MenuItem ><FaShareSquare className="me-3" />Share</MenuItem>
                                                }
                                            </MenuGroup>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            } else {
                return <div>
                    <div className="card row">
                        <div className="m-3 col-12">
                            <div className="d-flex">
                                <Avatar name={val.username} src={API_URL + val.profilepicture} className="col-1">
                                </Avatar>
                                <div className="fs-4 col-11 ms-4">{val.username}</div>
                            </div>
                            <div className="ms-3 col-11 mt-3">
                                <Link href={`/post?id=${val.idposting}`}>
                                    <Image type="button" src={API_URL + val.image} margin='auto' objectFit='cover' width={640} height={640}></Image>
                                </Link>
                                <div className="d-flex">
                                    <div className="fs-5 fw-bold">{val.username}</div>
                                    <div>
                                        <Textarea className="fs-5 col-12" defaultValue={val.caption} onChange={(e) => setEditCapt(e.target.value)} />
                                        <Button colorScheme='twitter' className="me-0 w-25" onClick={() => {
                                            onEdit(val)
                                            setEdit([])
                                        }} >Submit</Button>
                                    </div>
                                </div>
                                <span className="fs-6 text-muted">{printDiff}</span>
                                <div className="d-flex justify-content-between">
                                    {likePost.map((value, index) => {
                                        if (val.idposting == value.idposting) {
                                            checkLike.push(true)
                                        } else {
                                            checkLike.push(false)
                                        }
                                    })
                                    }
                                    {
                                        (checkLike.includes(true)) ?
                                            <div className="d-flex">
                                                <FcLike size={30} type='button' onClick={() => handleUnlike(val.idposting)} />
                                                {like.map((value, index) => {
                                                    if (value.post_id == val.idposting) {
                                                        return <span className="fs-5 ms-3">{value.totalLike}</span>
                                                    }
                                                })}
                                            </div>
                                            :
                                            <div className="d-flex">
                                                <GiSelfLove size={30} type='button' onClick={() => handleLike(val.idposting)} />
                                                {like.map((value, index) => {
                                                    if (value.post_id == val.idposting) {
                                                        return <span className="fs-5 ms-3">{value.totalLike}</span>
                                                    }
                                                })}
                                            </div>
                                    }
                                    {checkLike = []}
                                    <Menu >
                                        <MenuButton>
                                            <GoKebabHorizontal size={30} />
                                        </MenuButton>
                                        <MenuList>
                                            <MenuGroup>
                                                {val.user_id == dataUser.idusers ?
                                                    <div>
                                                        <MenuItem onClick={() => setEdit(val)} ><FiEdit3 className="me-3" />Edit</MenuItem>
                                                        <MenuItem ><FaShareSquare className="me-3" />Share</MenuItem>
                                                        <MenuItem onClick={() => onDelete(val.idposting)}><RiDeleteBin6Line className="me-3" />Delete</MenuItem>
                                                    </div>
                                                    :
                                                    <MenuItem ><FaShareSquare className="me-3" />Share</MenuItem>
                                                }
                                            </MenuGroup>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider />
                </div>
            }
        })
    }


    React.useEffect(() => {
        keepLogin()
        getAllPost()
        getLike()
        getPost()
        getNews()
    }, []);


    return <div>
        {loading ?
            <div className={styles.loading}>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </div> :
            <div>
                {dataUser.status == "Unverified" ?
                    <div>
                        <Head>
                            <title>Verification</title>
                            <meta name="description" content="Generated by create next app" />
                            <link rel="icon" href="logo.png" />
                        </Head>
                        <div className='container w-100 bg-white'>
                            <div className='d-flex' style={{ marginBottom: 100 }}>
                                <GiThreeFriends size={50} />
                                <Menu>
                                    <MenuButton>
                                        <div className="d-flex ms-3">
                                            <Avatar name={dataUser.username} src={API_URL + dataUser.profilepicture}>
                                                <AvatarBadge boxSize='1em' bg='green.500' />
                                            </Avatar>
                                        </div>
                                    </MenuButton>
                                    <MenuList>
                                        <MenuGroup>
                                            <MenuItem onClick={handleLogout}>SignOut <FaSignOutAlt className="ms-3" /></MenuItem>
                                        </MenuGroup>
                                    </MenuList>
                                </Menu>
                            </div>
                            <BiMailSend size={200} className="m-auto" />
                            <p className="text-muted text-center">You are not Verified, you must resend link for Verification</p>
                            <br />
                            <button type="button" className="btn btn-success w-25 position-relative" style={{ marginLeft: 500 }} onClick={() => handleResend()} >Resend Link Verification</button>
                            <Modal isOpen={toggleSpinResend} isCentered={true} size='xs'>
                                <ModalOverlay bg='blackAlpha.300'
                                    backdropFilter='blur(10px) hue-rotate(90deg)' />
                                <ModalContent className='align-items-center bg-transparent' >
                                    <Spinner
                                        thickness='4px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        color='blue.500'
                                        size='xl'
                                    />
                                </ModalContent>
                            </Modal>
                        </div>
                    </div>
                    : <div style={{ marginTop: 50 }}>
                        <Head>
                            <title>Home</title>
                            <meta name="description" content="Generated by create next app" />
                            <link rel="icon" href="logo.png" />
                        </Head>
                        <div className="container">
                            <div className="row">
                                <div className="col-3 position-fixed">
                                    <div className='d-flex'>
                                        <GiThreeFriends size={50} />
                                        <Menu>
                                            <MenuButton>
                                                <div className="d-flex ms-3">
                                                    <Avatar name={dataUser.username} src={API_URL + dataUser.profilepicture}>
                                                        <AvatarBadge boxSize='1em' bg='green.500' />
                                                    </Avatar>
                                                </div>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuGroup>
                                                    <MenuItem onClick={handleLogout}>SignOut <FaSignOutAlt className="ms-3" /></MenuItem>
                                                </MenuGroup>
                                            </MenuList>
                                        </Menu>
                                    </div>
                                    <div className="d-flex" style={{ marginTop: 100 }}>
                                        <Link href='/timeline'>
                                            <div className="d-flex rounded" type='button'>
                                                <AiFillHome size={40} /><span className='fw-bold fs-2 text-dark' style={{ fontFamily: 'monospace' }}>Home </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="d-flex mt-3">
                                        <Link href='/profile'>
                                            <div className="d-flex rounded" type='button'>
                                                <CgProfile size={40} /><span className='fw-bold fs-2 text-dark' style={{ fontFamily: 'monospace' }}>Profile </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div style={{ marginTop: 100 }}>
                                        <Button colorScheme='twitter' width={200} fontSize={30} onClick={() => setToggle(!toggle)}>Post</Button>
                                        <Modal isOpen={toggle} onClose={() => setToggle(!toggle)} size='3xl'>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalCloseButton onClick={() => {
                                                    setCaption('')
                                                    setPrevImg('')
                                                }} />
                                                <ModalHeader></ModalHeader>
                                                <ModalBody>
                                                    <div className='row '>
                                                        <div className='col-12 d-flex'>
                                                            <Avatar name={dataUser.username} src={API_URL + dataUser.profilepicture}>
                                                            </Avatar>
                                                            <Textarea className='form-control m-auto border-0' height={100} type='text' placeholder="What's Happening?" fontSize={20} onChange={(e) => setCaption(e.target.value)} />
                                                        </div>
                                                        <div className="col-10 ms-5">
                                                            <label htmlFor="upload" className="shadow"><FaImage size={30} /></label>
                                                            <input onChange={(e) => imageHandler(e)} type='File' id="upload" className="d-none" />
                                                            <Image boxSize='100% 50%' width={640} height={640} margin='auto' objectFit='cover' src={prevImg} fallbackSrc='https://media.istockphoto.com/vectors/image-preview-icon-picture-placeholder-for-website-or-uiux-design-vector-id1222357475?k=20&m=1222357475&s=612x612&w=0&h=jPhUdbj_7nWHUp0dsKRf4DMGaHiC16kg_FSjRRGoZEI=' />
                                                        </div>
                                                    </div>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <div>
                                                        {caption.length <= 300 ?
                                                            <div>
                                                                <Avatar name=" " bg='teal.300' color='black'>{300 - caption.length}</Avatar>
                                                                <Button colorScheme='twitter' className='btn btn-success text-white ms-5' onClick={() => {
                                                                    onAddPost()
                                                                    setToggle(!toggle);
                                                                }}>Post</Button>
                                                            </div>
                                                            :
                                                            <div>
                                                                <Avatar name=" " bg='red.300' color='black'>-{caption.length - 300}</Avatar>
                                                                <Button colorScheme='twitter' className='btn btn-success text-white ms-5' onClick={() => {
                                                                    onAddPost()
                                                                    setToggle(!toggle);
                                                                }} disabled>Post</Button>
                                                            </div>
                                                        }
                                                    </div>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                    </div>
                                </div>
                                <div className="col-3"></div>
                                <div className="col-6 card">
                                    <div className='row card'>
                                        <div className='col-12 d-flex mt-3'>
                                            <Avatar name={dataUser.username} src={API_URL + dataUser.profilepicture}>
                                            </Avatar>
                                            <Textarea className='form-control m-auto border-0' height={100} key={postKey} type='text' id="post" placeholder="What's Happening?" fontSize={20} onChange={(e) => setCaption(e.target.value)} />
                                        </div>
                                        <div className="col-10 ms-5">
                                            <label htmlFor="upload" className="shadow"><FaImage size={30} /></label>
                                            <input onChange={(e) => imageHandler(e)} type='File' id="upload" className="d-none" />
                                            {prevImg
                                                ?
                                                <Image width={200} height={200} margin='auto' objectFit='cover' src={prevImg} />
                                                : null}
                                        </div>
                                        {caption.length <= 300 ?
                                            <Avatar name=" " bg='teal.300' color='black' className="ms-auto">{300 - caption.length}</Avatar>
                                            :
                                            <Avatar name=" " bg='red.300' color='black' className="ms-auto">-{caption.length - 300}</Avatar>
                                        }
                                        {caption.length <= 300 ?
                                            <Button colorScheme='twitter' className='btn btn-success text-white w-25 ms-auto my-3' onClick={() => {
                                                onAddPost()
                                            }}>Post</Button>
                                            :
                                            <Button colorScheme='twitter' className='btn btn-success text-white ms-auto w-25 my-3' onClick={() => {
                                                onAddPost()
                                            }} disabled>Post</Button>
                                        }
                                    </div>
                                    <InfiniteScroll
                                        dataLength={posting.length}
                                        next={getMorePost}
                                        hasMore={hasMore}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        {printPost()}
                                    </InfiniteScroll>
                                </div>
                                <div className="col-3">
                                    {printHotNews()}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }
    </div >
}

export default timelinePage