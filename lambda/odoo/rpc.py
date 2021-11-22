import os


def get_model(proxy, obj_table, filter, fields):
    return proxy.execute_kw(
        os.environ["DB"],
        int(os.environ["UID"]),
        os.environ["PWD"],
        obj_table,
        "search_read",
        filter,
        {"fields": fields, "context": {"lang": "es_PE"}},
    )
