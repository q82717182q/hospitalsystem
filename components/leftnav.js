import Link from "next/link";
import {useRouter} from 'next/router';


export default function LeftNav({children}) {
    const router = useRouter();
    return (
        <div className="container mt-5">
            <div className="row">
                {/* 左側導航列 */}
                <div className="col-md-2">
                    <nav className="nav flex-column">
                        <Link href="/doctormanagement"
                              className={`btn btn-outline-primary  ${router.pathname === "/doctormanagement" && "btn-primary active"}`}>
                            醫生管理
                        </Link>
                        <Link href="/pdfmanagement"
                              className={`btn btn-outline-primary ${router.pathname === "/pdfmanagement" && "btn-primary active"}`}>
                            PDF管理
                        </Link>
                        <Link href="/accountmanagement"
                              className={`btn btn-outline-primary ${router.pathname === "/accountmanagement" && "btn-primary active"}`}>
                            帳號管理
                        </Link>
                        <Link href="/rolemanagement"
                              className={`btn btn-outline-primary ${router.pathname === "/rolemanagement" && "btn-primary active"}`}>
                            角色管理
                        </Link>
                        <Link href="/report"
                              className={`btn btn-outline-primary ${router.pathname === "/report" && "btn-primary active"}`}>
                            報告
                        </Link>
                    </nav>
                </div>

                {/* 右側內容呈現區塊 */}
                <div className="col-md-10">
                    {children}
                </div>
            </div>
        </div>
    );
};
