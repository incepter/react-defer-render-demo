import React from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  makeStyles,
  Tabs,
  Tab,
  Grid
} from "@material-ui/core";
import { DeferRenderProvider } from "react-defer-renderer";
import Commander from "./Commander";
import Todos, { ToDo } from "./Todos";

const useHeaderStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

function Header() {
  const classes = useHeaderStyles();

  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar>
          <Button color="inherit">
            <NavLink style={{ color: "white" }} to="/">
              Pause resume demo
            </NavLink>
          </Button>
          <Button color="inherit">
            <NavLink style={{ color: "white" }} to="/versus">
              Versus demo
            </NavLink>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

function PauseResumeDemo() {
  const [unmount, setUnmount] = React.useState(false);
  const [mode, setMode] = React.useState("sequential");
  const [delay, setDelay] = React.useState(1000);
  const [batchSize, setBatchSize] = React.useState(5);
  const numberDelay = Number(delay);
  const numberBatchSize = Number(batchSize);

  return (
    <DeferRenderProvider delay={delay} mode={mode} batchSize={batchSize}>
      <Commander
        mode={mode}
        setMode={setMode}
        unmounted={unmount}
        delay={numberDelay}
        setDelay={setDelay}
        batchSize={numberBatchSize}
        setBatchSize={setBatchSize}
        unmount={() => setUnmount(old => !old)}
      />

      {!unmount && <Todos size={2000} />}
    </DeferRenderProvider>
  );
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}
function TabContent({ activeTab }) {
  if (activeTab === 1) {
    return <PauseResumeDemo />;
  }
  const todos = range(2000).map(t => ({
    id: t,
    userId: t,
    title: `This is the todo with index ${t}`,
    completed: Math.random() > 0.5
  }));
  if (activeTab === 2) {
    return (
      <Grid container>
        {todos.map(todo => (
          <ToDo key={`${todo.id}`} {...todo} />
        ))}
      </Grid>
    );
  }
  throw new Error("Unknown tab");
}

function VersusDemo() {
  const [activeTab, setActiveTab] = React.useState(1);
  return (
    <>
      <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
        <Tab label="Deferred" value={1} />
        <Tab label="Normal" value={2} />
      </Tabs>
      <TabContent activeTab={activeTab} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ marginTop: 80 }}>
        <Switch>
          <Route exact path="/" component={PauseResumeDemo} />
          <Route exact path="/versus" component={VersusDemo} />
          <Route component={() => "Not found"} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
