
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WavingMascotLoader } from './waving-mascot-loader';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function AvatarUploader({ currentAvatar }: { currentAvatar: string | null }) {
    const [preview, setPreview] = useState<string | null>(currentAvatar);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isPending, setIsPending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();

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
        };
        reader.readAsDataURL(file);
        setFileToUpload(file);
    };

    const handleSave = async () => {
        if (!fileToUpload) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append('avatar', fileToUpload);

        try {
            const response = await fetch('/api/avatar/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                toast({
                    title: 'Avatar Updated!',
                    description: 'Your new profile picture has been saved.',
                });
                setFileToUpload(null); // Clear the file after successful upload
                // Refresh the page to show the new avatar everywhere
                router.refresh();
            } else {
                throw new Error(result.error || 'An unknown error occurred.');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: error instanceof Error ? error.message : String(error),
            });
            // Revert preview if upload fails
            setPreview(currentAvatar);
            setFileToUpload(null);
        } finally {
            setIsPending(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 mx-auto">
                <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={preview || ''} alt="User avatar" />
                    <AvatarFallback className="text-3xl">
                        {isPending ? <WavingMascotLoader messages={[]} /> : 'U'}
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
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    disabled={isPending}
                    aria-label="Choose new profile picture"
                >
                    {isPending ? <WavingMascotLoader messages={[]} /> : <Upload className="h-4 w-4" />}
                </Button>
            </div>
            {fileToUpload && (
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? (
                        <WavingMascotLoader messages={["Saving..."]} />
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Picture
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
