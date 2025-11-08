
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


export default function TermsOfThePeakPage() {
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
                <CardTitle className="text-3xl font-bold font-headline">Terms of Service</CardTitle>
                <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </CardHeader>
            <CardContent className="space-y-8">
                <Section title="1. Acceptance of Terms">
                    <p>Welcome to Rewards Peak ("we," "us," or "our"). By accessing or using our website and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use the Service.</p>
                </Section>
                <Section title="2. User Accounts">
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Eligibility:</strong> You must be at least 18 years old or the age of majority in your jurisdiction to create an account.</li>
                        <li><strong>Account Responsibility:</strong> You are responsible for all activities that occur under your account and for keeping your password secure.</li>
                        <li><strong>One Account Rule:</strong> Each user is strictly limited to one account. Creating multiple accounts for any reason, including to abuse referral systems or promotions, is strictly prohibited and will result in the termination of all associated accounts and forfeiture of all earnings.</li>
                    </ul>
                </Section>
                 <Section title="3. Prohibited Conduct">
                    <p>You agree not to engage in any of the following prohibited activities:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Using a VPN, proxy, or any other means to obscure your true location or create multiple accounts.</li>
                        <li>Using bots, scripts, or any automated method to access or interact with the Service.</li>
                        <li>Engaging in fraudulent activity, including but not limited to, providing false information on offers, using stolen information, or attempting to exploit bugs in the system.</li>
                        <li>Completing offers with dishonest intent or reversing completions after receiving a reward.</li>
                    </ul>
                     <p>Violation of these rules will lead to immediate account termination and forfeiture of all earned points.</p>
                </Section>
                <Section title="4. Earning and Withdrawing">
                     <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Points:</strong> Points are awarded for the successful completion of offers as determined by our advertising partners. We are not responsible for tracking issues and reserve the right to deny points for any reason.</li>
                        <li><strong>Withdrawals:</strong> You may request a withdrawal once you reach the minimum threshold specified for your chosen payment method. All withdrawal requests are subject to review for fraudulent activity.</li>
                    </ul>
                </Section>
                <Section title="5. Termination">
                    <p>We reserve the right to suspend or terminate your account at any time, without notice, for any reason, including but not limited to, a breach of these Terms. If your account is terminated for a violation, all earned points and pending withdrawals will be forfeited.</p>
                </Section>
                <Section title="6. Disclaimer of Warranties">
                    <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or secure.</p>
                </Section>
                <Section title="7. Limitation of Liability">
                    <p>In no event shall Rewards Peak be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.</p>
                </Section>
                 <Section title="8. Changes to Terms">
                    <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
                </Section>
                 <Section title="9. Contact Us">
                    <p>If you have any questions about these Terms, please contact us through the support page on our website.</p>
                </Section>
            </CardContent>
        </Card>
    </div>
  );
}
