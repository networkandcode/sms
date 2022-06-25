import { tables } from '../../constants'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res:NextApiResponse) => {
    const { HARPERDB_PASSWORD, HARPERDB_URL, HARPERDB_USERNAME  } = process.env
    
    tables.forEach(table => {
        const data = JSON.stringify({
            "operation": "create_table",
            "schema": "sms",
            table,
            "hash_attribute": "id"
        })
    
        const config = {
          method: 'post',
          url: 'http://172.105.62.33:9925',
          headers: { 
            'Content-Type': 'application/json',
            'authorization': 'Basic ' + Buffer.from(HARPERDB_USERNAME + ':' + HARPERDB_PASSWORD).toString('base64')
          },
          data
        }
    
        axios(config)
            .then(function (response) {
                //console.log(JSON.stringify(response.data))
                console.log('success')
                return res.status(200).json({ data })
            })
            .catch(function (error) {
                //console.log(error)
                console.log('error')
            })
    })
}

