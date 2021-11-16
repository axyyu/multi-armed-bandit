# Multi-Armed Bandit Project

This is the website/server for the multi-armed bandit game.

## Getting Started

#### Server

Install dependencies

```
pip3 install -r requirements.txt
```

Run server

```
python3 main.py
```

#### Website

Install dependencies

```
cd website
npm install
```

Start the website

```
cd website
npm start
```

The development website should be hosted at `http://localhost:3000`.

#### Deployment

Build website

```
cd website
npm run build
```

The website should now be shown at `http://localhost:8080`.

Deploy to Google

```
gcloud app deploy
```
