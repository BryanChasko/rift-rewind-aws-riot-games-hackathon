import React from 'react';
import CodeView from '@cloudscape-design/code-view/code-view';

export const EndpointCode: React.FC<{ endpoint: string }> = ({ endpoint }) => (
  <CodeView content={endpoint} />
);

export const HttpMethodCode: React.FC<{ method: string }> = ({ method }) => (
  <CodeView content={method} />
);

export const AuthHeaderCode: React.FC<{ header: string }> = ({ header }) => (
  <CodeView content={header} />
);

export const JsonResponseCode: React.FC<{ json: string }> = ({ json }) => (
  <CodeView content={json} lineNumbers />
);