import React from 'react';

global.React = React;
// scrollIntoView is not implemented in jsdom
global.HTMLElement.prototype.scrollIntoView = () => null;
