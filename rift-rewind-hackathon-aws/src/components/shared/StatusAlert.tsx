import React, { useEffect } from 'react';
import { Alert } from '@cloudscape-design/components';
import { announceToScreenReader } from '../../utils/accessibility';

interface StatusAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  header: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoFocus?: boolean;
}

export const StatusAlert: React.FC<StatusAlertProps> = ({
  type,
  header,
  children,
  dismissible = false,
  onDismiss,
  autoFocus = false
}) => {
  const alertRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Follow Cloudscape guidance for alert focus management
    if (autoFocus && (type === 'error' || type === 'warning' || type === 'success')) {
      alertRef.current?.focus();
    }
    
    // Announce important alerts with appropriate priority
    const priority = (type === 'error' || type === 'warning') ? 'assertive' : 'polite';
    announceToScreenReader(`${type}: ${header}`, priority);
  }, [type, header, autoFocus]);

  return (
    <div ref={alertRef} tabIndex={autoFocus ? -1 : undefined}>
      <Alert
        type={type}
        header={header}
        dismissible={dismissible}
        onDismiss={onDismiss}
        statusIconAriaLabel={`${type} status`}
      >
        {children}
      </Alert>
    </div>
  );
};