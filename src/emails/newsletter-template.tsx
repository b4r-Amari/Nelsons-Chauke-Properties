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
    <Preview>New Newsletter Subscriber: {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>NC Properties</Heading>
          <Text style={tagline}>Newsletter Subscription</Text>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Hello Admin,</Text>
          <Text style={paragraph}>
            You have a new subscriber to your marketing list!
          </Text>
          <Section style={detailsSection}>
            <Text style={detailText}><strong>Name:</strong> {name}</Text>
            <Text style={detailText}><strong>Email:</strong> <Link href={`mailto:${email}`} style={link}>{email}</Link></Text>
            <Text style={detailText}><strong>Source:</strong> {source}</Text>
            <Text style={detailText}><strong>Date:</strong> {new Date().toLocaleDateString('en-ZA', { dateStyle: 'full' })}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Nelson Chauke Properties Marketing • Pretoria, South Africa
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
  backgroundColor: "#BB0000", // Accent color for newsletter
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
  margin: "8px 0",
  color: "#555555",
};

const link = {
  color: "#BB0000",
  textDecoration: "underline",
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

export default NewsletterTemplate;