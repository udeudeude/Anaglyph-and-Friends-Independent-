"""Serve the built application for browser QA with browser AI enabled."""
import os, sys
from pathlib import Path
root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / 'backend'))
os.environ.setdefault('AAF_BROWSER_DEPTH', 'true')
from production import app
app.run(host='0.0.0.0', port=int(os.getenv('PORT', '3000')), threaded=True)
