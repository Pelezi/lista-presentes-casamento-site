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
# ----------------------------------------------------------------------------

echo "Removing potential existing backups..."
if [ -d "$BACKUPS_PATH" ]; then rm -Rf $BACKUPS_PATH; fi

echo "Creating a folder to handle backups"
mkdir $BACKUPS_PATH && cd $BACKUPS_PATH

echo "Removing potential existing backup file..."
if [ -f "$BACKUPS_PATH/$BACKUP_FILENAME" ]; then rm -f "$BACKUPS_PATH/$BACKUP_FILENAME"; fi

echo "Backuping remote render db..."
pg_dump -d $RENDER_PG_EXTERNAL_CONNECTION_STRING/$DB_NAME > ${BACKUP_FILENAME}

echo "Dropping local db..."
dropdb --username=postgres $DB_NAME

echo "Recreating local db..."
createdb --owner=postgres --username=postgres $DB_NAME

echo "Restoring local db from backup..."
psql -d $DB_NAME -f $BACKUPS_PATH/$BACKUP_FILENAME --username=postgres