class Location(object):
    ROWS = [
        'location_id',
        'business_id',
        'longitude',
        'latitude',
        'mapbox_id',
        'street_address',
        'street_2',
        'city',
        'state',
        'country',
        'postal_code',
        'is_deleted'
    ]

    PRIMARY_KEY = 'location_id'
    TABLE = 'locations'
    DEFAULT_ORDER = None
