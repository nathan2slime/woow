import { Club, Resume } from '@prisma/client';

import { authProcedure, createTRPCRouter } from '~/server/api/trpc';
import { searchSchema } from '~/schemas/search';

import { external } from '~/server/api/external';

export enum DataType {
  BOOK = 'BOOK',
  CLUB = 'CLUB',
  RESUME = 'RESUME',
}

export type Book = {
  title: string;
  publisher: string;
  authorName: string;
  description: string;
  publishYear: string;
  isbn: string;
  coverImage: string;
};

export type Data = {
  [DataType.CLUB]: Club;
  [DataType.BOOK]: Book;
  [DataType.RESUME]: Resume;
};

export type SearchData = {
  type: DataType;
  data: Data[DataType];
};

export const searchRouter = createTRPCRouter({
  general: authProcedure
    .input(searchSchema.search)
    .query(async ({ input, ctx }) => {
      console.log(input.query);
      const resumes = await ctx.db.resume.findMany({
        where: {
          OR: [
            {
              title: {
                contains: input.query,
              },
            },
            {
              content: {
                contains: input.query,
              },
            },
          ],
        },
      });

      const clubs = await ctx.db.club.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.query,
              },
            },
            {
              description: {
                contains: input.query,
              },
            },
          ],
        },
      });

      const results: SearchData[] = [];

      clubs.forEach((e) => results.push({ type: DataType.CLUB, data: e }));
      resumes.forEach((e) => results.push({ type: DataType.RESUME, data: e }));

      try {
        const { status, data } = await external.get(
          '/search.json?q='.concat(input.query),
        );
        if (status == 200) {
          const docs = data.docs as Record<string, any>[];
          docs.forEach((e) => {
            e &&
              results.push({
                type: DataType.BOOK,
                data: {
                  title: e.title,
                  publisher:
                    e.publisher && e.publisher.length > 0
                      ? e.publisher[0]
                      : e.publisher,
                  authorName:
                    e.author_name && e.author_name.length > 0
                      ? e.author_name[0]
                      : e.author_name,

                  description:
                    e.description && e.description.length > 0
                      ? e.description[0]
                      : e.description,
                  publishYear:
                    e.publish_year && e.publish_year.length > 0
                      ? e.publish_year[0]
                      : e.publish_year,
                  isbn: e.isbn && e.isbn.length > 0 ? e.isbn[0] : e.isbn,
                  coverImage:
                    e.isbn &&
                    'https://covers.openlibrary.org/b/isbn/'
                      .concat(e.isbn.length > 0 ? e.isbn[0] : '')
                      .concat('-M.jpg'),
                },
              });
          });
        }
      } catch (e) {}

      return results.sort((e) => Math.random() - 0.4);
    }),
});
