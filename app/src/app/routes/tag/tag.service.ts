import prisma from '../../../../prisma/prisma-client';
import { Tag } from './tag.model';

// MODIFICATION ICI : On utilise "export const" au lieu de juste "const"
export const getTags = async (id?: number): Promise<string[]> => {
  const queries = [];
  queries.push({ demo: true });

  if (id) {
    queries.push({
      id: {
        equals: id,
      },
    });
  }

  const tags = await prisma.tag.findMany({
    where: {
      articles: {
        some: {
          author: {
            OR: queries,
          },
        },
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  return tags.map((tag: Tag) => tag.name);
};

// SUPPRESSION DE LA LIGNE : export default getTags;