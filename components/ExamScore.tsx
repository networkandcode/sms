import axios from 'axios'
import { useEffect, useState } from 'react'

const ExamScore = ({ classWithSection, name }) => {
    const [ examScore, setExamScore ] = useState([])
    
    const getExamScore = async() => {
        const operation = 'search_by_conditions'
        const operator = 'and'
        const conditions = [
            {
              "search_attribute": "id",
              "search_type": "contains",
              "search_value": classWithSection
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
                "table": "exams"
            }
        ).then(res => {
            const { data }= res
            if(data.length > 0) setExamScore([ ...data ])
        })
    }

    
    useEffect(() => {
        getExamScore()
    }, [ ])
    
    console.log('name', name)
    return (
        <div className="mb-2">
            { examScore?.map ( (i, idx) => (
                <div key={`${i}-${idx}`}>
                    {i.marks[name] && (
                    <>
                    
                        <p className="text-xl"> {i.id.split('-').at(-1).toUpperCase()}: </p>
                        
                        { Object.keys(i.marks[name]).map( (subject, index) => (
                            <p className="italic"> {subject} : {i.marks[name][subject]} </p>
                        ))}
                    </>   
                    )}
                    
                </div>
            ))}
        </div>
    )
    
}

export  default ExamScore