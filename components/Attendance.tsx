import axios from 'axios'
import { useEffect, useState } from 'react'

const Attendance = ({ classWithSection, name }) => {
    const [ absentDates, setAbsentDates ] = useState([])
    
    const getAttendance = async() => {
            
        const operation = 'search_by_conditions'
        const operator = 'and'
        const conditions = [
            {
              "search_attribute": "class",
              "search_type": "equals",
              "search_value": classWithSection
            },
            {
              "search_attribute": "absentList",
              "search_type": "contains",
              "search_value": name
            }
        ]
        
        await axios.post(
            '/api/db-search', 
            {
                conditions,
                get_attributes: [
                    "*"
                ],
                operation,
                operator,
                "schema": "sms",
                "table": "attendance"
            }
        ).then(res => {
            const { data }= res
            if(data.length > 0) {
                let temp = []
                
                data.forEach( d => {
                    temp.push(d.date)
                })
                setAbsentDates([ ...temp ])
            }
        })
    }
    
    useEffect(() => {
        getAttendance()
    }, [ ])

    return (
        <div className="mb-2">
            <p className="text-xl"> Absent dates: </p>
            { absentDates.length > 0 ? absentDates.map ((d, idx) => (
                <p className="italic" key={`${d}-${idx}`}> {d} </p>
            )) : ' Nil'}
        </div>
    )
}

export default Attendance