import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactTemplate = ({
  name = 'Client',
  email = 'client@example.com',
  subject = 'Property Inquiry',
  message = 'I am interested in viewing this property.',
}: ContactTemplateProps) => {
  const referenceNumber = `NC-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;

  return (
    <Html>
      <Head />
      <Preview>We've received your inquiry regarding {subject}.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandLabel}>NC PROPERTIES</Text>
          </Section>

          <Heading style={heading}>We've received your inquiry.</Heading>

          <Text style={paragraph}>Hello,</Text>
          <Text style={paragraph}>
            This is an automated notification regarding a new contact form submission. Our team has received the following message regarding <strong>{subject}</strong>.
          </Text>

          <Section style={informationBox}>
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Reference ID</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{referenceNumber}</Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>From</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{name}</Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Email</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>
                  <Link href={`mailto:${email}`} style={link}>
                    {email}
                  </Link>
                </Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Message</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{message}</Text>
              </Column>
            </Row>
          </Section>

          <Text style={paragraph}>
            To respond to this inquiry, please click the email address above to reply directly to the client.
          </Text>

          <Hr style={footerDivider} />

          <Text style={footerText}>
            Copyright © {new Date().getFullYear()} NC Properties. All rights reserved. <br />
            Pretoria, South Africa
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactTemplate;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const header = {
  paddingBottom: '24px',
  textAlign: 'center' as const,
};

const brandLabel = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#4B0000',
  letterSpacing: '2px',
  margin: '0',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.2',
  fontWeight: '600',
  color: '#1d1d1f',
  textAlign: 'center' as const,
  letterSpacing: '-0.022em',
  paddingBottom: '16px',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '1.47059',
  fontWeight: '400',
  color: '#1d1d1f',
  letterSpacing: '-0.022em',
  margin: '0 0 16px',
};

const informationBox = {
  backgroundColor: '#f5f5f7',
  borderRadius: '12px',
  padding: '24px',
  marginTop: '32px',
  marginBottom: '32px',
};

const informationRow = {
  display: 'flex',
  padding: '8px 0',
};

const labelColumn = {
  width: '30%',
};

const valueColumn = {
  width: '70%',
  textAlign: 'right' as const,
};

const label = {
  fontSize: '14px',
  color: '#86868b',
  margin: '0',
  fontWeight: '400',
};

const value = {
  fontSize: '14px',
  color: '#1d1d1f',
  margin: '0',
  fontWeight: '500',
};

const divider = {
  borderColor: '#d2d2d7',
  margin: '8px 0',
};

const link = {
  color: '#BB0000',
  textDecoration: 'none',
};

const footerDivider = {
  borderColor: '#d2d2d7',
  margin: '40px 0 20px',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '1.33333',
  color: '#86868b',
  textAlign: 'center' as const,
  margin: '0',
};
