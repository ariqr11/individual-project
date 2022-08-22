import React from "react";
import Axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GoUnverified } from "react-icons/go";

const VerificationPage = (props) => {
    const router = useRouter()
    const API_URL = "http://localhost:1997"
    const handleVerif = async () => {
        try {
            let token = props.token.verif
            console.log(token)
            let res = await Axios.get(API_URL + `/users/verif`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (res.data.idusers) {
                localStorage.setItem('socmedLog', res.data.token);
                delete res.data.token;
                router.push({
                    pathname: '/timeline'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }


    return <div>
        <Head>
            <title>Verification Link</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className='container w-100 bg-white' style={{ marginTop: 100 }}>
            <GoUnverified size={200} className="m-auto" />
            <p className="text-muted text-center">After Register, you can access all feature with verified account</p>
            <br />
            <button type="button" className="btn btn-outline-warning w-25 position-relative" style={{ marginLeft: 500 }} onClick={() => handleVerif()} >Verified Your Account</button>
        </div>
    </div>
}

export const getServerSideProps = async (context) => {
    try {
        console.log('ini context', context.query);
        return {
            props: {
                token: context.query
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default VerificationPage