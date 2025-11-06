-- Add mobile column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS mobile TEXT;

-- Add comment to document the column
COMMENT ON COLUMN bookings.mobile IS 'Mobile phone number for the booking contact';
