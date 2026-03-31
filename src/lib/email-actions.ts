'use server';

/**
 * @fileOverview Email server actions using Resend.
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'nelson.c@ncproperties.com';
const FROM_EMAIL = 'onboarding@resend.dev'; // Replace with your verified domain in production

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }) {
  try {
    const { error } = await resend.emails.send({
      from: `NC Properties <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">New Message from ${data.name}</h2>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
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
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">Property Enquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          ${data.propertyId ? `<p><strong>Property ID:</strong> ${data.propertyId}</p>` : ''}
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendValuationEmail(data: { name: string; email: string; phone: string; address: string; type: string }) {
  try {
    const { error } = await resend.emails.send({
      from: `NC Properties <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Free Valuation Request: ${data.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">Valuation Request</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Property Address:</strong> ${data.address}</p>
          <p><strong>Property Type:</strong> ${data.type}</p>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
