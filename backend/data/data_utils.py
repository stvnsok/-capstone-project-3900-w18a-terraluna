import os


def data_file_to_lines(data_file_name):
    """Function used to access in backend/data folder from ANYWHERE
    Args:
        data_file_name (str): name of file in the data_folder

    Returns:
        List(str): list of lines in a data file
    """
    script_dir = os.path.dirname(__file__)
    abs_file_path = os.path.join(script_dir, data_file_name)
    with open(abs_file_path, 'r') as f:
        lines = f.read().strip().split("\n")
    return lines

def check_meal_type(meal_type):
    """Check if meal_type is defined in mealTypes.txt

    Args:
        meal_type (str): the meal type

    Returns:
        bool: True if valid, False otherwise.
    """
    if meal_type.lower() in data_file_to_lines("mealTypes.txt"):
        return True
    else:
        return False

def check_diet_type(diet_type):
    """Check if diet_type is defined in dietTypes.txt

    Args:
        diet_type (str): the meal type

    Returns:
        bool: True if valid, False otherwise.
    """
    if diet_type.lower() in data_file_to_lines("dietTypes.txt"):
        return True
    else:
        return False
