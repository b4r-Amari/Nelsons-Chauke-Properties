
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

/**
 * Ensures a value is a valid UUID. 
 * If it looks like a legacy integer ID, it converts it to a deterministic UUID.
 */
const ensureUuid = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  
  // Create a deterministic UUID from integer strings (e.g. "1" -> "00000000-0000-0000-0000-000000000001")
  const padded = String(id).padStart(12, '0');
  return `00000000-0000-0000-0000-${padded}`;
};

async function seed() {
  console.log('Starting resilient seed process...');

  // 1. Seed Agents
  console.log('Seeding estate_agents...');
  for (const agent of agentsData) {
    const agentId = ensureUuid(agent.id);
    const { error } = await supabase.from('estate_agents').upsert({
      id: agentId,
      first_name: agent.name.split(' ')[0],
      last_name: agent.name.split(' ').slice(1).join(' ') || 'Agent',
      slug: agent.slug || `agent-${agent.id}`,
      email: agent.email,
      phone: agent.phone,
      photo_url: agent.imageUrl,
      bio: agent.bio,
      role: agent.role,
      is_active: true
    }, { onConflict: 'id' });
    if (error) console.error(`Error seeding agent ${agent.name}:`, error.message);
  }

  // 2. Seed Properties
  console.log('Seeding properties...');
  for (const prop of propertiesData) {
    const propId = ensureUuid(prop.id);
    const agentId = prop.agentIds && prop.agentIds[0] ? ensureUuid(prop.agentIds[0]) : null;
    
    const { error } = await supabase.from('properties').upsert({
      id: propId,
      agent_id: agentId, 
      title: prop.address || prop.title,
      slug: prop.slug || `prop-${prop.id}`,
      description: prop.description,
      price: prop.price,
      status: prop.status,
      type: prop.type,
      bedrooms: prop.beds || prop.bedrooms || 0,
      bathrooms: prop.baths || prop.bathrooms || 0,
      location: prop.location,
      floor_size: prop.sqft || prop.floorSize || 0,
      erf_size: prop.erfSize || 0,
      year_built: prop.yearBuilt,
      features: prop.features || [],
      image_urls: [prop.imageUrl || 'https://picsum.photos/seed/1/800/600'],
      is_favorite: prop.isFavorite || false,
      on_show: prop.onShow || false
    }, { onConflict: 'id' });
    if (error) console.error(`Error seeding property ${prop.address}:`, error.message);
  }

  // 3. Seed Blogs
  console.log('Seeding blog_posts...');
  for (const post of blogData) {
    const postId = ensureUuid(post.id);
    const { error } = await supabase.from('blog_posts').upsert({
      id: postId,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      featured_image: post.imageUrl,
      author: post.author,
      published: true
    }, { onConflict: 'id' });
    if (error) console.error(`Error seeding blog ${post.title}:`, error.message);
  }

  console.log('Resilient seed completed successfully.');
}

seed().catch(err => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
