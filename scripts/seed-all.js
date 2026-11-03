const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables safely from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [k, ...vParts] = trimmed.split('=');
    const v = vParts.join('=').trim().replace(/^["']|["']$/g, '');
    if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL' && !url) url = v;
    if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY' && !serviceKey) serviceKey = v;
  });
}

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const sb = createClient(url, serviceKey);

// Read services from data-store/services.json and fix any encoding if needed
const servicesJsonPath = path.resolve(__dirname, '../data-store/services.json');
const galleryJsonPath = path.resolve(__dirname, '../data-store/gallery.json');
const testimonialsJsonPath = path.resolve(__dirname, '../data-store/testimonials.json');

async function seed() {
  console.log('--- STARTING SUPABASE SEEDING ---');

  // 1. SERVICES
  const servicesData = JSON.parse(fs.readFileSync(servicesJsonPath, 'utf8'));
  const cleanServices = servicesData.map((s, index) => {
    let features = s.features || [];
    features = features.map((f) => f.replace(/LATICRETEAr Hydro BanAr/g, 'LATICRETE® Hydro Ban®'));
    return {
      id: s.id,
      title: s.title,
      short_desc: s.shortDesc || '',
      full_desc: s.fullDesc || '',
      features: features,
      icon: s.icon || 'Award',
      image: s.image || '',
      badge: s.badge || '',
      position: index,
    };
  });

  const { data: existingServices } = await sb.from('services').select('*');
  const defaultIds = new Set(cleanServices.map((s) => s.id));
  const customServices = (existingServices || []).filter((s) => !defaultIds.has(s.id));
  const finalServices = [...cleanServices, ...customServices];

  const { error: srvErr } = await sb.from('services').upsert(finalServices);
  if (srvErr) {
    console.error('Error upserting services:', srvErr);
  } else {
    console.log(`✅ Upserted ${finalServices.length} services to Supabase.`);
  }

  // 2. GALLERY
  const galleryData = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf8'));
  const galleryRows = galleryData.map((item, index) => {
    const baseTime = new Date('2026-01-01T00:00:00.000Z').getTime();
    const itemTime = new Date(baseTime + (galleryData.length - index) * 60000).toISOString();
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      image: item.image,
      location: item.location || '',
      tile_type: item.tileType || '',
      description: item.description || '',
      created_at: itemTime,
    };
  });

  for (let i = 0; i < galleryRows.length; i += 20) {
    const chunk = galleryRows.slice(i, i + 20);
    const { error: galErr } = await sb.from('gallery').upsert(chunk);
    if (galErr) console.error(`Error upserting gallery chunk ${i}:`, galErr);
  }
  console.log(`✅ Upserted ${galleryRows.length} default gallery items to Supabase.`);

  // 3. TESTIMONIALS
  const testimonialsData = JSON.parse(fs.readFileSync(testimonialsJsonPath, 'utf8'));
  const testimonialRows = testimonialsData.map((t) => ({
    id: t.id,
    name: t.name,
    suburb: t.suburb || '',
    rating: t.rating || 5,
    date: t.date || '',
    comment: t.comment || '',
    service: t.service || '',
  }));

  const { error: testErr } = await sb.from('testimonials').upsert(testimonialRows);
  if (testErr) {
    console.error('Error upserting testimonials:', testErr);
  } else {
    console.log(`✅ Upserted ${testimonialRows.length} testimonials to Supabase.`);
  }

  // Final verification
  console.log('--- VERIFICATION ---');
  const { data: sData } = await sb.from('services').select('id, title, position').order('position');
  console.log(`Services in DB (${sData?.length}):`, sData?.map(s => s.title));

  const { data: gData } = await sb.from('gallery').select('id, title, category').order('created_at', { ascending: false });
  console.log(`Gallery in DB (${gData?.length}). Top 3:`, gData?.slice(0, 3));

  const { data: tData } = await sb.from('testimonials').select('id, name');
  console.log(`Testimonials in DB (${tData?.length}):`, tData?.map(t => t.name));
}

seed().catch(console.error);
