import getChild from './get-Child';

export default ({ html, render }) => {
  const Child = getChild({ html, render });

  return props => {
    const { useSafeWord = true, usePriority, limit, state } = props;
    const children = state.data.map((el, index) => Child({ el, useSafeWord, usePriority, limit, index }));

    return html`<div>${children}</div>`;
  };
};
