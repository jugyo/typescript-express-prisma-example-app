import { execSync } from 'child_process';

export default async () => {
  if (process.env.NODE_ENV === 'test') {
    try {
      console.log('Prisma is resetting the test database...');
      execSync('npx prisma migrate reset --force --skip-seed', {
        stdio: 'inherit',
      });
      console.log('Test database has been reset.');
    } catch (error) {
      console.error('Failed to reset the test database:', error);
      process.exit(1);
    }
  }
};
