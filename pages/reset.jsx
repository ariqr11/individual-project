import React from "react";
import Axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GrPowerReset } from "react-icons/gr";
import { useToast } from '@chakra-ui/react'

const ResetPage = (props) => {
    const router = useRouter()
    const toast = useToast()
    const API_URL = "http://localhost:1997"
    const [email, setEmail] = React.useState('');
    let checkEmail = []
    props.users.map((val) => checkEmail.push(val.email));

    const handleReset = async () => {
        try {
            if (checkEmail.includes(email.toLocaleLowerCase())) {
                let res = await Axios.get(API_URL + `/users/reset?email=${email}`)
                if (res) {
                    router.push({
                        pathname: '/'
                    })
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


    return <div>
        <Head>
            <title>Reset Password</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="logo.png" />
        </Head>
        <div className='container w-100 bg-white' style={{ marginTop: 100 }}>
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

export const getStaticProps = async () => {
    try {
        let res = await Axios.get('http://localhost:1997/users')
        return {
            props: {
                users: res.data
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default ResetPage