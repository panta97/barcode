from odoo.rpc import get_model
from functools import reduce


def get_purchase_order(env, po_id):
    # pol = purchase.order.line
    pol_table = "purchase.order.line"
    pol_filter = [[["order_id", "=", po_id]]]
    pol_fields = ["product_id", "product_qty"]
    order_line = get_model(env, pol_table, pol_filter, pol_fields)

    if len(order_line) == 0:
        return {
            "statusCode": 400,
            "body": "po does not exists",
        }

    # FILTER PRODUCT IDS ONLY
    product_ids = list(map(lambda e: e["product_id"][0], order_line))

    # pp = product.product
    pp_table = "product.product"
    pp_filter = [[["id", "in", product_ids]]]
    pp_fields = [
        "barcode",
        "name",
        "description",
        "default_code",
        "categ_id",
        "lst_price",
        "attribute_value_ids",
        "product_tmpl_id",
    ]
    # GET PRODUCTS WITH FILTERED PRODUCT IDS
    products = get_model(env, pp_table, pp_filter, pp_fields)

    # FILTER ATTRIBUTE IDS
    # [[12,23], [232,23]]
    attribute_value_ids = list(map(lambda e: e["attribute_value_ids"], products))
    # [12,23,232,23]
    attribute_value_ids = reduce(list.__add__, attribute_value_ids)
    # [12,23,232]
    attribute_value_ids = list(set(attribute_value_ids))

    # pav = product.attribute.value
    pav_table = "product.attribute.value"
    pav_filter = [[["id", "in", attribute_value_ids]]]
    pav_fields = ["display_name"]
    attribute_values = get_model(env, pav_table, pav_filter, pav_fields)

    # CREATE LIST LABEL DICT
    labels = []

    for i in range(0, len(order_line)):
        product_id = order_line[i]["product_id"][0]
        product = list(filter(lambda e: e["id"] == product_id, products))
        # LENGTH OF ORDER_LINE CAN DIFFER FROM PRODUCTS LENGTH
        # IF THAT'S THE CASE THERE ARE SOME ARCHIVED PRODUCTS
        if len(product) > 0:
            product = product[0]
        else:
            continue
        attribute = list(
            filter(
                lambda e: e["id"] in product["attribute_value_ids"], attribute_values
            )
        )
        labels.append(
            {
                "quantity": order_line[i]["product_qty"],
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
        "allLabels": "ALL" if len(order_line) == len(products) else "INCOMPLETE",
        "body": labels,
    }
