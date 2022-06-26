// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const api = async ( req: NextApiRequest, res: NextApiResponse<any> ) => {
    const { method } = req
    const { operation, schema, table, records } = req.body
    const dataJson =  { operation, schema, table, records }
    
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

export default api
