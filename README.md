# create-wp-theme

CLI que gera um tema WordPress com [Underscores](https://underscores.me/) + Tailwind CSS configurado e pronto pra usar.

## Uso

```bash
npx create-wp-theme meu-tema
```

Ou instala globalmente:

```bash
npm install -g create-wp-theme
create-wp-theme meu-tema
```

Se não passar o slug, ele pergunta o nome do tema e deriva o slug automaticamente.

## Opções

```
-n, --name <name>            Nome do tema
-a, --author <author>        Autor
-u, --author-uri <uri>       URL do autor
-d, --description <desc>     Descrição
    --sass                   Incluir suporte a SCSS
    --woo                    Incluir boilerplate WooCommerce
```

## O que gera

Um `.zip` pronto pra extrair em `wp-content/themes/`. Dentro já vem o Underscores com o Tailwind configurado:

```
meu-tema/
├── package.json          (scripts dev e build)
├── tailwind.config.js
├── src/input.css
└── assets/css/           (saída compilada)
```

Depois de extrair:

```bash
cd wp-content/themes/meu-tema
npm install
npm run dev
```

## Licença

MIT
