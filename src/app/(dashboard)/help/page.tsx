
'use client';

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
import { useState, useMemo, useRef, useTransition } from 'react';
import { createSupportTicket } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, MessageSquare, Search, Send, Paperclip, X } from 'lucide-react';
import Image from "next/image";

const faqs = [
    {
        question: "How long do payouts take?",
        answer: "Payouts are typically processed within 7 business days."
    },
    {
        question: "Why didn't I receive points for an offer?",
        answer: "Please ensure you have followed all offer instructions, including disabling ad-blockers. If you still have issues, contact support with the offer name and a screenshot."
    },
    {
        question: "Can I have multiple accounts?",
        answer: "No, users are limited to one account per person to ensure fairness. Creating multiple accounts may lead to a ban."
    },
    {
        question: "How do I start earning points?",
        answer: "Once you sign up, head to the 'Earn' page. You can choose from thousands of offers, including playing games, trying new apps, and completing surveys. Each offer shows the points you'll earn. Just follow the instructions to get your reward!"
    },
    {
        question: "How much are points worth and how can I cash out?",
        answer: "It's simple: 1,000 points = $1.00 USD. You can cash out your earnings starting from just $10. We offer fast and secure withdrawals to PayPal and popular cryptocurrencies like USDT."
    },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [attachment, setAttachment] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }
      setAttachment(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setPreview(null);
    if (formRef.current) {
        const fileInput = formRef.current.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }
  }

  const handleSubmit = (formData: FormData) => {
    if (attachment) {
      formData.append('attachment', attachment);
    }

    startTransition(async () => {
      const result = await createSupportTicket(formData);

      if (result.success) {
        toast({
          title: "Ticket Submitted!",
          description: "Our support team will get back to you shortly.",
        });
        formRef.current?.reset();
        removeAttachment();
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.error || "An unknown error occurred.",
        });
      }
    });
  };
  
  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqs;
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);


  return (
    <div className="space-y-8">
      <PageHeader
        title="Help Center"
        description="Have a question or need assistance? We're here to help."
      />
      
      <div className="grid gap-12 md:grid-cols-2">
          {/* FAQ Section */}
          <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Find quick answers to common questions.</p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search FAQs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <Card className="bg-card/50 border-border/50 max-h-[450px] overflow-y-auto">
                <CardContent className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>
                            {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground p-8">
                        <p>No FAQs match your search.</p>
                      </div>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
          </div>
          
          {/* Contact Form Section */}
          <div className="space-y-6">
              <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-headline">Still need help?</h2>
                  <p className="text-muted-foreground">Send us a message and we'll get back to you.</p>
              </div>
              <form action={handleSubmit} ref={formRef}>
                <Card className="overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-card">
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Mail className="h-5 w-5"/>
                        Contact Support
                    </CardTitle>
                    <CardDescription>
                      Fill out the form and our team will get back to you soon.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject"
                        name="subject"
                        placeholder="e.g., Issue with an offer" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message"
                        name="message"
                        placeholder="Describe your issue in detail..." 
                        className="min-h-[150px]"
                        required
                       />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="attachment">Attach Image (Optional)</Label>
                        <Input id="attachment" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" className="file:text-primary file:font-semibold" />
                        {preview && (
                            <div className="relative w-32 h-32 mt-2">
                                <Image src={preview} alt="Attachment preview" layout="fill" className="rounded-md object-cover" />
                                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeAttachment}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-card/50">
                      <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
                        {isPending ? 'Submitting...' : 'Send Ticket'}
                      </Button>
                  </CardFooter>
                </Card>
              </form>
          </div>
      </div>
    </div>
  );
}
