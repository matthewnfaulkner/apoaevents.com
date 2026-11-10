import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        hero: z.object({
          eyebrow: z.string(),
          headline: z.string(),
          lead: z.string(),
          slides: z.array(z.object({
            src: z.string(),
            alt: z.string(),
            caption: z.string().optional(),
          })),
        }),
        services: z.array(z.object({
          title: z.string(),
          icon: z.enum(['secretariat', 'development', 'events', 'education', 'digital']),
          description: z.string(),
        })),
        contact: z.object({
          company: z.string(),
          address: z.array(z.string()),
          phones: z.array(z.string()),
          email: z.string(),
          mapQuery: z.string(),
        }),
        apoaUrl: z.string(),
      }),
    }),
  },
})
