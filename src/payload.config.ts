// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Programmes } from './collections/Programmes'
import { Events } from './collections/Events'
import { Venues } from './collections/Venues'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import fs from 'node:fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const getPostgresSslConfig = () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.IS_LOCAL ||
    !process.env.POSTGRES_SSL_CERT_PATH
  ) {
    return {}
  }

  const certPath = path.join(process.cwd(), process.env.POSTGRES_SSL_CERT_PATH)

  console.log('Current working directory:', process.cwd());
  console.log('Full cert path:', certPath);
  console.log('Current Directory contents:', fs.readdirSync(process.cwd()));
  const certsParentPath = path.join(process.cwd(), 'certs')
  if(fs.existsSync(certsParentPath)){
    console.log('Cert Directory contents:', fs.readdirSync(certsParentPath));
  }else{
    console.log('Certs is missing in cwd()')
  }

  return {
    ssl: {
      rejectUnauthorized: false,
      cert: fs.readFileSync(certPath).toString(),
    },
  }
}

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      ...getPostgresSslConfig(),
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users, Events, Programmes, Venues],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
