import { MdCompareArrows } from "react-icons/md";
import { useState, useEffect } from "react";
import { axiosRT } from "../config/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../redux/notificationSlice.js";
import { setConfirmation } from "../redux/confirmationSlice.js";

const PergeseranBarang = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.jwToken.token);
  const expire = useSelector((state) => state.jwToken.expire);
  const axiosInterceptors = axiosRT(token, expire, dispatch);

  // submit
  const [jumlah, setJumlah] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi_tujuan, setlokasi_tujuan] = useState("");
  const [id_lokasi_penyimpanan, setid_lokasi_penyimpanan] = useState("");
  const [errForm, setErrForm] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosInterceptors.patch(
        `/pergeseran-barang/${id_lokasi_penyimpanan}`,
        {
          jumlah,
          tanggal,
          lokasi_tujuan,
        },
      );

      dispatch(
        setNotification({
          message: "pergeseran barang sukses",
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
    setJumlah("");
    setTanggal("");
    setlokasi_tujuan("");
    setid_lokasi_penyimpanan("");
    setInputLokasiPenyimpanan(true);
    setNamaLokasiPenyimpanan("");
  };

  // option select id_lokasi_penyimpanan
  const [lokasiPenyimpanan, setLokasiPenyimpanan] = useState([]);
  const [keyLokasiPenyimpanan, setKeyLokasiPenyimpanan] = useState("");

  const findLokasiPenyimpanan = async () => {
    try {
      const response = await axiosInterceptors.get(
        `/lokasi-penyimpanan?lokasi=${keyLokasiPenyimpanan}`,
      );

      const addedItemPromises = response.data.data.map(async (element) => {
        const [namaRes] = await Promise.all([
          axiosInterceptors.get(
            `/inventori-barang/${element.id_inventaris_barang}`,
          ),
        ]);
        return {
          nama: namaRes.data.nama,
        };
      });

      const addedItem = await Promise.all(addedItemPromises);

      const result = response.data.data.map((item, index) => ({
        ...item,
        nama: addedItem[index].nama,
      }));

      setLokasiPenyimpanan(result);
    } catch (e) {
      const arrError = e.response.data.error.split(",");
      dispatch(
        setNotification({ message: arrError, background: "bg-red-100" }),
      );
    }
  };

  useEffect(() => {
    findLokasiPenyimpanan();
  }, [keyLokasiPenyimpanan]);

  //  input id_lokasi_penyimpanan
  const [inputLokasiPenyimpanan, setInputLokasiPenyimpanan] = useState(true);
  const [namaLokasiPenyimpanan, setNamaLokasiPenyimpanan] = useState("");

  const handleChangeOptionSelectLokasi = (event) => {
    const selected = event.target[event.target.selectedIndex];
    setid_lokasi_penyimpanan(selected.value);
    setInputLokasiPenyimpanan(true);
    setNamaLokasiPenyimpanan(selected.getAttribute("data-additional-info"));
  };

  return (
    <>
      <button
        onClick={openModal}
        className="m-2 aspect-video w-[95%] rounded bg-teal-700 p-2 shadow md:w-[45%]"
      >
        <p className="border-b border-white text-center text-white">
          pergeseran barang
        </p>
        <MdCompareArrows className="mx-auto h-36 w-36 text-white" />
      </button>

      {/*modal*/}
      {showModal && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-slate-900 bg-opacity-80">
          <div className="relative w-[95%] rounded-md bg-white shadow-md shadow-teal-100 md:w-[80%] lg:w-[50%]">
            <p className="mb-2 border-b-2 border-teal-700 text-center">
              pergeseran barang
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
                {inputLokasiPenyimpanan ? (
                  <button
                    type="button"
                    className="mb-1 w-full rounded-md border p-1 text-start"
                    onClick={() => setInputLokasiPenyimpanan(false)}
                  >
                    {namaLokasiPenyimpanan ? (
                      namaLokasiPenyimpanan
                    ) : (
                      <span className="text-slate-400">barang...</span>
                    )}
                  </button>
                ) : (
                  <div className="flex justify-between">
                    <select
                      value={id_lokasi_penyimpanan}
                      onChange={handleChangeOptionSelectLokasi}
                      className="mb-1 w-[50%] rounded-md rounded-r-none border p-1"
                    >
                      <option selected value="">
                        list barang...
                      </option>
                      {lokasiPenyimpanan.map((each) => (
                        <option
                          value={each._id}
                          data-additional-info={each.nama}
                        >
                          {each.nama +
                            " | " +
                            each.lokasi +
                            " | " +
                            each.jumlah}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="search_lokasi"
                      className="mb-1 w-[50%] rounded-md rounded-l-none border p-1"
                      value={keyLokasiPenyimpanan}
                      onChange={(e) => setKeyLokasiPenyimpanan(e.target.value)}
                    />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="jumlah"
                  className="mb-1 w-full rounded-md border p-1"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
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
                  placeholder="lokasi_tujuan"
                  className="mb-1 w-full rounded-md border p-1"
                  value={lokasi_tujuan}
                  onChange={(e) => setlokasi_tujuan(e.target.value)}
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

export default PergeseranBarang;
