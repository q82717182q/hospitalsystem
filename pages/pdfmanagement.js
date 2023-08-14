import {useEffect, useState} from "react";
import LeftNav from "@/components/leftnav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Table} from "react-bootstrap";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import {Formik} from "formik";
import * as yup from "yup";
import {Document, Page, pdfjs} from "react-pdf";


const apiUrl = 'https://run.mocky.io/v3/ab0200f9-d77a-4bb4-ac8b-9c36add02910';
const deleteUrl = 'https://jack25.free.beeceptor.com/delete';
const saveUrl = 'https://jack25.free.beeceptor.com/save';

export default function Home() {
    const [data, setData] = useState([]);
    const [showEditWindow, setShowEditWindow] = useState(false);
    const [idToEdit, setIdToEdit] = useState("");
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [selectedPDFUrl, setSelectedPDFUrl] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    useEffect(() => {
        // 設定 pdf.worker.js 的路徑
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`; // 替換為你的 pdf.worker.js 的路徑

        // 在這裡執行你的其他程式碼
        // 例如，fetch PDF 資料，設定初始狀態，等等
    }, []);

    const onPDFLoadSuccess = ({ numPages }) => {
        console.log('PDF 加载成功，总页数：', numPages);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSelectedPDFUrl(url);
            setPageNumber(1);
            setShowPDFModal(true);
        }
    };
    const schema = yup.object().shape({
        clinicName: yup.string().required(),
        doctor: yup.string().required(),
        email: yup.string().required(),
    });

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

    const handleEditClick = (id) => {
        setShowEditWindow(true);
        setIdToEdit(id);
    };

    const handleSubmit = async (values) => {
        try {
            const response = await fetch(saveUrl, {
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


    const showDeleteConfirmWindowClick = (id) => {
        Swal.fire({
            title: '確認刪除',
            text: "你確定要刪除這個項目嗎？",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '是的',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                sendDeleteRequest(id);
            }
        });
    };


    const sendDeleteRequest = (id) => {
        fetch(deleteUrl + "/" + id, {
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

    const editData = data.find((item) => item.id === idToEdit);

    return (
        <LeftNav>
            <div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <h2 className="mb-0">PDF管理</h2>
                    </div>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th className="text-center align-middle">ID</th>
                    <th className="text-center align-middle">診所名稱</th>
                    <th className="text-center align-middle">醫生名稱</th>
                    <th className="text-center align-middle">電郵地址</th>
                    <th className="text-center align-middle">編輯</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td className="text-center align-middle">{item.id}</td>
                        <td className="text-center align-middle">{item.clinicName}</td>
                        <td className="text-center align-middle">{item.doctor}</td>
                        <td className="text-center align-middle">{item.email}</td>
                        <td className="text-center align-middle">
                            <div className="button-container d-grid gap-2 d-md-flex justify-content-center">
                                <Button className="btn btn-success" type="button"
                                        onClick={() => handleEditClick(item.id)}>編輯
                                </Button>
                                <Button className="btn btn-danger" type="button"
                                        onClick={() => showDeleteConfirmWindowClick(item.id)}>刪除
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>


                <Modal show={showEditWindow} onHide={() => setShowEditWindow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>編輯PDF</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            validationSchema={schema}
                            initialValues={editData || {
                                clinicName: '',
                                doctor: '',
                                email: '',
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({handleSubmit, handleChange, values, touched, errors}) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group controlId="id">
                                        <Form.Label>ID : </Form.Label>
                                        <Form.Control
                                            type="text"
                                            onChange={handleChange}
                                            value={values.id}
                                            isInvalid={touched.id && !!errors.id}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="id">
                                        <Form.Label>閱覽 PDF 內容 : </Form.Label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                        <Document
                                            file={selectedPDFUrl}
                                            onLoadSuccess={onPDFLoadSuccess}
                                        >
                                            <Page pageNumber={pageNumber} />
                                        </Document>
                                    </Form.Group>

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
                                    <Form.Group controlId="doctor">
                                        <Form.Label>醫生名稱</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            onChange={handleChange}
                                            value={values.doctor}
                                            isInvalid={touched.doctor && !!errors.doctor}
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
                                    <div className="d-flex justify-content-end mt-3">
                                        <Button type="submit">確定</Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </Table>
        </LeftNav>

    );
};
