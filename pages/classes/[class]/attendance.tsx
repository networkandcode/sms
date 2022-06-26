// /sms/pages/classes/[class]/attendance.tsx
import StatusProp from '../../../components/StatusProp'
import { useStudentsContext } from '../../../hooks/useStudents'
import { useAttendanceContext } from '../../../hooks/useAttendance'
import { formInput } from '../../../styles'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Attendance: NextPage = ()  => {
    const router: any = useRouter()
    const { students }: any = useStudentsContext()
    
    const state: any = useAttendanceContext()
    const { absentList, addAttendance, attendance, attendanceList, onChangeAbsentList, onChangeDate, rmAttendance, status } = state
    
    if( !Object.values(state)) {
        return (
            <>
                Loading
            </>
        )
    }

    return (
        <form className="gap-4 grid grid-cols-1 m-auto p-8 text-md" onSubmit={addAttendance}>
        
            <h1 className="font-bold text-purple-500 text-xl"> { router?.query?.class} Attendance </h1>
            
            <div>
                <label htmlFor="date"> Date: </label>
                <br/>
                <input className={formInput} id="date" name="date" onChange={onChangeDate} required type="date" value={attendance?.date || ''}/>
            </div>
            
            <div>
                Absentees:
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                    { students.sort().map ((student, idx) => (
                        <div className="p-2" key={`${student}-${idx}`}> <input onChange={onChangeAbsentList} name={student} type="checkbox" checked={absentList?.includes(student)} /> {student} </div>
                    ))}
                </div>
            </div>
            
            <div>
                <button 
                    className="bg-purple-500 font-bold px-4 py-2 rounded text-white disabled:bg-gray-500 hover:bg-purple-600" 
                    disabled={!attendance?.date || absentList?.length === 0}
                    type="submit"
                > 
                    Add 
                </button>
                
                { status && <StatusProp status={status} /> }
            </div>
            
            <div>
                {(attendanceList?.length > 0) && <> Absence List: </> }
                
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                    { attendanceList?.sort((a, b) => ( new Date(b.date).getTime() - new Date(a.date).getTime() )).map( (a, idx) => (
                        <div className="border-2 p-2 rounded hover:border-purple-500" key={`${a}-${idx}`}>
                            <div className="flex justify-between">
                                <div>
                                    {a.date}
                                </div>
                                
                                <button className="bg-gray-500 h-7 rounded-full text-center text-white w-7 hover:bg-red-500" onClick={ e => { e.preventDefault(); rmAttendance(a) } }>
                                    x 
                                </button>
                            </div>
                            {a.absentList 
                                ? 
                                    a.absentList?.map(i=> (
                                        <div key={`${i}-${idx}`}>
                                            {i}
                                        </div>
                                    ))
                                :
                                <div> No absentees </div>    
                            }
                        </div>
                    ))}
                </div>
            </div>
        </form>
    )
}

export default Attendance
