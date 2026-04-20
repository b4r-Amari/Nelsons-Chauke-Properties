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

interface NewsletterTemplateProps {
  name: string;
  email: string;
  source: string;
}

export const NewsletterTemplate = ({
  name = 'New Subscriber',
  email = 'subscriber@example.com',
  source = 'Homepage',
}: NewsletterTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>A new subscriber has joined the NC Properties newsletter.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandLabel}>NC PROPERTIES</Text>
          </Section>

          <Heading style={heading}>New Subscriber Confirmed</Heading>

          <Text style={paragraph}>Hello,</Text>
          <Text style={paragraph}>
            A new lead has been captured through the newsletter subscription form. The subscriber has been successfully added to the database.
          </Text>

          <Section style={informationBox}>
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Name</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{name}</Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Email Address</Text>
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
                <Text style={label}>Signup Source</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{source}</Text>
              </Column>
            </Row>
             <Hr style={divider} />
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Date</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{new Date().toLocaleDateString('en-ZA', { dateStyle: 'medium' })}</Text>
              </Column>
            </Row>
          </Section>

          <Text style={paragraph}>
            This user is now eligible to receive the latest property news, market insights, and featured listings.
          </Text>

          <Hr style={footerDivider} />

          <Text style={footerText}>
            Copyright © {new Date().getFullYear()} NC Properties. All rights reserved. <br />
            Nelson Chauke Properties • Redefining Real Estate
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterTemplate;

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
