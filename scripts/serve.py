import functools
import http.server

ROOT = "/Users/galakors/Desktop/CLAUDE/GALAKORS_PF"
PORT = 8743

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Serving {ROOT} at http://127.0.0.1:{PORT}")
    httpd.serve_forever()
