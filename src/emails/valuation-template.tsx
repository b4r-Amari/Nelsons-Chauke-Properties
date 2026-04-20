import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Column,
  Row,
} from "@react-email/components";
import * as React from "react";

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
  name,
  email,
  phone,
  address,
  type,
  bedrooms,
  bathrooms,
}: ValuationTemplateProps) => (
  <Html>
    <Head />
    <Preview>New Valuation: {address}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={brandLabel}>NC PROPERTIES</Text>
          <Heading style={h1}>Valuation Request</Heading>
        </Section>
        
        <Section style={content}>
          <Text style={paragraph}>
            A property owner is requesting a professional valuation.
          </Text>
          
          <Text style={sectionTitle}>OWNER DETAILS</Text>
          <Section style={infoCard}>
            <Row>
              <Column>
                <Text style={infoLabel}>NAME</Text>
                <Text style={infoValue}>{name}</Text>
              </Column>
              <Column>
                <Text style={infoLabel}>PHONE</Text>
                <Link href={`tel:${phone}`} style={link}>{phone}</Link>
              </Column>
            </Row>
            <Text style={infoLabel}>EMAIL</Text>
            <Link href={`mailto:${email}`} style={link}>{email}</Link>
          </Section>

          <Text style={sectionTitle}>PROPERTY DETAILS</Text>
          <Section style={infoCard}>
            <Text style={infoLabel}>ADDRESS</Text>
            <Text style={infoValue}>{address}</Text>
            
            <Row style={{ marginTop: "12px" }}>
              <Column>
                <Text style={infoLabel}>TYPE</Text>
                <Text style={infoValue}>{type}</Text>
              </Column>
              <Column>
                <Text style={infoLabel}>BEDS</Text>
                <Text style={infoValue}>{bedrooms}</Text>
              </Column>
              <Column>
                <Text style={infoLabel}>BATHS</Text>
                <Text style={infoValue}>{bathrooms}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            This is an automated priority notification for NC Properties agents.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#fbfbfd",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const headerSection = {
  padding: "32px",
  textAlign: "center" as const,
};

const brandLabel = {
  color: "#4B0000",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
};

const h1 = {
  color: "#1d1d1f",
  fontSize: "32px",
  fontWeight: "700",
  lineHeight: "1.1",
  margin: "0",
};

const content = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #d2d2d7",
  padding: "40px",
};

const paragraph = {
  fontSize: "17px",
  lineHeight: "1.5",
  color: "#1d1d1f",
  margin: "0 0 32px",
};

const sectionTitle = {
  color: "#86868b",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "0 0 12px",
};

const infoCard = {
  backgroundColor: "#f5f5f7",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px",
};

const infoLabel = {
  color: "#86868b",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const infoValue = {
  color: "#1d1d1f",
  fontSize: "15px",
  fontWeight: "500",
  margin: "0 0 12px",
};

const link = {
  color: "#BB0000",
  fontSize: "15px",
  fontWeight: "500",
  textDecoration: "none",
  display: "block",
  margin: "0 0 12px",
};

const hr = {
  borderColor: "#d2d2d7",
  margin: "32px 0 24px",
};

const footer = {
  color: "#86868b",
  fontSize: "12px",
  lineHeight: "1.4",
  textAlign: "center" as const,
};

export default ValuationTemplate;