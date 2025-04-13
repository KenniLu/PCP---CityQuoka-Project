const { Pool } = require('pg');
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const os = require('os')
const archiver = require('archiver')
const axios = require('axios')

const s3 = new AWS.S3()

exports.handler = async (event) => {
  // Process each message from SQS
  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body)
      console.log('Processing message:', JSON.stringify(messageBody, null, 2))

      // Extract request parameters
      const { reportId, reportType, params } = messageBody
      updateAPI(reportId, null, 'PROCESSING', null)

      // Step 1: Generate report from database
      const csvData = await generateReportFromDatabase(reportType, params)

      // Step 2: Compress CSV into zip file
      const zipBuffer = await compressCSV(csvData, `${process.env.APP_ENV}_post_audit_report_${reportId}.csv`)

      // Step 3: Upload to S3
      const s3Key = await uploadToS3(zipBuffer, reportId)

      // Step 4: Notify API of completion
      // await notifyAPI(reportId, s3Key);
      updateAPI(reportId, s3Key, 'COMPLETED', null)

      console.log(`Successfully processed report ${reportId}`)
    } catch (error) {
      console.error('Error processing message:', error)
      // Depending on the error, you might want to keep the message in the queue
      // by throwing an error, or just log it and continue to the next message
      updateAPI(reportId, null, 'FAILED', [error.messageBody])
    }
  }

  return { statusCode: 200, body: 'Processing complete' }
}

// Connect to PostgreSQL and run the query to generate report data
async function generateReportFromDatabase(reportType, params) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URI,
    ssl: {
      rejectUnauthorized: false
    },
    max: 1
  });
  const client = await pool.connect();
  try {
    const sqlQuery = getSQLQueryForReportType(reportType, params)
    const result = await client.query(sqlQuery)
    const csvData = convertResultsToCSV(result.rows)
    return csvData
  } catch (error) {
    throw error
  } finally {
    await client.end()
  }
}

function convertResultsToCSV(rows) {
  if (rows.length === 0) {
    return 'No data found'
  }

  const headers = Object.keys(rows[0])
  let csv = headers.join(',') + '\n'

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const val = row[header]
      if (val === null || val === undefined) {
        return ''
      }
      const stringVal = String(val)
      if (stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('"')) {
        return `"${stringVal.replace(/"/g, '""')}"`
      }
      return stringVal
    })
    csv += values.join(',') + '\n'
  })

  return csv
}

// Get SQL query based on report type
function getSQLQueryForReportType(reportType, params) {
  // This would be expanded to handle different report types
  switch (reportType) {
    case 'PostsAuditReport':
      return `
        select p.id as post_id, p.title as title, sub_title as subtitle, _status as status, standalone as is_standalone,
        max(hero_t.name) as hero_tag,
        max(feat_t.name) as featured_tag,
        CASE WHEN p.image_id IS NOT NULL THEN TRUE ELSE FALSE END AS has_image,
        string_agg(DISTINCT c.title, ', ') AS categories,
        string_agg(DISTINCT u.name, ', ') AS users
        FROM 
            posts p
        LEFT JOIN 
            posts_tags hero_t ON p.id = hero_t._parent_id AND hero_t.name = 'hero'
        LEFT JOIN 
            posts_tags feat_t ON p.id = feat_t._parent_id AND feat_t.name = 'featured'
        LEFT JOIN 
            posts_rels pr ON p.id = pr.parent_id
        LEFT JOIN 
            categories c ON pr.categories_id = c.id
        LEFT JOIN 
            users u ON pr.users_id = u.id
        GROUP BY 
            p.id
      `
    default:
      throw new Error(`Unknown report type: ${reportType}`)
  }
}

// Compress CSV data into a zip file
async function compressCSV(csvData, fileName) {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary file path
      const tempFilePath = path.join(os.tmpdir(), fileName)

      // Write CSV data to temporary file
      fs.writeFileSync(tempFilePath, csvData)

      // Create a zip archive
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Compression level
      })

      // Create a buffer to hold the zip file
      const chunks = []

      archive.on('data', (chunk) => {
        chunks.push(chunk)
      })

      archive.on('end', () => {
        // Cleanup temp file
        fs.unlinkSync(tempFilePath)

        // Combine chunks into a single buffer
        const buffer = Buffer.concat(chunks)
        resolve(buffer)
      })

      archive.on('error', (err) => {
        reject(err)
      })

      // Add the file to the archive
      archive.file(tempFilePath, { name: fileName })

      // Finalize the archive
      archive.finalize()
    } catch (error) {
      reject(error)
    }
  })
}

// Upload zip file to S3
async function uploadToS3(zipBuffer, reportId) {
  const bucketName = process.env.S3_BUCKET
  const prefix = 'reports'
  const key = `${prefix}/${process.env.APP_ENV}_post_audit_report_${reportId}.csv.zip`

  await s3
    .putObject({
      Bucket: bucketName,
      Key: key,
      Body: zipBuffer,
      ContentType: 'application/zip',
    })
    .promise()

  return key
}

// Notify API of report completion
async function updateAPI(reportId, filename, status, errors) {
  const apiEndpoint = `${process.env.APP_DOMAIN}/api/reports/${reportId}`
  try {
    const response = await axios.patch(
      apiEndpoint,
      {
        reportId: reportId,
        status: status,
        filename: filename,
        errors: errors,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          Authorization: process.env.APP_API_KEY,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('API notification error:', error)
    throw error
  }
}
