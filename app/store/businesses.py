from collections import namedtuple

class Business(object):
    ROWS = [
        'business_id',
        'name',
        'is_flagged',
        'is_open',
        'take_out',
        'delivery',
        'by_appointment',
        'business_type',
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
    DEFAULT_ORDER = 'businesses.created_ts DESC'
