import { initialStatusData } from '../../types'
import { appwrite } from '../../utils/appwrite'
import Link from 'next/link'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'

const Teams: NextPage = () => {
    const [ status, setStatus ] = useState({ ...initialStatusData })    
    const [ team, setTeam ] = useState('')
    const [ teams, setTeams ] = useState([])
    
    const onChange = e => {
        e.preventDefault()
        let { value } = e.target
        value  = value.toLowerCase()
        
        if(!teams.includes(value)) {
            setStatus({ ...initialStatusData })
            setTeam(value)
        } else {
            setStatus({ ...initialStatusData, err: `${value} exists...` })
        }
    }

    const addTeam = e  => {
        e.preventDefault()
        let promise = appwrite.teams.create(team, team)
    
        promise.then( res => {
            setTeams([ ...teams, team ])
            setStatus({
		...initialStatusData,
                res: 'Team added successfully...'
            })
            
        }, err => {
            setStatus({
		...initialStatusData,
                err: err.message
            })
        })
    
        setTeam('')
    }
    
    const rmTeam = (t: string) => {
        let promise = appwrite.teams.delete(t)
        
        promise.then( res => {
            let temp = [ ...teams ]
            const idx: number = temp.indexOf(t)
        
            if(idx !== -1){
                temp.splice(idx, 1)
                setTeams([ ...temp ])
                setStatus({
		    ...initialStatusData,
                    err: 'Team deleted successfully...'
                })
            }
            
        }, err => {
            setStatus({
                ...initialStatusData,
                err: err.message
            })
        })
    
        setTeam('')
    }
    
    useEffect(() => {
        let promise = appwrite.teams.list()
        
        promise.then( res => {
            console.log('teams', res)
            let temp = []
            res.teams.forEach( t => {
                temp.push(t.$id)
            })
            
            setTeams([ ...temp ])
        
            setStatus({
                ...initialStatusData,
                res: 'Retrieved team list successfully...'
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
            <div className="ml-8 mt-2 text-xl">
                <p className="pb-2 text-green-500"> { status?.res } </p>
                <p className="pb-2 text-red-500"> { status?.err } </p>
            </div>

            <h1 className="font-bold text-purple-500 text-xl"> Teams </h1>
            
            <div className="m-8">
                <div className="flex justify-between mb-2">
                    <input 
                        className="border mr-2 p-2 rounded focus:outline-purple-500" 
                        id="name"
                        maxLength={15}
                        name="name" 
                        onChange={onChange}
                        placeholder="Add team"
                        size={15}
                        value={team}
                    />
                    <button className="bg-purple-500 h-7 rounded-full text-center text-white w-7 disabled:bg-gray-500" disabled={!team || team.length < 3} onClick={ addTeam }>
                        + 
                    </button>
                </div>
                
                { teams.sort().map( (t, idx) => (
                    <div className="flex justify-between mb-2 text-lg" key={`${t}-${idx}`}> 
                        <span className="italic"> <Link href={`/teams/${t}`}><a className="hover:text-purple-500"> {t} </a></Link> </span>
                        <button className="bg-gray-500 h-7 rounded-full text-center text-white w-7 hover:bg-red-500" onClick={ e => { e.preventDefault(); rmTeam(t) } }>
                            x 
                        </button> 
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Teams
