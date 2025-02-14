import { BsSpeedometer, BsBasket, BsCaretRight } from "react-icons/bs";
import { AiOutlineShopping, AiOutlineStock } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { IoReceiptOutline, IoPeopleOutline } from "react-icons/io5";
import { IoIosPaperPlane } from "react-icons/io";
import { MdCompareArrows, MdOutlineStorage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const navigate = useNavigate();
  const sbar = useSelector((state) => state.bar.sidebar);

  const menu = [
    {
      path: "gudang-controller",
      icon: <BsSpeedometer />,
      name: "manage",
    },
    {
      path: "inventori-barang",
      icon: <AiOutlineShopping />,
      name: "inventori",
    },
    {
      path: "lokasi-penyimpanan",
      icon: <MdOutlineStorage />,
      name: "lokasi",
    },
    {
      path: "penerimaan-barang",
      icon: <IoReceiptOutline />,
      name: "penerimaan",
    },
    {
      path: "pengiriman-barang",
      icon: <IoIosPaperPlane />,
      name: "pengiriman",
    },
    {
      path: "pergeseran-barang",
      icon: <MdCompareArrows />,
      name: "pergeseran",
    },
    {
      path: "stok-barang",
      icon: <AiOutlineStock />,
      name: "stok",
    },
    {
      path: "pemasok",
      icon: <IoPeopleOutline />,
      name: "pemasok",
    },
    {
      path: "pelanggan",
      icon: <FaUserFriends />,
      name: "pelanggan",
    },
  ];

  return (
    <>
      <div
        className={`${
          !sbar && "-ml-52"
        } fixed bottom-0 left-0 top-[64px] hidden w-52 overflow-auto border-r-2 border-teal-700 bg-teal-300 p-4 transition-all md:block`}
      >
        <div className="flex flex-col">
          {menu.map((each) => (
            <button
              key={each.path}
              onClick={() => navigate(`/${each.path}`)}
              className="relative m-1 rounded bg-teal-700 px-2 py-1 text-start text-white shadow"
            >
              <div className="mr-2 inline-block">{each.icon}</div>
              {each.name}
              <BsCaretRight className="absolute right-1 top-2" />
            </button>
          ))}

          <button
            onClick={() => navigate("/product")}
            className="relative m-1 rounded bg-teal-700 px-2 py-1 text-start text-white shadow"
          >
            <BsBasket className="mr-2 inline" />
            product
            <BsCaretRight className="absolute right-1 top-2" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
