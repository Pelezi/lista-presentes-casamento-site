#!/bin/sh
set -e

# Config ---------------------------------------------------------------------
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_NAME=lista_presentes_casamento
DB_USER=postgres
BACKUPS_PATH=backups
BACKUP_FILENAME=$DB_NAME.sql
JSON_BACKUP_FILENAME=$DB_NAME.json
# ----------------------------------------------------------------------------

echo "Removing potential existing backups..."
if [ -d "$BACKUPS_PATH" ]; then rm -Rf $BACKUPS_PATH; fi

echo "Creating a folder to handle backups"
mkdir $BACKUPS_PATH && cd $BACKUPS_PATH

echo "Removing potential existing backup file..."
if [ -f "$BACKUPS_PATH/$BACKUP_FILENAME" ]; then rm -f "$BACKUPS_PATH/$BACKUP_FILENAME"; fi

echo "Backuping remote render db..."
pg_dump -d $RENDER_PG_EXTERNAL_CONNECTION_STRING/$DB_NAME > ${BACKUP_FILENAME}

echo "Exporting database as JSON..."
psql -d $RENDER_PG_EXTERNAL_CONNECTION_STRING/$DB_NAME -c "COPY (SELECT row_to_json(t) FROM (SELECT * FROM gift ORDER BY value asc) t) TO STDOUT;" > $JSON_BACKUP_FILENAME

echo "Dropping local db..."
dropdb --username=postgres $DB_NAME

echo "Recreating local db..."
createdb --owner=postgres --username=postgres $DB_NAME

echo "Restoring local db from backup..."
psql -d $DB_NAME -f $BACKUP_FILENAME --username=postgres