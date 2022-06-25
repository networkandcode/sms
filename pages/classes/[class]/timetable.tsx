import StatusProp from '../../../components/StatusProp'
import { allSubjects } from '../../../constants'
import { initialStatusData } from '../../../types'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const TimeTable: NextPage = () => {
    const router = useRouter()
    
    const [ isSaveDisabled, setIsSaveDisabled ] = useState<boolean>(true)
    const [ operation, setOperation ] = useState<string>('update')
    const [ record, setRecord ] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: []
    })
    const [ status, setStatus ] = useState(initialStatusData)
    
    const weekDays = [ 'Monday' , 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ]
    
    const getTimeTable = async(id: string) => {
        await axios.post(
            '/api/db-sql', 
            {
                "operation": "sql",
                "sql": `SELECT * FROM sms.timetable where id = "${id}"`
            }
        ).then(res => {
            const { data }= res
            
            if(data.length > 0) {
                setRecord({ ...data[0] })
            } else {
                setOperation('insert')
                setRecord({ ...record, id })
            }
        })    
    }
    
    const onChange = e => {
        e.preventDefault()
        const { name, value } = e.target
        const weekday = name.split('-').at(0)
        const i = parseInt(name.split('-').at(1))
        
        let temp = {
            [weekday]: record[weekday]
        }
        temp[weekday][i] = value
        
        setRecord({ ...record, ...temp })
        setIsSaveDisabled(false)
    }
    
    const saveTimeTable = async(e) => {
        setStatus({ ...initialStatusData, progress: 'Please wait...' })
        e.preventDefault()
        
        await axios.post(
            '/api/db', 
            {
                operation,
                "schema": "sms",
                "table": "timetable",
                "records": [
                    record
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
        const cl = router.query.class
        if(cl) {
            getTimeTable(cl)
        }
    }, [ router ])
    
    
    useEffect(() => {
        if(status?.res || status?.err || status?.progress ) {
            setTimeout(() => {
                setStatus({
                    progress: '',
                    err: '',
                    res: ''
                })
            }, 3000)
        }
    }, [ status ])
    
    
    return (
        <div className="m-2">
            <h1 className="text-2xl text-purple-500"> { router.query.class } Timetable </h1>
            
            { weekDays.map((weekday, idx) => (
                <div className="my-2" key={`${weekday}-${idx}`} >
                    <div> { weekday }: </div>
                    
                    <div className="gap-1 grid grid-cols-2 sm:grid-cols-6">
                        { [0, 1, 2, 3, 4, 5].map( i => (
                            <div key={`${weekday}-${idx}-${i}`}>
                                <select className={`border-2 rounded text-gray-500 text-sm active:border-purple-500 ${!record[weekday][i] && 'bg-slate-100'}`} name={`${weekday}-${i}`} onChange={onChange} value={record[weekday][i] || ''}>
                                    <option className="italic" value=""> Period {i + 1} </option>
                                    { allSubjects.map((subject, sIdx) => (
                                        <option key={`${weekday}-${idx}-${sIdx}`}> {subject} </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            <button 
                className="bg-purple-500 border-2 font-bold rounded mt-2 p-2 text-white text-xl w-1/6 disabled:bg-gray-500" 
                disabled={isSaveDisabled} 
                onClick={saveTimeTable}
            > 
                Save 
            </button>
            
            <StatusProp status={status} />
        </div>
    )    
}

export default TimeTable