from socketio.asyncio_server import AsyncServer
from config.Config import Colors, GameNames, SocketEvents

from helpers.colors import COLORS
import random


"""  
ROOMS = {
    GameNames.CHESS: {
        room_id: [
            user_1_username, user_2_username,....
        ]
    },
    GameNames.CHECKERS: {
        room_id: [
            user_1_username, user_2_username,....
        ]
    },
    GameNames.SKETCHIO: {
        room_id: [
            {
                username: user_1_username,
                points: user_1_points
            }, 
            {
                username: user_2_username,
                points: user_2_points
            },....
        ]
    }
}

socket_id_to_username = {
    socket_id: {
        username: username,
        room_id: room_id,
        game_name: game_name
    }
}

sketch_io_info = {
    room_id: {
        current_painter: username_index in ROOMS -> game_name -> room_id,
        word: word_to_paint
    }
}
"""


class SocketHandler:
    def __init__(self, socket: AsyncServer) -> None:
        self.socket = socket
        self.socket_id_to_username: "dict[str, dict[str, str]]" = {}
        self.ROOMS: "dict[str, dict[str, list[str]]]" = {
            GameNames.CHESS: {},
            GameNames.CHECKERS: {},
            GameNames.SKETCHIO: {},
        }
        self.sketch_io_info: "dict[str, dict[str, str]]" = {}

    async def disconnect(self, socket_id):
        socket_info = self.socket_id_to_username[socket_id]
        username = socket_info["username"]
        game_name = socket_info["game_name"]
        room_id = socket_info["room_id"]

        message = self.get_bot_message_for_user_join_leave(username, False)

        # delete the user from the room
        if game_name == GameNames.SKETCHIO:
            self.ROOMS[game_name][room_id] = list(
                filter(
                    lambda x: x["username"] != username,
                    self.ROOMS[game_name][room_id],
                )
            )

        else:
            self.ROOMS[game_name][room_id] = list(
                filter(
                    lambda x: x != username,
                    self.ROOMS[game_name][room_id],
                )
            )

        # free up some memory
        del self.socket_id_to_username[socket_id]

        await self.socket.emit(
            SocketEvents.RECEIVE_CHAT_MESSAGE,
            message,
            to=room_id,
            skip_sid=socket_id,
        )

    async def joinRoom(self, socket_id, data: "dict[str, str]"):
        # extract the game name from the room_id
        # room_id = <gameName>_<actualRoomId>

        game_name, room_id = data["roomId"].split("_")
        username = data["username"]

        self.socket_id_to_username[socket_id] = {
            "username": username,
            "game_name": game_name,
            "room_id": room_id,
        }

        self.socket.enter_room(socket_id, room_id)

        random_chat_color = COLORS[random.randint(0, len(COLORS) - 1)]

        # add the new socket to the room
        if not self.ROOMS[game_name].get(room_id):
            self.ROOMS[game_name][room_id] = []

        if game_name == GameNames.SKETCHIO:
            self.ROOMS[game_name][room_id].append({"username": username, "points": 0})
        else:
            # someone's already in the room so append the next player
            self.ROOMS[game_name][room_id].append(username)

        if game_name == GameNames.CHESS:
            if len(self.ROOMS[game_name][room_id]) == 1:
                # first player in a chess room, assign them the color white
                color = Colors.WHITE

            else:
                # one player is already in the room, so assign the color black
                color = Colors.BLACK

                # send a list of the two users who are playeing the game
                await self.socket.emit(
                    SocketEvents.CHESS_PLAYER_2_JOINED,
                    {"users": self.ROOMS[game_name][room_id]},
                    to=room_id,
                )

            await self.socket.emit(
                SocketEvents.CHESS_COLOR_SELECTED,
                {"color": color, "chatColor": random_chat_color},
                to=socket_id,
            )

        elif game_name == GameNames.CHECKERS:
            if len(self.ROOMS[game_name][room_id]) == 1:
                # first player in a chess room, assign them the color white
                color = Colors.WHITE

            else:
                # one player is already in the room, so assign the color black
                color = Colors.RED

                # send a list of the two users who are playeing the game
                await self.socket.emit(
                    SocketEvents.CHECKERS_PLAYER_2_JOINED,
                    {"users": self.ROOMS[game_name][room_id]},
                    to=room_id,
                )

            await self.socket.emit(
                SocketEvents.CHECKERS_COLOR_SELECTED,
                {"color": color, "chatColor": random_chat_color},
                to=socket_id,
            )

        elif game_name == GameNames.SKETCHIO:
            await self.socket.emit(
                SocketEvents.SKETCHIO_PLAYER_JOINED,
                {"allUsersInRoom": self.ROOMS[GameNames.SKETCHIO][room_id]},
                to=room_id,
            )

        # emit a chat message from a bot
        await self.socket.emit(
            SocketEvents.RECEIVE_CHAT_MESSAGE,
            self.get_bot_message_for_user_join_leave(username, connected=True),
            to=room_id,
            skip_sid=socket_id,
        )

    async def userPlayedAMove(self, socket_id, move: "dict[str, list[int]]"):
        room_to_send_to = self.get_room(socket_id)

        await self.socket.emit(
            SocketEvents.OPPONENT_PLAYED_A_MOVE,
            move,
            skip_sid=socket_id,
            to=room_to_send_to,
        )

    async def sentChatMessage(self, socket_id, data):
        """
        data = {
            username: string;
            color: string;
            message: string;
        }
        """
        room_to_send_to = self.get_room(socket_id)

        game_name = self.socket_id_to_username[socket_id]["game_name"]

        send_message_to_other_users = True

        # in sketchio we have to check if the message is the word_to_paint
        if game_name == GameNames.SKETCHIO:
            send_message_to_other_users = await self.handle_sketch_io_message(
                socket_id, room_to_send_to, data
            )

        # if someone has correctly guessed the word then we don't want others to know
        # what the word was, so we refrain from sending that word to other players in the game
        if send_message_to_other_users:
            await self.socket.emit(
                SocketEvents.RECEIVE_CHAT_MESSAGE,
                data,
                room=room_to_send_to,
                skip_sid=socket_id,
            )

    async def checkersGameOver(self, socket_id, gameOverData):
        room_to_send_to = self.get_room(socket_id)

        await self.socket.emit(
            SocketEvents.CHECKERS_GAME_OVER,
            gameOverData,
            room=room_to_send_to,
            skip_sid=socket_id,
        )

    # ========================== sketch io ========================================
    async def startSketchioGame(self, socket_id, data):
        """
        data = {room_id}
        """
        room_id = data["room_id"]
        all_users_in_room = self.ROOMS[GameNames.SKETCHIO][room_id]

        # add room data to dictionary if not already present
        if not self.sketch_io_info.get(room_id):
            self.sketch_io_info[room_id] = {"current_painter_index": -1, "word": ""}

        self.sketch_io_info[room_id]["current_painter_index"] += 1

        if self.sketch_io_info[room_id]["current_painter_index"] == len(
            all_users_in_room
        ):
            await self.socket.emit(
                SocketEvents.SKETCH_IO_GAME_OVER,
                {},
                to=room_id,
            )

    async def handle_sketch_io_message(self, socket_id, room_id, message):
        chat_message: str = message["message"]
        username: str = message["username"]

        sketchio_game_info = self.sketch_io_info[room_id]

        if chat_message.strip().lower() == sketchio_game_info["word"].strip().lower():
            # someone has guessed the correct word
            await self.socket.emit(
                SocketEvents.RECEIVE_CHAT_MESSAGE,
                self.get_custom_bot_message(
                    f"{username} has correctly guessed the word"
                ),
                to=room_id,
            )

            # signifies whether to send this message to other users or not
            return False

        return True

    async def beganPath(self, socket_id, data):
        room_to_send_to = self.get_room(socket_id)

        await self.socket.emit(
            SocketEvents.BEGAN_PATH,
            data,
            room=room_to_send_to,
            skip_sid=socket_id,
        )

    async def strokedPath(self, socket_id, data):
        room_to_send_to = self.get_room(socket_id)

        await self.socket.emit(
            SocketEvents.STROKED_PATH,
            data,
            room=room_to_send_to,
            skip_sid=socket_id,
        )

    async def startedFilling(self, socket_id, data):
        room_to_send_to = self.get_room(socket_id)

        await self.socket.emit(
            SocketEvents.STARTED_FILLING,
            data,
            room=room_to_send_to,
            skip_sid=socket_id,
        )

    # ============================ helpers ===================================
    def get_custom_bot_message(self, message) -> "dict[str, str]":
        return {
            "username": "BOT",
            "color": Colors.BOT_COLOR,
            "message": message,
        }

    def get_bot_message_for_user_join_leave(
        self, username: str, connected: bool
    ) -> "dict[str, str]":
        to_add = "joined" if connected else "left"

        return self.get_custom_bot_message(f"{username} just {to_add} the chat")

    def get_room(self, socket_id) -> str:
        for room in self.socket.rooms(socket_id):
            if room != socket_id:
                return room
