// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const appwrite = require('node-appwrite')

let client = new appwrite.Client()

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY)
            
let users = new appwrite.Users(client)

type Data = {
    name: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
    ) {
    console.log('req', req.method)  
   
    if (req.method === 'POST') {
        const { user } = req.query
        let promise = users.createMembership(user, 'email@example.com', [ 'member' ], 'https://example.com')
    
        promise.then(function (response) {
    
        }, function (error) {
        console.log(error)
        })
    
        res.status(200).json({ name: 'John Doe' })
    } else if(req.method === 'GET') {
        let promise = users.list()
        
        promise.then(function (response) {
            console.log(response)
            res.status(200).json(response)
            
        }, function (error) {
            console.log(error.message)
        })
    }
}