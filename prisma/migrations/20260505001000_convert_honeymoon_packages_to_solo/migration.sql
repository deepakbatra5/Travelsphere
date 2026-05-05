-- Convert old package records so Prisma never reads a category value that is
-- no longer present in the generated client.
UPDATE "Package"
SET "category" = 'SOLO'::"Category"
WHERE "category"::text = 'HONEYMOON';
