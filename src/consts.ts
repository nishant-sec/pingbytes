import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Your Blog Name',
  description:
    'A brief description of your blog. This will be used in meta tags and social sharing.',
  href: 'https://yourdomain.com',
  author: 'your-author-id',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 6,
}

// Google Analytics
// Configure via environment variable: PUBLIC_GOOGLE_ANALYTICS_ID
export const ANALYTICS = {
  google: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID || '',
}

// Umami Analytics
// Configure via environment variable: PUBLIC_UMAMI_WEBSITE_ID
export const UMAMI = {
  websiteId: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID || '',
}

// Giscus Comments
// Set environment variables:
// - PUBLIC_GISCUS_REPO=owner/repo
// - PUBLIC_GISCUS_REPO_ID=your-repo-id
// - PUBLIC_GISCUS_CATEGORY=Discussion category name
// - PUBLIC_GISCUS_CATEGORY_ID=Discussion category ID
export const GISCUS = {
  repo: import.meta.env.PUBLIC_GISCUS_REPO || '',
  repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID || '',
  category: import.meta.env.PUBLIC_GISCUS_CATEGORY || '',
  categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || '',
}

// Brevo Newsletter
// Get your API key from https://app.brevo.com/settings/keys/api
// Set it as an environment variable: BREVO_API_KEY=your-api-key
// Optional: Set BREVO_LIST_ID to automatically add subscribers to a specific list
// Optional: Set BREVO_TEMPLATE_ID for double opt-in confirmation email (default: 5)
export const BREVO = {
  apiKey: import.meta.env.BREVO_API_KEY || '',
  listId: import.meta.env.BREVO_LIST_ID || '',
  templateId: import.meta.env.BREVO_TEMPLATE_ID || '5',
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    href: '/wiki',
    label: 'Wiki',
  },
  {
    href: '/about',
    label: 'About',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/username',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/username',
    label: 'LinkedIn',
  },
  {
    href: 'mailto:your@email.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

// Newsletter consent text (centralized for GDPR compliance)
export const NEWSLETTER_CONSENT_TEXT = {
  text: 'I agree to receive newsletter emails.',
  privacyLink: '/privacy',
  privacyText: 'Privacy Policy',
}
