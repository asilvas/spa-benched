import getChild from './get-Child';

export default ({ html, render }) => {
  const Child = getChild({ html, render });

  return props => {
    const { useSafeWord, state } = props;
    const children = state.data.map((el, index) => Child({ el, useSafeWord, index }));

    return html`<div>${children}</div>`;
  };
};
