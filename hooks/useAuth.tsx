import { Status, User } from '../types'
import { appwrite } from '../utils/appwrite'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const initialUserData: User = {
    name: '',
    password: '',    
    role: '',
    username: ''
}

const emptyStatus: Status = {
    res: '',
    err: '',
    progress: ''
}

const authContext = createContext({})
export const useAuthContext = () => useContext(authContext)

const { Provider } = authContext

const useAuthContextProvider = () => {
    const router = useRouter()
    
    const [ user, setUser ] = useState(initialUserData)
    const [ status, setStatus ] = useState(emptyStatus)
    
    const clearStatus = () => {
        setStatus({
            res: '',
            err: ''
        })
    }
    
    const getUser = async() => {
        await appwrite.account.get().then(
            res => {
                setUser(res),
                setStatus({ res: 'Authenticated successfully', err: '', progress: '' })
            },
            err => {
                setUser({ $id: '' })
                setStatus({ res: '', err: 'Redirecting to authenticate', progress: '' })
            },
            progress => {
                setStatus({ res: '', err: '', progress: 'Retreiving account details' })
            }
        )
    }
    
    const onChange = e => {
        e.preventDefault()
        const { name, value } = e.target
        
        if(name === 'name') {
            if(validateName(value)) {
                setUser({ ...user, [ name ]: value })
            }
        } else {
            setUser({ ...user, [ name ]: value })
        }
    }
    
    const routeRedirection = () => {
        const { route } = router
        const adminPaths = [ '/classes' ]
        const authPaths = [ '/login', 'signup' ]
        const authOnlyPaths = [ '/', '/profile' ]
        const superAdminOnlyPaths = [ '/teams' ]
        
        if(
            !user.$id 
            && 
            authOnlyPaths.some( path => router.route === path ) 
        ) {
            setStatus({ progress: 'Redirecting to login screen...' })
            router.replace('/login')
        } else if(
            process.env.NEXT_PUBLIC_APPWRITE_SUPER_ADMINS.split(',').every( adminEmail => adminEmail !== user.email )
            && 
            superAdminOnlyPaths.some( path => router.route.startsWith(path) ) 
        ) {
            setStatus({ progress: 'Redirecting to home screen...' })
            router.replace('/')
        } else if(
            user.$id
            &&
            authPaths.some( path => router.route === path )
        ) {
            setStatus({ progress: 'Redirecting to home screen...' })
            router.replace('/')
        } else if(
            user?.$id.startsWith('parent-')
            &&
            router.route.includes('/timetable')
        ){
            console.log('...')
        } else if(
            (!user?.$id?.startsWith('admin-') && process.env.NEXT_PUBLIC_APPWRITE_SUPER_ADMINS.split(',').every( adminEmail => adminEmail !== user.email ))
            &&
            adminPaths.some( path => router.route.startsWith(path) )
        ) {
            router.replace('/') 
        } else if(
             ( user?.$id?.startsWith('admin-') || process.env.NEXT_PUBLIC_APPWRITE_SUPER_ADMINS.split(',').some( adminEmail => adminEmail === user.email ) )
             &&
             router.route === '/profile'
        ) {
            router.replace('/')
        }    
    }

    const sendEmailVerification = () => {
        appwrite.account.createVerification(process.env.NEXT_PUBLIC_APPWRITE_EMAIL_VERIFICATION_URL).then(
            res => {
                if(res){
                    setStatus({ res: 'Email verification sent', err: '', progress: '' })
                }
            },
            err => {
                setStatus({ res: '', err: err.message, progress: '' })
            }
        )
    }
    
    const userLogin = async() => {
        await appwrite.account.createSession(user.username, user.password).then(
            res => {
                if(res){
                    setStatus({ res: 'Login successful' })
                    getUser()
                }
            },
            err => {
                setStatus({ err: err.message })
            }
        )
    }
    
    const userLogout = async() => {
        await appwrite.account.deleteSession('current').then(
            res => {
                setUser({ ...initialUserData, $id: '' })
                setStatus({ res: 'Logout successful', err: '', progress: '' })
            },
            err => {
                setStatus({ res: '', err: err.message, progress: '' })
            },
            progress => {
                setStatus({ res: '', err: '', progress: 'Logout in progress' })
            }
        )
    }
    
    const userSignup = async(e) => {
        e.preventDefault()
        
        const { name, password, role, username } = user
        const id = `${role}-${username}`.toLowerCase().replace(' ', '-').replace('@', '-')
        
        await appwrite.account.create(id, username, password, name).then(
            res => {
                if(res){
                    setStatus({ res: 'Signup successful', err: '', progress: '' })
                    userLogin().then(() => {
                        sendEmailVerification()    
                    })
                }
            },
            err => {
                setStatus({ res: '', err: err.message, progress: '' })
            },
            progress => {
                setStatus({ res: 'Signup in progress', err: '', progress: '' })
            }
        )
    }
    
    const validateName = (value) => {
        const pattern = /^[a-zA-Z\s]*$/
        return pattern.test(value)
    }
    
    useEffect(() => {
        getUser()
    }, [ ])
    
    useEffect(() =>{
        if(Object.keys(user).includes('$id')) {
            routeRedirection()
        }
    }, [ router, user ])
    
    useEffect(() => {
        if(status?.res || status?.err || status?.progress ) {
            setTimeout(() => {
                clearStatus()
            }, 3000)
        }
    }, [ status ])
        
    return {
        getUser,
        onChange,
        sendEmailVerification,
        status,
        user,
        userLogin,
        userLogout,
        userSignup,
    }
}

export const AuthContextProvider = ({ children }) => {
    const auth = useAuthContextProvider()
    return <Provider value={auth}> { children } </Provider>
}