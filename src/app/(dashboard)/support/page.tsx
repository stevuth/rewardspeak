import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Station",
  description: "FAQs, support form, and contact helpdesk.",
};

const faqs = [
    {
        question: "How long do payouts take?",
        answer: "Payouts are typically processed within 24-48 hours. Crypto payouts may be faster depending on network congestion."
    },
    {
        question: "Why didn't I receive points for an offer?",
        answer: "Please ensure you have followed all offer instructions, including disabling ad-blockers. If you still have issues, contact support with the offer name and a screenshot."
    },
    {
        question: "Can I have multiple accounts?",
        answer: "No, users are limited to one account per person to ensure fairness. Creating multiple accounts may lead to a ban."
    }
]

export default function HelpStationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Help Station"
        description="Need help? We're here for you."
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Fill out the form below and our team will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g., Issue with an offer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue in detail..." className="min-h-[150px]" />
              </div>
            </CardContent>
            <CardFooter>
                <Button>Submit Ticket</Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>FAQs</CardTitle>
              <CardDescription>
                Frequently Asked Questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
