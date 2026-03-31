Setting up Resend for Nelson Chauke Properties involves integrating their SDK with Next.js Server Actions and managing your form state. Here is the step-by-step implementation:

**Step 1: Install Resend**
Open your terminal and install the Resend Node SDK into your project by running `npm install resend`.

**Step 2: Generate and Store Your API Key**
1. Log into your Resend dashboard and navigate to the **API Keys** section to create a new key.
2. Copy the generated value.
3. In the root of your Next.js project, open your `.env` file and safely store the key:
   `RESEND_API_KEY=your_copied_key_here`

**Step 3: Create the Server Action**
Create a new file for your server-side logic and add the `"use server"` directive at the very top so it only runs on the backend. You will instantiate Resend here and create the function to send the email:
* Import Resend and initialize it with your environment variable. 
* Call the send method, passing in the `to`, `subject`, and basic HTML content. 

**Step 4: Build the Client Form**
In your form component, utilize React's `useActionState` hook to handle the form submission. 
* This hook will return the current state, a form action to submit the data, and an `isPending` flag.
* Attach the action to your `<form action={...}>` attribute.
* Use the `isPending` flag to disable your input fields and submit button while the email is sending.

**Step 5: Configure a Custom Domain**
By default, Resend only allows you to send test emails from `onboarding@resend.dev` to your own verified inbox. To send emails to your actual users:
1. In the Resend dashboard, select **Domains** and add a new domain. It is recommended to use a subdomain (e.g., `mail.legacylearning.com`) to protect your root domain's deliverability.
2. Resend will provide specific DNS records. Add these to your domain provider (like Cloudflare, Vercel, or GoDaddy).
3. Once the records propagate and the domain is verified, update the `from` address in your Server Action to use your new custom domain.

**Step 6: Add React Email (Recommended)**
Instead of writing standard HTML strings for your emails, you can use **React Email**, an open-source library that lets you build unstyled, type-safe email templates using React components. 
* Build your template component, import it into your Server Action, and pass it directly into the Resend call instead of the HTML property.

**Step 7: Implement View Transitions (UX Bonus)**
For a polished user experience when displaying success or error messages after the form is submitted, import the `ViewTransition` component from React. Wrap your status messages with this component to trigger smooth, native browser fade animations when the state changes.