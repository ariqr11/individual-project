import React from "react";
import axios from 'axios'
import Head from 'next/head'
import Link from "next/link";
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
import { Text, Image, Menu, MenuButton, Avatar, AvatarBadge, MenuList, MenuGroup, MenuItem, Button, Textarea } from '@chakra-ui/react'
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

const timelinePage = () => {
    const toast = useToast()
    const router = useRouter()
    const [toggle, setToggle] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const API_URL = "http://localhost:1997"
    const [dataUser, setDataUser] = React.useState('')
    const [likePost, setLikePost] = React.useState([])
    const [posting, setPosting] = React.useState([])
    const [like, setLike] = React.useState([])
    const [edit, setEdit] = React.useState([])
    const [editCapt, setEditCapt] = React.useState('')
    const [img, setImg] = React.useState('');
    const [caption, setCaption] = React.useState('');
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
                    if (res.data.idusers) {
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

    const getPost = () => {
        axios.get(API_URL + `/post`)
            .then((res) => {
                setPosting(res.data)
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
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            user_id: dataUser.idusers,
            username_post: dataUser.username,
            caption
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

    const onEdit = (idposting) => {
        axios.patch(API_URL + `/post/edit?id=${idposting}`, {
            caption: editCapt
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
            if (edit.idposting != val.idposting) {
                return <div>
                    <div className="card row" type="button">
                        <div className="d-flex m-3 col-12">
                            <Avatar name={val.username_post} className="col-1">
                            </Avatar>
                            <div className="ms-5 col-10">
                                <div className="d-flex justify-content-between">
                                    <span className="fs-4">@{val.username_post}</span>
                                    <span className="fs-4 ms-auto">{val.date}</span>
                                </div>
                                <div className="fs-3 col-12 text-wrap">{val.caption}</div>
                                <Link href={`/post?id=${val.idposting}`}>
                                    <Image src={API_URL + val.image} className='shadow-sm col-12' boxSize='100% 50%' margin='auto' objectFit='cover'></Image>
                                </Link>
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
                    <div className="card row" type="button">
                        <div className="d-flex m-3 col-12">
                            <Avatar name={val.username_post} className="col-1">
                            </Avatar>
                            <div className="ms-5 col-10">
                                <div className="d-flex justify-content-between">
                                    <span className="fs-4">@{val.username_post}</span>
                                    <span className="fs-4 ms-auto">{val.date}</span>
                                </div>
                                <Textarea className="fs-3 col-12" defaultValue={val.caption} onChange={(e) => setEditCapt(e.target.value)} />
                                <Button colorScheme='twitter' className="me-0 w-25" onClick={() => {
                                    onEdit(val.idposting)
                                    setEdit([])
                                }} >Submit</Button>
                                <Link href={`/post?id=${val.idposting}`}>
                                    <Image src={API_URL + val.image} className='shadow-sm col-12' boxSize='100% 50%' margin='auto' objectFit='cover'></Image>
                                </Link>
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
            }
        })
    }


    React.useEffect(() => {
        keepLogin()
        getLike()
        getPost()
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
            <div style={{ marginTop: 10 }}>
                <Head>
                    <title>Home</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="container">
                    <div className="row">
                        <div className="col-3 position-fixed">
                            <div className='d-flex'>
                                <GiThreeFriends size={50} />
                                <Menu>
                                    <MenuButton>
                                        <div className="d-flex ms-3">
                                            <Avatar name={dataUser.username}>
                                                <AvatarBadge boxSize='1em' bg='green.500' />
                                            </Avatar>
                                            <div className="row ">
                                                <Text className="text-dark col-12 fw-bold" style={{ fontFamily: 'monospace' }}>{dataUser.fullname}</Text>
                                                <Text className='text-dark col-12 fw-bold' style={{ fontFamily: 'monospace' }}>{dataUser.username}</Text>
                                            </div>
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
                                        <ModalCloseButton />
                                        <ModalHeader></ModalHeader>
                                        <ModalBody>
                                            <div className='row '>
                                                <div className='col-12 d-flex'>
                                                    <Avatar name={dataUser.username}>
                                                    </Avatar>
                                                    <Textarea className='form-control m-auto border-0' height={100} type='text' placeholder="What's Happening?" fontSize={20} onChange={(e) => setCaption(e.target.value)} />
                                                    {/* <label className="form-label fw-bold text-muted">Image</label>
                                            <Image className='shadow-sm' boxSize='100% 50%' margin='auto' objectFit='cover' src={img} fallbackSrc='https://media.istockphoto.com/vectors/image-preview-icon-picture-placeholder-for-website-or-uiux-design-vector-id1222357475?k=20&m=1222357475&s=612x612&w=0&h=jPhUdbj_7nWHUp0dsKRf4DMGaHiC16kg_FSjRRGoZEI=' alt='add-product' />
                                            <input className='form-control m-auto' onChange={(e) => setImg(e.target.value)} type='text' placeholder='URL image' />
                                            <label className="form-label fw-bold text-muted">Product Name</label> */}
                                                </div>
                                                <div className="col-2 ms-5">
                                                    <label htmlFor="upload" className="shadow"><FaImage size={30} /></label>
                                                    <input onChange={(e) => setImg(e.target.files[0])} type='File' id="upload" className="d-none" />
                                                </div>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme='twitter' className='btn btn-success text-white' onClick={() => {
                                                onAddPost()
                                                setToggle(!toggle);
                                            }}>Post</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </div>
                        </div>
                        <div className="col-3"></div>
                        <div className="col-9 card">
                            <div className='row card'>
                                <div className='col-12 d-flex mt-3'>
                                    <Avatar name={dataUser.username}>
                                    </Avatar>
                                    <Textarea className='form-control m-auto border-0' height={100} type='text' placeholder="What's Happening?" fontSize={20} onChange={(e) => setCaption(e.target.value)} />
                                    {/* <label className="form-label fw-bold text-muted">Image</label>
                                            <Image className='shadow-sm' boxSize='100% 50%' margin='auto' objectFit='cover' src={img} fallbackSrc='https://media.istockphoto.com/vectors/image-preview-icon-picture-placeholder-for-website-or-uiux-design-vector-id1222357475?k=20&m=1222357475&s=612x612&w=0&h=jPhUdbj_7nWHUp0dsKRf4DMGaHiC16kg_FSjRRGoZEI=' alt='add-product' />
                                            <input className='form-control m-auto' onChange={(e) => setImg(e.target.value)} type='text' placeholder='URL image' />
                                            <label className="form-label fw-bold text-muted">Product Name</label> */}
                                </div>
                                <div className="col-2 ms-5">
                                    <label htmlFor="upload" className="shadow"><FaImage size={30} /></label>
                                    <input onChange={(e) => setImg(e.target.files[0])} type='File' id="upload" className="d-none" />
                                </div>
                                <Button colorScheme='twitter' className='btn btn-success text-white w-25 ms-auto my-3' onClick={onAddPost} >Post</Button>
                            </div>
                            {printPost()}
                        </div>
                    </div>
                </div>
            </div>}
    </div>
}

export default timelinePage