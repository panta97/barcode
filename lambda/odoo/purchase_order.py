from odoo.rpc import get_model
from functools import reduce
import odoo.shared as shr


def get_purchase_order(proxy, po_id):
    # pol = purchase.order.line
    pol_table = "purchase.order.line"
    pol_filter = shr.get_pol_filter(po_id)
    pol_fields = ["product_id", "product_qty"]
    order_lines = get_model(proxy, pol_table, pol_filter, pol_fields)

    if len(order_lines) == 0:
        return {
            "statusCode": 400,
            "body": "po does not exists",
        }

    # FILTER PRODUCT IDS ONLY
    product_ids = list(map(lambda e: e["product_id"][0], order_lines))

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

    for i in range(0, len(order_lines)):
        product_id = order_lines[i]["product_id"][0]
        product = list(filter(lambda e: e["id"] == product_id, products))
        # LENGTH OF ORDER_LINE CAN DIFFER FROM PRODUCTS LENGTH
        # IF THAT'S THE CASE THERE ARE SOME ARCHIVED PRODUCTS
        if len(product) > 0:
            product = product[0]
        else:
            continue
        attribute = list(
            filter(
                lambda e: e["id"] in product["product_template_attribute_value_ids"],
                template_attribute_values,
            )
        )
        labels.append(
            {
                "quantity": order_lines[i]["product_qty"],
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
        "allLabels": "ALL" if len(order_lines) == len(products) else "INCOMPLETE",
        "body": labels,
    }
