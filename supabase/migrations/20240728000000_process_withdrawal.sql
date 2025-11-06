
-- Enable Row-Level Security
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Create the function to process withdrawals
CREATE OR REPLACE FUNCTION public.process_withdrawal(
    p_user_id uuid,
    p_email text,
    p_amount_usd numeric,
    p_method text,
    p_wallet_address text
)
RETURNS void AS $$
DECLARE
    points_to_deduct int;
    current_points int;
    profile_id_val uuid;
BEGIN
    -- 1 USD = 1000 points
    points_to_deduct := p_amount_usd * 1000;

    -- Get the user's profile and current points, and lock the row for update
    SELECT id, points INTO profile_id_val, current_points
    FROM public.profiles
    WHERE user_id = p_user_id
    FOR UPDATE;

    -- If no profile is found, raise an error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found for user_id: %', p_user_id;
    END IF;

    -- Check if the user has enough points
    IF current_points < points_to_deduct THEN
        RAISE EXCEPTION 'Not enough points';
    END IF;

    -- Deduct the points from the user's profile
    UPDATE public.profiles
    SET points = points - points_to_deduct
    WHERE id = profile_id_val;

    -- Insert the withdrawal request
    INSERT INTO public.withdrawal_requests(user_id, email, amount_usd, method, wallet_address, status)
    VALUES (p_user_id, p_email, p_amount_usd, p_method, p_wallet_address, 'pending');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to the 'service_role'
-- This allows the function to be called from your backend with admin privileges
GRANT EXECUTE ON FUNCTION public.process_withdrawal(uuid, text, numeric, text, text) TO service_role;

