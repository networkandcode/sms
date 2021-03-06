import { initialStatusData } from '../types'
import { appwrite } from '../utils/appwrite'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Verify: NextPage = () => {
    const router = useRouter()
    const { secret, userId } = router.query
    const [ status, setStatus ] = useState({ ...initialStatusData })
    
    useEffect(()=> {
        if(secret && userId) {
            let promise = appwrite.account.updateVerification(userId, secret);

            promise.then(function (response) {
                setStatus({ ...initialStatusData, res: 'You are now verified !!!' })
            }, function (err) {
                setStatus({ ...initialStatusData, err: err.message }) // Failure
            });
        }
    },[ secret, userId ])
    
    useEffect(() => {
        if(status.res) {
            router.replace('/')
        }
    }, [ status ])

    return (
        <div className="m-auto max-w-xs text-md w-full">
            <p className="pb-2 text-3xl text-green-500"> { status.res } </p>
            <p className="pb-2 text-3xl text-red-500"> { status.err } </p>
        </div>
    )
}

export default Verify
