import Link from 'next/link'
import { useRouter } from 'next/router'

const Class = () => {
    const router = useRouter()
    const cl = router.query.class
    
    const links =[ `${cl}/attendance`, `${cl}/students`, `${cl}/timetable`, `${cl}/exams/term1`, `${cl}/exams/term2`, `${cl}/exams/term3`, `${cl}/exams/term4` ]
    
    return (
        <div className="gap-2 grid grid-cols-2 italic mt-8 mx-2 text-center text-xl md:grid-cols-4">
                { links.map( (link, index) => (
                    <Link href={link} key={`${link}-${index}`}><a>
                        <div className="border-2 rounded hover:bg-purple-500 hover:text-white" >
                            { link.split('/').at(-1) }
                        </div>
                    </a></Link>
                ))}
        </div>
    )
}

export default Class
