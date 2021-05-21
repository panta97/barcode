import os
from xmlrpc import client as xmlrpclib


def get_env():
    return {
        "url": os.environ['URL'],
        "db": os.environ['DB'],
        "pwd": os.environ['PWD'],
        "uid": int(os.environ['UID']),
    }


def get_model(env, obj_table, filter, fields):
    modelrpc = xmlrpclib.ServerProxy(
        '{}/xmlrpc/2/object'.format(env.get('url')))
    return modelrpc.execute_kw(env.get('db'), env.get('uid'), env.get('pwd'),
                               obj_table, 'search_read', filter, {'fields': fields, 'context': {'lang': 'es_PE'}})
