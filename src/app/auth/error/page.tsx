import { PageHeader } from '@/components/page-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function AuthErrorPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 text-destructive p-4 rounded-full w-fit">
                        <XCircle className="h-12 w-12" />
                    </div>
                    <CardTitle className="mt-4">Authentication Error</CardTitle>
                    <CardDescription>
                        Something went wrong during the authentication process. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        If the problem persists, please contact support.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
