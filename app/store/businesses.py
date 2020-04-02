from collections import namedtuple

class Business(object):
    ROWS = [
        'business_id',
        'name',
        'is_flagged',
        'is_open',
        'takeout',
        'delivery',
        'online',
        'details',
        'website',
        'phone_number',
        'created_ts',
        'last_updated',
        'is_deleted'
    ]
    PRIMARY_KEY = 'business_id'
    TABLE = 'businesses'
