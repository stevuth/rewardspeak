-- This migration removes the top_converting_offers table as it is no longer used in the application.
-- The logic has been consolidated to use only the all_offers table.

DROP TABLE IF EXISTS top_converting_offers;
