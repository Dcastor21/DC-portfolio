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
      name: 'devicon',
      title: 'Devicon slug',
      description: 'Optional Devicon slug used for the portfolio icon, e.g. react or nextjs.',
      type: 'string',
    },
    {
      name: 'iconStyle',
      title: 'Icon style',
      description: 'Choose whether the Devicon uses its brand color or a neutral color.',
      type: 'string',
      options: {
        list: [
          {title: 'Color', value: 'color'},
          {title: 'Monochrome', value: 'monochrome'},
        ],
        layout: 'radio',
      },
      initialValue: 'monochrome',
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