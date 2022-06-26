import StatusProp from '../../../../components/StatusProp'
import { useStudentsContext } from '../../../../hooks/useStudents'
import { formInput } from '../../../../styles'
import { validateNumbers } from '../../../../utils/functions'

import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Status = {
    err: string
    progress: string
    res: string
}

const initialStatusData: Status = {
    err: '',
    progress: '',
    res: ''
}

const Term1 = () => {
    const router = useRouter()
    
    const state: any = useStudentsContext()
    const { students } = state
    
    const [ helperText, setHelperText ] = useState({})
    const [ id, setId ] = useState('')
    const [ isSaveDisabled, setIsSaveDisabled ] = useState(true)
    
    const [ operation, setOperation ] = useState('insert')
    const [ marks, setMarks ] = useState({})
    const [ status, setStatus ] = useState({
        err: '',
        progress: '',
        res: ''
    })
    
    const allSubjects = [ 'English', 'Environmental Science', 'General Knowledge', 'Hindi', 'Malayalam', 'Mathematics', 'Science', 'Social Studies', 'Tamil', 'Telugu' ]
    
    const onBlur = e => {
        e.preventDefault()
        setHelperText({})
    }
    
    const onChange = (e, student) => {
        const { name, value } = e.target
        
        let temp = {
            [student]:
                {
                    ...marks[student],
                    [name]: value
                }
        }
        
        if(validateNumbers(value)) {
            setMarks({ ...marks, ...temp })
            setIsSaveDisabled(false)
            setStatus({ ...initialStatusData })
        } else {
            setStatus({ ...initialStatusData, err: 'Only numbers are accepted...' })
        }
    }
    
    const onFocus = (e, student) => {
        e.preventDefault()
        const { name } = e.target
        setHelperText({ [student]: name })
    }
    
    const getExam = () => {
        axios.post(
            '/api/db-sql', 
            {
                "operation": "sql",
                "sql": `SELECT * FROM sms.exams where id = "${id}"`
            }
        ).then(res => {
            if(res.data.length > 0) {
                setMarks({ ...res.data.at(0).marks })
                setOperation('update')
            }
        })
    }
    

    const saveForm = async(e) => {
        e.preventDefault()
        
        await axios.post(
            '/api/db', 
            {
                operation,
                "schema": "sms",
                "table": "exams",
                "records": [
                    { id, marks }
                ]
            }
        ).then( res => {
            setStatus({ ...initialStatusData, res: 'Saved successfully' })
            setIsSaveDisabled(true)
        }, err => {
            setStatus({ ...initialStatusData, err: err.message })
            setIsSaveDisabled(true)
        })
    
    }
    
    useEffect(() => {
        const cl = router.query.class
        const exam = router.query.exam
        
        if(cl) setId(cl + '-' + exam)
    }, [ router ])
    
    useEffect(() => {
        if(id) getExam()
    }, [ id ])
    
    
    return (
        <form className="gap-8 grid grid-cols-1 px-8 text-md" onSubmit={saveForm}>
            <StatusProp status={status}/>
            
            <h1 className="font-bold text-purple-500 text-xl"> {id.replaceAll('-', ' ')} exam score </h1>
            
            { students.map( (student, sIdx) => (
                <div className="border-2 p-2 rounded" key={`${student}-${sIdx}`} >
                    <div> {student} </div>
                    { allSubjects.map((subject, idx) => (
                        <input
                            className={formInput}
                            key={`${subject}-${idx}`} 
                            maxLength={2}
                            name={subject}
                            onBlur={onBlur}
                            onChange={e => { e.preventDefault(); onChange(e, student) }}
                            onFocus={e => { e.preventDefault(); onFocus(e, student) }}
                            placeholder={`${subject.at(0)}${subject.split(' ').at(1)?.at(0) || ''}`}
                            size={1}
                            value={ marks[student] ? marks[student][subject] : '' }
                        />
                    ))}
                    
                    { marks[student] && (
                        <>
                            Total: {Object.values(marks[student]).reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0)},
                            Average: {Object.values(marks[student]).reduce((a: any, b: any) => (parseInt(a) + parseInt(b))/2, 0)} {' '}
                            { Object.values(marks[student]).reduce((a:any, b:any) => (parseInt(a) + parseInt(b))/2, 0) >= 35 ? (
                                <span className="text-green-500"> Pass </span> 
                            ) : ( 
                                <span className="text-amber-500"> Fail </span>
                            )}
                        </>
                    )}
                    
                    <div className="italic mx-2 text-purple-500"> {helperText[student]} </div>
                </div>
            ))}
            
            <button
                disabled={ isSaveDisabled } 
                className="bg-purple-500 font-bold px-4 py-2 rounded text-white max-w-xs disabled:bg-gray-500 hover:bg-purple-600" 
                type="submit"
            > 
                Save 
            </button>
            
        </form>
    )    
}

export default Term1
