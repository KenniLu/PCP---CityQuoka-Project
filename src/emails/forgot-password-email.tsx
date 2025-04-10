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
  Button,
} from '@react-email/components'
import * as React from 'react'

interface ForgotPasswordEmailProps {
  url: string
}

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
}

const boxInfos = {
  padding: '20px',
}

export const ForgotPasswordEmail = ({ url }: ForgotPasswordEmailProps) => {
  // const formattedDate = new Intl.DateTimeFormat('en', {
  //   dateStyle: 'long',
  //   timeStyle: 'short',
  //   timeZone: 'Australia/Sydney'
  // }).format(emailDate);
  const { host, origin } = new URL(url)
  const labelUrl = new URL('/city-quokka-label.png', origin)
  // const escapedHost = host.replace(/\./g, "&#8203;.")

  return (
    <Html>
      <Head />
      <Preview>Your Password Reset link for {host}</Preview>
      <Body style={main}>
        <Container>
          <Section style={logo}>
            <Img src={labelUrl.href} />
          </Section>

          <Section style={content}>
            <Row style={{ ...boxInfos, paddingBottom: '0' }}>
              <Column>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    textAlign: 'left',
                  }}
                >
                  Your Password Reset link for {host}
                </Heading>

                <Button
                  style={{
                    backgroundColor: '#FFAD00',
                    borderRadius: '3px',
                    textAlign: 'center',
                    display: 'block',
                    padding: '11px 20px',
                    width: '150px',
                    fontSize: '15px',
                    color: '#000',
                  }}
                  href={url}
                >
                  Reset Password
                </Button>

                <Text style={paragraph}>
                  If you have any difficulty using the button above, please use the link
                  below.
                </Text>

                <a href={url}>{url}</a>

                <Text style={paragraph}>
                  You can safely ignore this email if you did not request a password reset at {host}
                </Text>
              </Column>
            </Row>
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

ForgotPasswordEmail.PreviewProps = {
  url: 'https://cityquokka.com/forgot-password?token=urltoken',
} as ForgotPasswordEmailProps

export default ForgotPasswordEmail
