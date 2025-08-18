import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })

  const rolesCount = await payload.count({
    collection: 'user-roles',
    where: {}
  })

  const usersCount = await payload.count({
    collection: 'users',
    where: {}
  })

  if (rolesCount.totalDocs === 0 && usersCount.totalDocs === 0) {

    if(process.env.DEFAULT_USER && process.env.DEFAULT_USERNAME && process.env.DEFAULT_PASSWORD){

      const transactionID = await payload.db.beginTransaction()
      try {
        const adminRole = await payload.create({
          collection: 'user-roles',
          data: {
            name: 'SuperAdmin',
            permissions: {
              admin: true,
            }
          },
          req: { transactionID: transactionID! },
        })
        const user = await payload.create({
          collection: 'users',
          data: {
            email: process.env.DEFAULT_USER,
            name: process.env.DEFAULT_USERNAME,
            password: process.env.DEFAULT_PASSWORD,
            userRoles: [adminRole],
          },
          req: { transactionID: transactionID! },
        })
        await payload.db.commitTransaction(transactionID!)
      } catch (error) {
        await payload.db.rollbackTransaction(transactionID!)
        console.log(`Failed to Initialize. Error: ${error}`)
      }
    }else{
      console.log(`Skipping Initialization. Please add DEFAULT_USER, DEFAULT_USERNAME and DEFAULT_PASSWORD in your .env file`)
    }
  }else{
    console.log(`Database has existing users and roles. Skipping Initialization`)
  }
  process.exit(0)
}

await run()
