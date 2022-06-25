import StatusProp from '../../../components/StatusProp'
import { useStudentsContext } from '../../../hooks/useStudents'
import type { NextPage } from 'next'

const Students: NextPage = () => {
    const state = useStudentsContext()
    console.log(state)
    const { addStudent, onChange, isSaveDisabled, rmStudent, save, status, student, students } = state
    
    return  (
        <div className="m-auto mt-8 max-w-sm px-2 w-full">
            { status && <StatusProp status={status} /> }
            <div className="flex justify-between">
                <input className="border mr-2 p-2 rounded text-sm w-full focus:outline-purple-500" name="student" onChange={onChange} placeholder="Student's name" type="text" value={student}/>
                <button 
                    className="bg-gray-500 h-7 rounded-full text-center text-white w-7 disabled:hover:bg-gray-500 hover:bg-purple-500"
                    disabled={!student}
                    onClick={addStudent}
                >
                    + 
                </button>
            </div>
            
            { students?.sort().map ( (s, idx) => (
                <div className="flex justify-between mb-1" key={`${s}-${idx}`}>
                    <span className="italic p-2"> {s} </span>
                    <button className="bg-gray-500 h-7 rounded-full text-center text-white w-7 hover:bg-red-500" onClick={ e => { e.preventDefault(); rmStudent(s) } }>
                        x 
                    </button>
                </div>
            ))}     
            
            <button className="bg-purple-500 font-bold mt-2 px-4 py-2 rounded text-white w-full disabled:bg-gray-500 hover:bg-purple-600" disabled={isSaveDisabled} onClick={save} >
                Save
            </button>
        </div>
    )
}

export default Students