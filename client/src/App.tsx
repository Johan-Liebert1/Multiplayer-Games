import React from "react";

import routes from "./routes/router";
import { Route, Switch } from "react-router";

const App: React.FC = () => {
  return (
    <div className="App" style={{ minWidth: "100%", minHeight: "100%", display: "flex" }}>
      <Switch>
        {routes.map(route => (
          <Route
            exact
            path={route.path}
            render={() => <route.component />}
            key={route.name}
          />
        ))}
      </Switch>
    </div>
  );
};

export default App;
