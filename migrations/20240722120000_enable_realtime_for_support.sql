-- Enable replication for the support_tickets table
ALTER TABLE "support_tickets" REPLICA IDENTITY FULL;
-- Add the table to the 'supabase_realtime' publication
ALTER PUBLICATION supabase_realtime ADD TABLE "support_tickets";

-- Enable replication for the ticket_messages table
ALTER TABLE "ticket_messages" REPLICA IDENTITY FULL;
-- Add the table to the 'supabase_realtime' publication
ALTER PUBLICATION supabase_realtime ADD TABLE "ticket_messages";
