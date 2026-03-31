
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const propertiesData = require('../../data/properties.json');
const agentsData = require('../../data/agents.json');
const blogData = require('../../data/blog.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Starting seed process...');

  // 1. Seed Agents
  console.log('Seeding estate_agents...');
  for (const agent of agentsData) {
    const { error } = await supabase.from('estate_agents').upsert({
      id: agent.id,
      first_name: agent.name.split(' ')[0],
      last_name: agent.name.split(' ').slice(1).join(' ') || 'Agent',
      slug: agent.slug,
      email: agent.email,
      phone: agent.phone,
      photo_url: agent.imageUrl,
      bio: agent.bio,
      role: agent.role,
      is_active: true
    }, { onConflict: 'slug' });
    if (error) console.error(`Error seeding agent ${agent.name}:`, error.message);
  }

  // 2. Seed Properties
  console.log('Seeding properties...');
  for (const prop of propertiesData) {
    const { error } = await supabase.from('properties').upsert({
      id: prop.id,
      agent_id: prop.agentIds[0], 
      title: prop.address,
      slug: prop.slug,
      description: prop.description,
      price: prop.price,
      status: prop.status,
      type: prop.type,
      bedrooms: prop.beds,
      bathrooms: prop.baths,
      location: prop.location,
      sqft: prop.sqft,
      erf_size: prop.erfSize,
      year_built: prop.yearBuilt,
      features: prop.features,
      image_urls: [prop.imageUrl],
      is_favorite: prop.isFavorite,
      on_show: prop.onShow
    }, { onConflict: 'slug' });
    if (error) console.error(`Error seeding property ${prop.address}:`, error.message);
  }

  // 3. Seed Blogs
  console.log('Seeding blog_posts...');
  for (const post of blogData) {
    const { error } = await supabase.from('blog_posts').upsert({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      featured_image: post.imageUrl,
      author: post.author,
      published: true
    }, { onConflict: 'slug' });
    if (error) console.error(`Error seeding blog ${post.title}:`, error.message);
  }

  console.log('Seed completed successfully.');
}

seed().catch(err => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
