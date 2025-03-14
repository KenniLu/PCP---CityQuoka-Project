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
  Button
} from '@react-email/components';
import * as React from 'react';

interface LoginEmailProps {
  url: string;
}

const baseUrl = process.env.EMAIL_ASSET_BASE_URL

const main = {
  backgroundColor: '#FFAD00',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const logo = {
  padding: '30px 20px',
};

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
  backgroundColor: '#fff',
};

const boxInfos = {
  padding: '20px',
};

export const LoginEmail = ({
  url
}: LoginEmailProps) => {
  // const formattedDate = new Intl.DateTimeFormat('en', {
  //   dateStyle: 'long',
  //   timeStyle: 'short',
  //   timeZone: 'Australia/Sydney'
  // }).format(emailDate);
  const { host, origin } = new URL(url)
  const labelUrl = new URL('/city-quokka-email-label.png', origin)
  // const escapedHost = host.replace(/\./g, "&#8203;.")

  return (
    <Html>
      <Head />
      <Preview>Your Login link for {host}</Preview>
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
                  Your Login link for {host}
                </Heading>

                <Button style={{
                  backgroundColor: '#FFAD00',
                  borderRadius: '3px',
                  textAlign: 'center',
                  display: 'block',
                  padding: '11px 20px',
                  width: '50px',
                  fontSize: '15px',
                  color: '#000',
                  }} href={url}>
                  Login
                </Button>
                
                <Text style={paragraph}>
                  Please login use this link if you have difficulty using the above button <a href={url}>{url}</a>
                </Text>

                <Text style={paragraph}>
                  Please ignore this email if you did not request a login to {host}
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
  );
};

LoginEmail.PreviewProps = {
  url: 'https://cityquokka.com/login-email'
} as LoginEmailProps;

export default LoginEmail;