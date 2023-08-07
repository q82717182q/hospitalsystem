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
                            這是首頁

                    </div>
                </div>
            </div>
        </LeftNav>

    );
};
