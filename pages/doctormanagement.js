import {useState} from "react";
import Link from "next/link";
import LeftNav from "@/components/leftnav";


export default function Home() {
    return (
        <LeftNav>
            {/* 右側內容呈現區塊 */}
            <div className="col-md-9">
                <div className="card">
                    <div className="card-body">
                        {/* 表格放在這裡 */}
                        <table className="table">

                            <thead>
                            <tr>
                                <th>#</th>
                                <th>這頁是醫生管理姓名</th>
                                <th>年齡</th>
                                <th>性別</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>John Doe</td>
                                <td>30</td>
                                <td>男</td>
                            </tr>
                            {/* 其他表格資料類似 */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </LeftNav>

    );
};
