"""Run the integrated Independent Edition (build frontend first)."""
import os
from production import app
if __name__ == '__main__':
    app.run(host=os.getenv('FLASK_HOST', '127.0.0.1'), port=int(os.getenv('PORT','8010')), threaded=True)
