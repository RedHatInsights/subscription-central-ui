import React, { FunctionComponent } from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';

interface EmptyTableProps {
  title: string;
  body?: string;
  icon: React.ReactNode;
  hasButton: boolean;
  buttonLink?: string;
  buttonClickHandler?: () => void;
  buttonText?: string;
}

const NoSearchResults: FunctionComponent<EmptyTableProps> = ({
  title,
  body,
  icon,
  hasButton,
  buttonLink,
  buttonClickHandler,
  buttonText
}) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={icon} />
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      {body && <EmptyStateBody>{body}</EmptyStateBody>}
      {hasButton === true && typeof buttonClickHandler !== 'undefined' && (
        <Button variant="link" onClick={buttonClickHandler}>
          {buttonText}
        </Button>
      )}
      {hasButton === true && buttonLink?.length && (
        <Button component="a" href={buttonLink}>
          {buttonText}
        </Button>
      )}
    </EmptyState>
  );
};

export default NoSearchResults;
