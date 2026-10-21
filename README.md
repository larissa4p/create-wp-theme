# create-wp-theme

CLI that scaffolds a WordPress theme with [Underscores](https://underscores.me/) + Tailwind CSS, configured and ready to use.

## Usage

```bash
npx create-wp-theme my-theme
```

Or install globally:

```bash
npm install -g create-wp-theme
create-wp-theme my-theme
```

If no slug is provided, the CLI prompts for a theme name and derives the slug automatically.

## Options

```
-n, --name <name>            Theme name
-a, --author <author>        Author name
-u, --author-uri <uri>       Author URL
-d, --description <desc>     Theme description
    --sass                   Include SCSS support
    --woo                    Include WooCommerce boilerplate
```

## What it generates

A `.zip` file ready to extract into `wp-content/themes/`. It includes Underscores with Tailwind CSS pre-configured:

```
my-theme/
├── package.json          (dev and build scripts)
├── tailwind.config.js
├── src/input.css
└── assets/css/           (compiled output)
```

After extracting:

```bash
cd wp-content/themes/my-theme
npm install
npm run dev
```

## License

MIT
