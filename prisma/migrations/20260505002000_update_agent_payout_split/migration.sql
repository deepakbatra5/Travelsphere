-- Store the agent payout in BookingAgent.commission.
-- Travel Sphere keeps 20% and the assigned agent receives 80%.
UPDATE "BookingAgent" AS assignment
SET "commission" = booking."totalAmount" * 0.8
FROM "Booking" AS booking
WHERE assignment."bookingId" = booking."id";
