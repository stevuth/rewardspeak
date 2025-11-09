-- Create the table for support tickets
CREATE TABLE
  public.support_tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open'::TEXT,
    priority TEXT NOT NULL DEFAULT 'low'::TEXT,
    CONSTRAINT support_tickets_pkey PRIMARY KEY (id),
    CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK ((status = ANY (ARRAY['open'::TEXT, 'closed'::TEXT]))),
    CONSTRAINT chk_priority CHECK ((priority = ANY (ARRAY['low'::TEXT, 'medium'::TEXT, 'high'::TEXT])))
  ) TABLESPACE pg_default;

-- Create the table for messages within a support ticket
CREATE TABLE
  public.ticket_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ticket_id UUID NOT NULL,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_from_support BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT ticket_messages_pkey PRIMARY KEY (id),
    CONSTRAINT ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT ticket_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE SET NULL
  ) TABLESPACE pg_default;

-- Enable Row Level Security (RLS) on both tables
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;


-- POLICIES for support_tickets table

-- Allow authenticated users to create their own tickets.
CREATE POLICY "Allow authenticated users to create their own tickets" ON public.support_tickets
  FOR INSERT
  WITH CHECK (auth.uid () = user_id);

-- Allow users to view their own tickets.
CREATE POLICY "Allow users to view their own tickets" ON public.support_tickets
  FOR SELECT
  USING (auth.uid () = user_id);

-- Allow service_role (admins/support) to perform all actions.
-- This policy assumes your support portal uses a service_role key.
CREATE POLICY "Allow full access for service_role" ON public.support_tickets
  FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);


-- POLICIES for ticket_messages table

-- Allow authenticated users to add messages to their own tickets.
CREATE POLICY "Allow users to create messages in their own tickets" ON public.ticket_messages
  FOR INSERT
  WITH CHECK (
    auth.uid () = user_id AND (
      EXISTS (
        SELECT 1
        FROM support_tickets
        WHERE
          support_tickets.id = ticket_id AND support_tickets.user_id = auth.uid()
      )
    )
  );

-- Allow users to view messages in their own tickets.
CREATE POLICY "Allow users to view messages in their own tickets" ON public.ticket_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM support_tickets
      WHERE
        support_tickets.id = ticket_id AND support_tickets.user_id = auth.uid()
    )
  );

-- Allow service_role (admins/support) to perform all actions on messages.
CREATE POLICY "Allow full access for service_role on messages" ON public.ticket_messages
  FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);
