
'use client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <div className="text-muted-foreground space-y-3 prose prose-invert prose-sm max-w-none">
            {children}
        </div>
    </div>
);

export default function PrivacyTrailPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Previous Page
            </Button>
        </div>
        <Card className="text-left">
            <CardHeader>
                <CardTitle className="text-3xl font-bold font-headline">Privacy Policy</CardTitle>
                <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </CardHeader>
            <CardContent className="space-y-8">
                <Section title="1. Introduction">
                    <p>Rewards Peak ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
                </Section>

                <Section title="2. Information We Collect">
                    <p>We may collect the following types of information:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Personal Information:</strong> When you register, we collect your email address. When you request a withdrawal, we may collect payment information, such as your PayPal email or cryptocurrency wallet address.</li>
                        <li><strong>Usage Data:</strong> We automatically collect information about how you access and use the Service, including your IP address, device type, browser type, pages visited, and the time and date of your visit.</li>
                        <li><strong>Information from Third Parties:</strong> Our offer wall partners may share information with us about the offers you complete, including confirmation of completion.</li>
                    </ul>
                </Section>
                
                <Section title="3. How We Use Your Information">
                     <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Provide, operate, and maintain our Service.</li>
                        <li>Process your rewards and withdrawal requests.</li>
                        <li>Prevent fraud and enforce our Terms of Service. This includes using your IP address for fraud detection purposes.</li>
                        <li>Communicate with you, including responding to your support inquiries.</li>
                        <li>Analyze usage to improve our Service.</li>
                    </ul>
                </Section>

                <Section title="4. Information Sharing and Disclosure">
                     <p>We do not sell your personal information. We may share your information with third parties only in the following circumstances:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf, such as payment processors and fraud detection services (e.g., IPHub).</li>
                        <li><strong>Offer Wall Partners:</strong> We share your unique user ID (but not your email) with our offer partners to track offer completions.</li>
                        <li><strong>Legal Compliance:</strong> If required by law or in response to valid requests by public authorities.</li>
                    </ul>
                </Section>

                <Section title="5. Data Security">
                    <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.</p>
                </Section>
                 <Section title="6. Children's Privacy">
                    <p>Our Service is not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information and terminate the child's account.</p>
                </Section>

                <Section title="7. Changes to This Privacy Policy">
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                </Section>

                <Section title="8. Contact Us">
                    <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@rewardspeak.com" className="text-primary hover:underline">support@rewardspeak.com</a>.</p>
                </Section>
            </CardContent>
        </Card>
    </div>
  );
}
