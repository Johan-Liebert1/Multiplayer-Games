from socketio.asyncio_server import AsyncServer
from config.Config import Colors


class SocketHandler:
    def __init__(self, socket: AsyncServer) -> None:
        self.socket = socket

    def get_bot_message(self, username: str, connected: bool) -> "dict[str, str]":
        to_add = "joined" if connected else "left"

        return {
            "username": "BOT",
            "color": Colors.BOT_COLOR,
            "message": f"{username} just {to_add} the chat",
        }

    def get_room(self, socket_id) -> str:
        for room in self.socket.rooms(socket_id):
            if room != socket_id:
                return room
