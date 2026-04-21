import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function PageWrapper({ title, children }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: 'var(--text3)' }}>
        <ArrowLeft size={14} /> Back to home
      </Link>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>{title}</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text3)' }}>Last updated: April 2025</p>
      <div className="space-y-6" style={{ color: 'var(--text2)' }}>
        {children}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{title}</h2>
      <div className="text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <PageWrapper title="Privacy Policy">
      <Section title="1. Information We Collect">
        <p>When you sign in with Google, we collect your name, email address, and profile photo provided by Google. We also store the resumes and cover letters you create within the app in our database (Firebase Firestore).</p>
        <p>We do not collect payment information, as ResumeAI is currently free to use.</p>
      </Section>
      <Section title="2. How We Use Your Information">
        <p>We use your information solely to provide the ResumeAI service — including saving your resumes, authenticating your account, and personalizing your experience. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
      </Section>
      <Section title="3. AI Processing">
        <p>When you use the ATS Analyzer, Resume Optimizer, or Cover Letter Generator, your resume content and job descriptions are sent to Anthropic's Claude API for processing. Please review <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)' }}>Anthropic's Privacy Policy</a> to understand how they handle data. We do not permanently store the text you submit for AI processing.</p>
      </Section>
      <Section title="4. Data Storage">
        <p>Your account data and saved resumes are stored securely in Google Firebase (Firestore). Firebase is a Google Cloud product subject to <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)' }}>Google's privacy policies</a>.</p>
      </Section>
      <Section title="5. Cookies and Local Storage">
        <p>We use browser localStorage to remember your theme preference (light/dark/system) and to track guest usage limits. We do not use advertising cookies or third-party tracking.</p>
      </Section>
      <Section title="6. Data Deletion">
        <p>You can delete your saved resumes at any time from your Dashboard. To request complete deletion of your account and all associated data, email us at the contact address below.</p>
      </Section>
      <Section title="7. Children's Privacy">
        <p>ResumeAI is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
      </Section>
      <Section title="8. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the "Last updated" date at the top of this page.</p>
      </Section>
      <Section title="9. Contact">
        <p>If you have questions about this Privacy Policy, please contact us through the ResumeAI application.</p>
      </Section>
    </PageWrapper>
  )
}

export function TermsPage() {
  return (
    <PageWrapper title="Terms of Service">
      <Section title="1. Acceptance of Terms">
        <p>By accessing or using ResumeAI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
      </Section>
      <Section title="2. Description of Service">
        <p>ResumeAI provides AI-powered tools for resume analysis, optimization, building, and cover letter generation. The Service is provided free of charge and powered by Claude AI (Anthropic).</p>
      </Section>
      <Section title="3. User Accounts">
        <p>You may use limited features as a guest (up to 2 analyses). For unlimited access, you must sign in using Google Authentication. You are responsible for maintaining the security of your account.</p>
      </Section>
      <Section title="4. Acceptable Use">
        <p>You agree not to use the Service to upload malicious content, attempt to circumvent usage limits through automated means, or use the Service in any way that violates applicable laws. You must not misrepresent yourself or your qualifications in resumes generated using this Service.</p>
      </Section>
      <Section title="5. Your Content">
        <p>You retain ownership of all resume content and personal information you upload or create. By using the Service, you grant ResumeAI a limited license to process your content for the purpose of providing the Service (including sending it to the Claude AI API for analysis).</p>
      </Section>
      <Section title="6. AI-Generated Content">
        <p>ResumeAI uses Claude AI to generate and optimize resume content. AI-generated content is provided as a starting point and may not always be accurate, complete, or suitable for your specific situation. You are solely responsible for reviewing, editing, and verifying all content before using it in job applications.</p>
      </Section>
      <Section title="7. No Employment Guarantee">
        <p>ResumeAI does not guarantee job placement, interview invitations, or any specific employment outcome. The Service is a tool to help improve your resume — results will vary based on many factors outside our control.</p>
      </Section>
      <Section title="8. Disclaimer of Warranties">
        <p>The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access or error-free operation. AI-generated content may contain inaccuracies.</p>
      </Section>
      <Section title="9. Limitation of Liability">
        <p>To the fullest extent permitted by law, ResumeAI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
      </Section>
      <Section title="10. Changes to Terms">
        <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
      </Section>
      <Section title="11. Governing Law">
        <p>These Terms are governed by the laws of the Province of Ontario, Canada, without regard to conflict of law principles.</p>
      </Section>
    </PageWrapper>
  )
}
