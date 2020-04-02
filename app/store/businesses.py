from collections import namedtuple

class Business(
    namedtuple(
        'Business',
        [
            'id',
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
        ])):
    pass
