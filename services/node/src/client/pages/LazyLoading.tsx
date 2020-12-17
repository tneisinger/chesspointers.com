import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React, { lazy, Suspense } from 'react';

const LazilyLoadedContent = lazy(() =>
  // webpackChunkName: "LazilyLoadedContent"
  import('../components/LazilyLoadedContent')
);

const Spinner = () => (<div>LOADING...</div>);

const LazyLoadingPage: React.FunctionComponent = () => (
  <Card>
    <CardHeader title='Lazy Loading Example' />
    <CardContent>
      <Suspense fallback={<Spinner />}>
        <LazilyLoadedContent />
      </Suspense>
    </CardContent>
  </Card>
);

export default LazyLoadingPage;
