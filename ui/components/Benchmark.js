import React from 'react';

export default ({ app, test }) => {
  return <iframe src={`/tests/${test.name}/test.html?cache=false&app=${app.name}`} className="benchmark"></iframe>;
};
