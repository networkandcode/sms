// todo

import StatusProp from '../../../components/StatusProp'
import { useAuthContext } from '../../../hooks/useAuth'
import { addButton, rmButton } from '../../../styles'
import { initialStatusData } from  '../../../types'

import axios from 'axios'
import type { NextPage }  from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Files: NextPage = () => {
    const router = useRouter()
    const { user }: any = useAuthContext()
    
    const [ file, setFile ] = useState({ name: '', uploader: user?.name })
    const [ fileObject, setFileObject ] = useState()
    const [ files, setFiles ] = useState([])
    
    const [ status, setStatus ] = useState(initialStatusData)
    
    const onChange = e => {
        e.preventDefault()
        const { name, value } = e.target
        
        setFile({ ...file, [name]: value })
        setFileObject(e.target.files[0])
    }
    
    const addFile = async(e) => {
        e.preventDefault()
        
        if(files.some(f => f.name === file.name)) {
            setStatus({ ...initialStatusData, err: 'File exists' })
        } else {
            const base64Data = await toBase64()
            const fileName= file.name
            const path = router.query.class
            
            const body = { base64Data, fileName, path }
            
            const { data } = await axios.put('/api/storage', body)
            const { url } = data
        
            await axios.put(url, base64Data, {
                headers: {
                    'Content-type': 'image/jpeg',
                    'Access-Control-Allow-Origin': '*'
                }
            }).then(() => {
                setFiles([ ...files, file ])
                setFile({ name: '', uploader: user?.name })
                setStatus({ ...initialStatusData, res: 'File added' })        
            })
        }
    }
    
    const rmFile = f => {
        let isIdxFound = false
        let temp = files
        
        files.forEach( (fi, idx) => {
            if(fi.name === f.name) {
                isIdxFound = true
                temp.splice(idx, 1)
            }
        })
        
        if(isIdxFound) setFiles([ ...temp ])
    }
    
    const toBase64 = () => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileObject);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    
    useEffect(() => {
        if(user.name) {
            setFile({ ...file, uploader: user.name })
        }
    }, [ user ])
    
    return (
        <div className="max-w-sm m-auto p-2" >
            <StatusProp status={status} />
            <h1 className="text-3xl text-purple-500"> Add files </h1>
            <div className="flex justify-between p-4">
                <input type="file" name="name" value={file.name} onChange={onChange}/>
                <button className={addButton} disabled={!file.name} onClick={addFile}> + </button>
            </div>
            
            {files.map((f, idx) => (
                <div className="flex justify-between p-4" key={`${f}-${idx}`}>
                    <div> 
                        <p> { f.name } </p> 
                        <p className="italic text-xs"> added by: { f.uploader } </p>
                    </div>
                    <button className={rmButton} onClick={ e => { e.preventDefault(); rmFile(f) } } > x </button>
                </div>    
            ))}
        </div>
    )    
}

export default Files
