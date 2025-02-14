import { MdCompareArrows } from "react-icons/md";
import { useState, useEffect } from "react";
import { axiosRT } from "../config/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../redux/notificationSlice.js";
import { setConfirmation } from "../redux/confirmationSlice.js";

const PenerimaanBarang = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.jwToken.token);
  const expire = useSelector((state) => state.jwToken.expire);
  const axiosInterceptors = axiosRT(token, expire, dispatch);

  // submit
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [jenis, setJenis] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [id_pemasok, setid_pemasok] = useState("");
  const [lokasi_penyimpanan, setlokasi_penyimpanan] = useState("");
  const [errForm, setErrForm] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosInterceptors.post(`/penerimaan-barang`, {
        nama,
        jumlah,
        jenis,
        tanggal,
        id_pemasok,
        lokasi_penyimpanan,
      });

      dispatch(
        setNotification({
          message: "barang ditambahkan ke daftar inventori",
          background: "bg-teal-100",
        }),
      );
      closeModal();
    } catch (e) {
      const arrError = e.response.data.error.split(",");
      setErrForm(arrError);
    }
  };

  // modal
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setErrForm(null);
    setNama("");
    setJumlah("");
    setJenis("");
    setTanggal("");
    setlokasi_penyimpanan("");
    setid_pemasok("");
    setInputPemasok(true);
    setNamaPemasok("");
  };

  // option select id_pemasok
  const [pemasok, setPemasok] = useState([]);
  const [keyPemasok, setKeyPemasok] = useState("");

  const findPemasok = async () => {
    try {
      const response = await axiosInterceptors.get(
        `/pemasok?nama=${keyPemasok}`,
      );
      setPemasok(response.data.data);
    } catch (e) {
      const arrError = e.response.data.error.split(",");
      dispatch(
        setNotification({ message: arrError, background: "bg-red-100" }),
      );
    }
  };

  useEffect(() => {
    findPemasok();
  }, [keyPemasok]);

  //  input id_pemasok
  const [inputPemasok, setInputPemasok] = useState(true);
  const [namaPemasok, setNamaPemasok] = useState("");

  const handleChangeOptionSelectPemasok = (event) => {
    const selected = event.target[event.target.selectedIndex];
    setid_pemasok(selected.value);
    setInputPemasok(true);
    setNamaPemasok(selected.getAttribute("data-additional-info"));
  };

  return (
    <>
      <button
        onClick={openModal}
        className="m-2 aspect-video w-[95%] rounded bg-teal-700 p-2 shadow md:w-[45%]"
      >
        <p className="border-b border-white text-center text-white">
          penerimaan barang
        </p>
        <MdCompareArrows className="mx-auto h-36 w-36 text-white" />
      </button>

      {/*modal*/}
      {showModal && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-slate-900 bg-opacity-80">
          <div className="relative w-[95%] rounded-md bg-white shadow-md shadow-teal-100 md:w-[80%] lg:w-[50%]">
            <p className="mb-2 border-b-2 border-teal-700 text-center">
              penerimaan barang (baru)
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
                  placeholder="nama"
                  className="mb-1 w-full rounded-md border p-1"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="jumlah"
                  className="mb-1 w-full rounded-md border p-1"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="jenis"
                  className="mb-1 w-full rounded-md border p-1"
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                />
                <input
                  type="datetime-local"
                  placeholder="tanggal"
                  className="mb-1 w-full rounded-md border p-1"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="lokasi_penyimpanan"
                  className="mb-1 w-full rounded-md border p-1"
                  value={lokasi_penyimpanan}
                  onChange={(e) => setlokasi_penyimpanan(e.target.value)}
                />
                {inputPemasok ? (
                  <button
                    type="button"
                    className="mb-1 w-full rounded-md border p-1 text-start"
                    onClick={() => setInputPemasok(false)}
                  >
                    {namaPemasok ? (
                      namaPemasok
                    ) : (
                      <span className="text-slate-400">pemasok...</span>
                    )}
                  </button>
                ) : (
                  <div className="flex justify-between">
                    <select
                      value={id_pemasok}
                      onChange={handleChangeOptionSelectPemasok}
                      className="mb-1 w-[50%] rounded-md rounded-r-none border p-1"
                    >
                      <option selected value="">
                        list pemasok...
                      </option>
                      {pemasok.map((each) => (
                        <option
                          value={each._id}
                          data-additional-info={each.nama}
                        >
                          {each.nama}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="search_inventori"
                      className="mb-1 w-[50%] rounded-md rounded-l-none border p-1"
                      value={keyPemasok}
                      onChange={(e) => setKeyPemasok(e.target.value)}
                    />
                  </div>
                )}
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

export default PenerimaanBarang;
