// Run before 'pnpm build', copy env.production.${APP_ENV} to .env.production.
// So that we can specify staging and production settings.

import fs from 'fs/promises';
const source = {
  staging: 'staging.env',
  production: 'prod.env',
}[process.env.APP_ENV];

const dest = '.env.production';
console.log('Current env', process.env);

console.log(`Copy .env file "${source}" to "${dest}"`);
await fs.copyFile(source, dest);
await fs.writeFile(dest, '\nDATABASE_URL=' + process.env.DATABASE_URL, {
  flag: 'a',
});
