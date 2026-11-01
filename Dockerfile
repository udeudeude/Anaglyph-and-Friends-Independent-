FROM node:22-bookworm-slim AS frontend
WORKDIR /src/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_FLASK_BACKEND_API_URL=.
RUN npm run build

FROM python:3.11-slim AS source
WORKDIR /source
COPY . .
RUN python scripts/package_source.py /source/application-source.zip

FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements-hosted.txt /app/backend/requirements-hosted.txt
RUN pip install --no-cache-dir -r backend/requirements-hosted.txt
COPY backend/ /app/backend/
COPY --from=frontend /src/frontend/dist /app/frontend/dist
COPY LICENSE THIRD-PARTY-NOTICES.md /app/
COPY --from=source /source/application-source.zip /app/application-source.zip
ENV AAF_BROWSER_DEPTH=true FLASK_HOST=0.0.0.0 PORT=10000
EXPOSE 10000
CMD ["sh", "-c", "exec gunicorn --chdir backend --bind 0.0.0.0:${PORT:-10000} --workers 1 --threads 2 --timeout 300 production:app"]
