import { useAuthContext } from '../hooks/useAuth'
import type { NextPage } from 'next'
import Link  from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type LinkClass = {
    home: string
    login: string
    logout: string
    profile: string
    signup: string
    verify: string
}

const initialLinkClassData = {
    home: '',
    login: '',
    logout: '',
    profile: '',
    signup: '',
    verify: ''
}

const NavBar: NextPage = () => {
    const router = useRouter()
    const state: any = useAuthContext()
    
    const [ linkClass, setLinkClass ] = useState<LinkClass>(initialLinkClassData)
    
    useEffect(() => {
        if(router.route === '/') {
            setLinkClass({ ...initialLinkClassData, home: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/profile') {
            setLinkClass({ ...initialLinkClassData, profile: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/signup') {
            setLinkClass({ ...initialLinkClassData, signup: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/login') {
            setLinkClass({ ...initialLinkClassData, login: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/logout') {
            setLinkClass({ ...initialLinkClassData, logout: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/verify') {
            setLinkClass({ ...initialLinkClassData, verify: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } 
    }, [ router ] )
    
    return (
        <div className="bg-purple-500 gap-2 grid grid-cols-4 p-1 text-white">
            <div>
                <Link href="/"><a className={linkClass.home}> 
                    Home 
                </a></Link>
            </div>
            
            { 
                !state?.user?.$id?.startsWith('admin-') 
	        && 
                process?.env?.NEXT_PUBLIC_APPWRITE_SUPER_ADMINS?.split(',').every( adminEmail => adminEmail !== state?.user?.email )
                &&
                state?.user?.$id
                && (
                <div>
                    <Link href="/profile"><a className={linkClass.profile}>
                        Profile
                    </a></Link>
                </div>
            )}
            
            { !state.user?.$id 
            ?(
                <>
                    <div>
                        <Link href="/signup"><a className={linkClass.signup}> 
                            Signup
                        </a></Link>
                    </div>
                
                    <div>
                        <Link href="/login"><a className={linkClass.login}> 
                            Login 
                        </a></Link>
                    </div>
                </>
            ):(
                <div onClick={state.userLogout}>
                    <a className={linkClass.logout}> 
                        Logout
                    </a>
                </div>
            )}
            
            {/** !state?.user?.$id?.emailVerification && (
                <div>
                    <Link href="/verify"><a className={linkClass.verify}>
                        Verify
                    </a></Link>
                </div>
            )**/}
            
        </div>
    )
}

export default NavBar
