import React, { useEffect } from "react";

const ProductAgent = ({ productInfo }) => {
  useEffect(() => {}, []);

  return (
    <div>
      <h1>Product Training</h1>
      <p>Training phrases added for {productInfo.length} products.</p>
      <pre>{process.env.GOOGLE_APPLICATION_CREDENTIALS}</pre>
    </div>
  );
};

export default ProductAgent;
