import React from 'react';

global.React = React;
global.insights = {};
// scrollIntoView is not implemented in jsdom
global.HTMLElement.prototype.scrollIntoView = () => null;
