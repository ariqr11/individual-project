import React from "react";
import Axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link';
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
    Spinner
} from '@chakra-ui/react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import PasswordStrengthBar from 'react-password-strength-bar';
import styles from '../styles/Home.module.css'
import { GrPowerReset } from "react-icons/gr";

const ResetPasswordPage = (props) => {
    const router = useRouter()
    const toast = useToast()
    const API_URL = "http://localhost:1997"
    const [loading, setLoading] = React.useState(true)
    const [password, setPassword] = React.useState('');
    const [repPassword, setRepPassword] = React.useState('');
    const [visible, setVisible] = React.useState('password');
    const [repVisible, setRepVisible] = React.useState('password');
    const [verification, setVerification] = React.useState(false)
    const [email, setEmail] = React.useState('');
    let checkEmail = []
    props.users.map((val) => checkEmail.push(val.email));

    const handleResetPassword = async () => {
        try {
            let token = props.token.reset
            console.log(token)
            let res = await Axios.get(API_URL + `/users/resetpass?password=${password}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (res.data.idusers) {
                localStorage.setItem('socmedLog', null);
                router.push({
                    pathname: '/login'
                })
                toast({
                    title: "Reset Password Success",
                    position: 'top',
                    description: `Please Login With New Password`,
                    status: "success",
                    duration: 3000,
                    isClosable: true
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleReset = async () => {
        try {
            if (checkEmail.includes(email.toLocaleLowerCase())) {
                let res = await Axios.get(API_URL + `/users/reset?email=${email}`)
                if (res) {
                    toast({
                        title: "Reset Password",
                        position: 'top',
                        description: `Check your Email to Reset Password`,
                        status: "success",
                        duration: 3000,
                        isClosable: true
                    })
                }
            }
            else {
                toast({
                    title: "Email not registered",
                    position: 'top',
                    status: "error",
                    duration: 3000,
                    isClosable: true
                })
            }
        } catch (error) {
            console.log(error)
        }
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

    React.useEffect(() => {
        console.log(props.data)
        if (props.data[0].tokenReset == props.token.reset) {
            setVerification(true)
        }
        setLoading(false)
    }, []);

    return <div>
        <Head>
            <title>Reset Password</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="logo.png" />
        </Head>
        <div>
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
                <div> {
                    verification == true ?
                        <div>
                            <Modal isOpen={true} size='md'>
                                <ModalOverlay />
                                <ModalContent>
                                    <Link href='/'>
                                        <ModalCloseButton />
                                    </Link>
                                    <ModalBody>
                                        <Text fontSize='4xl' className="fw-bold py-5">Reset Password</Text>
                                        <div>
                                            <label className='form-label text-muted'>New Password</label>
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
                                            <label className='form-label text-muted'>Repeat New Password</label>
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
                                            {
                                                (((password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[~!@#$%^&*()_+]/) && password.length > 7)) && password == repPassword)
                                                    ? <button type="button" className="btn btn-primary p-3 shadow my-5" onClick={handleResetPassword}>Reset Password</button>
                                                    : <button type="button" className="btn btn-primary p-3 shadow my-5" onClick={handleResetPassword} disabled>Reset Password</button>
                                            }
                                        </div>
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                        </div>
                        :
                        <div>
                            <div className='container w-100 bg-white' style={{ marginTop: 100 }}>
                                <p className="fs-2 text-center">Your Link Are Expired</p>
                                <GrPowerReset size={200} className="m-auto" />
                                <div className="text-center my-5">
                                    <label className="fw-bold fs-3 form-label text-center">Input your account email for reset password</label>
                                    <input
                                        type="text"
                                        className='w-25 form-control m-auto'
                                        onChange={(e) => setEmail(e.target.value)}>
                                    </input>
                                    <button type="button" className="btn btn-primary py-3 shadow mt-3" onClick={handleReset}>Reset Password</button>
                                </div>
                            </div>
                        </div>
                }
                </div>
            }
        </div>
    </div>
}

export const getServerSideProps = async (context) => {
    try {
        console.log('ini context', context.query);
        let res1 = await Axios.get('http://localhost:1997/users')
        let res = await Axios.get(`http://localhost:1997/users?email=${context.query.email}`)
        return {
            props: {
                users: res1.data,
                data: res.data,
                token: context.query
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default ResetPasswordPage