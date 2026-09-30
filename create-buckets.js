const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating storage buckets in Supabase...');
    
    // Create id-proofs bucket
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('id-proofs', 'id-proofs', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    
    // Create hackathon-images bucket
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('hackathon-images', 'hackathon-images', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);

    // We also need to add basic policies so that anyone can upload and read (for testing/demo purposes)
    // Execute one by one to avoid prepared statement issues
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Access" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;`);
    
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Public Access" 
      ON storage.objects FOR SELECT 
      USING ( bucket_id = 'id-proofs' OR bucket_id = 'hackathon-images' );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow Uploads" 
      ON storage.objects FOR INSERT 
      WITH CHECK ( bucket_id = 'id-proofs' OR bucket_id = 'hackathon-images' );
    `);

    console.log('Successfully created buckets and policies!');
  } catch (error) {
    console.error('Error creating buckets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
