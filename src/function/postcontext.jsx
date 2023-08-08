import React, { createContext, useContext, useState } from 'react';

export const PoseContext = createContext();

export const usePose = () => useContext(PoseContext);

export const PoseProvider = ({ children }) => {
  const [pose, setPose] = useState('');

  const resetPose = () => {
    setPose('');
  };

  return <PoseContext.Provider value={{ pose, setPose, resetPose }}>{children}</PoseContext.Provider>;
};
