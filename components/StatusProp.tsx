import { useAuthContext } from '../hooks/useAuth'
import { useEffect } from 'react'

const Status = ({ status }) => {
    
        
    return (
        
            <div className="italic h-5">
                { status.res && <p className="pb-2 text-green-500"> { status.res } </p> }
                { status.err && <p className="pb-2 text-red-500"> { status.err } </p> }
                { status.progress && <p className="pb-2 text-amber-500"> { status.progress } </p> }
            </div>
        
    )
    
}

export default Status