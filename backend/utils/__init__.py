import random
import string

def generate_random_numeric_string(length = 6):
    return ''.join(random.choices(string.digits, k=length))
