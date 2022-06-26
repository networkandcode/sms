import StatusProp from '../../components/StatusProp'
import { initialStatusData } from '../../types'
import { appwrite } from '../../utils/appwrite'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const Members: NextPage = () => {
    const router = useRouter()
    const { team }: any = router.query
    
    const [ status, setStatus ] = useState({ ...initialStatusData })
    const [ member, setMember ] = useState<any>({})
    const [ members, setMembers ] = useState([])
    const [ remainingUsers, setRemainingUsers ] = useState([])
    const [ users, setUsers ] = useState([])
    
    const onChangeName = e => {
        e.preventDefault()
        const { name, value } = e.target
        
        setMember({ ...member, [ name ]:  value })
    }
    
    const onChangeEmail = e => {
        e.preventDefault()
        let { name, value } = e.target
        value  = value.toLowerCase()
     
        if(members.every(m => m.email !== value)) {
            setStatus({ ...initialStatusData })
            setMember({ ...member, [ name ]:  value })
        } else {
            setStatus({ ...initialStatusData,  err: `${value} exists...` })
        }
    }

    const addMember = u  => {
        const { email, name } = u
        let promise = appwrite.teams.createMembership(team, email, [ 'member' ], process.env.NEXT_PUBLIC_APPWRITE_NEW_MEMBER_URL, name);
        
        promise.then(function (response) {
            setMembers([ ...members, { userEmail: email, userName: name } ])
            setMember({})
        }, function (error) {
            console.log(error); // Failure
        });
    }
    
    const rmMember = (t: any) => {
        console.log('member', t)
        let promise = appwrite.teams.deleteMembership(team, t.$id)
        
        promise.then( res => {
            let temp = [ ...members ]
            const idx: number = temp.indexOf(t)
        
            if(idx !== -1){
                temp.splice(idx, 1)
                setMembers([ ...temp ])
                setStatus({ ...initialStatusData, err: 'Member deleted successfully...' })
                setMember({})
            }
            
        }, err => {
            setStatus({ ...initialStatusData, err: err.message })
        })
        
    }
    
    const getMembers = () => {
        let promise = appwrite.teams.getMemberships(team)
        
        promise.then( res => {
            let temp = []
            res.memberships.forEach( m => {
                if(m.roles.includes('member')) {
                    temp.push(m)
                }
            })
            
            setMembers([ ...temp ])
        
            setStatus({ ...initialStatusData, res: 'Retrieved member list successfully...' })
        }, err => {
            setStatus({ ...initialStatusData, err: err.message })
        })
    }
    
    const getUsers = async () => {
        await axios('/api/users').then(res => {
            setUsers([ ...res.data.users ])
        })
    }
    
    const updateUsers = () => {        
        let temp = []
        const teamSingular = team.slice(0, -1)
        
        users.forEach( u => {
            if(u.$id.startsWith(`${teamSingular}-`)) {
                const { email, name } = u
                
                if( !( members.some( m => m.userEmail === email ) ) ) {
                    temp.push({ email, name })
                }
            }
        })
        
        setRemainingUsers([ ...temp ])
    }
    
    useEffect(() => {
        if(team) {
            getUsers()
            getMembers()
        }
    }, [  team ])
    
    useEffect(() => {
        if(team) {
            updateUsers()
        }
    }, [ members, users ])
    
    useEffect(() => {
        if(status?.res || status?.err) {
            setTimeout(() => {
                setStatus({ ...initialStatusData })
            }, 3000)
        }
    }, [ status ])
    
    return (
        <div className="m-auto max-w-xs text-md w-full">
            <StatusProp status={status} />
            <div className="mx-8">
                <h1 className="font-bold mb-4 text-2xl text-purple-500"> Team {team} </h1>
                
                <form className="bg-grey-500 flex justify-between mb-2 rounded text-lg" onSubmit={ e => { e.preventDefault(); addMember(member) } }> 
                    <div className="text-sm">
                        <input className="border-2 focus:outline-purple-500 mb-2 p-2 rounded w-5/6" onChange={onChangeName} name="name" placeholder="Name" type="text" value={member.name || ''}/>
                        <input className="border-2 focus:outline-purple-500 mb-2 p-2 rounded w-5/6" onChange={onChangeEmail} name="email" placeholder="Email" type="text" value={member.email || ''}/>
                    </div>
                    <button
                        className="bg-gray-500 h-7 rounded-full text-center text-white w-7 disabled:hover:bg-gray-500 hover:bg-purple-500" 
                        disabled={!member.name || !member.email}
                        type="submit"
                    >
                    +
                    </button>
                </form>
                
                { remainingUsers.sort().map( (u, idx) => (
                    <div className="bg-grey-500 border-b-2 border-purple-500 flex justify-between mb-2 rounded text-lg" key={`${u}-${idx}`}> 
                        <span className="italic"> {u.name} <br/> {u.email} </span>
                        <button 
                            className="bg-gray-500 h-7 rounded-full text-center text-white w-7 hover:bg-purple-500" 
                            onClick={ e => { e.preventDefault(); addMember(u) } }
                        >
                        +
                        </button>
                    </div>
                ))}
                
                { members.sort().map( (m, idx) => (
                    <div className="border-b-2 border-purple-500 flex justify-between mb-2 rounded text-lg" key={`${m}-${idx}`}> 
                        <span className="italic"> {m.userName} <br/> {m.userEmail} </span>
                        <button className="bg-gray-500 h-7 rounded-full text-center text-white w-7 hover:bg-red-500" onClick={ e => { e.preventDefault(); rmMember(m) } }>
                            x 
                        </button> 
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Members
