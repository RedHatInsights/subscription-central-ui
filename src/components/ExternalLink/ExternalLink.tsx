import React, { FC, ReactNode } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

interface ExternalLinkProps {
  href: string;
  children: ReactNode | string;
}

const ExternalLink: FC<ExternalLinkProps> = ({ href, children }) => {
  return (
    <Button
      variant="link"
      component="a"
      href={href}
      target="_blank"
      isInline
      icon={<ExternalLinkAltIcon />}
      iconPosition="right"
    >
      {children}
    </Button>
  );
};

export default ExternalLink;
