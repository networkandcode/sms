import { initialStatusData } from '../types'
import { toTitleCase, validateName } from '../utils/functions'
import axios from 'axios'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const studentsContext = createContext({})
export const useStudentsContext = () => useContext(studentsContext)

const { Provider } = studentsContext
const useStudentsContextProvider = ()  => {
    const router = useRouter()
    const cl = router.query.class
    
    const [ classes, setClasses ] = useState([])
    const [ isSaveDisabled, setIsSaveDisabled ] = useState(true)
    const [ status, setStatus ] = useState(initialStatusData)
    const [ student, setStudent ] = useState('')
    const [ students, setStudents ] = useState([])
    
    const onChange = e => {
        e.preventDefault()
        const { value } = e.target
        if( validateName(value) )  {
            setStudent(toTitleCase(value))
        } else {
            setStatus({ ...initialStatusData, err: 'Name not valid...' })
        }
    }
    
    const addStudent = e => {
        e.preventDefault()
        if( students.every(s => s.toLowerCase() !== student.toLowerCase()) ) {
            setStudents([ ...students, student ])
            setStudent('')
            setIsSaveDisabled(false)
        } else {
            setStatus({ ...initialStatusData, err: 'Student name exists' })
        }
    }
    
    const rmStudent = ( s: string ) => {
        let temp: string[] = students
        let isSpliced: boolean = false
        
        students.forEach( (st, idx) => {
            if(st === s) {
                temp.splice(idx, 1)
                isSpliced =  true
            }
        })
        
        if(isSpliced) {
            setStudents([ ...temp ])
            setStudent('')
            setIsSaveDisabled(false)
        }
    }
    
    const getClasses = async() => {
        await axios.post(
            '/api/db-sql', 
            {
                "operation": "sql",
                "sql": `SELECT * FROM sms.classes where id = "${cl}"`
            }
        ).then(res => {
            const { data }= res
            setClasses([ ...data ])
            
            data.forEach(d => {
                if(d.id === cl) {
                    setStudents([ ...d.students ])
                }
            })
        })
    }
    
    const save = async(e) => {
        e.preventDefault()
        let operation = 'insert'
        
        if(classes.some(c => c.id === cl)) {
            operation = 'update'
        }
        
        await axios.post(
            '/api/db', 
            {
                operation,
                "schema": "sms",
                "table": "classes",
                "records": [
                    { id: cl, students }
                ]
            }
        ).then( res => {
            setStatus({ ...initialStatusData, res: 'Saved successfully' })
            setIsSaveDisabled(true)
        }, err => {
            setStatus({ ...initialStatusData, err: err.message })
        })
    }
    
    useEffect(() => {
        if(cl) {
            setStatus({ ...initialStatusData, progress: 'Loading...'})
            getClasses()
        }
    }, [ cl ])
    
    useEffect(() => {
        if(status?.res || status?.err || status?.progress ) {
            setTimeout(() => {
                setStatus({ ...initialStatusData })
            }, 3000)
        }
    }, [ status ])
    
    return {
        addStudent,
        isSaveDisabled,
        onChange,
        rmStudent,
        save,
        status,
        student,
        students
    }
}

export const StudentsContextProvider = ({ children }) => {
    const value = useStudentsContextProvider()
    return <Provider value={value}> {children} </Provider>
}
