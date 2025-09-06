# Guide

## Migrations
1. Apply changes to the models in com.unihub.app.models
2. In the terminal, go into /api if not in /api and run `./mvnw clean install liquibase:diff -DskipTests=true
`
3. Rename the generated file to changelog-[version+1].yaml
4. Add it to the master changelog
5. Rerun the application
6. If there are any errors, wipe data if necessary