import { useAuthContext } from '../hooks/useAuth'
import { appwrite } from '../utils/appwrite'

import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const Login: NextPage = () => {
    const state: any = useAuthContext()
    const { onChange, user, userLogin } = state
    
    if(user.$id) {
        return (
            <div> Redirecting to Homepage... </div>
        )
    }
    
    return (
        <div className="m-auto max-w-xs text-md w-full">
            <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={ (e) => { e.preventDefault(); userLogin() } }>
                <div className="mb-4">
                    <label 
                        className="block text-sm" 
                        htmlFor="username"
                    > 
                        Username 
                    </label>
                    
                    <input 
                        className="border p-2 rounded text-sm w-full focus:outline-purple-500" 
                        id="username" 
                        name="username" 
                        onChange={ onChange }
                        placeholder="Enter email address" 
                        type="email" 
                        value={ user.username }
                    />
                </div>
                
                <div className="mb-6">
                    <label 
                        className="block text-sm" 
                        htmlFor="password"
                    > 
                        Password 
                    </label>
                    
                    <input 
                        className="border p-2 rounded text-sm w-full focus:outline-purple-500" 
                        id="password" 
                        name="password" 
                        onChange={ onChange } type="password" value={ user.password } 
                    />
                </div>
                
                <button 
                    disabled={ 
                        !(user?.username?.length > 0) 
                        || 
                        !(user?.password?.length > 0)
                    } 
                    className="bg-purple-500 font-bold px-4 py-2 rounded text-white disabled:bg-gray-500 hover:bg-purple-600" 
                    type="submit"
                > 
                    Login 
                </button>
            </form>
        </div>
    )
}

export default Login
