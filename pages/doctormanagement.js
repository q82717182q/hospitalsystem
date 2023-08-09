import {useEffect, useState} from "react";
import LeftNav from "@/components/leftnav";

const apiUrl = 'https://run.mocky.io/v3/341c470d-1830-45fc-a4f3-1ef6c2cf58e0';
const saveUrl = 'https://enie8qmtr6mi.x.pipedream.net';
const deleteUrl = 'https://enie8qmtr6mi.x.pipedream.net';


export default function Home() {
    const [data, setData] = useState([]);
    const [showEditWindow, setShowEditWindow] = useState(false);
    const [showDeleteConfirmWindow, setShowDeleteConfirmWindow] = useState(false);
    const [clinicName, setClinicName] = useState("");
    const [clinicAddress, setClinicAddress] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [email, setEmail] = useState("");
    const [preference, setPreference] = useState("");
    const [emailToDelete, setEmailToDelete] = useState("");

    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((responseData) => {
                setData(responseData);
            })
            .catch((error) => {
                console.log("Error fetching data:", error);
            });
    }, []);

    const handleEditClick = () => {
        setShowEditWindow(true);
    };
    const closeEditClick = () => {
        setShowEditWindow(false);
    };
    const handleSaveClick = () => {
        const formData = {
            clinicName: clinicName,
            clinicAddress: clinicAddress,
            doctorName: doctorName,
            email: email,
            preference: preference,
        };

        fetch(saveUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("表單資料已成功傳送: ", responseData);
                setShowEditWindow(false);
            })
            .catch((error) => {
                console.log("傳送表單資料時發生錯誤: ", error)
            });
    };

    const handleInputChange = (event) => {
        const {id, value} = event.target;
        switch (id) {
            case "clinicName":
                setClinicName(value);
                break;
            case "clinicAddress":
                setClinicAddress(value);
                break;
            case "doctorName":
                setDoctorName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "preference":
                setPreference(value);
                break;
            default:
                break;
        }
    };

    const showDeleteConfirmWindowClick = (email)  => {
        setEmailToDelete(email);
        setShowDeleteConfirmWindow(true);
    };

    const closeDeleteConfirmWindow = () => {
        setEmailToDelete("");
        setShowDeleteConfirmWindow(false);
    };

    const sendDeleteRequest = () => {
        closeDeleteConfirmWindow();
        fetch(deleteUrl + "/" +emailToDelete, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => {
                if (response.ok){
                    console.log("刪除成功");
                }else {
                    console.log("刪除時發生錯誤: ");
                }
            })
            .catch((error) => {
                console.log("發送刪除請求時發生錯誤: ", error)
            });
    };

    return (
        <LeftNav>
            {/* 右側內容呈現區塊 */}
            <div>
                <div className="card">
                    <div className="card-body">
                        {/* 表格放在這裡 */}
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th className="text-center">診所名稱</th>
                                <th className="text-center">診所地址</th>
                                <th className="text-center">醫生名稱</th>
                                <th className="text-center">電郵地址</th>
                                <th className="text-center">偏好設定</th>
                                <th className="text-center">編輯</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center align-middle">{item.name}</td>
                                    <td className="text-center align-middle">{item.address}</td>
                                    <td className="text-center align-middle">{item.doctor}</td>
                                    <td className="text-center align-middle">{item.email}</td>
                                    <td className="text-center align-middle">{item.preference}</td>
                                    <td className="text-center align-middle">
                                        <div className="button-container d-grid gap-2 d-md-flex justify-content-center">
                                            <button className="btn btn-success" type="button"
                                                    onClick={handleEditClick}>編輯
                                            </button>
                                            <button className="btn btn-danger" type="button"
                                                    onClick={() => showDeleteConfirmWindowClick(item.email)}>刪除
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {/* 其他表格資料類似 */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showEditWindow && (
                <div className="edit-window">
                    <h2>編輯醫生</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="clinicName">診所名稱</label>
                            <input
                                type="text"
                                id="clinicName"
                                className="form-contorl"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clinicAddress">診所地址</label>
                            <input
                                type="text"
                                id="clinicAddress"
                                className="form-contorl"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="doctorName">醫生名稱</label>
                            <input
                                type="text"
                                id="doctorName"
                                className="form-contorl"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">電郵地址</label>
                            <input
                                type="text"
                                id="email"
                                className="form-contorl"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="perference">偏好設定</label>
                            <input
                                type="text"
                                id="perference"
                                className="form-contorl"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="button-container d-grid gap-2 d-md-flex justify-content-center mt-4">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={handleSaveClick}>
                                儲存
                            </button>
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={closeEditClick}>
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showDeleteConfirmWindow && (
                <div className="delete-confirm-window">
                    <h2>確定是否刪除？</h2>
                    <button
                        onClick={sendDeleteRequest}>確定</button>
                    <button
                        onClick={closeDeleteConfirmWindow}>取消
                    </button>
                </div>
            )}
        </LeftNav>

    );
};
