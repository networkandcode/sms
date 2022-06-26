import { initialStatusData } from '../types'
import { appwrite } from '../utils/appwrite'
import axios from 'axios'
import Link from 'next/link'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'

const Users: NextPage = () => {
    const [ status, setStatus ] = useState({ ...initialStatusData })
    const [ user, setUser ] = useState('')
    const [ users, setUsers ] = useState([])
    
    const onChange = e => {
        e.preventDefault()
        let { value } = e.target
        value  = value.toLowerCase()
        
        if(!users.includes(value)) {
            setStatus({ ...initialStatusData })
            setUser(value)
        } else {
            setStatus({
                ...initialStatusData,
                err: `${value} exists...`
            })
        }
    }

    const addUser = e  => {
        e.preventDefault()
        let promise = appwrite.users.create(user, user)
    
        promise.then( res => {
            setUsers([ ...users, user ])
            setStatus({
                ...initialStatusData,
                res: 'User added successfully...'
            })
            
        }, err => {
            setStatus({
                ...initialStatusData,
                err: err.message
            })
        })
    
        setUser('')
    }
    
    const rmUser = (t: string) => {
        let promise = appwrite.users.delete(t)
        
        promise.then( res => {
            let temp = [ ...users ]
            const idx: number = temp.indexOf(t)
        
            if(idx !== -1){
                temp.splice(idx, 1)
                setUsers([ ...temp ])
                setStatus({
                    ...initialStatusData,
                    err: 'User deleted successfully...'
                })
            }
            
        }, err => {
            setStatus({
                ...initialStatusData,
                err: err.message
            })
        })
    
        setUser('')
    }
    
    useEffect(() => {
        let promise = appwrite.users.list()
        
        promise.then( res => {
            let temp = []
            res.users.forEach( t => {
                temp.push(t.$id)
            })
            
            setUsers([ ...temp ])
        
            setStatus({
                ...initialStatusData,
                res: 'Retrieved user list successfully...'
            })
        }, err => {
            setStatus({
                ...initialStatusData,
                err: err.message
            })
        })
        
    }, [])
    
    useEffect(() => {
        if(status?.res || status?.err) {
            setTimeout(() => {
                setStatus({ ...initialStatusData })
            }, 3000)
        }
    }, [ status ])
    
    return (
        <div className="m-auto max-w-xs text-md w-full">
            <div className="m-8">
                <div className="flex justify-between mb-2">
                    <input 
                        className="border mr-2 p-2 rounded focus:outline-purple-500" 
                        id="name"
                        maxLength={15}
                        name="name" 
                        onChange={onChange}
                        placeholder="Add user"
                        size={15}
                        value={user}
                    />
                    <button className="bg-purple-500 h-7 rounded-full text-center text-white w-7 disabled:bg-gray-500" disabled={!user || user.length < 3} onClick={ addUser }>
                        + 
                    </button>
                </div>
                
                <p className="pb-2 text-green-500"> { status?.res } </p>
                <p className="pb-2 text-red-500"> { status?.err } </p>
                
                { users.sort().map( (t, idx) => (
                    <div className="flex justify-between mb-2 text-lg" key={`${t}-${idx}`}> 
                        <span className="italic"> <Link href={`/users/${t}`}><a> {t} </a></Link> </span>
                        <button className="bg-gray-500 h-7 rounded-full text-center text-white w-7 hover:bg-red-500" onClick={ e => { e.preventDefault(); rmUser(t) } }>
                            x 
                        </button> 
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Users
