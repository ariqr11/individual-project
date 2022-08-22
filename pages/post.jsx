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

const detail = (props) => {
    const API_URL = "http://localhost:1997"
    const [dataUser, setDataUser] = React.useState('')
    const [likePost, setLikePost] = React.useState([])
    const [like, setLike] = React.useState([])
    const [edit, setEdit] = React.useState([])
    let checkLike = []

    const keepLogin = () => {
        let socmedLog = localStorage.getItem('socmedLog');
        if (socmedLog != "null") {
            axios.get(API_URL + `/users/keep?id=${socmedLog}`)
                .then((res) => {
                    if (res.data.idusers) {
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

    const getLike = () => {
        axios.get(API_URL + `/post/getLike`)
            .then((res) => {
                setLike(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const handleLike = (idposting) => {
        console.log(dataUser.idusers)
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


    React.useEffect(() => {
        keepLogin()
        getLike()
    }, []);

    return <div className="container">
        <div className="card row">
            <div className="d-flex m-3 col-12">
                <Avatar name={props.detail.username_post} className="col-1">
                </Avatar>
                <div className="ms-5 col-10">
                    <div className="d-flex justify-content-between">
                        <span className="fs-4">@{props.detail.username_post}</span>
                        <span className="fs-4 ms-auto">{props.detail.date}</span>
                    </div>
                    <div className="fs-3 col-12 text-wrap">{props.detail.caption}</div>
                    <Image src={API_URL + props.detail.image} className='shadow-sm col-12' boxSize='100% 50%' margin='auto' objectFit='cover'></Image>
                    <div className="d-flex justify-content-between">
                        {likePost.map((value, index) => {
                            if (props.detail.idposting == value.idposting) {
                                checkLike.push(true)
                            } else {
                                checkLike.push(false)
                            }
                        })
                        }
                        {
                            (checkLike.includes(true)) ?
                                <div className="d-flex">
                                    <FcLike size={30} type='button' onClick={() => handleUnlike(props.detail.idposting)} />
                                    {like.map((value, index) => {
                                        if (value.post_id == props.detail.idposting) {
                                            return <span className="fs-5 ms-3">{value.totalLike}</span>
                                        }
                                    })}
                                </div>
                                :
                                <div className="d-flex">
                                    <GiSelfLove size={30} type='button' onClick={() => handleLike(props.detail.idposting)} />
                                    {like.map((value, index) => {
                                        if (value.post_id == props.detail.idposting) {
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
                                    {props.detail.user_id == dataUser.idusers ?
                                        <div>
                                            <MenuItem onClick={() => setEdit(props.detail)} ><FiEdit3 className="me-3" />Edit</MenuItem>
                                            <MenuItem ><FaShareSquare className="me-3" />Share</MenuItem>
                                            <MenuItem onClick={() => onDelete(props.detail.idposting)}><RiDeleteBin6Line className="me-3" />Delete</MenuItem>
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

export const getServerSideProps = async (context) => {
    try {
        console.log('ini context', context.query);
        let res = await axios.get(`http://localhost:1997/post?id=${context.query.id}`)
        console.log(res.data)
        return {
            props: {
                detail: res.data[0]
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default detail