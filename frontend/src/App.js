import React from "react";
import { Switch, Route } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import CheckersScreen from "./screens/CheckersScreen";
import ChessScreen from "./screens/Chessscreen";
import GamesScreen from "./screens/GamesScreen";
import SketchIOScreen from "./screens/SketchIOScreen";
import InvitePlayersScreen from "./screens/InvitePlayersScreen";

const App = () => {
	return (
		<Switch>
			<Route exact path="/" render={routeProps => <HomeScreen {...routeProps} />} />

			<Route
				exact
				path="/games"
				render={routeProps => <GamesScreen {...routeProps} />}
			/>

			<Route
				exact
				path="/chess"
				render={routeProps => <ChessScreen {...routeProps} />}
			/>

			<Route
				exact
				path="/checkers"
				render={routeProps => <CheckersScreen {...routeProps} />}
			/>

			<Route
				path="/inviteplayers/:roomId"
				render={routeProps => <InvitePlayersScreen {...routeProps} />}
			/>

			<Route
				path="/sketchio"
				render={routeProps => <SketchIOScreen {...routeProps} />}
			/>
		</Switch>
	);
};

export default App;
