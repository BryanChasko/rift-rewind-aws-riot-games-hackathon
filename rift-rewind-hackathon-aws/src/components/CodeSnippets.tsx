import React from 'react';
import CodeView from '@cloudscape-design/code-view';

export const EndpointCode: React.FC<{ endpoint: string }> = ({ endpoint }) => (
  <CodeView content={endpoint} lineNumbers={false} />
);

export const HttpMethodCode: React.FC<{ method: string }> = ({ method }) => (
  <CodeView content={method} lineNumbers={false} />
);

export const AuthHeaderCode: React.FC<{ header: string }> = ({ header }) => (
  <CodeView content={header} lineNumbers={false} />
);

export const JsonResponseCode: React.FC<{ json: string }> = ({ json }) => (
  <CodeView content={json} lineNumbers={true} />
);