import http.server
import socketserver
import json
import subprocess
import os
import sys
import webbrowser
from urllib.parse import urlparse

PORT = 5050
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")
BINARY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "MyString.exe")

class MyStringHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {
                "status": "ready",
                "binaryExists": os.path.exists(BINARY_PATH),
                "platform": sys.platform
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
            return

        # Default static file handling
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/run":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            
            try:
                data = json.loads(body) if body else {}
                s1 = data.get("s1", "Hello")
                s2 = data.get("s2", "World")
                
                # Make sure binary exists, recompile if needed
                if not os.path.exists(BINARY_PATH):
                    compile_proc = subprocess.run(
                        ["g++", "-Wall", "-Wextra", "Main.cpp", "MyString.cpp", "-o", "MyString.exe"],
                        cwd=os.path.dirname(os.path.abspath(__file__)),
                        capture_output=True,
                        text=True
                    )
                    if compile_proc.returncode != 0:
                        self.send_response(500)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            "success": False,
                            "error": f"Compilation failed:\n{compile_proc.stderr}"
                        }).encode("utf-8"))
                        return

                # Execute binary with inputs
                input_data = f"{s1}\n{s2}\n"
                proc = subprocess.run(
                    [BINARY_PATH],
                    input=input_data,
                    cwd=os.path.dirname(os.path.abspath(__file__)),
                    capture_output=True,
                    text=True,
                    timeout=5
                )

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "output": proc.stdout,
                    "stderr": proc.stderr,
                    "returncode": proc.returncode
                }).encode("utf-8"))

            except subprocess.TimeoutExpired:
                self.send_response(504)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": False,
                    "error": "Process execution timed out."
                }).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": False,
                    "error": str(e)
                }).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

def run_server():
    sys.stdout.reconfigure(line_buffering=True)
    server_address = ("127.0.0.1", PORT)
    with ThreadingServer(server_address, MyStringHandler) as httpd:
        print(f"======================================================", flush=True)
        print(f" MyString Studio Server running at http://127.0.0.1:{PORT}", flush=True)
        print(f" Serving UI from: {FRONTEND_DIR}", flush=True)
        print(f" C++ Binary: {BINARY_PATH}", flush=True)
        print(f" Press Ctrl+C to stop.", flush=True)
        print(f"======================================================", flush=True)
        if "--open" in sys.argv:
            webbrowser.open(f"http://127.0.0.1:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
