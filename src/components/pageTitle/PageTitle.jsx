import React from 'react';
import { Helmet } from 'react-helmet-async';

const PageTitle = ({ title }) => {
  const fullTitle = title ? `${title} | EZ English` : 'EZ English';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
};

export default PageTitle; 