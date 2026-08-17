export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      description: 'Title of the project',
      type: 'string',
    },
    {
      // NEW — e.g. "Developer". Shown next to the title on the resume.
      name: 'role',
      title: 'Your role',
      description: "e.g. 'Developer', 'Lead Engineer'. Optional.",
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      description: 'Used on the portfolio project card. Not shown on the resume.',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'summary',
      title: 'Summary',
      description: 'Single-paragraph summary for the portfolio card.',
      type: 'text',
    },
    {
      // NEW — the resume shows bullets, not a paragraph.
      name: 'points',
      title: 'Points',
      description: 'Bullet points for the resume "Projects & Outside Experience" section.',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      // NEW
      name: 'dateStarted',
      title: 'Date started',
      type: 'date',
    },
    {
      // NEW
      name: 'dateEnded',
      title: 'Date ended',
      description: 'Leave blank if isOngoing is checked.',
      type: 'date',
    },
    {
      // NEW
      name: 'isOngoing',
      title: 'Ongoing',
      description: "Shows 'Present' instead of an end date.",
      type: 'boolean',
      initialValue: false,
    },
    {
      // NEW — dates alone don't reliably reproduce the resume's intended order.
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers show first on the resume.',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'reference', to: {type: 'skill'}}],
    },
    {
      name: 'linkToBuild',
      title: 'LinkToBuild',
      type: 'url',
    },
  ],
}