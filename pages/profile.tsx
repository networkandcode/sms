import ParentForm from '../components/ParentForm'
import TeacherForm from '../components/TeacherForm'
import { appwrite } from '../utils/appwrite'
import { useAuthContext } from '../hooks/useAuth'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

const Profile: NextPage = () => {
    const [ teams, setTeams ] = useState([])
    const state = useAuthContext()
    const { user } = state
    
    const listTeams = () => {
        let promise = appwrite.teams.list()
        
        promise.then( res => {
            console.log(res.teams)
            setTeams([ ...res.teams ])
        }, err => {
            console.log(err.message)
        })
    }
    
    useEffect(() => {
        listTeams()
    }, [])
    
    return (
        <>
            { teams.some(team => team.name === 'teachers') && <TeacherForm/> }
            { teams.some(team => team.name === 'parents') && <ParentForm/> }
        </>
    )
}

export default Profile