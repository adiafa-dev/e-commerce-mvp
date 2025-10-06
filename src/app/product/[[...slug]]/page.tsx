type ProductPageProps = {
  params: { slug: string[] };
};

const ProductPage = (props: ProductPageProps) => {
  const { params } = props;

  console.log(params);

  return (
    <>
      <h1>{params.slug ? 'Detail Product Page' : 'Product Page'}</h1>
      {params.slug && (
        <>
          <h2>{params.slug[0]}</h2>
          <h2>{params.slug[1]}</h2>
          <h2>{params.slug[2]}</h2>
        </>
      )}
    </>
  );
};

export default ProductPage;
