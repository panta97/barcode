def get_pol_filter(po_id):
    return [
        [
            ["order_id", "=", po_id],
            [
                "product_id",
                "!=",
                False,
            ],  # since v13 order lines could be (product, section, note)
        ]
    ]
