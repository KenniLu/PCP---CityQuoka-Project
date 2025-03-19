'use server'
import { render } from '@react-email/components'
import EnquiryEmail from '@/emails/enquiry-email'
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { BusinessContactFormValues } from '@/validationSchemas/businessContactSchema';

export default async function sendBusinessContactEmail(data: BusinessContactFormValues) {
  const { host } = new URL(process.env.NEXT_PUBLIC_SERVER_URL)
  try {
      const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY || "",
      });
    
      const loginEmailHtml = await render(EnquiryEmail({ url: process.env.NEXT_PUBLIC_SERVER_URL, ...data }))
    
      const sentFrom = new Sender("noreply@cityquokka.com", "City Quokka");
      const recipients = [new Recipient('sales@cityquokka.com')];
    
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(`Business enquiry from ${host}`)
        .setHtml(loginEmailHtml);
    
      await mailerSend.email.send(emailParams);

  } catch (error) {
    console.error(`Error sending enquiry: ${error}`)
    throw new Error(`Email could not be sent`)
  }
}