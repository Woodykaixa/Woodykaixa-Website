import moment from 'moment';

export const SearchTags = ['since', 'until', 'tags'] as const;

export type SearchTagType = typeof SearchTags[number];

export type SearchTagDescriptor = {
  usage: string;
  description: string;
  validator: (input: string) => boolean;
  examples: string[];
};

export const SearchTagDescriptors: Record<SearchTagType, SearchTagDescriptor> = {
  since: {
    description: '搜索指定日期及以后发布的文章',
    usage: '@since([Date])',
    validator(input) {
      const c = /@since\((\d{4}-\d{1,2}-\d{1,2})\)/.exec(input);

      if (!c) {
        return false;
      }
      return moment(c[1]).isValid();
    },
    examples: ['@since(2022-01-01)'],
  },
  until: {
    description: '搜索指定日期及以前发布的文章',
    usage: '@until([Date])',
    validator(input) {
      const c = /@until\((\d{4}-\d{1,2}-\d{1,2})\)/.exec(input);

      if (!c) {
        return false;
      }
      return moment(c[1]).isValid();
    },
    examples: ['@until(2022-01-01)'],
  },
  tags: {
    description: '搜索包含指定标签的文章',
    usage: '@tags([TagList])',
    validator: input => /@tags\((.+,)*(.+)\)/.test(input),
    examples: ['@tags(react,typescript)', '@tags(next.js)'],
  },
};
