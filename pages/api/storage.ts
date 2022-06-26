import { Credentials } from 'aws-sdk'
import S3 from 'aws-sdk/clients/s3'
import type { NextApiRequest, NextApiResponse } from 'next'

const s3Client = new S3({
    region: 'ap-south-1',
    endpoint: 'ap-south-1.linodeobjects.com',
    sslEnabled: true,
    s3ForcePathStyle: false,
    credentials: new Credentials({
        accessKeyId: 'PK8SC159T8TFO3D66OKQ',
        secretAccessKey: 'xbi9DL2u0JhPOkMChGEmAAo6RhIPMMqCIIMNBQRS',
    }),
})

const api = async (req: NextApiRequest, res: NextApiResponse) => {
    const { base64Data, path, fileName } = req.body
    const paramsBody = base64Data.replace(/^data:image\/\w+;base64,/, '')
    
    const params = {
        Bucket: 'sms',
        Key: `${path}/${fileName}`,
        Body: paramsBody,
        //ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/jpeg`
        //ContentType: `image/${extension}`,
    }

    const url = await s3Client.getSignedUrlPromise('putObject', params)
    res.status(200).json({ url })
    
    /*s3Client.upload(params, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log(data)
    })*/
    
}

export default api
