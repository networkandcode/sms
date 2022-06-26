import { initialStatusData } from '../types'

import axios from 'axios'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const attendanceContext = createContext({})

export const useAttendanceContext = () => useContext(attendanceContext)

const { Provider } = attendanceContext

const useAttendanceContextProvider = () => {
    const router = useRouter()
    
    const [ attendance, setAttendance ] = useState<any>({})
    const [ attendanceList, setAttendanceList ] = useState<any>([])
    const [ absentList, setAbsentList ] = useState<any>([])
    const [ status, setStatus ] = useState(initialStatusData)
    
    const onChangeDate = (e: any) => {
        const { name, value } = e.target
        if(attendanceList.every( (i: any) => i.date !== value )) {
            if(new Date(value) < new Date()) {
                setAttendance({ ...attendance, [ name ]: value })
                setStatus({ ...initialStatusData })
            } else {
                setStatus({ ...initialStatusData, err: 'Date should not be greater than today...' })
            }
        } else {
            setStatus({ ...initialStatusData, err: `Date ${value} exists...` })
        }
    }
    
    const onChangeAbsentList = (e: any) => {
        
        const { checked, name } = e.target
        if(checked) {
            setAbsentList([ ...absentList, name ])
        } else {
            let temp:any = absentList
            const idx = temp.indexOf(name)
            
            if(idx !== -1) {
                temp.splice(idx, 1)
                setAbsentList([ ...temp ])
            }
        }
    }
    
    const getAttendance = async(cl: any) => {
        await axios.post(
            '/api/db-sql', 
            {
                "operation": "sql",
                "sql": `SELECT * FROM sms.attendance`
            }
        ).then(res => {
            const { data }= res
            
            let temp:any = []
            res.data.forEach( (d:any) => {
                if(d.class === cl) {
                    temp.push(d)
                }
            })
            
            if(temp.length > 0) setAttendanceList([ ...temp ])
            
        })
    }
    
    const addAttendance = async(e:any) => {
        e.preventDefault()
        let operation = 'insert'
        
        await axios.post(
            '/api/db', 
            {
                operation,
                "schema": "sms",
                "table": "attendance",
                "records": [
                    { class: router.query.class, ...attendance, absentList }
                ]
            }
        ).then( res => {
            setAttendanceList([ ...attendanceList, { date: attendance.date, absentList } ])
            setAttendance({})
            setAbsentList([])
            setStatus({ ...initialStatusData, res: 'Added successfully' })
        }, err => {
            setStatus({ ...initialStatusData, err: err.message })
        })
    }
    
    const rmAttendance = async(a: any) => {
        setStatus({ ...initialStatusData, progress: 'Please wait...' })
        axios.post(
            '/api/db-sql', 
            {
                "operation": "sql",
                "sql": `DELETE FROM sms.attendance where id="${a.id}"`
            }
        ).then(res => {
            let temp:any = attendanceList
            attendanceList.forEach( (t: any, idx: number) => {
                if(t.date === a.date) {
                    temp.splice(idx, 1)
                }
            })
            
            setAttendanceList([...temp])
            setStatus({ ...initialStatusData })
        }).catch(err => {
            setStatus({ ...initialStatusData, err: err.message })
        })      
    }
    
    useEffect(() => {
        const cl = router.query.class
        if(cl) {
            getAttendance(cl)
        }
    }, [ router ])
    
    return {
        absentList, 
        addAttendance, 
        attendance, 
        attendanceList, 
        onChangeAbsentList, 
        onChangeDate, 
        rmAttendance,
        status
    }
}

export const AttendanceContextProvider = ({ children }: any) => {
    const value = useAttendanceContextProvider()
    return <Provider value={value}> {children} </Provider>
}
