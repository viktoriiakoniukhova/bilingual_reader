class DBRouter(object):
    """
    A router to control all database operations on models in the
    user application.
    """
    def db_for_read(self, model, **hints):
        """
        Attempts to read user models go to users_db.
        """
        if model._meta.db_table_comment == 'documents':
            return 'documents'
        return "default"

    def db_for_write(self, model, **hints):
        """
        Attempts to write user models go to users_db.
        """
        if model._meta.db_table_comment == 'documents':
            return 'documents'
        return "default"

    def allow_migrate(self, db, db_table_comment, model_name=None, **hints):
        """
        Make sure the auth app only appears in the 'users_db'
        database.
        """
        if db_table_comment == 'documents':
            return db == 'documents'
        return db == 'default'

