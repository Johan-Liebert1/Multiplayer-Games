from typing import List


from sqlalchemy.orm.query import Query


def serialize(objects: List[Query]) -> "List[dict[str, str]]":
    """
    Takes in a list of SQLAlchemy query objects, and returns a JSONified list
    """
    new_list: List[dict[str, str]] = []
    custom_attr_names = ["salt", "password", "registry", "metadata"]

    # get a list of query objects
    for q_obj in objects:
        d: dict[str, str] = {}

        for attr_name in dir(q_obj):
            if not attr_name.startswith("_") and attr_name not in custom_attr_names:
                d[attr_name] = q_obj.__getattribute__(attr_name)

        new_list.append(d)

    return new_list
