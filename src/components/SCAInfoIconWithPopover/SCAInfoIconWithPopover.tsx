import React, { FunctionComponent } from 'react';
import { Popover } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import ExternalLink from '../ExternalLink';
import './SCAInfoIconWithPopover.scss';

const SCAInfoIconWithPopover: FunctionComponent = () => {
  const scaMoreInfoLink =
    'https://access.redhat.com/documentation/en-us/subscription_central/2023/html/' +
    'getting_started_with_simple_content_access/con-what-is-simplecontent_assembly-simplecontent-ctxt';

  return (
    <>
      <Popover
        aria-label="Learn more about Simple Content Access"
        headerContent="Simple Content Access"
        bodyContent={
          <p>
            Simple content access is a set of capabilities that enables a change in the way Red Hat
            manages its subscription and entitlement enforcement model. When enabled, you are
            allowed to consume content on your systems without strict entitlement enforcement.
          </p>
        }
        footerContent={
          <ExternalLink href={scaMoreInfoLink}>
            Learn more about enabling simple content access on an existing manifest
          </ExternalLink>
        }
      >
        <QuestionCircleIcon
          className="sca-more-info-icon"
          data-testid="sca-more-info-icon"
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </Popover>
    </>
  );
};

export default SCAInfoIconWithPopover;
