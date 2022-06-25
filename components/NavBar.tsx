import { useAuthContext } from '../hooks/useAuth'
import type { NextPage } from 'next'
import Link  from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const NavBar: NextPage = () => {
    const router = useRouter()
    const state = useAuthContext()
    
    const [ linkClass, setLinkClass ] = useState({
        home: '',
        signup: '',
        login: '',
        logout: ''
    })
    
    useEffect(() => {
        if(router.route === '/') {
            setLinkClass({ home: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/profile') {
            setLinkClass({ profile: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/signup') {
            setLinkClass({ signup: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/login') {
            setLinkClass({ login: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/logout') {
            setLinkClass({ logout: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } else if(router.route === '/verify') {
            setLinkClass({ verify: 'bg-white inline-block px-3 py-1 rounded text-purple-500' })
        } 
    }, [ router ] )
    
    return (
        <div className="bg-purple-500 gap-2 grid grid-cols-4 p-1 text-white">
            <div>
                <Link href="/"><a className={linkClass.home}> 
                    Home 
                </a></Link>
            </div>
            
            { !state?.user?.$id?.startsWith('admin-') && process.env.NEXT_PUBLIC_APPWRITE_SUPER_ADMINS.split(',').every( adminEmail => adminEmail !== state?.user?.email ) && (
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