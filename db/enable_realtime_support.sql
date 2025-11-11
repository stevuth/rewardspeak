-- Enable real-time updates for the support_tickets table
-- This allows the app to listen for changes to ticket status (e.g., open/closed).
ALTER TABLE support_tickets REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;

-- Enable real-time updates for the ticket_messages table
-- This is crucial for the live chat functionality on the help page
-- and for the notification bell to show when a new message arrives.
ALTER TABLE ticket_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE ticket_messages;
