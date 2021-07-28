l = [{"u": i, "p": 0} for i in range(10)]

map_result = map(lambda x: {**x, "p": x["p"] + 1} if x["u"] == 2 else x, l)

print(list(map_result))
