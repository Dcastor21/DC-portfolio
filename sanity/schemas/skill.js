export default {
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      description: 'Title of skill',
      type: 'string',
    },
    {
      // NEW — groups skills into the resume's "Languages / AI & ML / Cloud &
      // DevOps / Databases / Frontend / Backend" lines. The portfolio's
      // progress-bar view can ignore this field entirely.
      name: 'category',
      title: 'Resume category',
      type: 'string',
      options: {
        list: [
          {title: 'Languages', value: 'Languages'},
          {title: 'AI/ML', value: 'AI/ML'},
          {title: 'Cloud & DevOps', value: 'Cloud & DevOps'},
          {title: 'Databases', value: 'Databases'},
          {title: 'Frontend', value: 'Frontend'},
          {title: 'Backend', value: 'Backend'},
        ],
      },
    },
    {
      name: 'progress',
      title: 'Progress',
      type: 'number',
      description: 'Progress of skill from 0 to 100%. Used only by the portfolio progress bars.',
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'image',
      title: 'Image',
      description: 'Used only by the portfolio progress bars.',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}