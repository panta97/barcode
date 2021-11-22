import os
from xmlrpc import client as xmlrpclib
from odoo.purchase_order import get_purchase_order
from odoo.product_template import get_product_template
from odoo.product_product import get_product_product
from odoo.purchase_order_sheet import get_purchase_order_sheet


def lambda_handler(event, context):
    # CLOUDWATCH TO KEEP IT WARM
    if event.__contains__("ping"):
        print("called from cloudwatch")
        return {"message": "pong"}

    # GET ENVIRONMENT VARIABLES
    proxy = xmlrpclib.ServerProxy("{}/xmlrpc/2/object".format(os.environ["URL"]))

    # GET PURCHASE ORDER ID FROM GATEWAY API
    if event["model"] == "purchase.order":
        return get_purchase_order(proxy, event["id"])
    elif event["model"] == "product.template":
        return get_product_template(proxy, event["id"])
    elif event["model"] == "product.product":
        return get_product_product(proxy, event["id"])
    elif event["model"] == "purchase.order.sheet":
        return get_purchase_order_sheet(proxy, event["id"])
