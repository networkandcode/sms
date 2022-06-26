import Attendance from '../components/Attendance'
import ExamScore from '../components/ExamScore'
import { useAuthContext } from '../hooks/useAuth'
import axios from 'axios'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Children: NextPage = () => {
    const authContext: any = useAuthContext()
    const { user } = authContext
    const [ parent, setParent ] = useState<any>({})
    
    const getParent = async() => {
        await axios.post(
            '/api/db-sql', 
            {
                "operation": "sql",
                "sql": `SELECT * FROM sms.parents WHERE id = "${user.$id}"`
            }
        ).then(res => {
            const { data }= res
            setParent(data.at(0))
        })
    }
    
    const cl = ''
    const student = ''
    
    useEffect(() => {
        if(user.$id) {
            getParent()
        }
    }, [ user ])

    return (
        <div className="m-auto max-w-sm">
            <p className="p-2 text-2xl text-gray-500" > Children info </p>
            { parent?.children?.map( (child, idx) => (
                <div className="border-b-2 my-2 p-2 rounded" key={`${child}-${idx}`} >
                    <h1 className="mb-2 text-xl text-purple-500"> { child.name }, <span className="text-gray-500 text-sm"> { child.classWithSection } </span> </h1>
                    <Attendance classWithSection={child.classWithSection} name={child.name} />
                    <ExamScore classWithSection={child.classWithSection} name={child.name} />
                    
                    <div className="my-4">
                        <Link href={`/classes/${child.classWithSection}/timetable`}>
                            <a className="border-2 border-purple-500 font-bold italic p-2 rounded text-gray-500 text-xl hover:bg-purple-500 hover:text-white">
                                Timetable
                            </a>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )   
}

export default Children
