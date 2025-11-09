
-- Step 1: Create a new storage bucket for attachments
-- Go to Storage -> Buckets -> Create Bucket
-- Name: support_attachments
-- Make it a public bucket for now. We will secure it with policies.

-- Step 2: Run the following SQL code in the Supabase SQL Editor.

-- Add a new column to the ticket_messages table for the attachment URL
ALTER TABLE public.ticket_messages
ADD COLUMN attachment_url TEXT;

-- Update the comments for the new column
COMMENT ON COLUMN public.ticket_messages.attachment_url IS 'URL of an image attached to the message, stored in Supabase Storage.';


-- Create policies for the new storage bucket
-- This policy allows any authenticated user to upload to the 'support_attachments' bucket.
-- The files are stored in a folder named after the user's ID to keep them organized and secure.
CREATE POLICY "Allow authenticated users to upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'support_attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- This policy allows users to view attachments within their own tickets.
-- It joins the storage objects with the ticket messages and tickets tables to verify ownership.
CREATE POLICY "Allow users to view their own attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'support_attachments' AND
    auth.uid() IN (
        SELECT tm.user_id
        FROM public.ticket_messages tm
        JOIN public.support_tickets st ON tm.ticket_id = st.id
        WHERE tm.attachment_url = 'https://<YOUR-PROJECT-ID>.supabase.co/storage/v1/object/public/support_attachments/' || storage.objects.name
        AND st.user_id = auth.uid()
    )
);

-- Note for support agents:
-- The default service_role key bypasses RLS, so support agents using an admin client
-- will be able to view all attachments. If you create a specific 'support' role,
-- you will need to add a SELECT policy for that role.
-- For example:
-- CREATE POLICY "Allow support agents to view all attachments"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'support_attachments' AND get_my_claim('user_role') = 'support');

-- Previous schema for completeness (if running for the first time)
-- You do not need to run this part again if the tables already exist.

-- Create the table for support tickets if it doesn't exist
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'open' NOT NULL, -- 'open' or 'closed'
    priority TEXT DEFAULT 'low' NOT NULL -- 'low', 'medium', or 'high'
);

-- Create the table for ticket messages if it doesn't exist
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- ID of the sender
    message TEXT NOT NULL,
    is_from_support BOOLEAN DEFAULT FALSE NOT NULL
    -- The attachment_url column is added by the ALTER TABLE statement above
);
