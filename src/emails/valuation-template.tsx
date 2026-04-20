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

interface ValuationTemplateProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
}

export const ValuationTemplate = ({
  name = 'Alex Appleseed',
  email = 'alex@example.com',
  phone = '012 345 6789',
  address = '123 Property Lane, Pretoria',
  type = 'House',
  bedrooms = 3,
  bathrooms = 2,
}: ValuationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Valuation Request: {address}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandLabel}>NC PROPERTIES</Text>
          </Section>

          <Heading style={heading}>New Valuation Request</Heading>

          <Text style={paragraph}>Hello Team,</Text>
          <Text style={paragraph}>
            A new professional property valuation has been requested through the website. Please review the details below and contact the owner.
          </Text>

          <Section style={informationBox}>
             <Text style={sectionTitle}>Owner Information</Text>
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
                <Text style={label}>Phone</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>
                  <Link href={`tel:${phone}`} style={link}>
                    {phone}
                  </Link>
                </Text>
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
            
            <Text style={{ ...sectionTitle, marginTop: '24px' }}>Property Details</Text>
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Address</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{address}</Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Type</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{type}</Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={informationRow}>
              <Column style={labelColumn}>
                <Text style={label}>Beds / Baths</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{bedrooms} Bedrooms, {bathrooms} Bathrooms</Text>
              </Column>
            </Row>
          </Section>

          <Text style={paragraph}>
            This is a priority lead generated from the "Sell" page.
          </Text>

          <Hr style={footerDivider} />

          <Text style={footerText}>
            Copyright © {new Date().getFullYear()} NC Properties. All rights reserved. <br />
            Nelson Chauke Properties • Real Estate Excellence
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ValuationTemplate;

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

const sectionTitle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#86868b',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '12px',
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
