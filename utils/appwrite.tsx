// utils/appwrite.js

import { Appwrite } from 'appwrite'

export const server = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
}

export const appwrite = new Appwrite()
    .setEndpoint(server.endpoint)
    .setProject(server.project)