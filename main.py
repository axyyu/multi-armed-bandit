from server import create_app

app = create_app()
app.app_context().push()

if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
