import Link from "next/link";
import {useRouter} from 'next/router';

export default function LeftNav({children}) {
    const router = useRouter();
    return (
            <div className="d-flex">
                    {/* 左側導航列 */}
                    <div className="col-md-2 bg-primary sticky-top vh-100">
                        <nav className="nav flex-column">
                            <Link href="/doctormanagement"
                                  className={`btn nav-link text-light m-2 ${router.pathname === "/doctormanagement" && "btn-light active"}`}>
                                醫生管理
                            </Link>
                            <Link href="/pdfmanagement"
                                  className={`btn nav-link text-light m-2 ${router.pathname === "/pdfmanagement" && "btn-light active"}`}>
                                PDF管理
                            </Link>
                            <Link href="/accountmanagement"
                                  className={`btn nav-link text-light m-2 ${router.pathname === "/accountmanagement" && "btn-light active"}`}>
                                帳號管理
                            </Link>
                            <Link href="/rolemanagement"
                                  className={`btn nav-link text-light m-2 ${router.pathname === "/rolemanagement" && "btn-light active"}`}>
                                角色管理
                            </Link>
                            <Link href="/report"
                                  className={`btn nav-link text-light m-2 ${router.pathname === "/report" && "btn-light active"}`}>
                                報告
                            </Link>
                        </nav>
                    </div>

                    {/* 右側內容呈現區塊 */}
                    <div className="flex-grow-1 p-3 ml-500 overflow-auto">
                        {children}
                    </div>
            </div>
    );
};
