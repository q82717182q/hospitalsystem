import {useEffect, useRef, useState} from "react";
import LeftNav from "@/components/leftnav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Table} from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import Swal from "sweetalert2"; // Import the Form component

const apiUrl = 'https://run.mocky.io/v3/341c470d-1830-45fc-a4f3-1ef6c2cf58e0';
const saveUrl = 'https://jack25.free.beeceptor.com/save';
const deleteUrl = 'https://jack25.free.beeceptor.com/delete';
const uploadCSVUrl = 'https://jack25.free.beeceptor.com/file';


export default function Home() {
    const {Formik} = formik;
    const schema = yup.object().shape({
        clinicName: yup.string().required(),
        clinicAddress: yup.string().required(),
        doctorName: yup.string().required(),
        email: yup.string().required(),
        preference: yup.string().required(),
    });

    const [data, setData] = useState([]);
    const [showEditWindow, setShowEditWindow] = useState(false);
    const [showDeleteConfirmWindow, setShowDeleteConfirmWindow] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const alertTimeoutRef = useRef(null);

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

    useEffect(() => {
        return () => {
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
        };
    }, []);

    const handleEditClick = () => {
        setShowEditWindow(true);
    };
    const handleSubmit = async (values) => {
        try {
            const response = await fetch("https://jack25.free.beeceptor.com/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                console.log("Form data submitted successfully");
                const updatedResponse = await fetch(apiUrl);
                const updatedData = await updatedResponse.json();
                setData(updatedData);
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: true,
                    timer: 1500,
                    timerProgressBar: true,
                })
            } else {
                console.error("Failed to submit form data");
            }
        } catch (error) {
            console.error("Error while submitting form:", error);
        }
        setShowEditWindow(false)
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

    const handleUploadCSV = () => {
        fileInputRef.current.click();
    };


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "text/csv") {

                try {
                    const formData = new FormData();
                    formData.append("file", file);

                    const response = await fetch(uploadCSVUrl, {
                        method: "POST",
                        body: formData,
                    });

                    if (response.ok) {
                        console.log("File uploaded successfully");
                    } else {
                        console.error("Failed to upload file");
                    }
                } catch (error) {
                    console.error("Error while uploading file:", error);
                }
            } else {
                console.error("請選擇CSV文件");
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please choose a CSV file',
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        }
    };

    const fileInputRef = useRef(null);
    return (
        <LeftNav>
            <div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <h2 className="mb-0">醫生管理</h2>
                    </div>
                    <div className="d-flex align-items-center">

                        <Button
                            className="btn btn-warning text-white" onClick={() => handleUploadCSV()}>上傳CSV
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{display: "none"}}
                            onChange={handleFileChange}
                        />
                    </div>

                </div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th className="text-center align-middle">診所名稱</th>
                        <th className="text-center align-middle">診所地址</th>
                        <th className="text-center align-middle">醫生名稱</th>
                        <th className="text-center align-middle">電郵地址</th>
                        <th className="text-center align-middle">偏好設定</th>
                        <th className="text-center align-middle">編輯</th>
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

            <Modal show={showEditWindow} onHide={() => setShowEditWindow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>編輯醫生</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            clinicName: '',
                            clinicAddress: '',
                            doctorName: '',
                            email: '',
                            preference: '',
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({handleSubmit, handleChange, values, touched, errors}) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group controlId="clinicName">
                                    <Form.Label>診所名稱</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={values.clinicName}
                                        isInvalid={touched.clinicName && !!errors.clinicName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        請輸入診所名稱。
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="clinicAddress">
                                    <Form.Label>診所地址</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={values.clinicAddress}
                                        isInvalid={touched.clinicAddress && !!errors.clinicAddress}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        請輸入診所地址。
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="doctorName">
                                    <Form.Label>醫生名稱</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={values.doctorName}
                                        isInvalid={touched.doctorName && !!errors.doctorName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        請輸入醫生名稱。
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label>電郵地址</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={values.email}
                                        isInvalid={touched.email && !!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        請輸入電郵地址。
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="preference">
                                    <Form.Label>偏好設定</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={values.preference}
                                        isInvalid={touched.preference && !!errors.preference}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        請輸入偏好設定。
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <div className="d-flex justify-content-end mt-3">
                                    <Button type="submit">確定</Button>
                                </div>
                            </Form>)}
                    </Formik>
                </Modal.Body>
            </Modal>

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


        </LeftNav>


    );
};