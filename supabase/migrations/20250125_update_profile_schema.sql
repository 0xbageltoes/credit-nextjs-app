-- Update profiles table schema
ALTER TABLE profiles
  DROP COLUMN IF EXISTS display_name,
  DROP COLUMN IF EXISTS company,
  DROP COLUMN IF EXISTS focus_areas,
  DROP COLUMN IF EXISTS priority_assets;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS skills text[];

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Create new policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
