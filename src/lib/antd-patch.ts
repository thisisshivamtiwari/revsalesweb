// This file ensures the Ant Design compatibility patch for React 19 is applied
// before any Ant Design components are initialized

import '@ant-design/v5-patch-for-react-19';

// The patch modifies ReactDOM rendering to make Ant Design v5 components 
// compatible with React 19's changes to the rendering system

export default function applyAntDPatch(): boolean {
  // This function exists to verify the patch is imported
  // It doesn't need to do anything, as the import above handles everything
  return true;
} 