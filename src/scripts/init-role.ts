import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })

  const userRoles = await payload.find({
    collection: 'user-roles',
    limit: 1,
    where: {
      name: {
        equals: 'SuperAdminn',
      },
    },
  })

  if (userRoles.docs.length === 0) {
    const adminRole = await payload.create({
      collection: 'user-roles',
      data: {
        name: 'SuperAdminn',
        permissions: {
          admin: true,
        },
      },
    })
  }

  process.exit(0)
}

await run()
