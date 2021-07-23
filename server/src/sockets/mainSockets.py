from main import socket

print("socket = ", socket, "\n\n\n")


@socket.event
def connect(socket_id, data):
    print("\n\n ", socket_id, "\n\n")


@socket.event
def hi(socket_id, data):
    print("\n\n ", socket_id, "\n\n")
