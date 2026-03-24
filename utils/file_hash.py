import hashlib


def compute_hash(text):

    return hashlib.md5(text.encode()).hexdigest()