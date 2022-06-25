// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    const { method } = req
    const { conditions, get_attributes, operation, operator, schema, table } = req.body
    const dataJson =  { conditions, get_attributes, operation, operator, schema, table }
    
    // convert JSON to text
    var data = JSON.stringify(dataJson)
        
    var config = {
      method,
      url: process.env.HARPERDB_URL,
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Basic ' + Buffer.from(process.env.HARPERDB_USERNAME + ':' + process.env.HARPERDB_PASSWORD).toString('base64')
      },
      data
    }
    
     return await axios(config)
      .then(function (resp) {
        const { data, status } = resp
        console.log('success')
        return res.status(status).json(data)
      })
      .catch(function (error) {
        console.log(error)
      })
}