import {useEffect, useState} from "react";
import LeftNav from "@/components/leftnav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Table} from "react-bootstrap"; // Import the Form component

const apiUrl = 'https://run.mocky.io/v3/341c470d-1830-45fc-a4f3-1ef6c2cf58e0';
const saveUrl = 'https://jack25.free.beeceptor.com/save';
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
    const [validated, setValidated] = useState(false);


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
    const handleSaveClick = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        const formData = {
            clinicName: clinicName,
            clinicAddress: clinicAddress,
            doctorName: doctorName,
            email: email,
            preference: preference,
        };
        console.log("===========================================test JSON.stringify(formData)")
        console.log(JSON.stringify(formData));
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

    const showDeleteConfirmWindowClick = (email) => {
        setEmailToDelete(email);
        setShowDeleteConfirmWindow(true);
    };

    const closeDeleteConfirmWindow = () => {
        setEmailToDelete("");
        setShowDeleteConfirmWindow(false);
    };

    const sendDeleteRequest = () => {
        closeDeleteConfirmWindow();
        fetch(deleteUrl + "/" + emailToDelete, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log("刪除成功");
                } else {
                    console.log("刪除時發生錯誤: ");
                }
            })
            .catch((error) => {
                console.log("發送刪除請求時發生錯誤: ", error)
            });
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <LeftNav>
            {/* 右側內容呈現區塊 */}
            <div>
                <div className="card">
                    <div className="card-body">
                        {/* 表格放在這裡 */}
                        <Table striped bordered hover>
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
                                            <Button className="btn btn-success" type="button"
                                                    onClick={handleEditClick}>編輯
                                            </Button>
                                            <Button className="btn btn-danger" type="button"
                                                    onClick={() => showDeleteConfirmWindowClick(item.email)}>刪除
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {/* 其他表格資料類似 */}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            {showEditWindow && (
                <div>
                    <Modal show={showEditWindow} onHide={() => setShowEditWindow(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>編輯醫生</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group controlId="clinicName">
                                    <Form.Label>診所名稱</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="clinic name"
                                        onChange={handleInputChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a username.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="clinicAddress">
                                    <Form.Label>診所地址</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="clinic address"
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="doctorName">
                                    <Form.Label>醫生名稱</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="doctor name"
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label>電郵地址</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="email"
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="perference">
                                    <Form.Label>偏好設定</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="perference"
                                        onChange={handleInputChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid zip.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="button-container d-grid gap-2 d-md-flex justify-content-center mt-4">

                                    <Button
                                        onClick={handleSaveClick}>確定</Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
            )}

            {showDeleteConfirmWindow && (
                <div>
                    <Modal show={showDeleteConfirmWindow} onHide={() => setShowDeleteConfirmWindow(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>確認刪除</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>你確定要刪除這個項目嗎？</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={sendDeleteRequest}>確定</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </LeftNav>

    );
};