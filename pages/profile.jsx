import React from "react";
import axios from 'axios'
import Head from 'next/head'
import Link from "next/link";
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { GiThreeFriends, GiSelfLove } from 'react-icons/gi'
import { GoKebabHorizontal } from 'react-icons/go'
import { AiFillHome } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { FaSignOutAlt, FaImage, FaShareSquare, FaUserEdit } from 'react-icons/fa'
import { FiEdit3 } from 'react-icons/fi'
import { FcLike } from 'react-icons/fc'
import { Text, Menu, MenuButton, Avatar, AvatarBadge, MenuList, MenuGroup, MenuItem, Spinner, Image, Divider, useToast } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Button } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Textarea
} from '@chakra-ui/react'
import { BiMailSend } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr"

const profilePage = (props) => {
    const toast = useToast()
    const router = useRouter();
    const API_URL = "http://localhost:1997"
    const [toggle, setToggle] = React.useState(false)
    const [togglePost, setTogglePost] = React.useState(false)
    const [toggleReset, setToggleReset] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [dataUser, setDataUser] = React.useState('')
    const [ownPost, setOwnPost] = React.useState([])
    const [likePost, setLikePost] = React.useState([])
    const [bio, setBio] = React.useState('')
    const [fullname, setFullname] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [profPict, setProfPict] = React.useState('')
    const [prevImg, setPrevImg] = React.useState('')
    const [imgPost, setImgPost] = React.useState('');
    const [caption, setCaption] = React.useState('');
    const [prevImgPost, setPrevImgPost] = React.useState('')
    const [toggleSpinResend, setToggleSpinResend] = React.useState(false)

    let checkUsername = []
    props.users.map((val) => checkUsername.push(val.username));
    let index = ''

    const onEditData = () => {
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            bio,
            fullname,
            username
        }))
        formData.append('profilepicture', profPict);
        axios.patch(API_URL + `/users/edit?id=${dataUser.idusers}`, formData).then((response) => {
            if (response.data.success) {
                keepLogin();
                toast({
                    title: "Edit Success",
                    description: ``,
                    status: "success",
                    duration: 3000,
                    isClosable: true
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

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
                        setBio(res.data.bio)
                        setUsername(res.data.username)
                        setFullname(res.data.fullname)
                        setProfPict(res.data.profilepicture)
                        setOwnPost(res.data.posts)
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

    const onAddPost = () => {
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            user_id: dataUser.idusers,
            username_post: dataUser.username,
            caption,
        }))
        formData.append('image', imgPost);
        axios.post(API_URL + '/post/add', formData).then((response) => {
            if (response.data.success) {
                keepLogin()
                toast({
                    title: "Post Added",
                    description: ``,
                    status: "success",
                    duration: 3000,
                    isClosable: true
                })
                setImgPost('');
                setCaption('');
                setPrevImgPost('')
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleResend = async () => {
        try {
            setToggleSpinResend(true)
            let token = localStorage.getItem('socmedLog');
            let res = await axios.get(API_URL + `/users/resend`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (res.data[0].idusers) {
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

    const printOwnPost = () => {
        if (ownPost.length == 0) {
            return <div className="text-center">
                <p className="fs-3"> You haven't post yet</p>
            </div>
        } else {
            return ownPost.map((val, idx) => {
                return <div className="col-4 justify-content-between mt-3">
                    <Link href={`/post?id=${val.idposting}`}>
                        <Box border='1px' borderColor='white'>
                            <Image type="button" src={API_URL + val.image} margin='auto' objectFit='cover' width={300} height={300} />
                        </Box>
                    </Link>
                </div>
            })
        }
    }

    const printLikePost = () => {
        if (likePost.length == 0) {
            return <div className="text-center">
                <p className="fs-3"> You haven't like someone post yet</p>
            </div>
        } else {
            return likePost.map((val, idx) => {
                return <div className="col-4 justify-content-between mt-3">
                    <Link href={`/post?id=${val.idposting}`}>
                        <Box >
                            <Image type="button" src={API_URL + val.image} margin='auto' objectFit='cover' width={300} height={300} />
                        </Box>
                    </Link>
                </div>
            })
        }
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

    const imageHandler = (e) => {
        setProfPict(e.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setPrevImg(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    const imageHandlerPost = (e) => {
        setImgPost(e.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setPrevImgPost(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    React.useEffect(() => {
        keepLogin()
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
                    :
                    <div style={{ marginTop: 50 }}>
                        <Head>
                            <title>Profile</title>
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
                                        <Button colorScheme='twitter' width={200} fontSize={30} onClick={() => setTogglePost(!togglePost)}>Post</Button>
                                        <Modal isOpen={togglePost} onClose={() => setTogglePost(!togglePost)} size='3xl'>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalCloseButton onClick={() => {
                                                    setImgPost('');
                                                    setCaption('');
                                                    setPrevImgPost('')
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
                                                            <input onChange={(e) => imageHandlerPost(e)} type='File' id="upload" className="d-none" />
                                                            <Image boxSize='100% 50%' width={640} height={640} margin='auto' objectFit='cover' src={prevImgPost} fallbackSrc='https://media.istockphoto.com/vectors/image-preview-icon-picture-placeholder-for-website-or-uiux-design-vector-id1222357475?k=20&m=1222357475&s=612x612&w=0&h=jPhUdbj_7nWHUp0dsKRf4DMGaHiC16kg_FSjRRGoZEI=' />
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
                                <div className="col-9 card p-3">
                                    <div className="row d-flex" >
                                        <Box W='100%' overflow='hidden' className="text-center col-4 ">
                                            <Avatar name={dataUser.username} size='2xl' src={API_URL + dataUser.profilepicture} />
                                        </Box>
                                        <div className="col-8">
                                            <div className="row">
                                                <span className="fs-3 col-8 my-3">{dataUser.username}</span>
                                                <div className="col-4 my-3">
                                                    <Button onClick={() => setToggle(!toggle)}> Edit Profile </Button>
                                                    <Modal isOpen={toggle} onClose={() => setToggle(!toggle)} size='3xl'>
                                                        <ModalOverlay />
                                                        <ModalContent>
                                                            <ModalCloseButton onClick={() => setPrevImg('')} />
                                                            <ModalHeader>Edit Profile</ModalHeader>
                                                            <ModalBody>
                                                                <div>
                                                                    <div className="mt-5 mb-3">
                                                                        <label className="form-label fw-bold text-muted">Fullname</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder='example01'
                                                                            className='w-100 form-control'
                                                                            defaultValue={dataUser.fullname}
                                                                            onChange={(e) => setFullname(e.target.value)}
                                                                        >
                                                                        </input>

                                                                    </div>
                                                                    <div className="mt-5 mb-3">
                                                                        <label className="form-label fw-bold text-muted">Bio</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder='example01'
                                                                            className='w-100 form-control'
                                                                            defaultValue={dataUser.bio}
                                                                            onChange={(e) => setBio(e.target.value)}
                                                                        >
                                                                        </input>
                                                                    </div>
                                                                    <div className="mt-5 mb-3">
                                                                        <label className="form-label fw-bold text-muted">Username</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder='example01'
                                                                            className='w-100 form-control'
                                                                            defaultValue={dataUser.username}
                                                                            onChange={(e) => setUsername(e.target.value)}
                                                                        >
                                                                        </input>
                                                                        {username.length == 0 ? null :
                                                                            < div >
                                                                                <div className="d-none">
                                                                                    {index = checkUsername.findIndex(val => val == dataUser.username)}
                                                                                    {checkUsername.splice(index, 1)}
                                                                                </div>
                                                                                {
                                                                                    checkUsername.includes(username.toLocaleLowerCase()) || username.length < 4 ?
                                                                                        <span style={{ color: 'red' }}>Can't use username</span>
                                                                                        :
                                                                                        <span style={{ color: 'green' }}>You can use username</span>
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <div className="mt-5 mb-3">
                                                                        <label className="form-label fw-bold text-muted">Profile Picture</label>
                                                                        <br />
                                                                        <label htmlFor="upload" className="shadow"><FaImage size={30} /></label>
                                                                        <input onChange={(e) => imageHandler(e)} type='File' id="upload" name="image" accept="image/*"
                                                                            className="d-none" />
                                                                        <Image boxSize='100% 50%' width={640} height={640} margin='auto' objectFit='cover' src={prevImg} fallbackSrc='https://media.istockphoto.com/vectors/image-preview-icon-picture-placeholder-for-website-or-uiux-design-vector-id1222357475?k=20&m=1222357475&s=612x612&w=0&h=jPhUdbj_7nWHUp0dsKRf4DMGaHiC16kg_FSjRRGoZEI=' />
                                                                    </div>
                                                                </div>
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                {
                                                                    ((!checkUsername.includes(username.toLocaleLowerCase()) || checkUsername.includes(dataUser.username.toLocaleLowerCase())) && username.length > 3)
                                                                        ? <button className='btn btn-success text-white' onClick={() => {
                                                                            onEditData()
                                                                            setToggle(!toggle);
                                                                        }}>Submit</button>
                                                                        :
                                                                        <button className='btn btn-success text-white' disabled>Submit</button>
                                                                }
                                                            </ModalFooter>
                                                        </ModalContent>
                                                    </Modal>
                                                </div>
                                                <span className="col-12 my-3">{dataUser.posts.length} Posts</span>
                                                <span className="col-12 fw-bold">{dataUser.fullname}</span>
                                                <span className="col-12">{dataUser.email}</span>
                                                <span className="col-12">{dataUser.bio}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Tabs className="mt-5">
                                        <TabList className="justify-content-center">
                                            <Tab fontSize={20}>Post</Tab>
                                            <Tab fontSize={20}>Likes</Tab>
                                        </TabList>
                                        <TabPanels>
                                            <TabPanel>
                                                <div className="row d-flex">
                                                    {printOwnPost()}
                                                </div>
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="row d-flex">
                                                    {printLikePost()}
                                                </div>
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
        }
    </div >
}

export const getStaticProps = async () => {
    try {
        let res = await axios.get('http://localhost:1997/users')
        return {
            props: {
                users: res.data
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default profilePage