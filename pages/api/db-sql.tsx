// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApires } from 'next'
import axios from 'axios'

export default async ( req: NextApiRequest, res: NextApires<Data> ) => {
    const { method } = req
    const { operation, sql } = req.body
    const dataJson =  { operation, sql }
    
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
    
    console.log(req)
    return await axios(config)
      .then(function (resp) {
        const { data, status } = resp
        console.log('resp', resp)
        return res.status(status).json(data)
      }, err => {
        console.log(err)
      })
      .catch(function (error) {
        console.log('err', error.message)
      })
}