#!/usr/bin/env python3
"""
Simple local-network static file server.
Serves the contents of the directory this script resides in over HTTP
on the local network at specified port (default: 8000).
"""
import argparse
import os
import socket
from http.server import HTTPServer, SimpleHTTPRequestHandler


def get_local_ip():
    # Determine the local IP address by making a dummy connection
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # connect to an external host; doesn't actually send data
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


def serve(directory, host, port):
    os.chdir(directory)
    handler = SimpleHTTPRequestHandler
    server = HTTPServer((host, port), handler)
    print(f"Serving HTTP on {host}:{port}")
    print(f"Visit: http://{host}:{port}/ in your browser")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        server.server_close()


def main():
    parser = argparse.ArgumentParser(
        description="Serve current directory over HTTP on the local network."
    )
    parser.add_argument(
        "-p", "--port", type=int, default=8000,
        help="Port number to listen on (default: 8000)"
    )
    args = parser.parse_args()

    directory = os.path.abspath(os.path.dirname(__file__))
    host = '0.0.0.0'  # bind to all interfaces
    local_ip = get_local_ip()
    print(f"Serving files from: {directory}")
    print(f"Local network address: http://{local_ip}:{args.port}/")
    serve(directory, host, args.port)


if __name__ == '__main__':
    main()
