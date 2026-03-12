# Italian Irregular Verbs Learning App

A free, no-login website for learning Italian irregular verbs through interactive games.

## Features

- **Easy mode**: match the six Italian pronouns to the correct conjugations, then answer a multiple-choice meaning question.
- **Hard mode**: type the correct conjugation given an English prompt and pronoun.
- **Session-only score**: scoring is tracked in-memory and resets on page refresh.
- **No backend required for gameplay**: the app loads verb data from `public/data/verbs.json`.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Verb data

Edit `public/data/verbs.json` to add or modify verbs.
