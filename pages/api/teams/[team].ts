// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const sdk = require('node-appwrite')

type Data = {
    name: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { team } = req.query
    let client = new sdk.Client()
    let teams = new sdk.Teams(client)
    
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY)
    
    let promise = teams.createMembership(team, 'email@example.com', [ 'member' ], 'https://example.com')
    
    promise.then(function (response) {
        
    }, function (error) {
        console.log(error)
    });

    res.status(200).json({ name: 'John Doe' })
  }
}
