import React from "react";
import axios from 'axios'
import Head from 'next/head'
import Link from "next/link";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'
import moment from "moment";
import { FaSignOutAlt, FaImage, FaShareSquare } from 'react-icons/fa'
import { FiEdit3 } from 'react-icons/fi'
import { FcLike } from 'react-icons/fc'
import { GoKebabHorizontal } from 'react-icons/go'
import { GiSelfLove } from 'react-icons/gi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Text, Image, Menu, MenuButton, Avatar, AvatarBadge, MenuList, MenuGroup, MenuItem, Button, Textarea, Divider, useToast } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react'

const detail = (props) => {
    const router = useRouter()
    const toast = useToast()
    const API_URL = "http://localhost:1997"
    const [dataUser, setDataUser] = React.useState('')
    const [likePost, setLikePost] = React.useState([])
    const [like, setLike] = React.useState([])
    const [edit, setEdit] = React.useState([])
    const [editCapt, setEditCapt] = React.useState('')
    const [coms, setComs] = React.useState('')
    const [comments, setComments] = React.useState([])
    const [commsKey, setCommsKey] = React.useState(1)
    const [seeComms, setSeeComms] = React.useState(5)
    console.log(edit)

    let checkLike = []
    let angka2 = [props.detail.date.split('-')[2].split('T')[0], props.detail.date.split('-')[1], props.detail.date.split('-')[0]]
    let angka3 = props.detail.date.split('T')[1].split('.')[0].split(':')
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
                        localStorage.setItem('socmedLog', res.data.token);
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
        axios.post(API_URL + '/post/like', {
            user_id: dataUser.idusers,
            post_id: idposting
        }).then((response) => {
            if (response.data.success) {
                keepLogin()
                getLike()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const getComments = () => {
        axios.get(API_URL + `/post/getComments?id=${props.detail.idposting}`)
            .then((res) => {
                setComments(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const handleComs = () => {
        setCommsKey(commsKey + 1)
        axios.post(API_URL + `/post/addComments`, {
            user_id: dataUser.idusers,
            post_id: props.detail.idposting,
            coms
        }
        ).then((res) => {
            getComments()
        }).catch((err) => {
            console.log(err);
        })
    }

    const printComments = () => {
        if (comments.length == 0) {
            return <div className="text-center">
                <p className="fs-4"> No Comments yet</p>
            </div>
        } else {
            return comments.map((val, idx) => {
                let angka4 = [val.date.split('-')[2].split('T')[0], val.date.split('-')[1], val.date.split('-')[0]]
                let angka5 = val.date.split('T')[1].split('.')[0].split(':')
                angka5.splice(0, 1, parseInt(angka5[0]) + 7)
                if (angka5[0] >= 24) {
                    angka5[0] = angka5[0] - 24;
                    angka4[0] = parseInt(angka4[0]) + 1
                }
                console.log(angka4)
                let jam1 = angka5.join(':')
                let date1 = angka4.join('-')
                let tanggal1 = date1 + ' ' + jam1
                let startDate = moment(`${tanggal1}`, 'DD-MM-YYYY hh:mm:ss');
                let diff1 = endTime.diff(startDate, 'seconds')
                let printDiff1 = diff1 + ' seconds ago'
                if (diff1 > 60 && diff1 < 3600) {
                    diff1 = endTime.diff(startDate, 'minutes')
                    printDiff1 = diff1 + ' minutes ago'
                } else if (diff1 >= 3600 && diff1 < 86400) {
                    diff1 = endTime.diff(startDate, 'hours')
                    printDiff1 = diff1 + ' hours ago'
                } else if (diff1 >= 86400 && diff1 < 604800) {
                    diff1 = endTime.diff(startDate, 'days')
                    printDiff1 = diff1 + ' days ago'
                } else if (diff1 >= 604800 && diff1 < (43200 * 60)) {
                    diff1 = endTime.diff(startDate, 'weeks')
                    printDiff1 = diff1 + ' weeks ago'
                } else if (diff1 >= (43200 * 60) && diff1 < (525600 * 60)) {
                    diff1 = endTime.diff(startDate, 'months')
                    printDiff1 = diff1 + ' months ago'
                } else if (diff1 >= (525600 * 60)) {
                    diff1 = endTime.diff(startDate, 'years')
                    printDiff1 = diff1 + ' years ago'
                }
                if (idx < seeComms) {
                    return <div className="my-2">
                        <div className="d-flex">
                            <Avatar name={props.detail.username} src={API_URL + val.profilepicture} size='md' className="col-1">
                            </Avatar>
                            <div className="col-11">
                                <div className="fs-5 fw-bold ms-3">{val.username}</div>
                                <div className="fs-5 ms-3 text-wrap col-10">{val.comments}</div>
                            </div>
                        </div>
                        <span className="fs-6 text-muted ms-2">{printDiff1}</span>
                    </div>
                }
            })
        }
    }

    const handleUnlike = (idposting) => {
        axios.delete(API_URL + `/post/unlike?iduser=${dataUser.idusers}&idposting=${idposting}`)
            .then((response) => {
                if (response.data.success) {
                    keepLogin()
                    getLike()
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    const onEdit = (idposting) => {
        let date = props.detail.date.split('T')[0].split('-')
        let dateMan = props.detail.date.split('T')[1].split('.')[0].split(':')
        dateMan.splice(0, 1, parseInt(dateMan[0]) + 7)
        if (dateMan[0] >= 24) {
            dateMan[0] = parseInt(dateMan[0]) - 24;
            date[2] = parseInt(date[0] + 1);
        }
        axios.patch(API_URL + `/post/edit?id=${idposting}`, {
            caption: editCapt,
            date: date + ' ' + dateMan
        }).then((response) => {
            if (response.data.success) {
                keepLogin()
                getLike()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const onDelete = (idposting) => {
        axios.delete(API_URL + `/post/delete?id=${idposting}`)
            .then((response) => {
                if (response.data.success) {
                    router.push({
                        pathname: '/timeline'
                    })
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


    React.useEffect(() => {
        keepLogin()
        getLike()
        getComments()
    }, []);

    return <div>
        <Head>
            <title>Post Detail</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="logo.png" />
        </Head>
        <div>
            <Modal isOpen={true} size='6xl'>
                <ModalOverlay />
                <ModalContent>
                    <Link href='/timeline'>
                        <ModalCloseButton />
                    </Link>
                    <ModalBody>
                        <div className="row">
                            <div className="col-7">
                                <Image src={API_URL + props.detail.image} boxSize='100% 50%' margin='auto' objectFit='cover' width={780} height={780}></Image>
                            </div>
                            <div className="col-5">
                                <div className="my-2 d-flex">
                                    <Avatar name={props.detail.username} src={API_URL + props.detail.profilepicture} size='md' className="col-1">
                                    </Avatar>
                                    <div className="fs-5 fw-bold ms-3">{props.detail.username}</div>
                                </div>
                                <div>
                                    {edit.idposting ?
                                        <div>
                                            <Textarea className="fs-5 col-12" defaultValue={editCapt ? editCapt : props.detail.caption} onChange={(e) => setEditCapt(e.target.value)} />
                                            <Button colorScheme='twitter' className="me-0 w-25" onClick={() => {
                                                onEdit(props.detail.idposting)
                                                setEdit([])
                                            }} >Submit</Button>
                                        </div>
                                        :
                                        <div className="fs-5 ms-2 text-wrap w-75">{editCapt ? editCapt : props.detail.caption}</div>
                                    }
                                </div>
                                <span className="fs-6 text-muted">{printDiff}</span>
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
                                <Divider />
                                <div>
                                    <div className={styles.overflow} id="scroll">
                                        {printComments()}
                                        {comments.length <= seeComms ?
                                            <div></div> :
                                            <div type="button" onClick={() => setSeeComms(seeComms + 5)} className="text-center">See More Comments</div>
                                        }
                                    </div>
                                </div>
                                <Divider />
                                <div className="d-flex mt-3">
                                    <Avatar name={dataUser.username} src={API_URL + dataUser.profilepicture} className="col-1">
                                    </Avatar>
                                    <Textarea
                                        type="text"
                                        placeholder='Add comment...'
                                        className='col-10 w-75 ms-2'
                                        onChange={(e) => setComs(e.target.value)}
                                        key={commsKey}
                                    >
                                    </Textarea>
                                    {coms.length <= 300 ?
                                        <div>
                                            <Avatar size='sm' name=" " bg='teal.300' color='black'>{300 - coms.length}</Avatar>
                                            <Button colorScheme='twitter' className='btn btn-success text-white ms-auto' onClick={handleComs}>Post</Button>
                                        </div>
                                        :
                                        <div>
                                            <Avatar size='sm' name=" " bg='red.300' color='black'>-{coms.length - 300}</Avatar>
                                            <Button colorScheme='twitter' className='btn btn-success text-white ms-auto' onClick={handleComs} disabled>Post</Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    </div >
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