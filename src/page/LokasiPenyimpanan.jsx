import { useState, useEffect } from "react";
import { axiosRT } from "../config/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../redux/notificationSlice.js";
import { setConfirmation } from "../redux/confirmationSlice.js";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const LokasiPenyimpanan = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.jwToken.token);
  const expire = useSelector((state) => state.jwToken.expire);

  const axiosInterceptors = axiosRT(token, expire, dispatch);

  // view data
  const [lokasiPenyimpanan, setLokasiPenyimpanan] = useState([]);
  const [allPage, setAllPage] = useState(0);

  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [key, setKey] = useState("");
  const [search, setSearch] = useState("");
  const [searchBased, setSearchBased] = useState("lokasi");

  const findLokasiPenyimpanan = async () => {
    try {
      // const response = await axiosInterceptors.get(
      //   `/lokasi-penyimpanan?limit=${limit}&page=${page}&${key}`
      // );

      // let addedItem = [];
      // for (const element of response.data.data) {
      //   const nama = await axiosInterceptors.get(
      //     `/inventori-barang/${element.id_inventaris_barang}`
      //   );
      //   const createdBy = await axiosInterceptors.get(
      //     `/user/${element.createdBy}`
      //   );
      //   const updatedBy = await axiosInterceptors.get(
      //     `/user/${element.updatedBy}`
      //   );
      //   addedItem.push({
      //     nama: nama.data.nama,
      //     createdBy: createdBy.data.email,
      //     updatedBy: updatedBy.data.email
      //   });
      // }

      // const lokasiPenyimpanan = response.data.data.map((item, index) => ({
      //   ...item,
      //   nama: addedItem[index].nama,
      //   created_by: addedItem[index].createdBy,
      //   updated_by: addedItem[index].updatedBy
      // }));

      // setLokasiPenyimpanan(lokasiPenyimpanan);

      const response = await axiosInterceptors.get(
        `/lokasi-penyimpanan?limit=${limit}&page=${page}&${key}`,
      );

      const addedItemPromises = response.data.data.map(async (element) => {
        const [namaRes, createdByRes, updatedByRes] = await Promise.all([
          axiosInterceptors.get(
            `/inventori-barang/${element.id_inventaris_barang}`,
          ),
          axiosInterceptors.get(`/user/${element.createdBy}`),
          axiosInterceptors.get(`/user/${element.updatedBy}`),
        ]);
        return {
          nama: namaRes.data.nama,
          createdBy: createdByRes.data.email,
          updatedBy: updatedByRes.data.email,
        };
      });

      const addedItem = await Promise.all(addedItemPromises);

      const result = response.data.data.map((item, index) => ({
        ...item,
        nama: addedItem[index].nama,
        created_by: addedItem[index].createdBy,
        updated_by: addedItem[index].updatedBy,
      }));

      setLokasiPenyimpanan(result);
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

  useEffect(() => {
    findLokasiPenyimpanan();
  }, [limit, page, key]);

  return token ? (
    <>
      <div className="mt-2 flex flex-wrap justify-evenly gap-2">
        <div className="w-[95%] md:w-[75%] lg:w-[45%]">
          {/*judul*/}
          <p className="mb-2 rounded bg-teal-300 p-1 text-center shadow">
            lokasi penyimpanan
          </p>

          {/*pagination*/}
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
                  <option selected>lokasi</option>
                </select>
                <button
                  onClick={() => setKey(`${searchBased}=${search}`)}
                  className="ml-1 rounded bg-green-700 p-1 text-xs italic text-white"
                >
                  <HiMiniMagnifyingGlass />
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

          {/*tabel*/}
          <div className="w-full overflow-auto rounded-md p-2 shadow-md shadow-teal-100">
            <table className="w-full">
              <tr className="border-b-2 border-teal-700 bg-teal-300">
                <th className="px-2">nama</th>
                <th className="px-2">lokasi</th>
                <th className="px-2">jumlah</th>
                <th className="px-2">created_by</th>
                <th className="px-2">updated_by</th>
                <th className="px-2">created_at</th>
                <th className="px-2">updated_at</th>
              </tr>
              {lokasiPenyimpanan.map((each) => (
                <tr key={each._id} className="border-b border-teal-300">
                  <td className="px-2">{each.nama}</td>
                  <td className="px-2">{each.lokasi}</td>
                  <td className="px-2">{each.jumlah}</td>
                  <td className="px-2">{each.created_by}</td>
                  <td className="px-2">{each.updated_by}</td>
                  <td className="px-2">{each.createdAt}</td>
                  <td className="px-2">{each.updatedAt}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="m-4 rounded bg-red-100 p-4 text-center">unauthorized</div>
  );
};

export default LokasiPenyimpanan;
