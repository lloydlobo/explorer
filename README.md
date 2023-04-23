# Explorer

Explore the world with this Next.js, Jotai, and React app.
Browse and search through a list of countries, filter by region,
and view detailed information about each country, including its flag,
population and languages.

Discover bordering countries and navigate between detailed information pages
with ease.

<!--
"Explore the world with ease: a simple and intuitive way to browse
and learn about countries, their regions, and bordering nations." -->

## Table Of Contents

<!--toc:start-->

- [Explorer](#explorer)
  - [Table Of Contents](#table-of-contents)
  - [Usage](#usage)
    - [Features](#features)
      - [Viewing the Country List](#viewing-the-country-list)
      - [Filtering by Region](#filtering-by-region)
      - [Selecting a Country](#selecting-a-country)
      - [Viewing Bordering Countries](#viewing-bordering-countries)
  - [Technologies](#technologies)
  - [Folder Structure](#folder-structure)
  - [Similar Projects](#similar-projects)
  - [License](#license)
  <!--toc:end-->

## Usage

1. Clone this repository to your local machine: `git clone https://github.com/lloydlobo/explorer.git`
2. Navigate to the project directory: `cd repo-name`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Features

- Displays a list of countries with basic information such as name and flag.
- Allows the user to filter countries by region.
- Allows the user to select one or more countries and displays their names.
- Displays the border countries of a selected country.

When the app is running, you can use the following features:

#### Viewing the Country List

The home page of the app displays a list of all countries. You can browse through the list and click on a country to view more information about it.

#### Filtering by Region

You can filter the list of countries by region using the dropdown menu at the top of the page. Simply select a region from the menu and the list of countries will update to show only the countries in that region.

#### Selecting a Country

To view more detailed information about a country, click on its name in the list. This will take you to a new page with more information about the country, including its flag, population, and languages.

#### Viewing Bordering Countries

When you are viewing detailed information about a country, you can see a list of its bordering countries by scrolling down to the "Border Countries" section. Clicking on one of these countries will take you to its own detailed information page.

## Technologies

- [Next.js](https://nextjs.org/) — A React framework for building server-side rendered and statically generated web applications.
- [Jotai](https://github.com/pmndrs/jotai) — A simple state management library for React.
- [Tailwind CSS](https://tailwindcss.com/) — A utility-first CSS framework for rapidly building custom user interfaces.

## Folder Structure

- `components` — React components that make up the UI.
- `lib` — Utility functions and Jotai store for state management.
- `pages` — Next.js pages that represent routes.
- `public` — Static files that are served by Next.js.
- `styles` — Global styles and Tailwind CSS configuration.

## development

### Testing

#### Playwright Codegen

Interact and copy the e2e code generated. Use it in `tests` folder.

```shell
pnpx playwright codegen localhost:3000
```

## Similar Projects

- [Countries Of The World](https://countries.petethompson.net/)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
