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
} from "@react-email/components";
import * as React from "react";

interface NewsletterTemplateProps {
  name: string;
  email: string;
  source: string;
}

export const NewsletterTemplate = ({
  name,
  email,
  source,
}: NewsletterTemplateProps) => (
  <Html>
    <Head />
    <Preview>New Subscriber: {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={brandLabel}>NC PROPERTIES</Text>
          <Heading style={h1}>New Subscriber</Heading>
        </Section>
        
        <Section style={content}>
          <Section style={welcomeBadge}>
            <Text style={badgeText}>MARKETING LEAD</Text>
          </Section>

          <Text style={paragraph}>
            A new user has joined the Nelson Chauke Properties newsletter list.
          </Text>
          
          <Section style={infoCard}>
            <Text style={infoLabel}>NAME</Text>
            <Text style={infoValue}>{name}</Text>
            
            <Text style={infoLabel}>EMAIL ADDRESS</Text>
            <Link href={`mailto:${email}`} style={link}>{email}</Link>
            
            <Text style={infoLabel}>SIGNUP SOURCE</Text>
            <Text style={infoValue}>{source}</Text>
            
            <Text style={infoLabel}>DATE</Text>
            <Text style={infoValue}>{new Date().toLocaleDateString('en-ZA', { dateStyle: 'long' })}</Text>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            Nelson Chauke Properties • Real Estate Excellence
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
  color: "#BB0000",
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

const welcomeBadge = {
  backgroundColor: "#BB0000",
  borderRadius: "20px",
  padding: "4px 12px",
  width: "fit-content",
  margin: "0 auto 24px",
};

const badgeText = {
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.5px",
  margin: "0",
};

const paragraph = {
  fontSize: "17px",
  lineHeight: "1.5",
  color: "#1d1d1f",
  textAlign: "center" as const,
  margin: "0 0 32px",
};

const infoCard = {
  backgroundColor: "#f5f5f7",
  borderRadius: "8px",
  padding: "24px",
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
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 20px",
};

const link = {
  color: "#BB0000",
  fontSize: "16px",
  fontWeight: "500",
  textDecoration: "none",
  display: "block",
  margin: "0 0 20px",
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

export default NewsletterTemplate;