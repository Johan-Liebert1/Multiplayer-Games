from config.Config import Colors


def get_bot_message(username: str, connected: bool) -> "dict[str, str]":
    to_add = "joined" if connected else "left"

    return {
        "username": "BOT",
        "color": Colors.BOT_COLOR,
        "message": f"{username} just {to_add} the chat",
    }


def get_room(socket, socket_id) -> str:
    for room in socket.rooms(socket_id):
        if room != socket_id:
            return room
