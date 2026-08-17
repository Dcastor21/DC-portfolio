export default {
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    {
      name: 'school',
      title: 'School',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'degree',
      title: 'Degree',
      description: "e.g. 'Bachelor's, Computer Science', 'AI Business Solutions Engineer'",
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location',
      description: "e.g. 'Morrow, GA'",
      type: 'string',
    },
    {
      name: 'dateStarted',
      title: 'Date started',
      description: 'Optional — not currently shown on the resume, kept for future use.',
      type: 'date',
    },
    {
      name: 'dateEnded',
      title: 'Date ended',
      description: 'Optional — not currently shown on the resume, kept for future use.',
      type: 'date',
    },
    {
      name: 'points',
      title: 'Points',
      description: 'Optional bullets (honors, coursework, GPA). Not currently used on the resume.',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers show first. Dates are unreliable here, so ordering is manual.',
      type: 'number',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'school', subtitle: 'degree'},
  },
}