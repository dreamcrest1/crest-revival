-- Add is_hot_selling flag to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_hot_selling boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_hot_selling ON public.products (is_hot_selling) WHERE is_hot_selling = true;

-- Mark hot-selling products
UPDATE public.products SET is_hot_selling = true WHERE id IN (
  '574d32ae-e33d-4752-80a3-59013066756f', -- Stealth Writer
  '7a19d5bf-1e75-4053-a756-781b9db41acc', -- WriteHuman AI 1 Month
  '5e1662ef-babe-48ea-a941-8f45405c18d4', -- Gemini + 5TB
  '4b7507dd-c2d1-470a-a41d-370554047e8c', -- Gemini Ultra
  '4cc2171b-0898-4fd7-8dca-cd46f4a4b862', -- HeyGen Shared
  'f43ce9a7-c031-400a-a6b5-013bf3634506', -- HeyGen Private
  '47d25f1b-29e3-41e0-9e3a-8f609c5a5ce5', -- Hailuo AI
  '79ed1344-fb5e-4440-8991-d5febe3e8c4c', -- Runway ML
  '9e0018f7-4c3d-4edb-95d5-697292f7afbf', -- Perplexity Pro 1 Year
  'b13c8823-9f74-4119-a03f-cfc2c17b5143', -- Lovable Pro
  '0908ce13-8fa9-4065-8477-34729213c48a', -- Replit Core
  'ec878a72-560b-43f0-b52b-ec73754fae37', -- Notion Business Plus
  'd6a12f8b-b50f-4f37-a821-dece2f5a57bb', -- Bolt.new Pro 1 Year
  'd1dda484-3099-4e6e-9f33-20617af43b3d', -- Gamma AI Pro 1 Year
  '2ea7a782-88b1-4b03-9502-b452a84ef9bd', -- Cursor Pro 1 Year
  '00e38f90-c642-4bb5-a74a-e6d52632843e', -- Manus AI Pro 1 Year
  'e841e421-952a-402b-ba06-d29689acd6c0', -- Eleven Labs 1 Year
  '3a04114d-d621-46b4-b626-89aa1b0a3d52', -- LinkedIn Career
  '76034cdd-4b88-4439-926c-49f75e8e5fda', -- LinkedIn Business
  '01f35256-ebfb-45ad-8cc3-b6e9e6550b6e', -- Office 365 Copilot
  'd7175643-828d-434a-b2ec-91aff8276b72', -- Webflow CMS
  'dfca792d-02a3-4b92-95dc-3381bd2800bb', -- Netflix 4K UHD 3 Months
  '6f22264e-0168-4670-a46c-3e6eee372197', -- Prime Video Yearly
  '71d84354-47d3-4bf1-a59c-9f1f258844aa', -- Hotstar Premium 4K UHD
  '34113ad2-3940-4e6c-943b-d0802b41e97b'  -- Sony LIV Premium 1 Year
);