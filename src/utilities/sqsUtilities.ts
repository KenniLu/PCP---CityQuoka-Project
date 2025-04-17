// utils/sqs.js
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// Configure the AWS SDK
const sqsClient = new SQSClient({
  region: process.env._AWS_REGION as string,
  credentials: {
    accessKeyId: process.env._AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env._AWS_SECRET_ACCESS_KEY as string,
  },
});

/**
 * Send a message to an SQS queue
 * @param {string} queueUrl - The URL of the SQS queue
 * @param {object} messageBody - The message body to send
 * @param {object} options - Additional options like DelaySeconds, MessageAttributes, etc.
 * @returns {Promise<object>} - The response from SQS
 */
export async function sendSQSMessage(queueUrl, messageBody, options = {}) {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
    ...options,
  };

  try {
    const command = new SendMessageCommand(params);
    const response = await sqsClient.send(command);
    console.log("Message sent successfully:", response.MessageId);
    return response;
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    throw error;
  }
}