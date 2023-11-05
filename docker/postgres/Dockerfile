FROM postgres:9.6

COPY ./scripts/*.sh /docker-entrypoint-initdb.d/
COPY ./sql/**/*.sql /docker-entrypoint-initdb.d/dump/

CMD ["postgres"]