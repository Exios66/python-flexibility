const { BrowserRouter, Route, Switch } = ReactRouterDOM;

const App = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Switch>
        <Route exact path="/">
          <Home darkMode={darkMode} />
        </Route>
        <Route path="/quiz">
          <QuizApp darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
