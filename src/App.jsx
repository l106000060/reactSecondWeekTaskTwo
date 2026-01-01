// 外部資源
import { useState } from "react";
import axios from "axios";

// 內部資源
import logo from "./assets/images/logos/FOCUS-FITNESS-logo-3-long-big.png";

function App() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const path = import.meta.env.VITE_API_PATH;

  // 登入api資料
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [productDetails, setproductDetails] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  function authorization() {
    // 從cookie取得token
    const autoken = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // 將tokens放入headers
    axios.defaults.headers.common["Authorization"] = autoken;
  }
  authorization();

  const handleLoginChange = (e) => {
    const { value, name } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });
    // console.log(login);
  };

  const handleLoginBtn = async (e) => {
    e.preventDefault();
    try {
      // 取得登入api
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, login);
      const { token, expired } = res.data;
      // 將token存入cookie
      document.cookie = `token=${token}; expires=${expired}`;
      authorization();

      // 判斷顯示登入頁面或商品列表頁
      setIsAuth(true);

      //取得商品api、loading
      setLoadingProducts(true);
      const productRes = await axios.get(
        `${baseUrl}/v2/api/${path}/admin/products`
      );
      setProducts(productRes.data.products);
      setLoadingProducts(false);

      console.log("登入成功");
    } catch (error) {
      console.log(error);
      alert("登入失敗");
    }
  };

  const checkLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      alert("您已經登入");
    } catch {
      console.log(error);
      alert("您尚未登入");
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container">
          <h1 className="text-center mb-4">Focus Fitness</h1>
          {/* 格線系統 */}
          <div className="row">
            {/* 商品清單區塊 */}
            <div className="col-6">
              <div className="border p-2 rounded-1">
                <h2 className="text-center  mb-3">裝備清單</h2>
                <table className="table mb-0 table-hover table-bg table-color mb-3">
                  <thead>
                    <tr>
                      <th scope="col">裝備</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col">是否啟用</th>
                      <th scope="col">裝備介紹</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingProducts ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          資料載入中...
                        </td>
                      </tr>
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id}>
                          <th scope="row">{product.title}</th>
                          <td>{product.origin_price}</td>
                          <td>{product.price}</td>
                          <td>{product.is_enabled ? "啟用" : "不啟用"}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary-400 text-grey-900 fs-6 hover-effect"
                              onClick={() => setproductDetails(product)}
                            >
                              更多詳情
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          尚無商品
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <button
                  onClick={checkLogin}
                  type="button"
                  className="btn text-white text-grey-900 fs-6 hover-effect"
                >
                  登入驗證
                </button>
              </div>
            </div>
            {/* 裝備介紹區塊 */}
            <div className="col-6">
              <div className="border p-2 rounded-1">
                <h2 className="text-center mb-3">裝備介紹</h2>
                {productDetails.title ? (
                  <div className="card p-2 bg-white-opacity-20">
                    <img
                      src={productDetails.imageUrl}
                      className="card-img-top max-w-50 mx-auto"
                      alt="..."
                    />
                    <div className="card-body text-white">
                      <h5 className="card-title">
                        {productDetails.title}{" "}
                        <span className="badge bg-primary-600 rounded-pill">
                          {productDetails.category}
                        </span>
                      </h5>
                      <p className="card-text">
                        商品描述：{productDetails.description}
                      </p>
                      <p>商品內容：{productDetails.content}</p>
                      <p>
                        {productDetails.price}元 /
                        <del>{productDetails.origin_price}</del>元
                      </p>
                      <p>更多圖片：</p>
                      <div className="d-flex flex-wrap">
                        {productDetails.imagesUrl.map((url, index) => {
                          return <img src={url} key={index} className="w-50" />;
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center">
                    點擊「更多詳情」按鈕，查看裝備介紹
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="container text-center bg-white-opacity-20 p-3 rounded-3">
            <div className="row">
              {/*圖片*/}
              <div className="col-6">
                <div className="h-100 d-flex justify-content-center align-items-end login-bg rounded-3">
                  {/*logo*/}
                  <div className="max-w-182 mb-8">
                    <img src={logo} alt="logo" />
                  </div>
                </div>
              </div>
              {/*表單*/}
              <div className="col-6 pt-107 pb-107">
                <div>
                  {/*標題*/}
                  <div className="text-start mb-7">
                    <h2 className="fs-7 fw-bold mb-3 text-primary-400">
                      / Log in /
                    </h2>
                    <h2 className="fs-2 fw-bold lh-sm">會員登入</h2>
                  </div>
                  <form onSubmit={handleLoginBtn}>
                    <div className="mb-3 text-start">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        帳號<span className="text-danger-normal">*</span>
                      </label>
                      <input
                        name="username"
                        value={login.username}
                        onChange={handleLoginChange}
                        type="email"
                        className="form-control pt-2 pb-2"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="請輸入電子郵件帳號"
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        密碼<span className="text-danger-normal">*</span>
                      </label>
                      <input
                        name="password"
                        value={login.password}
                        onChange={handleLoginChange}
                        type="password"
                        className="form-control pt-2 pb-2"
                        id="exampleInputPassword1"
                        placeholder="請輸入密碼"
                      />
                    </div>
                    <button
                      onclick={handleLoginBtn}
                      className="btn btn-primary-400 w-100 pt-3 pb-3 fs-7 fw-bold"
                    >
                      登入
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
