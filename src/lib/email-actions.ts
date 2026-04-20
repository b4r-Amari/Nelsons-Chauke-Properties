'use server';

/**
 * @fileOverview Email server actions using Resend and React Email templates.
 */

import { Resend } from 'resend';
import React from 'react';
import { ContactTemplate } from '@/emails/contact-template';
import { ValuationTemplate } from '@/emails/valuation-template';
import { NewsletterTemplate } from '@/emails/newsletter-template';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'tommychaukejr@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev'; // Replace with your verified domain in production

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }) {
  try {
    const { error } = await resend.emails.send({
      from: `NC Properties <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Contact Form Submission: ${data.subject}`,
      react: React.createElement(ContactTemplate, {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      }),
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Email Action Error:', err);
    return { success: false, error: err.message };
  }
}

export async function sendEnquiryEmail(data: { name: string; email: string; phone: string; message: string; propertyId?: string }) {
  try {
    const { error } = await resend.emails.send({
      from: `NC Properties <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Property Enquiry from ${data.name}`,
      react: React.createElement(ContactTemplate, {
        name: data.name,
        email: data.email,
        subject: data.propertyId ? `Enquiry for Property ${data.propertyId}` : "General Property Enquiry",
        message: `Phone: ${data.phone}\n\n${data.message}`
      }),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendValuationEmail(data: { name: string; email: string; phone: string; address: string; type: string; bedrooms: number; bathrooms: number }) {
  try {
    const { error } = await resend.emails.send({
      from: `NC Properties <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Free Valuation Request: ${data.name}`,
      react: React.createElement(ValuationTemplate, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        type: data.type,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms
      }),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendNewsletterNotification(data: { name: string; email: string; source: string }) {
  try {
    const { error } = await resend.emails.send({
      from: `NC Properties <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Newsletter Subscriber: ${data.name}`,
      react: React.createElement(NewsletterTemplate, {
        name: data.name,
        email: data.email,
        source: data.source
      }),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}