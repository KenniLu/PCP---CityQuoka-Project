import { GetObjectCommand } from '@aws-sdk/client-s3'
import { S3Client } from '@aws-sdk/client-s3'
import { getReportsS3Config } from '@/config/reportsS3Config'

// +   {
// +     path: '/whoami/:parameter',
// +     method: 'post',
// +     handler: (req) => {
// +       return Response.json({
// +         parameter: req.routeParams.parameter,
// +         // ^^ `params` is now `routeParams`
// +         name: req.data.name,
// +         age: req.data.age,
// +       })
// +     }
// +   }

export const downloadReport = async (req): Promise<Response> => {
  // Create a server function for downloading reports
  // export const downloadReport = async (req) => {
  const { payload, routeParams } = req
  const reportId = routeParams!.id

  try {
    // Find the report by ID to get the filename
    const report = await payload.findByID({
      collection: 'reports',
      id: reportId as string,
    })

    if (!report || !report.filename) {
      return Response.json({ error: 'Not Found' }, { status: 404 })
    }

    // Initialize S3 client using environment variables
    const {reportS3Bucket, reportS3config} = getReportsS3Config()
    const s3Client = new S3Client(reportS3config)

    const key = report.filename

    // Get the file from S3
    const command = new GetObjectCommand({
      Bucket: reportS3Bucket,
      Key: key,
    })

    try {
      const { Body, ContentType, ContentLength } = await s3Client.send(command)

      if (!Body) {
        return Response.json(
          { message: 'File not found in S3' },
          { status: 404 }
        );
      }

      // Simple solution: Convert to array buffer
      // This works for files that can fit in memory
      const arrayBuffer = await Body.transformToByteArray();
      
      // Create headers
      const headers = new Headers({
        'Content-Type': ContentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${report.filename}"`,
      });
      
      if (ContentLength) {
        headers.set('Content-Length', ContentLength.toString());
      }
      
      // Return response with array buffer
      return new Response(arrayBuffer, {
        status: 200,
        headers,
      });
    } catch (s3Error) {
      console.error('Error retrieving file from S3:', s3Error)
      return Response.json(
        {
          message: 'Error retrieving file from S3',
          error: s3Error.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error processing download request:', error)
    return Response.json(
      { message: 'Error processing download request', error: error.message },
      { status: 500 },
    )
  }
}
