export default {
  name: 'pageInfo',
  title: 'PageInfo',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
    },
    {
      name: 'heroImage',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'backgroundInformation',
      title: 'BackgroundInformation',
      // Changed from 'string' to 'text' — this now doubles as the resume's
      // Professional Summary paragraph, which runs several sentences.
      // 'string' renders as a single-line input in Studio; 'text' gives a
      // proper multi-line box. Same underlying string type on the wire, so
      // nothing else (About.tsx, typings) needs to change.
      type: 'text',
    },
    {
      // NEW — the 2-4 bullets under the Professional Summary paragraph.
      name: 'summaryHighlights',
      title: 'Summary highlights',
      description: 'Bullet points shown under the professional summary paragraph on the resume.',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'profilePic',
      title: 'ProfilePic',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'phoneNumber',
      title: 'PhoneNumber',
      description: 'Not currently shown on the resume header — kept for the portfolio contact form.',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      description: 'Not currently shown on the resume header — kept for the portfolio contact form.',
      type: 'string',
    },
    {
      name: 'socials',
      title: 'Socials',
      description:
        "Also drives the resume's contact line. Add a 'Website' entry pointing at dcastor.dev to show it there.",
      type: 'array',
      of: [{type: 'reference', to: {type: 'social'}}],
    },
  ],
}