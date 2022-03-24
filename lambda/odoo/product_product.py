from odoo.rpc import get_model
from functools import reduce


def get_product_product(proxy, pp_id):
    # pp = product.product
    pp_table = "product.product"
    pp_filter = [[["id", "=", pp_id]]]
    pp_fields = [
        "barcode",
        "name",
        "description",
        "default_code",
        "categ_id",
        "lst_price",
        "product_template_attribute_value_ids",
        "product_tmpl_id",
    ]
    # GET PRODUCTS WITH FILTERED PRODUCT IDS
    products = get_model(proxy, pp_table, pp_filter, pp_fields)

    # FILTER ATTRIBUTE VALUE IDS
    # [[12,23], [232,23]]
    attribute_value_ids = list(
        map(lambda e: e["product_template_attribute_value_ids"], products)
    )
    # [12,23,232,23]
    attribute_value_ids = reduce(list.__add__, attribute_value_ids)
    # [12,23,232]
    attribute_value_ids = list(set(attribute_value_ids))

    # ptav = product.template.attribute.value
    ptav_table = "product.template.attribute.value"
    ptav_filter = [[["id", "in", attribute_value_ids]]]
    ptav_fields = ["display_name"]
    attribute_values = get_model(proxy, ptav_table, ptav_filter, ptav_fields)

    # CREATE LIST LABEL DICT
    labels = []

    attribute = list(
        filter(
            lambda e: e["id"] in products[0]["product_template_attribute_value_ids"],
            attribute_values,
        )
    )
    labels.append(
        {
            "quantity": 1,  # DEFAULT QTY
            "code": products[0]["barcode"],
            "desc": products[0]["name"],
            "mCode": products[0]["default_code"],
            "cats": products[0]["categ_id"][1],
            "price": products[0]["lst_price"],
            "attr": list(map(lambda e: e["display_name"], attribute)),
        }
    )

    return {
        "statusCode": 200,
        "allLabels": "ALL",
        "body": labels,
    }
