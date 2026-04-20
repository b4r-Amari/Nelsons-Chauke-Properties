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
    <Preview>New Valuation Request from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>NC Properties</Heading>
          <Text style={tagline}>Free Property Valuation Request</Text>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Hello Agent,</Text>
          <Text style={paragraph}>
            A new property valuation request has been submitted. Please contact the owner as soon as possible.
          </Text>
          
          <Heading style={sectionTitle}>Owner Details</Heading>
          <Section style={detailsSection}>
            <Text style={detailText}><strong>Name:</strong> {name}</Text>
            <Text style={detailText}><strong>Email:</strong> <Link href={`mailto:${email}`} style={link}>{email}</Link></Text>
            <Text style={detailText}><strong>Phone:</strong> <Link href={`tel:${phone}`} style={link}>{phone}</Link></Text>
          </Section>

          <Heading style={sectionTitle}>Property Details</Heading>
          <Section style={detailsSection}>
            <Text style={detailText}><strong>Address:</strong> {address}</Text>
            <Text style={detailText}><strong>Property Type:</strong> {type}</Text>
            <Row style={{ marginTop: "10px" }}>
              <Column>
                <Text style={detailText}><strong>Bedrooms:</strong> {bedrooms}</Text>
              </Column>
              <Column>
                <Text style={detailText}><strong>Bathrooms:</strong> {bathrooms}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            This is an automated notification from the Nelson Chauke Properties Portal.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: 'Lato, "Helvetica Neue", Helvetica, Arial, sans-serif',
};

const container = {
  margin: "40px auto",
  width: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const header = {
  backgroundColor: "#4B0000",
  padding: "40px 20px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const tagline = {
  color: "#ffffff",
  fontSize: "14px",
  opacity: "0.8",
  marginTop: "5px",
};

const content = {
  padding: "30px 40px",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#4B0000",
  marginTop: "25px",
  marginBottom: "10px",
  borderBottom: "2px solid #f0f0f0",
  paddingBottom: "5px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
};

const detailsSection = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  borderRadius: "4px",
};

const detailText = {
  fontSize: "14px",
  margin: "5px 0",
  color: "#555555",
};

const link = {
  color: "#BB0000",
  textDecoration: "none",
  fontWeight: "bold",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "30px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};

export default ValuationTemplate;