import getChild from './get-Child';

const test = window.test;

let latestState = test.initialState;
let setState;
let setStateImmediate;

export default React => {
  const Child = getChild(React);

  return class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = { data: latestState };
      const { stateManager } = this.props;
  
      test.dispatch = action => {
        // produce new state
        latestState = stateManager(latestState, test.reducer, action);
        if (setState && !setStateImmediate) { // avail globally
          setStateImmediate = setImmediate(() => {
            setStateImmediate = null;
            setState({ data: latestState }); // apply latest, regardless of state after dispatch
          });
        }
      };
    }

    componentDidMount() {
      if (this.state.data !== latestState) { // if state change since rendering apply that new state
        this.setState({ data: latestState });
      }
      setState = this.setState.bind(this); // avail globally
    }
  
    componentWillUnmount() {
      setState = null; // no longer avail
    }

    render() {
      const { useSafeWord = true, usePriority, limit } = this.props;
      const children = this.state.data.map((el, index) => React.createElement(Child, { key: el.id, el, useSafeWord, usePriority, limit, index }));
  
      return React.createElement('div', {}, children);
    }
  }
};
