import { NextPage } from 'next'
import Link from 'next/link'

const Classes: NextPage = () => {
    let classes = [ 'Pre-KG1', 'Pre-KG2', 'LKG', 'UKG' ]
    let classesWithSections = []
    let sections = [ 'A', 'B' ]
    
    for(let i=1; i<=12; i++) {
        classes.push(i.toString())
    }
    
    classes.forEach( c => {
        sections.forEach( s => {
            classesWithSections.push(c + ' ' + s)
        })
    })
    
    return (
        <div className="px-2">
            <h1 className="p-2 text-3xl text-purple-500"> Classes </h1>
            <div className="gap-2 grid grid-cols-2 mx-2 text-center md:grid-cols-4">
                { classesWithSections.map( (c, idx) => (
                        <Link key={`${c}-${idx}`} href={`/classes/${c}`}><a>
                            <div className="border-2 rounded hover:bg-purple-500 hover:text-white" >
                                {c}
                            </div>
                        </a></Link>
                ))}
            </div>
        </div>
    )
}

export default Classes