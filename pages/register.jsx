import React from 'react';
import axios from "axios";
import Head from 'next/head'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useToast
} from '@chakra-ui/react'
import Link from 'next/link';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import PasswordStrengthBar from 'react-password-strength-bar';
import { useRouter } from 'next/router';

const regisPage = (props) => {
    const router = useRouter()
    const API_URL = "http://localhost:1997"
    const [dataUser, setDataUser] = React.useState('')
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repPassword, setRepPassword] = React.useState('');
    const [toggle, setToggle] = React.useState(true)
    const [visible, setVisible] = React.useState('password');
    const [repVisible, setRepVisible] = React.useState('password');
    const toast = useToast()

    let checkUsername = []
    props.users.map((val) => checkUsername.push(val.username));

    let checkEmail = []
    props.users.map((val) => checkEmail.push(val.email));


    const onRegis = () => {
        axios.post(API_URL + "/users/regis", {
            username: username.toLocaleLowerCase(),
            email: email.toLocaleLowerCase(),
            password
        }).then((res) => {
            console.log(res.data);
            if (res.data.success) {
                toast({
                    title: "Account created",
                    position: 'top',
                    description: `Welcome to MyFriend, Check your Email to Verification`,
                    status: "success",
                    duration: 3000,
                    isClosable: true
                })
                setUsername('')
                setEmail('')
                setPassword('')
                setRepPassword('')
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const onVisibility = () => {
        if (visible == "password") {
            setVisible("text")
        } else if (visible == "text") {
            setVisible("password")
        }
    }

    const onRepVisibility = () => {
        if (repVisible == "password") {
            setRepVisible("text")
        } else if (repVisible == "text") {
            setRepVisible("password")
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
                    <title>Register MyFriend</title>
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
                            <h6 className=' muted-color text-sm mt-5'>Find your friend.</h6>
                            <h1 className='fw-bold text-xl fs-2 mt-2'>Sign up to MyFriend</h1>
                            <div className='d-flex fs-6 lead text-muted mt-2'>
                                <h6>Have an account ? </h6>
                                <Link href='/login'>
                                    <h6 type='button' className='fw-bold text-primary ms-2'> Login</h6>
                                </Link>
                            </div>
                            <br />
                            <div>
                                <div>
                                    <label className='form-label text-muted'>Username</label>
                                    <input
                                        type="text"
                                        placeholder='example01'
                                        className='w-100 form-control'
                                        onChange={(e) => setUsername(e.target.value)}
                                    >
                                    </input>
                                    {username.length == 0 ? null :
                                        <div>
                                            {
                                                checkUsername.includes(username.toLocaleLowerCase()) || (username.length < 4) ?
                                                    <span style={{ color: 'red' }}>Can't use username</span>
                                                    :
                                                    <span style={{ color: 'green' }}>You can use username</span>
                                            }
                                        </div>
                                    }
                                </div>
                                <br />
                                <div>
                                    <label className='form-label text-muted'>E-Mail</label>
                                    <input
                                        type="text"
                                        placeholder='name@example.com'
                                        className='w-100 form-control '
                                        onChange={(e) => setEmail(e.target.value)}>
                                    </input>
                                    {email.length == 0 ? null :
                                        <div>
                                            {checkEmail.includes(email.toLocaleLowerCase()) || !email.includes('@') || !email.toLocaleLowerCase().includes('.com') || email == '' ?
                                                <span style={{ color: 'red' }}>Can't use email</span>
                                                :
                                                <span style={{ color: 'green' }}>You can use email</span>
                                            }
                                        </div>
                                    }
                                </div>
                                <br />
                                <div>
                                    <label className='form-label text-muted'>Password</label>
                                </div>
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
                                {password.length == 0 ? null :
                                    <div>
                                        {password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[~!@#$%^&*()_+]/) && password.length > 7 ?
                                            null
                                            :
                                            <span style={{ color: 'red' }}>Password must contain 8 character including uppercase letter, symbol, and number</span>
                                        }
                                        <PasswordStrengthBar className='w-50' password={password} />
                                    </div>
                                }
                                <br />
                                <div>
                                    <label className='form-label text-muted'>Repeat Password</label>
                                </div>
                                <div className='input-group border rounded'>
                                    <input type={repVisible} className="form-control p-3 border-0" placeholder="8+ character" onChange={(e) => setRepPassword(e.target.value)} />
                                    <span onClick={onRepVisibility} className="input-group-text bg-transparent border-0" id="basic-addon2">
                                        {
                                            repVisible == "password" ?
                                                <AiOutlineEye size={20} type='button' />
                                                : <AiOutlineEyeInvisible size={20} type='button' />
                                        }
                                    </span>
                                </div>
                                {password == repPassword || repPassword.length == 0 ?
                                    null
                                    :
                                    <span style={{ color: 'red' }}>Password not same</span>
                                }
                                <div>
                                    <br />
                                    <br />
                                    {
                                        ((!checkUsername.includes(username) || username.length > 3) && !checkEmail.includes(email.toLocaleLowerCase()) && email.includes('@') && (email.toLocaleLowerCase().includes('.com') || email.includes('.co.id')) && ((password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[~!@#$%^&*()_+]/) && password.length > 7)) && password == repPassword)
                                            ? <button type='button' className='btn btn-success btn-lg w-100 border-0 ' onClick={onRegis}>Create an Account</button>
                                            :
                                            <button type='button' className='btn btn-success btn-lg w-100 border-0 ' disabled>Create an Account</button>
                                    }
                                    <div className='text-center text-muted my-3'>
                                        <span>or</span>
                                    </div>
                                    <button className='btn btn-light py-2 text-muted mb-5 w-100 shadow border'>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <FcGoogle size={36} className="me-2" /> <span> Sign up with Google</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        }
    </div>
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

export default regisPage;