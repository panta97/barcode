import os
from xmlrpc import client as xmlrpclib
from functools import reduce


def lambda_handler(event, context):

    # CLOUDWATCH TO KEEP IT WARM
    if event.__contains__('ping'):
        print('called from cloudwatch ')
        return { 'message': 'pong' }

    # GET ENVIRONMENT VARIABLES
    url = os.environ['URL']
    db = os.environ['DB']
    pwd = os.environ['PWD']
    uid = int(os.environ['UID'])

    # GET PURCHASE ORDER ID FROM GATEWAY API
    po_id = event['poId']

    # GET PRODUCT IDS AND QUANTITIES BASE ON PURCHASE ORDER ID
    models = xmlrpclib.ServerProxy('{}/xmlrpc/2/object'.format(url))
    order_line = models.execute_kw(db, uid, pwd,'purchase.order.line', 'search_read',
    [[['order_id', '=', po_id]]], {'fields': ['product_id', 'product_qty'], 'context': {'lang': "es_PE"}})

    if len(order_line) == 0:
        return {
            'statusCode': 400,
            'body': 'po does not exists',
        }

    # FILTER PRODUCT IDS ONLY
    product_ids = list(map(lambda e: e['product_id'][0], order_line))

    # GET PRODUCTS WITH FILTERED PRODUCT IDS
    products = models.execute_kw(db, uid, pwd,'product.product', 'search_read',
    [[['id', 'in', product_ids]]],
    {'fields': ['barcode', 'name', 'description', 'default_code', 'categ_id', 'lst_price', 'attribute_value_ids', 'product_tmpl_id'],
    'context': {'lang': "es_PE"}})

    # FILTER ATTRIBUTE IDS
    # [[12,23], [232,23]]
    attribute_value_ids = list(map(lambda e: e['attribute_value_ids'], products))
    # [12,23,232,23]
    attribute_value_ids = reduce(list.__add__, attribute_value_ids)
    # [12,23,232]
    attribute_value_ids = list(set(attribute_value_ids))

    attribute_values = models.execute_kw(db, uid, pwd,'product.attribute.value', 'search_read',
    [[['id', 'in', attribute_value_ids]]], {'fields': ['display_name'], 'context': {'lang': "es_PE"}})

    # CREATE LIST LABEL DICT
    labels = []

    for i in range(0, len(order_line)):
        product_id = order_line[i]['product_id'][0]
        product = list(filter(lambda e: e['id'] == product_id, products))
        # LENGTH OF ORDER_LINE CAN DIFFER FROM PRODUCTS LENGTH
        # IF THAT'S THE CASE THERE ARE SOME PRODUCTS THAT WERE ARCHIVED
        if len(product) > 0: product = product[0]
        else: continue
        attribute = list(filter(lambda e: e['id'] in product['attribute_value_ids'], attribute_values))
        labels.append({
            'quantity': order_line[i]['product_qty'],
            'code': product['barcode'],
            'desc': product['name'],
            'mCode': product['default_code'],
            'cats': product['categ_id'][1],
            'price': product['lst_price'],
            'attr': list(map(lambda e: e['display_name'], attribute))
        })

    return {
        'statusCode': 200,
        'allLabels' : 'ALL' if len(order_line) == len(products) else 'INCOMPLETE',
        'body': labels,
    }
