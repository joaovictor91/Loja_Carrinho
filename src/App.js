import { useEffect, useState } from "react";
import styled from "styled-components";
import Cart from "./components/Cart";
import Products from "./components/Product"
/**
 * Função para chamar API
 * @param {string} url Caminho da Função
 * @param {string} method Metodo da Função
 * @returns Objeto de resposta
 */
async function api(url, method, body = undefined) {
  return await fetch(`http://localhost:4000${url}`, {
    body: body !== undefined ? JSON.stringify(body) : body,
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json()); 
}

/**
 * Busca todos os produtos da APi
 * @returns lista de produtos
 */
async function apiGetProducts() {
  const data = await api("/products", "GET");
  return data.products;
}

/**
 * Salva o carrinho de compras na API
 * @param {Object[]} products Lista de Produtos
 */
async function apiSubmitCart(products) {
  await api("/purchases", "POST", {products});
}

function App() {
  const [productsLoading, setProductsLoading] =useState(false); //Status do loaing de produtos
  const [products, setProducts] = useState([]); //Lista dos produtos
  const [cart, setCart] = useState([]); //Lista de produtos no carrinho
  const [cartLoading, setCartLoading] = useState(false); //Status do loading do carrinho
  
  /**
   * Busca dos produtos
   */
  async function getProducts() {
    setProductsLoading(true); //Ativa o loading de produtos
    setProducts(await apiGetProducts()); //Salva lista de produtos na variavel global
    setProductsLoading(false); //Desativa o loading de produtos
  }

  /**
   * Salva no carrinho
   */
  async function submitCart() {
    setCartLoading(true); //Ativa o loading do carrinho
    await apiSubmitCart(cart); //Salva o carrinho
    setCart([]); //Limpa o carrinho
    setCartLoading(false); //Desativa o loading do carrinho

    getProducts(); //Busca os produtos novamente
  }

  /**
   * Altera unidade do produto
   */
  function setProduct(product, change) {
    const products = cart.filter(({id}) => {
      return id !== product.id;
    });

    product.units += change;
    if (product.units > 0) {
      setCart(() => [...products, product]);
    } else {
      setCart(() => [...products]);
      setProducts((LastProducts) => [...LastProducts, product]);
    }
  }

  /**
   * Adiciona produto no carrinho
   */
  function addProduct(product) {
    product.units = 1;
    setCart(() => [...cart, product]);

    setProducts(() =>
      products.filter(({id}) => {
        return id !== product.id;
      })
    );
  }

  useEffect(() => {
    getProducts(); //Busca os produtos ao carregar a página
  }, []);

  
  /* Elemento main personalizado com CSS */
  const SMain = styled.main`
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 1fr;
  `;

  return (
    <SMain>
      <Cart
        products={cart}
        onChange={setProduct}
        onClick={submitCart}
        isLoading={cartLoading}
      />
      <Products 
        products={products}
        onClick={addProduct}
        isLoading={productsLoading}
      />
    </SMain>
  );
}

export default App;
