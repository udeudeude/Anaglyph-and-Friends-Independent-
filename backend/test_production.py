"""Exercise the deployed production entrypoint, not only development Flask routes."""
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import production


def main():
    client = production.app.test_client()
    health = client.get("/healthz")
    assert health.status_code == 200, health.status_code
    with TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "index.html").write_text("<!doctype html><title>Independent Studio</title>")
        (root / "assets").mkdir()
        (root / "assets" / "main.js").write_text("console.log('independent');")
        with patch.object(production, "FRONTEND_DIST", str(root)):
            home = client.get("/")
            assert home.status_code == 200 and b"Independent Studio" in home.data
            asset = client.get("/assets/main.js")
            assert asset.status_code == 200 and b"independent" in asset.data
            route = client.get("/studio/phantogram")
            assert route.status_code == 200 and b"Independent Studio" in route.data
    with TemporaryDirectory() as directory:
        archive = Path(directory) / "source.zip"
        archive.write_bytes(b"source-archive-fixture")
        with patch.dict("os.environ", {"AAF_SOURCE_ARCHIVE": str(archive)}):
            source = client.get("/source")
            assert source.status_code == 200
            assert source.data == b"source-archive-fixture"
    print("Production frontend, SPA navigation, assets, health and source distribution passed")


if __name__ == "__main__":
    main()
