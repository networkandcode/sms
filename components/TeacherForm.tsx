import { allSubjects } from '../constants'
import { useAuthContext } from '../hooks/useAuth'
import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

type Teacher = {
    schools: string[]
    subjects: string[]
}

const initialTeacherData: Teacher = {
    schools: [],
    subjects: []
}

const TeacherForm: NextPage = () => {
    const state = useAuthContext()
    const { user } = state

    const [ isSaveDisabled, setIsSaveDisabled ] = useState(true)
    const [ teacher, setTeacher ] = useState(initialTeacherData)
    const [ teachers, setTeachers ] = useState([])
    
    const allSchools = [ 'Pre-primary', 'Primary(1-4)', 'Middle(5-7)', 'Secondary(8-10)' ]
    
    const onChange = e => {
        e.preventDefault()
        const { name } = e.target
        
        let value = Array.from(e.target.selectedOptions, option => option.value)
        setTeacher({ ...teacher, [ name ]: value })
        setIsSaveDisabled(false)
    }
    
    const getTeachers = () => {
        axios.post(
            'api/db-sql', 
            {
                "operation": "sql",
                "sql": `SELECT * FROM sms.teachers where id = "${user.$id}"`
            }
        ).then(res => {
            setTeachers(res.data)
            
            res.data.forEach( t => {
                if(t.id === user.$id) {
                    setTeacher({ ...teacher, ...t })
                }
            })
        })
    }
    
    const updateProfile = e => {
        e.preventDefault()
        let operation = 'insert'
        
        if(teachers.some(t => t.id === teacher.id)) {
            operation = 'update'
        }
        
        axios.post(
            'api/db', 
            {
                operation,
                "schema": "sms",
                "table": "teachers",
                "records": [
                    teacher
                ]
            }
        ).then(() => {
            setIsSaveDisabled(true)
        })
    }
    
    useEffect(() => {
        if(user.$id) {
            getTeachers()
        }
    }, [ user ])
    
    return (
        <div className="m-auto max-w-xs text-md w-full">
            <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={updateProfile}>
                <div className="mb-4">
                    <label 
                        className="block text-sm" 
                        htmlFor="subjects"
                    > 
                        Subjects
                    </label>
                    
                    <select
                        className="border overflow-hidden p-2 rounded text-sm w-full focus:outline-purple-500" 
                        id="subjects" 
                        name="subjects" 
                        onChange={ onChange }
                        multiple
                        size={10}
                        value={ teacher.subjects }
                    >
                        { allSubjects.map( subject => (
                            <option className="checked:bg-white checked:font-bold checked:text-purple-500" key={subject} value={subject}> {subject} </option>
                        ))}
                    </select>
                    
                </div>
                
                <div className="mb-4">
                    <label 
                        className="block text-sm" 
                        htmlFor="schools"
                    > 
                        Classes
                    </label>
                    
                    <select
                        className="border overflow-hidden p-2 rounded text-sm w-full focus:outline-purple-500" 
                        id="schools" 
                        name="schools" 
                        onChange={ onChange }
                        multiple
                        size={4}
                        value={ teacher.schools }
                    >
                        { allSchools.map( school => (
                            <option className="checked:bg-white checked:font-bold checked:text-purple-500" key={school} value={school} > {school} </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <button
                        disabled={ 
                            isSaveDisabled
                        } 
                        className="bg-purple-500 font-bold px-4 py-2 rounded text-white w-full disabled:bg-gray-500 hover:bg-purple-600" 
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TeacherForm