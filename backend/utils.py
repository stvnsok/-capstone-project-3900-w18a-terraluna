from error import *


def get_data(data, *args):
    if not data or any(data.get(arg) is None for arg in args):
        raise Error400

    return tuple(data[arg] for arg in args)
