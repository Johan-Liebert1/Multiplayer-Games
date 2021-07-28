

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
        current_painter_index: username_index in ROOMS -> game_name -> room_id,
        word: word_to_paint
    }
}
"""
