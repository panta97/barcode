from odoo.rpc import get_model
from datetime import datetime, timedelta


def get_purchase_order_sheet(env, po_id):
    # po = purchase.order
    po_table = "purchase.order"
    po_filter = [[["id", "=", po_id]]]
    po_fields = ["name", "date_order", "create_uid", "partner_ref", "partner_id"]

    order = get_model(env, po_table, po_filter, po_fields)

    # pol = purchase.order.line
    pol_table = "purchase.order.line"
    pol_filter = [[["order_id", "=", po_id]]]
    pol_fields = ["product_id", "product_qty", "date_planned"]
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
        "display_name",
        "categ_id",
        "product_tmpl_id",
    ]
    # GET PRODUCTS WITH FILTERED PRODUCT IDS
    products = get_model(env, pp_table, pp_filter, pp_fields)

    # CREATE ORDER_LINE LIST DICT
    order_lines = []

    for i in range(0, len(order_line)):
        product_id = order_line[i]["product_id"][0]
        product = list(filter(lambda e: e["id"] == product_id, products))
        # LENGTH OF ORDER_LINE CAN DIFFER FROM PRODUCTS LENGTH
        # IF THAT'S THE CASE THERE ARE SOME ARCHIVED PRODUCTS
        if len(product) > 0:
            product = product[0]
        else:
            continue

        order_lines.append(
            {
                "name": product["display_name"],
                "cats": product["categ_id"][1],
                "quantity": order_line[i]["product_qty"],
                "datetime": order_line[i]["date_planned"],
            }
        )

    date_obj = datetime.strptime(
        order[0]["date_order"], "%Y-%m-%d %H:%M:%S"
    ) - timedelta(hours=5)
    return {
        "statusCode": 200,
        "allLabels": "ALL" if len(order_line) == len(products) else "INCOMPLETE",
        "order_details": {
            "username": order[0]["create_uid"][1],
            "datetime": datetime.strftime(date_obj, "%Y-%m-%d %H:%M:%S"),
            "name": order[0]["name"],
            "partner_name": order[0]["partner_id"][1],
            "partner_ref": order[0]["partner_ref"] if order[0]["partner_ref"] else "",
        },
        "order_lines": order_lines,
    }
