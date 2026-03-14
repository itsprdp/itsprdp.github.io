## pradeepg.me

Personal site hosted on [GitHub Pages](https://pages.github.com). Built with Jekyll via the `github-pages` gem.

## Setup

```bash
bundle install
cp .env.example .env  # add your JEKYLL_GITHUB_TOKEN (token: [manjaro-linux-jekyll-local-dot-env](https://github.com/settings/personal-access-tokens/12405308))
```

## Usage

```bash
make serve  # local dev at http://localhost:4000
make build  # production build to _site/
make clean  # remove _site/
```

## Deploy

Push to `master` — GitHub Pages builds and deploys automatically.
