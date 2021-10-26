import React from 'react';
import Head from 'next/head';

const HomePage = () => (
  <>
    <Head>
      <title>Create Project</title>
    </Head>
  </>
);

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: '/create-project',
    },
  };
}

export default HomePage;
