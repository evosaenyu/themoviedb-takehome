## Movie list!

This webapp gets movies from themoviedb.org and presents them in a simple way.
I believe the movie posters provide most of the colors to the website, so I kept it relatively muted.

I used the following command to bootstrap this project:

`npx create-react-app my-app --template typescript`

## Setup
- `cd my-app && cp .env.template .env.local`
- Get your themoviedb.org API key and set it in your `.env.local` file.
- `npm install`
- `npm start`
should run on localhost:3000

## Test
I added some really basic unit tests, using dummy data, for the Movie card, grid, and filter section. You can test with:
- `npm test`

## Future considerations
- I think a search bar, powered by something like meilisearch, would be very nice to have, maybe even an AI-powered one to help find a title based on its synopsis (overview as the api calls it).
- Clicking a movie card should take us somewhere, probably another page on this website that would contain further details like actors, budget, links to streaming/renting sites. Since themoviedb already gives us ids for these movies, we can just use that for fetching such details.
- Maybe with an auth layer, we could let users save movie lists and share them with friends. They can also rate movies for themselves, have that saved to a db of our own.

-- Chris Oh
GitHub: @evosaenyu
