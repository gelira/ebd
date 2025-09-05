import random, string, uuid

def generate_random_numeric_string(length = 6):
    return ''.join(random.choices(string.digits, k=length))

def validate_uuid(value):
    try:
        return uuid.UUID(value)

    except ValueError:
        return None
