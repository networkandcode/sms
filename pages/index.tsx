import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { gridLink } from '../styles'
import { useAuthContext } from '../hooks/useAuth'
import styles from '../styles/Home.module.css'
import { toTitleCase } from '../utils/functions'

const Home: NextPage = () => {
    const state = useAuthContext()
    const { user } = state
  
    const generateTables = e => {
        e.preventDefault()
        axios.post('/api/tables', )
    }
  
    return (
      <div>
        <Head>
          <title>My School</title>
          <meta name="description" content="School management software for My School" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
            <div className="m-auto max-w-xl text-md w-full">
                <div className="m-8 pb-8  px-8 rounded shadow-md text-gray-500">
                    <div className="mb-4"> Hi <span className="font-bold italic text-purple-500"> {toTitleCase(user?.name) || 'there'} </span>, you are logged in as { state?.user?.$id?.includes('parent') ? 'parent' : 'administrator' } </div>
                    
                    <div className="gap-4 grid grid-cols-3 sm:grid-cols-4">
                    
                        {/** Links for Admins**/}
                        { ( user?.$id?.startsWith('admin-') || process.env.NEXT_PUBLIC_APPWRITE_SUPER_ADMINS.split(',').some( adminEmail => adminEmail === user.email ) )&& (
                            <>
                              <div>
                                <Link href="/classes"><a className={gridLink}>
                                    Classes
                                </a></Link>
                              </div>
                              
                              <div>
                                <Link href="/teams"><a className={gridLink}>
                                    Teams
                                </a></Link>
                              </div>
                            </>
                        )}
                        
                        {/** Links for parents**/}
                        { user?.$id?.startsWith('parent-') && (
                            <div>
                              <Link href="/children"><a className={gridLink}>
                                  Children
                              </a></Link>
                            </div>
                        )}
                        
                    </div>
                    
                    <img className="mt-8 w-full" src="https://source.unsplash.com/featured/?school" />
                    
                    { process.env.NEXT_PUBLIC_APPWRITE_SUPER_ADMINS.split(',').some( superAdminEmail => superAdminEmail === user?.email ) && (
                        <div className="mt-2 text-purple-500 text-right"> 
                            <button className="italic text-sm" onClick={generateTables}> 
                                generate tables 
                            </button> 
                        </div>
                    )}
                </div>
            </div>
        </main>
      </div>
    )
}

export default Home
