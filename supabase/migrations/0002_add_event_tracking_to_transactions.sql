-- Add new columns to the transactions table for better event tracking.
ALTER TABLE public.transactions
ADD COLUMN rewarded_txn_id TEXT,
ADD COLUMN event_id TEXT,
ADD COLUMN event_name TEXT;

-- Add comments for clarity on the new columns.
COMMENT ON COLUMN public.transactions.rewarded_txn_id IS 'For chargebacks, this contains the original transaction ID of the reward.';
COMMENT ON COLUMN public.transactions.event_id IS 'ID of the specific offer event that was credited.';
COMMENT ON COLUMN public.transactions.event_name IS 'Name of the specific offer event that was credited.';
