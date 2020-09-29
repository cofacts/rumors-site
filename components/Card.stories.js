import React from 'react';
import { Card, CardHeader, CardContent } from './Card';

export default {
  title: 'Card',
  component: 'Card',
};

export const BasicCard = () => <Card>Basic card</Card>;

export const CardWithContent = () => (
  <Card>
    <CardContent>Card content 1</CardContent>
    <CardContent>Card content 2</CardContent>
  </Card>
);

export const CardWithHeader = () => (
  <Card>
    <CardHeader>Card header here</CardHeader>
    <CardContent>Card content</CardContent>
  </Card>
);
