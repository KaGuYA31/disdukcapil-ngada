-- Add videos and photos columns to berita table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'berita' AND column_name = 'videos') THEN
    ALTER TABLE "berita" ADD COLUMN "videos" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'berita' AND column_name = 'photos') THEN
    ALTER TABLE "berita" ADD COLUMN "photos" TEXT;
  END IF;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add videos and photos columns to inovasi table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inovasi' AND column_name = 'videos') THEN
    ALTER TABLE "inovasi" ADD COLUMN "videos" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inovasi' AND column_name = 'photos') THEN
    ALTER TABLE "inovasi" ADD COLUMN "photos" TEXT;
  END IF;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
