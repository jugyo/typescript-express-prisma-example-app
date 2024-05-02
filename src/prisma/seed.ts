import {
  randEmail,
  randFullName,
  randLines,
  randParagraph,
  randPassword,
  randPhrase,
  randWord,
} from '@ngneat/falso';
import { PrismaClient } from '@prisma/client';
import { RegisteredUser } from '../app/routes/auth/registered-user.model';
import { createUser } from '../app/routes/auth/auth.service';
import {
  addComment,
  createArticle,
} from '../app/routes/article/article.service';

const prisma = new PrismaClient();

export const generateUser = async (): Promise<RegisteredUser> =>
  createUser({
    username: randFullName(),
    email: randEmail(),
    password: randPassword(),
  });

export const generateArticle = async (id: number) =>
  createArticle(
    {
      title: randPhrase(),
      description: randParagraph(),
      body: randLines({ length: 10 }).join(' '),
      tagList: randWord({ length: 4 }),
    },
    id
  );

export const generateComment = async (id: number, slug: string) =>
  addComment(randParagraph(), slug, id);

const main = async () => {
  try {
    const users = [];
    for (let i = 0; i < 12; i++) {
      const user = await generateUser();
      users.push(user);
    }

    for (const user of users) {
      const articles = [];
      for (let j = 0; j < 12; j++) {
        const article = await generateArticle(user.id);
        articles.push(article);
      }

      for (const article of articles) {
        for (const userItem of users) {
          await generateComment(userItem.id, article.slug);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
