from odoo.rpc import get_model
from functools import reduce


def get_product_template(proxy, pt_id):
    # pp = product.product
    pp_table = "product.product"
    pp_filter = [[["product_tmpl_id", "=", pt_id]]]
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
    template_attribute_values = get_model(proxy, ptav_table, ptav_filter, ptav_fields)

    # CREATE LIST LABEL DICT
    labels = []

    for product in products:
        pass
        attribute = list(
            filter(
                lambda e: e["id"] in product["product_template_attribute_value_ids"],
                template_attribute_values,
            )
        )
        labels.append(
            {
                "quantity": 1,  # DEFAULT QTY
                "code": product["barcode"],
                "desc": product["name"],
                "mCode": product["default_code"],
                "cats": product["categ_id"][1],
                "price": product["lst_price"],
                "attr": list(map(lambda e: e["display_name"], attribute)),
            }
        )

    return {
        "statusCode": 200,
        "allLabels": "ALL",
        "body": labels,
    }
