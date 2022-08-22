import React from "react";
import Head from 'next/head'
import axios from "axios";
import {
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,

} from '@chakra-ui/react'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'


const loginPage = () => {
    const router = useRouter()
    const toast = useToast()
    const API_URL = "http://localhost:1997"
    const [user, setUser] = React.useState('');
    const [dataUser, setDataUser] = React.useState('')
    const [password, setPassword] = React.useState('');
    const [toggle, setToggle] = React.useState(true)
    const [visible, setVisible] = React.useState('password');


    const handleLogin = () => {
        axios.post(API_URL + `/users/login`, {
            user,
            password
        }
        )
            .then((res) => {
                console.log(res.data);
                if (res.data.idusers) {
                    toast({
                        title: "Login Success",
                        position: 'top',
                        description: `Find your friend`,
                        status: "success",
                        duration: 3000,
                        isClosable: true
                    })
                    localStorage.setItem('socmedLog', res.data.token);
                    if (res.data.status == "Verified") {
                        router.push({
                            pathname: '/timeline'
                        })
                    } else {
                        router.push({
                            pathname: '/resend'
                        })
                    }
                    setUser('')
                    setPassword('')
                } else {
                    toast({
                        title: "Username/email or Password not valid",
                        position: 'top',
                        status: "error",
                        duration: 3000,
                        isClosable: true
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const onVisibility = () => {
        if (visible == "password") {
            setVisible("text")
        } else if (visible == "text") {
            setVisible("password")
        }
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
                        setDataUser(res.data)
                    }
                }).catch((err) => {
                    console.log(err);
                })
        }
    }

    const redirect = () => {
        router.push({
            pathname: '/timeline'
        })
    }

    React.useEffect(() => {
        keepLogin()
    }, []);

    return <div>
        {dataUser ?
            redirect()
            :
            <div>
                <Head>
                    <title>Login MyFriend</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Modal isOpen={toggle} size='3xl'>
                    <ModalOverlay />
                    <ModalContent>
                        <Link href='/'>
                            <ModalCloseButton />
                        </Link>
                        <ModalBody>
                            <Text fontSize='4xl' className="fw-bold">Sign in to MyFriend</Text>
                            <div className="d-flex">
                                <h6 className="text-muted">Not have account?</h6>
                                <Link href='/register'>
                                    <h6 className="text-primary ms-2" type="button">Sign up</h6>
                                </Link>
                            </div>
                            <div className="mt-5 mb-3">
                                <label className="form-label fw-bold text-muted">Username/Email</label>
                                <input
                                    type="text"
                                    placeholder='example01'
                                    className='w-100 form-control'
                                    onChange={(e) => setUser(e.target.value)}
                                >
                                </input>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold text-muted">Password</label>
                                <div className='input-group border rounded'>
                                    <input type={visible} className="form-control p-3 border-0" placeholder="8+ character" onChange={(e) => setPassword(e.target.value)} />
                                    <span onClick={onVisibility} className="input-group-text bg-transparent border-0" id="basic-addon2">
                                        {
                                            visible == "password" ?
                                                <AiOutlineEye size={20} type='button' />
                                                : <AiOutlineEyeInvisible size={20} type='button' />
                                        }
                                    </span>
                                </div>
                            </div>
                            <p className="text-muted my-3" style={{ textAlign: 'right' }}>Forgot Password?<span className="ms-2 text-primary">Click Here</span></p>
                            <button type="button" className="btn btn-primary py-3 shadow" onClick={handleLogin}>Sign In</button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        }
    </div>
}

export default loginPage