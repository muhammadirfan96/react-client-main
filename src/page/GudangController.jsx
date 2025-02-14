import { IoReceiptOutline } from "react-icons/io5";
import { IoIosPaperPlane } from "react-icons/io";
import { MdCompareArrows } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import PenambahanBarang from "../gudang/PenambahanBarang.jsx";
import PenerimaanBarang from "../gudang/PenerimaanBarang.jsx";
import PengirimanBarang from "../gudang/PengirimanBarang.jsx";
import PergeseranBarang from "../gudang/PergeseranBarang.jsx";
import { useSelector } from "react-redux";

const GudangController = () => {
  const token = useSelector((state) => state.jwToken.token);
  return token ? (
    <>
      <div className="mt-2 flex flex-wrap justify-evenly gap-2">
        <div className="w-[95%] md:w-[75%] lg:w-[45%]">
          {/*judul*/}
          <p className="mb-2 rounded bg-teal-300 p-1 text-center shadow">
            manage gudang
          </p>
          <div className="flex flex-wrap justify-evenly gap-2">
            <PenambahanBarang />
            <PenerimaanBarang />
            <PengirimanBarang />
            <PergeseranBarang />
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="m-4 rounded bg-red-100 p-4 text-center">unauthorized</div>
  );
};

export default GudangController;
