import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import * as readline from 'readline';

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const packageJson = (slug) => JSON.stringify({
  name: slug,
  version: '1.0.0',
  scripts: {
    dev: 'tailwindcss -i ./src/input.css -o ./assets/css/style.css --watch',
    build: 'tailwindcss -i ./src/input.css -o ./assets/css/style.css --minify',
  },
  devDependencies: {
    tailwindcss: '^3.4.0',
  },
}, null, 2);

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.php',
    './src/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

const inputCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

export async function createTheme(slugArg, options) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log(chalk.bold('\n✦ create-wp-theme\n'));

  const name = options.name ?? await ask(rl, 'Nome do tema: ');
  const slug = slugArg || toSlug(name);
  const author = options.author ?? await ask(rl, 'Autor: ');
  const authorUri = options.authorUri ?? await ask(rl, 'URL do autor (opcional): ');
  const description = options.description ?? await ask(rl, 'Descrição (opcional): ');

  rl.close();

  const outputZip = resolve(process.cwd(), `${slug}.zip`);

  if (existsSync(outputZip)) {
    console.error(chalk.red(`\nArquivo "${slug}.zip" já existe. Remova-o ou escolha outro slug.\n`));
    process.exit(1);
  }

  // Download do Underscores
  const spinner = ora('Baixando Underscores...').start();

  const params = new URLSearchParams({
    underscoresme_generate: '1',
    underscoresme_name: name,
    underscoresme_slug: slug,
    underscoresme_author: author,
    underscoresme_author_uri: authorUri,
    underscoresme_description: description,
    ...(options.sass ? { underscoresme_sass: '1' } : {}),
    ...(options.woo ? { underscoresme_woocommerce: '1' } : {}),
  });

  let zipBuffer;
  try {
    const res = await fetch('https://underscores.me/', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('zip')) {
      throw new Error('Resposta inesperada do underscores.me — pode estar fora do ar.');
    }

    zipBuffer = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    spinner.fail('Falhou ao baixar o Underscores.');
    console.error(chalk.red(err.message));
    process.exit(1);
  }

  // Adiciona arquivos do Tailwind no zip
  spinner.text = 'Adicionando Tailwind...';

  const zip = new AdmZip(zipBuffer);
  zip.addFile(`${slug}/package.json`, Buffer.from(packageJson(slug)));
  zip.addFile(`${slug}/tailwind.config.js`, Buffer.from(tailwindConfig));
  zip.addFile(`${slug}/src/input.css`, Buffer.from(inputCss));
  zip.addFile(`${slug}/assets/css/.gitkeep`, Buffer.from(''));

  writeFileSync(outputZip, zip.toBuffer());

  spinner.succeed(chalk.green(`${slug}.zip criado.`));

  console.log(`
${chalk.bold('Próximos passos:')}

  Extraia o zip em wp-content/themes/
  cd wp-content/themes/${slug}
  npm install
  npm run dev     ${chalk.dim('# watch — compila o CSS automaticamente')}
  npm run build   ${chalk.dim('# build final minificado')}
`);
}
