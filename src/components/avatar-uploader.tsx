
'use client';

import { useState, useRef, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadAvatar } from "@/app/actions";

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function AvatarUploader({ currentAvatar }: { currentAvatar: string | null }) {
    const [preview, setPreview] = useState<string | null>(currentAvatar);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE_BYTES) {
            toast({
                variant: 'destructive',
                title: 'File Too Large',
                description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
            
            startTransition(async () => {
                const formData = new FormData();
                formData.append('avatar', file);

                const result = await uploadAvatar(formData);

                if (result.success) {
                    toast({
                        title: 'Avatar Updated!',
                        description: 'Your new profile picture has been saved.',
                    });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Upload Failed',
                        description: result.error || 'An unknown error occurred.',
                    });
                    // Revert preview if upload fails
                    setPreview(currentAvatar);
                }
            });
        };
        reader.readAsDataURL(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative w-24 h-24 mx-auto group">
            <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={preview || ''} alt="User avatar" />
                <AvatarFallback className="text-3xl">
                    {isPending ? <Loader2 className="animate-spin" /> : 'U'}
                </AvatarFallback>
            </Avatar>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                disabled={isPending}
            />
            <Button
                onClick={handleButtonClick}
                variant="secondary"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isPending}
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
        </div>
    );
}
