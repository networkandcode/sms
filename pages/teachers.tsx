import { appwrite } from '../utils/appwrite'
import type { NextPage } from 'next'
import { useEffect } from 'react'

const Teachers: NextPage = () => {
    const getMembers = () => {
        let promise = appwrite.teams.getMemberships('teachers')
        
        promise.then( res => {
            console.log('res', res)
            let temp = []
            res.memberships.forEach( m => {
                if(m.roles.includes('member')) {
                    temp.push(m)
                }
            })
            
            setMembers([ ...temp ])
        
            setStatus({
                res: 'Retrieved member list successfully...'
            })
        }, err => {
            setStatus({
                err: err.message
            })
        })
    }
    
    useEffect(() => {
        getMembers()
    }, [])
    return (
        <div>
        </div>
    )
}

export default Teachers