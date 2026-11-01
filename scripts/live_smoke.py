"""Exercise the actual hosted Independent Preview without altering user data."""
import re
import sys
import time
import urllib.request

ROOT = "https://anaglyph-friends-independent.onrender.com"


def fetch(path, timeout=30, maximum=4_000_000):
    request = urllib.request.Request(ROOT + path, headers={"User-Agent": "AAF-independent-CI-smoke/1"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        assert response.status == 200, (path, response.status)
        return response.read(maximum)


def main():
    for attempt in range(24):
        try:
            if b"ok" in fetch("/healthz", 20, 256).lower():
                break
        except Exception as error:
            print("Waiting for hosted service:", type(error).__name__, str(error)[:120], flush=True)
        time.sleep(10)
    else:
        sys.exit("Hosted service did not become healthy")
    html = fetch("/")
    assert b"<html" in html.lower() and b"Anaglyph" in html
    assets = re.findall(rb'(?:src|href)="(/assets/[^"]+)"', html)
    assert assets, "No built Vite assets referenced"
    for path in assets[:8]:
        assert len(fetch(path.decode())) > 100, path
    assert fetch("/source", maximum=8).startswith(b"PK"), "AGPL source ZIP not available"
    print("Hosted health, React shell, assets and source distribution verified")


if __name__ == "__main__":
    main()
