#!/bin/bash
set -e

echo 'Create db Log'

psql --username $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE log;"