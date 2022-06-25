import { useAuthContext } from '../hooks/useAuth'

const Status = () => {
    const state = useAuthContext()
    const { status } = state
    
    return (
        <div className="m-auto max-w-xs text-xl w-full">
            <div className="mx-8">
                { status.res && <p className="pb-2 text-green-500"> { status.res } </p> }
                { status.err && <p className="pb-2 text-red-500"> { status.err } </p> }
                { status.progress && <p className="pb-2 text-amber-500"> { status.progress } </p> }
            </div>
        </div>
    )
    
}

export default Status