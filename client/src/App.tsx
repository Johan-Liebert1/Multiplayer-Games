import React from "react";

import routes from "./routes/router";
import { Route, Switch } from "react-router";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <div
      className="App"
      style={{
        minWidth: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <NavBar />
      <Switch>
        {Object.values(routes).map(route => (
          <Route
            exact
            path={route.path}
            render={routeProps => <route.component {...routeProps} />}
            key={route.name}
          />
        ))}
      </Switch>
    </div>
  );
};

export default App;
