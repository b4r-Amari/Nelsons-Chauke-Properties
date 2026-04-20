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
    <Preview>New Message from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>NC Properties</Heading>
          <Text style={tagline}>Contact Form Submission</Text>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Hello Admin,</Text>
          <Text style={paragraph}>
            You have received a new message through the website contact form:
          </Text>
          <Section style={detailsSection}>
            <Text style={detailText}><strong>Name:</strong> {name}</Text>
            <Text style={detailText}><strong>Email:</strong> <Link href={`mailto:${email}`} style={link}>{email}</Link></Text>
            <Text style={detailText}><strong>Subject:</strong> {subject}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={messageHeading}>Message:</Text>
          <Text style={messageContent}>{message}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Nelson Chauke Properties • South Africa
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

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
};

const detailsSection = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "4px",
  marginTop: "20px",
};

const detailText = {
  fontSize: "14px",
  margin: "5px 0",
  color: "#555555",
};

const link = {
  color: "#BB0000",
  textDecoration: "underline",
};

const messageHeading = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#4B0000",
  marginTop: "20px",
};

const messageContent = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#333333",
  whiteSpace: "pre-wrap" as const,
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

export default ContactTemplate;