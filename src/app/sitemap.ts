
import { MetadataRoute } from 'next'
import { getProperties } from '@/lib/data'
import { getAgents } from '@/lib/data'
import { getBlogPosts } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://nc-properties.vercel.app'

    const properties = await getProperties()
    const agents = await getAgents()
    const blogPosts = await getBlogPosts()

    const propertyUrls = properties.map((property) => {
        return {
            url: `${baseUrl}/properties/${property.id}`,
            lastModified: new Date(),
        }
    })

    const agentUrls = agents.map((agent) => {
        return {
            url: `${baseUrl}/agents/${agent.slug}`,
            lastModified: new Date(),
        }
    })

    const blogPostUrls = blogPosts.map((post) => {
        return {
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(),
        }
    })

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/properties`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/agents`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
        },
        ...propertyUrls,
        ...agentUrls,
        ...blogPostUrls,
    ]
}
