import StatusProp from '../components/StatusProp'
import { useAuthContext } from '../hooks/useAuth'
import { toTitleCase, validateName } from '../utils/functions'
import axios from 'axios'
import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'

type Child = {
    classWithSection: string
    name: string
}

type Status =  {
    err: string
    progress: string
    res: string
}

const initialChildData: Child = {
    classWithSection: '',
    name: ''
}

const initialChildrenData: Child[] = []

const initialStatusData: Status = {
    err: '',
    progress: '',
    res: ''
}

const ParentForm: NextPage = () => {
    const state: any = useAuthContext()
    const { user } = state
    
    const [ child, setChild ] = useState(initialChildData)
    const [ children, setChildren ] = useState(initialChildrenData)
    const [ isSaveDisabled, setIsSaveDisabled ] = useState(true)
    
    const [ parent, setParent ] = useState<any>({})
    const [ parents, setParents ] = useState<any>([])
    
    const [ status, setStatus ]= useState(initialStatusData)
    
    let classes = [ 'Pre-KG1', 'Pre-KG2', 'LKG', 'UKG' ]
    let classesWithSections = [ '' ]
    let sections = [ 'A', 'B' ]
    
    for(let i=1; i<=12; i++) {
        classes.push(i.toString())
    }
    
    classes.forEach( c => {
        sections.forEach( s => {
            classesWithSections.push(c + ' ' + s)
        })
    })
    
    const onChange = (e: any) => {
        e.preventDefault()
        let { name, value } = e.target
        
        let isValueValid = true
        
        if(name === 'name') {
            isValueValid = validateName(value)
            value = toTitleCase(value)
        }
        
        if(isValueValid) {
            setChild({ ...child, [ name ]: value })
        }
    }
    
    const addChild = async(e: any) => {
        e.preventDefault()
        
        setStatus({ ...initialStatusData, progress: 'Please wait...' })
        
        const operation = 'search_by_conditions'
        const operator = 'and'
        const conditions = [
            {
              "search_attribute": "id",
              "search_type": "equals",
              "search_value": child.classWithSection
            },
            {
              "search_attribute": "students",
              "search_type": "contains",
              "search_value": child.name
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
                "table": "classes"
            }
        ).then(res => {
            const { data }= res
            if(data.length > 0) {
                checkForDuplicateStudent()                
            } else {
                setStatus({ ...initialStatusData, err: `${child.name} is not found in ${child.classWithSection}`})
            }
        })
    }
    
    const checkForDuplicateStudent = async() => {
        await axios.post(
            'api/db-sql', 
            {
                "operation": "sql",
                "sql": `SELECT * FROM sms.parents where search_json('$[name=\"${child.name}\"]', children) IS NOT NULL`
            }
        ).then(res => {
            if ( 
                res.data.some( (parent: any) => ( 
                    parent.children.some( (ch: any) => ( 
                        ch.name === child.name && ch.classWithSection === child.classWithSection
                    ))
                ))  
            ) {
                setStatus({ ...initialStatusData, err: `${child.name} in ${child.classWithSection} was already registered`})
            } else {
                setChildren([ ...children, child ])
                setIsSaveDisabled(false)
                setChild(initialChildData)
                setStatus({ ...initialStatusData })
            }
                
        })
    }
    
    const getParents = async() => {
        await axios.post(
            'api/db-sql', 
            {
                "operation": "sql",
                "sql": `SELECT * FROM sms.parents where id = "${user.$id}"`
            }
        ).then(res => {
            const { data }= res
            setParents([ ...data ])
        })
    }
    
    const rmChild = (c: any) => {
        let temp = children
        let isRemoved: boolean = false
        
        children.forEach( (ch, idx) => {
            if (
                c.classWithSection === ch.classWithSection
                &&
                c.name === ch.name
            ) {
                temp.splice(idx, 1)
                isRemoved = true
            }
        })
        
        if(isRemoved) {
            setChildren([ ...temp ])
            setIsSaveDisabled(false)
        }
    }
    
    const saveProfile = async(e: any) => {
        e.preventDefault()
        let operation = 'insert'
        
        if(parents.some((p: any) => p.id === parent.id)) {
            operation = 'update'
        }
        
        
        await axios.post(
            'api/db', 
            {
                operation,
                "schema": "sms",
                "table": "parents",
                "records": [
                    { ...parent, children }
                ]
            }
        ).then( (res: any) => {
            setStatus({ ...initialStatusData, res: 'Saved successfully' })
            setIsSaveDisabled(true)
        }, (err: any) => {
            setStatus({ ...initialStatusData, err: err.message })
        })
    }
    
    useEffect(() => {
        if(user.$id) {
            getParents()
        }
    }, [ user ])
    
    useEffect(() => {
        let temp = { id: user.$id }
        
        if(parents.length > 0) {
            parents.forEach( (p: any) => {
                if(p.id === user.$id) {
                    temp = p
                }
            })
        }
        
        setParent({ ...parent, ...temp })
    }, [ parents ])
    
    useEffect(() => {
       const temp = parent.children
       if(parent.children) {
           setChildren([ ...temp ])
       }
    }, [ parent ])
    
    useEffect(() => {
        if(status?.res || status?.err) {
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
        <div className="m-auto max-w-xs pt-2 text-md w-full">
        
            
            <div className="m-8">
            <StatusProp status={status} />

            Student, Class & Section
                <form className="bg-grey-500 flex justify-between mb-4 rounded text-lg" onSubmit={ addChild }> 
                    <div className="text-sm w-5/6">
                        <input 
                            className="border-2 focus:outline-purple-500 mr-1 p-2 rounded w-6/6" 
                            onChange={onChange}
                            name="name" 
                            placeholder="Name" 
                            type="text" 
                            value={child.name || ''}
                        />
                        
                        <select className="border-2 mt-1 p-2 rounded w-3/6"  name="classWithSection" onChange={onChange} value={child.classWithSection}>
                            { classesWithSections.map((c, idx) => (
                                <option key={`${c}-${idx}`}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="w-1/6">
                        <button
                            className="bg-gray-500 h-7 rounded-full text-center text-white w-7 disabled:hover:bg-gray-500 hover:bg-purple-500" 
                            disabled={!child.name || !child.classWithSection}
                            type="submit"
                        >
                        +
                        </button>
                    </div>
                </form>
                
                { children.sort().map( (c, idx) => (
                    <div className="border-b-2 border-purple-500 flex justify-between mb-2 pb-1 rounded text-lg" key={`${c}-${idx}`}> 
                        <div className="italic w-5/6"> {c.name}, {c.classWithSection} </div>
                        <div className="w-1/6">
                            <button className="bg-gray-500 h-7 rounded-full text-center text-white w-7 hover:bg-red-500" onClick={ e => { e.preventDefault(); rmChild(c) } }>
                                x 
                            </button> 
                        </div>
                    </div>
                ))}
                
                
                <button
                    disabled={isSaveDisabled}
                    className="bg-purple-500 font-bold px-4 py-2 rounded text-white w-full disabled:bg-gray-500 hover:bg-purple-600" 
                    onClick={saveProfile}
                >
                    Save
                </button>
                
            </div>
            
            
        </div>
        
    )
}

export default ParentForm
