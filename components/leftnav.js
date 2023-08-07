import Link from "next/link";
import {useState} from "react";

export default function LeftNav({children}) {
    const [selectedItem, setSelectedItem] = useState("doctormanagement");

    const handleItemClick = (item) => {
        setSelectedItem(item);
        console.log(item);
    };
    return (
        <div className="container mt-5">
            <div className="row">
                {/* 左側導航列 */}
                <div className="col-md-3">
                    <nav className="nav flex-column">
                        <Link href="/doctormanagement"
                              className={`btn btn-primary ${selectedItem === "doctormanagement" && "active"}`}
                              onClick={() => handleItemClick("doctormanagement")}>
                            醫生管理
                        </Link>
                        <Link href="/pdfmanagement"
                              className={`btn btn-primary ${selectedItem === "pdfmanagement" && "active"}`}
                              onClick={() => handleItemClick("pdfmanagement")}>
                            PDF管理
                        </Link>
                        <Link href="/accountmanagement"
                              className={`btn btn-primary ${selectedItem === "accountmanagement" && "active"}`}
                              onClick={() => handleItemClick("accountmanagement")}>
                            帳號管理
                        </Link>
                        <Link href="/rolemanagement"
                              className={`btn btn-primary ${selectedItem === "rolemanagement" && "active"}`}
                              onClick={() => handleItemClick("rolemanagement")}>
                            角色管理
                        </Link>
                        <Link href="/report"
                              className={`btn btn-primary ${selectedItem === "report" && "active"}`}
                              onClick={() => handleItemClick("report")}>
                            報告
                        </Link>
                    </nav>
                </div>

                {/* 右側內容呈現區塊 */}
                <div className="col-md-9">
                    {children}
                </div>
            </div>
        </div>
    );
};
