import { useState, useEffect } from "react";
import { axiosRT } from "../config/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../redux/notificationSlice.js";
import { setConfirmation } from "../redux/confirmationSlice.js";

const Product = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.jwToken.token);
  const expire = useSelector((state) => state.jwToken.expire);

  const axiosInterceptors = axiosRT(token, expire, dispatch);

  // submit
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errForm, setErrForm] = useState(null);
  const [form, setForm] = useState(null);

  const handleAdd = () => {
    setForm(null);
    setNamaModal("add product");
    openModal();
  };

  const handleUpdate = async (id) => {
    setForm({ id: id });
    setNamaModal("update product");
    const oldData = await axiosInterceptors.get(`/product/${id}`);
    openModal();
    setName(oldData.data?.name);
    setPrice(oldData.data?.price);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    form ? updateData(form.id) : addData();
  };

  const handleDelete = (id) => {
    deleteData(id);
    dispatch(setConfirmation(false));
  };

  const addData = async () => {
    try {
      await axiosInterceptors.post(`/product`, { name, price });
      dispatch(
        setNotification({
          message: "new data has been added",
          background: "bg-teal-100",
        }),
      );
      closeModal();
      getProducts();
    } catch (e) {
      const arrError = e.response.data.error.split(",");
      setErrForm(arrError);
    }
  };

  const updateData = async (id) => {
    try {
      await axiosInterceptors.patch(`/product/${id}`, {
        name,
        price,
      });

      dispatch(
        setNotification({
          message: "selected data has been updated",
          background: "bg-teal-100",
        }),
      );
      closeModal();
      getProducts();
    } catch (e) {
      const arrError = e.response.data.error.split(",");
      setErrForm(arrError);
    }
  };

  const deleteData = async (id) => {
    try {
      await axiosInterceptors.delete(`/product/${id}`);
      dispatch(
        setNotification({
          message: "selected data has been deleted",
          background: "bg-teal-100",
        }),
      );
      getProducts();
    } catch (e) {
      const arrError = e.response.data.error.split(",");
      dispatch(
        setNotification({ message: arrError, background: "bg-red-100" }),
      );
    }
  };

  // view data
  const [products, setProducts] = useState([]);
  const [allPage, setAllPage] = useState(0);

  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [key, setKey] = useState("");
  const [search, setSearch] = useState("");
  const [searchBased, setSearchBased] = useState("name");

  const getProducts = async () => {
    try {
      const response = await axiosInterceptors.get(
        `/products?limit=${limit}&page=${page}&${key}`,
      );
      setProducts(response.data.data);
      setAllPage(response.data.all_page);
    } catch (e) {
      const arrError = e.response.data.error.split(",");
      dispatch(
        setNotification({ message: arrError, background: "bg-red-100" }),
      );
    }
  };

  const pageComponents = [];
  for (let i = 1; i <= allPage; i++) {
    pageComponents.push(
      <button
        onClick={() => setPage(i)}
        className={`${
          i == page ? "bg-teal-300" : ""
        } mx-1 rounded border border-teal-100 px-1 text-xs`}
      >
        {i}
      </button>,
    );
  }

  // modal
  const [namaModal, setNamaModal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setErrForm(null);
    setName("");
    setPrice("");
  };

  useEffect(() => {
    getProducts();
  }, [limit, page, key]);

  return (
    <>
      {token ? (
        <div className="mt-2 flex flex-wrap justify-evenly gap-2">
          <div className="w-[95%] md:w-[75%] lg:w-[45%]">
            <div className="mb-2 flex flex-wrap justify-between">
              <div className="w-[30%] rounded p-1 shadow shadow-teal-100">
                <p className="border-b border-teal-300 text-xs">limit</p>
                <div>
                  <input
                    type="button"
                    value="4"
                    onClick={(e) => setLimit(e.target.value)}
                    className={`${
                      limit == 4 ? "bg-teal-300" : ""
                    } mx-1 rounded border border-teal-100 px-2 text-xs`}
                  />
                  <input
                    type="button"
                    value="6"
                    onClick={(e) => setLimit(e.target.value)}
                    className={`${
                      limit == 6 ? "bg-teal-300" : ""
                    } mx-1 rounded border border-teal-100 px-2 text-xs`}
                  />
                  <input
                    type="button"
                    value="8"
                    onClick={(e) => setLimit(e.target.value)}
                    className={`${
                      limit == 8 ? "bg-teal-300" : ""
                    } mx-1 rounded border border-teal-100 px-2 text-xs`}
                  />
                </div>
              </div>
              <div className="w-[30%] rounded p-1 shadow shadow-teal-100">
                <p className="mb-1 border-b border-teal-300 text-xs">page</p>
                <div className="flex overflow-auto">{pageComponents}</div>
              </div>
              <div className="w-[30%] rounded p-1 shadow shadow-teal-100">
                <p className="border-b border-teal-300 text-xs">
                  <select
                    value={searchBased}
                    onChange={(e) => setSearchBased(e.target.value)}
                  >
                    <option selected>name</option>
                    <option disabled>price</option>
                  </select>
                  <button
                    onClick={() => setKey(`${searchBased}=${search}`)}
                    className="rounded bg-green-700 px-1 text-xs italic text-white"
                  >
                    go
                  </button>
                </p>
                <div className="overflow-auto">
                  <input
                    type="text"
                    autocomplete="off"
                    placeholder="..."
                    className="rounded border border-teal-100"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="mb-2 w-full rounded-md border bg-teal-300 p-1 text-xs"
            >
              add product
            </button>
            <div className="w-full rounded-md p-2 shadow-md shadow-teal-100">
              <table className="w-full">
                <tr className="border-b-2 border-teal-700 bg-teal-300">
                  <th className="w-[10%]">no</th>
                  <th className="w-[50%]">name</th>
                  <th className="w-[30%]">price</th>
                  <th className="w-[10%]">action</th>
                </tr>
                {products.map((product, index) => (
                  <tr key={product._id} className="border-b border-teal-300">
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      <button
                        onClick={() => handleUpdate(product._id)}
                        className="w-full rounded bg-green-700 p-1 text-xs italic text-white"
                      >
                        update
                      </button>
                      <button
                        onClick={() =>
                          dispatch(
                            setConfirmation({
                              message:
                                "the selected data will be permanently delete ?",
                              handleOke: () => handleDelete(product._id),
                              handleCancel: () =>
                                dispatch(setConfirmation(false)),
                            }),
                          )
                        }
                        className="w-full rounded bg-red-700 p-1 text-xs italic text-white"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-4 rounded bg-red-100 p-4 text-center">
          unauthorized
        </div>
      )}
      {showModal && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-slate-900 bg-opacity-80">
          <div className="relative w-[95%] rounded-md bg-white shadow-md shadow-teal-100 md:w-[80%] lg:w-[50%]">
            <p className="mb-2 border-b-2 border-teal-700 text-center">
              {namaModal}
            </p>
            <button
              onClick={closeModal}
              className="absolute -right-1 -top-1 rounded bg-red-700 px-1 text-white"
            >
              x
            </button>
            <div className="mt-1 max-h-96 overflow-auto p-2 md:max-h-72">
              {errForm && (
                <div className="mb-2 rounded border border-red-700 p-1 text-xs italic text-red-700">
                  {errForm.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="product name"
                  className="mb-1 w-full rounded-md border p-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="price"
                  className="mb-1 w-full rounded-md border p-1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <button
                  type="submit"
                  className="mb-1 w-full rounded-md border bg-teal-300 p-1"
                >
                  submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
