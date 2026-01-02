# Guide

## Migrations
1. Apply changes to the models in com.unihub.app.models
2. In the terminal, go into /api if not in /api and run `./mvnw clean install liquibase:diff -DskipTests=true
`
3. Rename the generated file to changelog-[version+1].yaml
4. Add it to the master changelog
5. Rerun the application
6. If there are any errors, wipe data if necessary

## Containerization

After making changes to the codebase, in terminal:
1. `./mvnw clean package -DskipTests`
2. `docker buildx build --platform linux/amd64 -t anikdey/unihub-api:latest .`
3. `docker run --env-file .env -p 8081:8081 unihub-backend`

https://hub.docker.com/repository/docker/anikdey/unihub-api/general

To push to DockerHub, in terminal:
1. `docker login`
2. `docker tag anikdey/unihub-api:latest anikdey/unihub-api:latest`
3. `docker push anikdey/unihub-api:latest`