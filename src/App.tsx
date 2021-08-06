import React from 'react';
import Radar from './components/Radar';
import Playground from './components/Playground';
import styled from 'styled-components';

const StyledApp = styled.div`
  .fixed-radar {
    position: fixed;
    top: 10px;
    right: 10px;
    pointer-events: none;
    z-index: 1;
  }
`;

function App() {
  return (
    <StyledApp>
      <Radar className="fixed-radar" size="160px" />
      <Playground />
    </StyledApp>
  );
}

export default App;
