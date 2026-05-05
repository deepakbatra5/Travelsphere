-- Older deployments used HONEYMOON before the category was renamed to SOLO.
-- Ensure the new enum value exists before data is converted in the next migration.
ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'SOLO';
