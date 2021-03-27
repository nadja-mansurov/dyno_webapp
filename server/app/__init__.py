import logging
import os
from flask import Flask, send_from_directory
from flask_appbuilder import AppBuilder, SQLA

"""
 Logging configuration
"""
logging.basicConfig(format="%(asctime)s:%(levelname)s:%(name)s:%(message)s")
logging.getLogger().setLevel(logging.DEBUG)


template_dir = os.path.abspath('../client/dist')
static_dir = os.path.abspath('../client/dist')

app = Flask(__name__, 
            template_folder=template_dir, 
            static_url_path='',
            static_folder=static_dir)

app.config.from_object("config")
db = SQLA(app)
appbuilder = AppBuilder(app, db.session, base_template='index.html')


"""
from sqlalchemy.engine import Engine
from sqlalchemy import event

#Only include this for SQLLite constraints
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    # Will force sqllite contraint foreign keys
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
"""

from . import views
from . import api 
from . import index 