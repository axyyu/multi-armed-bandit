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
python3 app.py
```

Initialize database

```
flask db init
```

Create database migrations

```
flask db migrate -m "Migration Name"
```

Apply database migrations

```
flask db upgrade
```

#### Database

Uncomment the appropriate database URI line in `server/__init__.py`.

SQL Instance: `multi-armed-bandit`
Password: `multi-armed-bandit-uva-hongning`

User: `admin`
Password: `multi-armed-bandit-uva-hongning`
Database name: `mab`

Create proxy

```
./cloud_sql_proxy -instances=modern-tangent-218303:us-east4:multi-armed-bandit=tcp:3306
```

Connect to database through CLI (not required)

```
mysql -u admin --password=multi-armed-bandit-uva-hongning --host 127.0.0.1 mab
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
