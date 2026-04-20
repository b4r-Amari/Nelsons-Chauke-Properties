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

interface ContactTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactTemplate = ({
  name,
  email,
  subject,
  message,
}: ContactTemplateProps) => (
  <Html>
    <Head />
    <Preview>Message from {name}: {subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={brandLabel}>NC PROPERTIES</Text>
          <Heading style={h1}>Contact Inquiry</Heading>
        </Section>
        
        <Section style={content}>
          <Text style={paragraph}>
            You have received a new message from <strong>{name}</strong>.
          </Text>
          
          <Section style={infoCard}>
            <Text style={infoLabel}>SENDER</Text>
            <Text style={infoValue}>{name}</Text>
            
            <Text style={infoLabel}>EMAIL</Text>
            <Link href={`mailto:${email}`} style={link}>{email}</Link>
            
            <Text style={infoLabel}>SUBJECT</Text>
            <Text style={infoValue}>{subject}</Text>
          </Section>

          <Text style={infoLabel}>MESSAGE</Text>
          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            This notification was sent from the Nelson Chauke Properties administration portal.
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
  margin: "0 0 24px",
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
  margin: "0 0 16px",
};

const link = {
  color: "#BB0000",
  fontSize: "15px",
  textDecoration: "none",
  display: "block",
  margin: "0 0 16px",
};

const messageBox = {
  margin: "8px 0 24px",
};

const messageText = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#1d1d1f",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
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

export default ContactTemplate;