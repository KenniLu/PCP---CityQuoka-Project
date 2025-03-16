import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link,
  Hr
} from '@react-email/components'
import * as React from 'react'

import { reasonForContactOptions } from '@/validationSchemas/businessContactSchema'
import { businessTypeOptions } from '@/validationSchemas/businessContactSchema'

interface EnquiryEmailProps {
  url: string,
  reasonForContact: string
  otherReason?: string
  businessName: string
  typeOfBusiness: string
  businessLocation: string
  contactName: string
  email: string
  contactNumber: string
}

const baseUrl = process.env.EMAIL_ASSET_BASE_URL

const main = {
  backgroundColor: '#FFAD00',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const paragraph = {
  fontSize: 16,
}

const logo = {
  padding: '30px 20px',
}

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  padding: '10px'
}

const tableContainer = {
  width: '100%',
  // borderCollapse: 'collapse',
};

const tableRow = {
  borderBottom: '1px solid #eee',
};

const heading = {
  fontSize: '20px',
  color: '#333',
  marginBottom: '24px',
  fontWeight: 'bold',
};


const tableHeaderColumn = {
  width: '40%',
  padding: '12px 0',
  textAlign: 'left' as const,
  verticalAlign: 'top' as const,
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
};

const tableColumn = {
  width: '60%',
  padding: '12px 0',
  textAlign: 'left' as const,
  verticalAlign: 'top' as const,
  fontSize: '14px',
  color: '#333',
};

const subDetail = {
  marginTop: '4px',
  fontSize: '14px',
  color: '#666',
  fontStyle: 'italic',
};

const hr = {
  borderColor: '#eee',
  margin: '30px 0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const footer = {
  fontSize: '13px',
  color: '#888',
  lineHeight: '1.5',
};

export const EnquiryEmail = ({ reasonForContact,  otherReason, businessName, typeOfBusiness, businessLocation, contactName, email, contactNumber, url }: EnquiryEmailProps) => {
  // const formattedDate = new Intl.DateTimeFormat('en', {
  //   dateStyle: 'long',
  //   timeStyle: 'short',
  //   timeZone: 'Australia/Sydney'
  // }).format(emailDate);
  const { host, origin } = new URL(url)
  const labelUrl = new URL('/city-quokka-email-label.png', origin)
  // const escapedHost = host.replace(/\./g, "&#8203;.")

  const getReasonLabel = (value: string) => {
    const option = reasonForContactOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getBusinessTypeLabel = (value: string) => {
    const option = businessTypeOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };
  

  return (
    <Html>
      <Head />
      <Preview>Enquiry for {host}</Preview>
      <Body style={main}>
        <Container>
          <Section style={logo}>
            <Img src={labelUrl.href} />
          </Section>

          <Section style={content}>
            <Heading style={heading}>New Contact Form Submission for {host}</Heading>
            <Text style={paragraph}>
              You have received a new contact form submission with the following details:
            </Text>

            <Section style={tableContainer}>
              <Row style={tableRow}>
                <Column style={tableHeaderColumn}>Reason for Contact:</Column>
                <Column style={tableColumn}>
                  {getReasonLabel(reasonForContact)}
                  {reasonForContact === 'other' && otherReason && (
                    <Text style={subDetail}>- {otherReason}</Text>
                  )}
                </Column>
              </Row>

              <Row style={tableRow}>
                <Column style={tableHeaderColumn}>Business Name:</Column>
                <Column style={tableColumn}>{businessName}</Column>
              </Row>

              <Row style={tableRow}>
                <Column style={tableHeaderColumn}>Type of Business:</Column>
                <Column style={tableColumn}>{getBusinessTypeLabel(typeOfBusiness)}</Column>
              </Row>

              <Row style={tableRow}>
                <Column style={tableHeaderColumn}>Business Location:</Column>
                <Column style={tableColumn}>{businessLocation}</Column>
              </Row>

              <Row style={tableRow}>
                <Column style={tableHeaderColumn}>Contact Name:</Column>
                <Column style={tableColumn}>{contactName}</Column>
              </Row>

              <Row style={tableRow}>
                <Column style={tableHeaderColumn}>Email:</Column>
                <Column style={tableColumn}>
                  <Link href={`mailto:${email}`} style={link}>
                    {email}
                  </Link>
                </Column>
              </Row>

              <Row style={tableRow}>
                <Column style={tableHeaderColumn}>Contact:</Column>
                <Column style={tableColumn}>
                  <Link href={`tel:${contactNumber}`} style={link}>
                    {contactNumber}
                  </Link>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              This email was sent automatically from business contact form.
            </Text>
          </Section>

          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'rgb(0,0,0, 0.7)',
            }}
          >
            © 2025 | City Quokka | www.cityquokka.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

EnquiryEmail.PreviewProps = {
  reasonForContact: "other",
  otherReason: "There is something else\nI want to discuss\nwith someone",
  businessName: 'ACME Pty Ltd',
  typeOfBusiness: 'food',
  businessLocation: 'Sydney',
  contactName: 'John Doe',
  email: 'contact@acme.org',
  contactNumber: '0424242424',
  url: 'https://cityquokka.com'
} as EnquiryEmailProps

export default EnquiryEmail
