from dotenv import load_dotenv

load_dotenv()

import os
from xmlrpc import client as xmlrpclib
from flask import Flask, request
from odoo.purchase_order import get_purchase_order
from odoo.product_template import get_product_template
from odoo.product_product import get_product_product
from odoo.purchase_order_sheet import get_purchase_order_sheet


# create the Flask app
app = Flask(__name__)


@app.after_request
def after_request(response):
    header = response.headers
    header["Access-Control-Allow-Origin"] = "*"
    header["Access-Control-Allow-Headers"] = "Content-Type,x-api-key"
    # Other headers can be added here if required
    return response


@app.route("/default/Barcode", methods=["GET"])
def barcode():
    event = request.args.to_dict()
    event["id"] = int(event["id"])

    # GET ENVIRONMENT VARIABLES
    proxy = xmlrpclib.ServerProxy("{}/xmlrpc/2/object".format(os.getenv("URL")))

    # GET PURCHASE ORDER ID FROM GATEWAY API
    if event["model"] == "purchase.order":
        return get_purchase_order(proxy, event["id"])
    elif event["model"] == "product.template":
        return get_product_template(proxy, event["id"])
    elif event["model"] == "product.product":
        return get_product_product(proxy, event["id"])
    elif event["model"] == "purchase.order.sheet":
        return get_purchase_order_sheet(proxy, event["id"])


if __name__ == "__main__":
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)
