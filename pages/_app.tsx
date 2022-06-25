import NavBar from '../components/NavBar'
import Status from '../components/Status'
import { AuthContextProvider } from '../hooks/useAuth'
import { AttendanceContextProvider } from '../hooks/useAttendance'
import { StudentsContextProvider } from '../hooks/useStudents'
import '../styles/globals.css'

import type { AppProps } from'next/app'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthContextProvider>
            <StudentsContextProvider>
                <AttendanceContextProvider>
                    <NavBar/>
                    <Status/>
                    <Component {...pageProps} />
                </AttendanceContextProvider>
            </StudentsContextProvider>
        </AuthContextProvider>
    )
}

export default MyApp
