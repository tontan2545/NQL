#!/bin/bash
set -e

echo 'Create db Pagila'
psql --username $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE pagila;"
echo 'Importing data into db pagila'
psql --username $POSTGRES_USER -d pagila < /docker-entrypoint-initdb.d/dump/pagila-schema.sql
echo 'Importing schema finished successfully'
psql --username $POSTGRES_USER -d pagila < /docker-entrypoint-initdb.d/dump/pagila-insert-data.sql
echo 'Importing insert-data finished successfully'
psql --username $POSTGRES_USER -d pagila < /docker-entrypoint-initdb.d/dump/pagila-data.sql
echo 'Importing data finished successfully'

echo 'Data import finished successfully'