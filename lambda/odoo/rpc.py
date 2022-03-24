import os


def get_model(proxy, obj_table, filter, fields):
    return proxy.execute_kw(
        os.getenv("DB"),
        int(os.getenv("UID")),
        os.getenv("PWD"),
        obj_table,
        "search_read",
        filter,
        {"fields": fields, "context": {"lang": "es_PE"}},
    )
