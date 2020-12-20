import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { lightTheme } from '../lib/theme';
import '../components/app.css';

// Mock next/router
// @see https://github.com/vercel/next.js/issues/1827#issuecomment-306740374
import Router from 'next/router';
const mockedRouter = { push: () => {}, prefetch: () => Promise.resolve() };
Router.router = mockedRouter;

addDecorator(storyFn => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    {storyFn()}
  </ThemeProvider>
));
