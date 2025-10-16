import { PageHeader } from '@/components/page-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MailCheck } from 'lucide-react';

export default function AuthConfirmPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
                        <MailCheck className="h-12 w-12" />
                    </div>
                    <CardTitle className="mt-4">Confirm your email</CardTitle>
                    <CardDescription>
                        We sent a verification link to your email address. Please check your inbox (and spam folder) to complete your registration.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Once you've verified your email, you can close this tab and log in.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
