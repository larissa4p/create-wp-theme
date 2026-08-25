#!/usr/bin/env node
import { program } from 'commander';
import { createTheme } from '../src/create-theme.js';

program
  .name('create-wp-theme')
  .description('Gera um tema WordPress com Underscores + Tailwind CSS')
  .argument('[slug]', 'Slug do tema (ex: meu-tema)')
  .option('-n, --name <name>', 'Nome do tema')
  .option('-a, --author <author>', 'Nome do autor')
  .option('-u, --author-uri <uri>', 'URL do autor')
  .option('-d, --description <description>', 'Descrição do tema')
  .option('--sass', 'Incluir suporte a SCSS')
  .option('--woo', 'Incluir boilerplate WooCommerce')
  .action(createTheme);

program.parse();
