export default {
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Certification name',
      type: 'string',
      description: "Exactly as the issuer names it, e.g. 'AWS Certified Cloud Practitioner'",
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'issuer',
      title: 'Issuing organization',
      type: 'string',
      description: "e.g. 'Amazon Web Services', 'DataCamp'",
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'badgeImage',
      title: 'Badge image',
      type: 'image',
      description: 'Upload the badge PNG. Transparent background at 340x340 or larger works best.',
      options: {
        hotspot: false,
      },
    },
    {
      name: 'badgeImageUrl',
      title: 'Badge image URL',
      type: 'url',
      description:
        'Alternative to uploading: paste the issuer-hosted image URL (e.g. https://images.credly.com/size/340x340/images/<id>/image.png). Remember to allow the host in next.config.js.',
    },
    {
      name: 'verifyUrl',
      title: 'Verification URL',
      type: 'url',
      description:
        'Public link that proves the credential — the Credly badge page, Microsoft Learn transcript, Coursera certificate, etc. This is what makes the badge worth showing.',
      validation: (Rule) => Rule.required().uri({scheme: ['https']}),
    },
    {
      name: 'credentialId',
      title: 'Credential ID',
      type: 'string',
      description: 'Optional. Shown on the resume, linked to the verification URL if set.',
    },
    {
      name: 'dateIssued',
      title: 'Date issued',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'dateExpires',
      title: 'Expiry date',
      type: 'date',
      description:
        "Leave blank if the credential does not expire — the resume shows 'Expiry Date: N/A' in that case.",
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    },
    {
      // NEW — e.g. "Complete all solution building assignments aligned to
      // the Cloud Practitioner role within AWS."
      name: 'points',
      title: 'Points',
      description: 'Optional bullet(s) describing what the credential covers, shown on the resume.',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Featured certifications sort first.',
      initialValue: false,
    },
    {
      name: 'skills',
      title: 'Related skills',
      type: 'array',
      description: 'Optional. Shown as small pills beneath the badge (first three).',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'dateIssuedDesc',
      by: [{field: 'dateIssued', direction: 'desc'}],
    },
  ],

  preview: {
    select: {title: 'title', subtitle: 'issuer', media: 'badgeImage'},
  },
}